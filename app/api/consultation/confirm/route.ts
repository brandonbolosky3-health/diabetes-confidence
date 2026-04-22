import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription, isPremium } from "@/lib/subscription";

export async function POST() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const subscription = await getUserSubscription(supabase, user.id);
  if (!isPremium(subscription)) {
    return NextResponse.json(
      { error: "Only Premium members can use this" },
      { status: 400 }
    );
  }

  const { data: profile, error: profileErr } = await supabase
    .from("profiles")
    .select("free_consultation_used_at")
    .eq("id", user.id)
    .single();

  if (profileErr) {
    return NextResponse.json({ error: profileErr.message }, { status: 500 });
  }

  if (profile?.free_consultation_used_at) {
    return NextResponse.json(
      { error: "Consultation already used" },
      { status: 400 }
    );
  }

  const { error: updateErr } = await supabase
    .from("profiles")
    .update({ free_consultation_used_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
