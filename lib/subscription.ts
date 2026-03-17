import { SupabaseClient } from "@supabase/supabase-js";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: "free" | "essential" | "premium";
  status: "active" | "inactive" | "canceled" | "past_due" | "trialing";
  current_period_end: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUserSubscription(
  supabase: SupabaseClient,
  userId: string
): Promise<Subscription | null> {
  const { data } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  return data as Subscription | null;
}

export function isPremium(subscription: Subscription | null): boolean {
  return subscription?.tier === "premium" && subscription?.status === "active";
}

export function isEssential(subscription: Subscription | null): boolean {
  if (!subscription || subscription.status !== "active") return false;
  return subscription.tier === "essential" || subscription.tier === "premium";
}
