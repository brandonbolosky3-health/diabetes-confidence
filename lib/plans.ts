export const PLANS = {
  free_trial: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID!,
    price: 0,
    name: "7-Day Free Trial",
    features: [
      "Full lesson library",
      "Monthly new content",
      "Printable resources",
      "AI Health Coach (50 messages/month)",
      "1 free live meet",
    ],
  },
  essential: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID!,
    price: 29,
    name: "Essential",
    features: [
      "Full lesson library",
      "Monthly new content",
      "Printable resources",
      "AI Health Coach (50 messages/month)",
      "1 free live meet",
    ],
  },
  premium: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    price: 49,
    name: "Premium",
    features: [
      "Everything in Essential",
      "Unlimited AI Coach",
      "Monthly live Q&A sessions",
      "Priority support (~2hr)",
      "4 live monthly meets (up to 30 min)",
    ],
  },
} as const;

export type PlanTier = keyof typeof PLANS;

/**
 * Map a Stripe price ID back to a billable plan tier ("essential" or "premium").
 * Returns null if the price ID doesn't match a known plan — caller decides
 * whether that's a no-op or an error. Note: "free_trial" is never returned
 * here; trial state is tracked via Stripe subscription.status === "trialing".
 */
export function tierFromPriceId(priceId: string | null | undefined): "essential" | "premium" | null {
  if (!priceId) return null;
  if (priceId === PLANS.premium.priceId) return "premium";
  if (priceId === PLANS.essential.priceId) return "essential";
  return null;
}
