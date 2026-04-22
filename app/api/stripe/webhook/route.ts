import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendPaymentConfirmationEmail, sendSubscriptionCanceledEmail } from "@/lib/email";
import { tierFromPriceId } from "@/lib/plans";

// Use service-role client for webhook (no user session)
function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

type AdminClient = ReturnType<typeof getAdminClient>;

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe().webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "invalid signature" }, { status: 400 });
  }

  const supabase = getAdminClient();

  // Idempotency: insert the event ID; if it already exists, Stripe is retrying
  // a previously-processed event and we ack without re-running side effects.
  const { error: dedupErr } = await supabase
    .from("stripe_webhook_events")
    .insert({ event_id: event.id, type: event.type });

  if (dedupErr) {
    // 23505 = unique_violation — expected on retry
    if (dedupErr.code === "23505") {
      return NextResponse.json({ received: true, duplicate: true }, { status: 200 });
    }
    console.error("Dedup insert failed:", dedupErr);
    // Return 500 so Stripe retries — better to retry than to silently drop
    return NextResponse.json({ error: "dedup insert failed" }, { status: 500 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, event.data.object as Stripe.Checkout.Session);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(supabase, event.data.object as Stripe.Subscription);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionDeleted(supabase, event.data.object as Stripe.Subscription);
        break;
      case "invoice.payment_failed":
        await handlePaymentFailed(supabase, event.data.object as Stripe.Invoice);
        break;
    }
  } catch (err) {
    // Roll back the dedup row so Stripe's retry re-runs the handler.
    await supabase.from("stripe_webhook_events").delete().eq("event_id", event.id);
    console.error(`Webhook handler failed for ${event.type} (${event.id}):`, err);
    return NextResponse.json({ error: "handler failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true }, { status: 200 });
}

async function handleCheckoutCompleted(
  supabase: AdminClient,
  session: Stripe.Checkout.Session
) {
  const userId = session.metadata?.user_id;
  const sessionTier = session.metadata?.tier || "essential";

  if (!userId) return;

  const subscription = await stripe().subscriptions.retrieve(session.subscription as string);
  const periodEnd = subscription.items.data[0]?.current_period_end;
  const priceId = subscription.items.data[0]?.price.id;

  // Derive tier from the actual price on the subscription. If we can't map it
  // (shouldn't happen in prod), fall back to the session metadata so we don't
  // lose the row. The trial case keeps its own "free_trial" tier until the
  // first successful invoice flips the subscription to active.
  const isTrialCheckout = sessionTier === "free_trial";
  const mappedTier = tierFromPriceId(priceId);
  const tier = isTrialCheckout ? "free_trial" : (mappedTier ?? sessionTier);

  const { error: upsertErr } = await supabase.from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_customer_id: session.customer as string,
      stripe_subscription_id: session.subscription as string,
      tier,
      status: isTrialCheckout ? "trialing" : "active",
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (upsertErr) throw upsertErr;

  if (isTrialCheckout) {
    const now = new Date();
    const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        trial_started_at: now.toISOString(),
        trial_ends_at: trialEnd.toISOString(),
      })
      .eq("id", userId);
    if (profileErr) throw profileErr;
  }

  // Email is non-critical — a send failure should not fail the webhook.
  try {
    const { data: userData } = await supabase.auth.admin.getUserById(userId);
    const user = userData?.user;
    if (user?.email) {
      const localPart = user.email.split("@")[0];
      const firstName =
        user.user_metadata?.first_name ||
        localPart.charAt(0).toUpperCase() + localPart.slice(1);
      const amount = session.amount_total
        ? session.amount_total / 100
        : tier === "premium"
          ? 49
          : 29;
      const nextBilling = periodEnd
        ? new Date(periodEnd * 1000).toISOString()
        : new Date().toISOString();
      await sendPaymentConfirmationEmail(user.email, firstName, tier, amount, nextBilling);
    }
  } catch (e) {
    console.warn("Payment confirmation email failed (non-critical):", e);
  }
}

async function handleSubscriptionUpdated(
  supabase: AdminClient,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("user_id, tier")
    .eq("stripe_customer_id", customerId)
    .single();
  if (!sub) return;

  const status = mapStripeStatus(subscription.status);
  const itemPeriodEnd = subscription.items.data[0]?.current_period_end;
  const priceId = subscription.items.data[0]?.price.id;

  // Resolve the current tier from the price. On trial → paid conversion or a
  // plan change, Stripe fires subscription.updated and we need to flip the
  // tier here — otherwise it stays frozen at whatever it was at checkout.
  const mappedTier = tierFromPriceId(priceId);
  const isTrialing = subscription.status === "trialing";
  const nextTier = isTrialing
    ? "free_trial"
    : (mappedTier ?? sub.tier);

  const { error } = await supabase
    .from("subscriptions")
    .update({
      tier: nextTier,
      status,
      current_period_end: itemPeriodEnd ? new Date(itemPeriodEnd * 1000).toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
  if (error) throw error;
}

async function handleSubscriptionDeleted(
  supabase: AdminClient,
  subscription: Stripe.Subscription
) {
  const customerId = subscription.customer as string;

  const { data: canceledSub } = await supabase
    .from("subscriptions")
    .select("user_id, current_period_end")
    .eq("stripe_customer_id", customerId)
    .single();

  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "canceled",
      tier: "free",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
  if (error) throw error;

  if (canceledSub) {
    try {
      const { data: userData } = await supabase.auth.admin.getUserById(canceledSub.user_id);
      const user = userData?.user;
      if (user?.email) {
        const localPart = user.email.split("@")[0];
        const firstName =
          user.user_metadata?.first_name ||
          localPart.charAt(0).toUpperCase() + localPart.slice(1);
        const accessUntil = canceledSub.current_period_end || new Date().toISOString();
        await sendSubscriptionCanceledEmail(user.email, firstName, accessUntil);
      }
    } catch (e) {
      console.warn("Subscription canceled email failed (non-critical):", e);
    }
  }
}

async function handlePaymentFailed(supabase: AdminClient, invoice: Stripe.Invoice) {
  const customerId = invoice.customer as string;
  const { error } = await supabase
    .from("subscriptions")
    .update({
      status: "past_due",
      updated_at: new Date().toISOString(),
    })
    .eq("stripe_customer_id", customerId);
  if (error) throw error;
}

function mapStripeStatus(
  status: Stripe.Subscription.Status
): "active" | "inactive" | "canceled" | "past_due" | "trialing" {
  switch (status) {
    case "active":
      return "active";
    case "trialing":
      return "trialing";
    case "past_due":
      return "past_due";
    case "canceled":
    case "unpaid":
      return "canceled";
    default:
      return "inactive";
  }
}
