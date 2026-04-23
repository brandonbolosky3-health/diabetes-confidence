import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { sendWelcomeEmail } from "@/lib/email";
import { stripe } from "@/lib/stripe";
import { PLANS } from "@/lib/plans";

// Subscription statuses that let a user into the product without going
// through Stripe Checkout again. "past_due" stays allowed because the
// dashboard shows its own banner prompting the user to update payment.
const ACTIVE_SUB_STATUSES = new Set(["active", "trialing", "past_due"]);

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/member";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=auth`);
  }

  const isNewUser =
    user.created_at &&
    Date.now() - new Date(user.created_at).getTime() < 60_000;

  if (isNewUser) {
    const localPart = (user.email || "").split("@")[0];
    const firstName =
      user.user_metadata?.first_name ||
      (localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : "there");
    sendWelcomeEmail(user.email!, firstName).catch(() => {});
  }

  // Look up subscription. Anyone without an active sub gets routed to
  // Stripe Checkout to start their 7-day free trial — card required.
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id, status")
    .eq("user_id", user.id)
    .single();

  const hasActiveSub = sub && ACTIVE_SUB_STATUSES.has(sub.status);

  if (!hasActiveSub) {
    try {
      // Reuse existing Stripe customer if we have one, otherwise create.
      let stripeCustomerId = sub?.stripe_customer_id;
      if (!stripeCustomerId) {
        const customer = await stripe().customers.create({
          email: user.email!,
          metadata: { user_id: user.id },
        });
        stripeCustomerId = customer.id;
        await supabase.from("subscriptions").upsert(
          { user_id: user.id, stripe_customer_id: stripeCustomerId },
          { onConflict: "user_id" }
        );
      }

      const session = await stripe().checkout.sessions.create({
        customer: stripeCustomerId,
        mode: "subscription",
        line_items: [{ price: PLANS.essential.priceId, quantity: 1 }],
        subscription_data: {
          trial_period_days: 7,
          metadata: { user_id: user.id, tier: "free_trial" },
        },
        payment_method_collection: "always",
        success_url: `${origin}/dashboard?upgrade=success`,
        cancel_url: `${origin}/pricing`,
        metadata: { user_id: user.id, tier: "free_trial" },
      });

      if (session.url) {
        return NextResponse.redirect(session.url);
      }
    } catch (err) {
      console.error("Failed to create Stripe Checkout from /auth/callback:", err);
      // Fall through to /pricing so the user can retry manually.
      return NextResponse.redirect(`${origin}/pricing?error=checkout`);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
