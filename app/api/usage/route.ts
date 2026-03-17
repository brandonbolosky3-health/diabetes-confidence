import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription } from "@/lib/subscription";
import {
  getRemainingMessages,
  getUsage,
  MONTHLY_LIMIT,
  getNextMonthResetDate,
} from "@/lib/ai-usage";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscription = await getUserSubscription(supabase, user.id);
  const remaining = await getRemainingMessages(supabase, user.id);
  const usage = await getUsage(supabase, user.id);
  const used = usage?.message_count ?? 0;

  return NextResponse.json({
    used,
    limit: MONTHLY_LIMIT,
    remaining,
    reset_date: getNextMonthResetDate(),
    tier: subscription?.tier ?? "free",
  });
}
