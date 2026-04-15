import { SupabaseClient } from "@supabase/supabase-js";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  tier: "free" | "free_trial" | "essential" | "premium";
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

export function isTrialActive(subscription: Subscription | null, trialEndsAt: string | null): boolean {
  if (!subscription || subscription.tier !== "free_trial") return false;
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) > new Date();
}

export function isTrialExpired(subscription: Subscription | null, trialEndsAt: string | null): boolean {
  if (!subscription || subscription.tier !== "free_trial") return false;
  if (!trialEndsAt) return false;
  return new Date(trialEndsAt) <= new Date();
}

export function getTrialTimeRemaining(trialEndsAt: string | null): { days: number; hours: number; isUrgent: boolean } {
  if (!trialEndsAt) return { days: 0, hours: 0, isUrgent: false };
  const now = new Date();
  const end = new Date(trialEndsAt);
  const diff = end.getTime() - now.getTime();
  if (diff <= 0) return { days: 0, hours: 0, isUrgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  return { days, hours, isUrgent: days < 2 };
}
