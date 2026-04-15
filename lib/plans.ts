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
    price: 9.99,
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
    price: 19.99,
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
