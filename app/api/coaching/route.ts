import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";
import {
  getPersonalizedChunks,
  buildAICoachSystemPrompt,
  type MemberProfile,
} from "@/lib/onboarding";
import { getUserSubscription, isPremium } from "@/lib/subscription";
import { checkAndIncrementUsage, MONTHLY_LIMIT, getNextMonthResetDate } from "@/lib/ai-usage";

const anthropic = new Anthropic();

export async function POST(request: NextRequest) {
  // 1. Authenticate
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // 2. Check subscription tier
  const subscription = await getUserSubscription(supabase, user.id);
  if (!isPremium(subscription)) {
    return NextResponse.json({ error: "premium_required" }, { status: 403 });
  }

  // 3. Check usage limit
  const usageResult = await checkAndIncrementUsage(supabase, user.id, user.email ?? undefined);
  if (!usageResult.allowed) {
    return NextResponse.json(
      {
        error: "rate_limit_exceeded",
        message:
          "You have used all 50 AI coaching messages for this month. Your limit resets on the 1st.",
        reset_date: getNextMonthResetDate(),
        limit: MONTHLY_LIMIT,
        used: MONTHLY_LIMIT,
      },
      { status: 429 }
    );
  }

  // 4. Parse request
  const { message, sessionId } = await request.json();

  if (!message || typeof message !== "string") {
    return NextResponse.json({ error: "message is required" }, { status: 400 });
  }

  // 5. Fetch member profile
  const { data: memberProfile } = await supabase
    .from("member_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  if (!memberProfile) {
    return NextResponse.json({ error: "onboarding_required" }, { status: 400 });
  }

  // 6. Get personalized context chunks
  let chunks: Awaited<ReturnType<typeof getPersonalizedChunks>> = [];
  try {
    chunks = await getPersonalizedChunks(supabase, user.id, 5);
  } catch {
    // fallback to empty context
  }

  // 7. Build system prompt
  const systemPrompt = buildAICoachSystemPrompt(memberProfile as MemberProfile, chunks);

  // 8. Manage session
  let currentSessionId = sessionId;
  let conversationHistory: Anthropic.MessageParam[] = [];

  if (currentSessionId) {
    // Load existing session
    const { data: session } = await supabase
      .from("coaching_sessions")
      .select("messages")
      .eq("id", currentSessionId)
      .eq("user_id", user.id)
      .single();

    if (session?.messages) {
      conversationHistory = session.messages as Anthropic.MessageParam[];
    }
  } else {
    // Create new session
    const { data: newSession, error } = await supabase
      .from("coaching_sessions")
      .insert({
        user_id: user.id,
        messages: [],
      })
      .select("id")
      .single();

    if (error || !newSession) {
      return NextResponse.json({ error: "failed to create session" }, { status: 500 });
    }
    currentSessionId = newSession.id;
  }

  // Add user message to history
  conversationHistory.push({ role: "user", content: message });

  // 9. Call Claude API
  try {
    const response = await anthropic.messages.create({
      model: "claude-sonnet-4-6-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const replyText = response.content
      .filter((block): block is Anthropic.TextBlock => block.type === "text")
      .map((block) => block.text)
      .join("");

    // Add assistant reply to history
    conversationHistory.push({ role: "assistant", content: replyText });

    // 10. Save updated messages
    await supabase
      .from("coaching_sessions")
      .update({ messages: conversationHistory, updated_at: new Date().toISOString() })
      .eq("id", currentSessionId);

    // 11. Return response with usage stats
    return NextResponse.json({
      reply: replyText,
      sessionId: currentSessionId,
      usage: {
        used: usageResult.count,
        limit: MONTHLY_LIMIT,
        remaining: MONTHLY_LIMIT - usageResult.count,
      },
    });
  } catch (err) {
    console.error("Claude API error:", err);
    return NextResponse.json({ error: "ai_error" }, { status: 500 });
  }
}
