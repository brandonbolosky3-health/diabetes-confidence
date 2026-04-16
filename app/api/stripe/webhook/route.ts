import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import Stripe from "stripe";
import { sendPaymentConfirmationEmail, sendSubscriptionCanceledEmail } from "@/lib/email";

// Use service-role client for webhook (no user session)
function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

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

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const userId = session.metadata?.user_id;
      const tier = session.metadata?.tier || "essential";

      if (!userId) break;

      // Retrieve the subscription to get period end from items
      const subscription = await stripe().subscriptions.retrieve(
        session.subscription as string
      );
      const periodEnd = subscription.items.data[0]?.current_period_end;

      const isTrialCheckout = tier === "free_trial";
      await supabase.from("subscriptions").upsert(
        {
          user_id: userId,
          stripe_customer_id: session.customer as string,
          stripe_subscription_id: session.subscription as string,
          tier: isTrialCheckout ? "free_trial" : tier,
          status: isTrialCheckout ? "trialing" : "active",
          current_period_end: periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      );

      // Set trial tracking on profiles if free trial
      if (isTrialCheckout) {
        const now = new Date();
        const trialEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
        await supabase
          .from("profiles")
          .update({
            trial_started_at: now.toISOString(),
            trial_ends_at: trialEnd.toISOString(),
          })
          .eq("id", userId);
      }

      // Send payment confirmation email
      try {
        const { data: userData } = await supabase.auth.admin.getUserById(userId);
        const user = userData?.user;
        if (user?.email) {
          const firstName =
            user.user_metadata?.first_name ||
            user.email.split("@")[0].charAt(0).toUpperCase() +
              user.email.split("@")[0].slice(1);
          const amount = session.amount_total
            ? session.amount_total / 100
            : tier === "premium"
              ? 49
              : 29;
          const nextBilling = periodEnd
            ? new Date(periodEnd * 1000).toISOString()
            : new Date().toISOString();
          sendPaymentConfirmationEmail(
            user.email,
            firstName,
            tier,
            amount,
            nextBilling
          ).catch(() => {});
        }
      } catch {
        // email is non-critical
      }
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Look up user by stripe_customer_id
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("user_id")
        .eq("stripe_customer_id", customerId)
        .single();

      if (!sub) break;

      const status = mapStripeStatus(subscription.status);

      const itemPeriodEnd = subscription.items.data[0]?.current_period_end;

      await supabase
        .from("subscriptions")
        .update({
          status,
          current_period_end: itemPeriodEnd
            ? new Date(itemPeriodEnd * 1000).toISOString()
            : null,
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const customerId = subscription.customer as string;

      // Look up user before updating
      const { data: canceledSub } = await supabase
        .from("subscriptions")
        .select("user_id, current_period_end")
        .eq("stripe_customer_id", customerId)
        .single();

      await supabase
        .from("subscriptions")
        .update({
          status: "canceled",
          tier: "free",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);

      // Send cancellation email
      if (canceledSub) {
        try {
          const { data: userData } = await supabase.auth.admin.getUserById(
            canceledSub.user_id
          );
          const user = userData?.user;
          if (user?.email) {
            const firstName =
              user.user_metadata?.first_name ||
              user.email.split("@")[0].charAt(0).toUpperCase() +
                user.email.split("@")[0].slice(1);
            const accessUntil =
              canceledSub.current_period_end || new Date().toISOString();
            sendSubscriptionCanceledEmail(
              user.email,
              firstName,
              accessUntil
            ).catch(() => {});
          }
        } catch {
          // email is non-critical
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      const customerId = invoice.customer as string;

      await supabase
        .from("subscriptions")
        .update({
          status: "past_due",
          updated_at: new Date().toISOString(),
        })
        .eq("stripe_customer_id", customerId);
      break;
    }
  }

  return NextResponse.json({ received: true }, { status: 200 });
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
