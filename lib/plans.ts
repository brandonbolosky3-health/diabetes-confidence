export const PLANS = {
  essential: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_ESSENTIAL_PRICE_ID!,
    price: 9.99,
    name: "Essential",
    features: [
      "Full educational curriculum",
      "Personalized learning path",
      "Blood sugar tracking guides",
      "Anti-inflammatory meal plans",
      "Community access",
    ],
  },
  premium: {
    priceId: process.env.NEXT_PUBLIC_STRIPE_PREMIUM_PRICE_ID!,
    price: 19.99,
    name: "Premium",
    features: [
      "Everything in Essential",
      "AI health coach unlimited questions",
      "Personalized lab interpretation",
      "Peptide and advanced optimization content",
      "Priority support",
    ],
  },
} as const;

export type PlanTier = keyof typeof PLANS;
