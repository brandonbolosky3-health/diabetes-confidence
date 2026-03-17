import { SupabaseClient } from "@supabase/supabase-js";
import { sendUsageLimitWarningEmail } from "@/lib/email";

export const MONTHLY_LIMIT = 50;

export function getCurrentMonth(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

export function getNextMonthResetDate(): string {
  const now = new Date();
  const next = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  return next.toISOString();
}

interface UsageRow {
  id: string;
  user_id: string;
  month: string;
  message_count: number;
  last_message_at: string | null;
  created_at: string;
  updated_at: string;
}

export async function getUsage(
  supabase: SupabaseClient,
  userId: string
): Promise<UsageRow | null> {
  const { data } = await supabase
    .from("ai_usage")
    .select("*")
    .eq("user_id", userId)
    .eq("month", getCurrentMonth())
    .single();

  return data as UsageRow | null;
}

const WARNING_THRESHOLD = 40;

export async function checkAndIncrementUsage(
  supabase: SupabaseClient,
  userId: string,
  userEmail?: string
): Promise<{ allowed: boolean; count: number; limit: number }> {
  const usage = await getUsage(supabase, userId);
  const currentCount = usage?.message_count ?? 0;

  if (currentCount >= MONTHLY_LIMIT) {
    return { allowed: false, count: currentCount, limit: MONTHLY_LIMIT };
  }

  const now = new Date().toISOString();
  const newCount = currentCount + 1;

  await supabase.from("ai_usage").upsert(
    {
      user_id: userId,
      month: getCurrentMonth(),
      message_count: newCount,
      last_message_at: now,
      updated_at: now,
    },
    { onConflict: "user_id,month" }
  );

  // Send warning email at threshold
  if (newCount === WARNING_THRESHOLD && userEmail) {
    try {
      const firstName = userEmail.split("@")[0].charAt(0).toUpperCase() + userEmail.split("@")[0].slice(1);
      sendUsageLimitWarningEmail(
        userEmail,
        firstName,
        newCount,
        MONTHLY_LIMIT,
        getNextMonthResetDate()
      ).catch(() => {});
    } catch {
      // email is non-critical
    }
  }

  return { allowed: true, count: newCount, limit: MONTHLY_LIMIT };
}

export async function getRemainingMessages(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const usage = await getUsage(supabase, userId);
  const count = usage?.message_count ?? 0;
  return Math.max(0, MONTHLY_LIMIT - count);
}
