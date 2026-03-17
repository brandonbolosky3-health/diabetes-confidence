import Stripe from "stripe";

let _stripe: Stripe | null = null;
export function stripe(): Stripe {
  if (!_stripe) {
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-02-25.clover",
      typescript: true,
    });
  }
  return _stripe;
}

// Re-export plans for server-side convenience
export { PLANS, type PlanTier } from "@/lib/plans";
