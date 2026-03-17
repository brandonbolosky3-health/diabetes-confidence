import { NextRequest } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@/lib/supabase/server";

const anthropic = new Anthropic();

const SYSTEM_PROMPT =
  "You are a supportive, knowledgeable health coach specializing in diabetes management, nutrition, and lifestyle. Be warm, encouraging, and evidence-based. Never diagnose or replace medical advice.";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan")
    .eq("id", user.id)
    .single();

  if (!profile || profile.plan !== "premium") {
    return new Response("Premium plan required", { status: 403 });
  }

  const { message, conversationId } = await request.json();
  let convId: string = conversationId;

  if (!convId) {
    const { data: conv, error } = await supabase
      .from("ai_conversations")
      .insert({ user_id: user.id })
      .select("id")
      .single();
    if (error || !conv)
      return new Response("Failed to create conversation", { status: 500 });
    convId = conv.id;
  }

  await supabase.from("ai_messages").insert({
    conversation_id: convId,
    role: "user",
    content: message,
  });

  const { data: history } = await supabase
    .from("ai_messages")
    .select("role, content")
    .eq("conversation_id", convId)
    .order("created_at", { ascending: true });

  const messages: Anthropic.MessageParam[] = (history || []).map((m) => ({
    role: m.role as "user" | "assistant",
    content: m.content,
  }));

  let fullContent = "";

  const aiStream = anthropic.messages.stream({
    model: "claude-sonnet-4-0",
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages,
  });

  const readable = new ReadableStream({
    async start(controller) {
      const enc = new TextEncoder();
      controller.enqueue(
        enc.encode(`data: ${JSON.stringify({ conversationId: convId })}\n\n`)
      );

      for await (const event of aiStream) {
        if (
          event.type === "content_block_delta" &&
          event.delta.type === "text_delta"
        ) {
          fullContent += event.delta.text;
          controller.enqueue(
            enc.encode(
              `data: ${JSON.stringify({ text: event.delta.text })}\n\n`
            )
          );
        }
      }

      await supabase.from("ai_messages").insert({
        conversation_id: convId,
        role: "assistant",
        content: fullContent,
      });

      controller.enqueue(
        enc.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
      );
      controller.close();
    },
    cancel() {
      aiStream.abort();
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
