import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-admin";
import { sendMonthlyResetEmail } from "@/lib/email";
import { MONTHLY_LIMIT } from "@/lib/ai-usage";

export async function GET(request: NextRequest) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const supabase = createAdminClient();

  // Get all active premium subscribers
  const { data: subscribers, error } = await supabase
    .from("subscriptions")
    .select("user_id")
    .eq("tier", "premium")
    .eq("status", "active");

  if (error || !subscribers) {
    return NextResponse.json(
      { error: "failed to fetch subscribers" },
      { status: 500 }
    );
  }

  let sent = 0;
  let errors = 0;

  for (const sub of subscribers) {
    // Get user email and name from auth
    const { data: userData } = await supabase.auth.admin.getUserById(
      sub.user_id
    );
    const user = userData?.user;
    if (!user?.email) {
      errors++;
      continue;
    }

    const firstName =
      user.user_metadata?.first_name ||
      user.email.split("@")[0].charAt(0).toUpperCase() +
        user.email.split("@")[0].slice(1);

    const result = await sendMonthlyResetEmail(
      user.email,
      firstName,
      MONTHLY_LIMIT
    );

    if (result.success) {
      sent++;
    } else {
      errors++;
    }
  }

  return NextResponse.json({ sent, errors });
}
