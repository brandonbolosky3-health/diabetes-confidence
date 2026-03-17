import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { stripe, PLANS, type PlanTier } from "@/lib/stripe";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { tier } = (await request.json()) as { tier: PlanTier };

  if (!tier || !PLANS[tier]) {
    return NextResponse.json({ error: "invalid tier" }, { status: 400 });
  }

  // Check for existing Stripe customer
  const { data: existingSub } = await supabase
    .from("subscriptions")
    .select("stripe_customer_id")
    .eq("user_id", user.id)
    .single();

  let stripeCustomerId = existingSub?.stripe_customer_id;

  if (!stripeCustomerId) {
    // Create new Stripe customer
    const customer = await stripe().customers.create({
      email: user.email!,
      metadata: { user_id: user.id },
    });
    stripeCustomerId = customer.id;

    // Upsert subscription row with customer ID
    await supabase.from("subscriptions").upsert(
      {
        user_id: user.id,
        stripe_customer_id: stripeCustomerId,
      },
      { onConflict: "user_id" }
    );
  }

  // Create checkout session
  const session = await stripe().checkout.sessions.create({
    customer: stripeCustomerId,
    mode: "subscription",
    line_items: [{ price: PLANS[tier].priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgrade=success`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
    metadata: { user_id: user.id, tier },
  });

  return NextResponse.json({ url: session.url });
}
