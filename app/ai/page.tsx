"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  Bot,
  Plus,
  Send,
  Lock,
  MessageSquare,
} from "lucide-react";
import Logo from "@/components/Logo";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Conversation = {
  id: string;
  created_at: string;
  firstMessage?: string;
};

function formatDate(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  const days = Math.floor(diff / 86400000);
  if (days === 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function AssistantMessage({ content }: { content: string }) {
  return (
    <div className="flex flex-col gap-1">
      {content.split("\n").map((line, i) => {
        if (line.trim() === "") return <div key={i} className="h-2" />;
        return (
          <p key={i} className="text-[0.9rem] text-[color:var(--foreground)] leading-relaxed">
            {line}
          </p>
        );
      })}
    </div>
  );
}

export default function AICoachPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<string>("essential");
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConvId, setActiveConvId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const [{ data: profile }, { data: convData }] = await Promise.all([
        supabase.from("profiles").select("plan").eq("id", user.id).single(),
        supabase
          .from("ai_conversations")
          .select("id, created_at")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false }),
      ]);

      if (profile) setPlan(profile.plan);

      if (convData && convData.length > 0) {
        const ids = convData.map((c) => c.id);
        const { data: firstMsgs } = await supabase
          .from("ai_messages")
          .select("conversation_id, content")
          .in("conversation_id", ids)
          .eq("role", "user")
          .order("created_at", { ascending: true });

        const firstMsgMap: Record<string, string> = {};
        firstMsgs?.forEach((m) => {
          if (!firstMsgMap[m.conversation_id])
            firstMsgMap[m.conversation_id] = m.content;
        });

        setConversations(
          convData.map((c) => ({ ...c, firstMessage: firstMsgMap[c.id] }))
        );
      }

      setLoading(false);
    };
    run();
  }, [router]);

  useEffect(() => {
    if (!activeConvId) return;
    const run = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("ai_messages")
        .select("role, content")
        .eq("conversation_id", activeConvId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data as Message[]);
    };
    run();
  }, [activeConvId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || streaming) return;
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";

    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setMessages((prev) => [...prev, { role: "assistant", content: "" }]);
    setStreaming(true);

    try {
      const res = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, conversationId: activeConvId }),
      });

      if (!res.ok || !res.body) throw new Error("Request failed");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let newConvId = activeConvId;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          try {
            const data = JSON.parse(line.slice(6));

            if (data.conversationId && !newConvId) {
              newConvId = data.conversationId;
              setActiveConvId(data.conversationId);
              setConversations((prev) => [
                {
                  id: data.conversationId,
                  created_at: new Date().toISOString(),
                  firstMessage: text,
                },
                ...prev,
              ]);
            }

            if (data.text) {
              setMessages((prev) => {
                const updated = [...prev];
                const last = updated[updated.length - 1];
                if (last?.role === "assistant") {
                  updated[updated.length - 1] = {
                    ...last,
                    content: last.content + data.text,
                  };
                }
                return updated;
              });
            }
          } catch {
            // ignore malformed SSE lines
          }
        }
      }
    } catch {
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const startNewConversation = () => {
    setActiveConvId(null);
    setMessages([]);
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/member" aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-6 w-auto text-[color:var(--foreground)]" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/member"
            className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 sm:gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      {/* Essential upgrade prompt */}
      {plan === "essential" ? (
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 flex items-center justify-center mx-auto mb-5">
              <Lock className="w-7 h-7 text-amber-600" />
            </div>
            <h1 className="text-[1.5rem] text-[color:var(--foreground)] mb-2" style={{ fontWeight: 700 }}>
              AI Coach is Premium
            </h1>
            <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-6 leading-relaxed">
              Upgrade to Premium to chat with your personal AI diabetes health
              coach — available 24/7 to answer your questions.
            </p>
            <Link
              href="/signup?plan=premium"
              className="inline-block px-6 py-2.5 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              Upgrade — $49/mo
            </Link>
          </div>
        </main>
      ) : (
        /* Premium chat UI */
        <div className="flex-1 flex overflow-hidden" style={{ height: "calc(100vh - 4rem)" }}>
          {/* Sidebar */}
          <aside className="hidden sm:flex flex-col w-60 border-r border-[color:var(--border)] bg-white">
            <div className="p-3 border-b border-[color:var(--border)]">
              <button
                onClick={startNewConversation}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-[0.875rem] text-[color:var(--foreground)] hover:bg-[color:var(--background)] transition-colors"
                style={{ fontWeight: 600 }}
              >
                <Plus className="w-4 h-4 text-[color:var(--primary)]" />
                New chat
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-2 px-2">
              {conversations.length === 0 ? (
                <p className="text-[0.8rem] text-[color:var(--muted-foreground)] text-center mt-6 px-2">
                  No conversations yet
                </p>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setActiveConvId(conv.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl mb-0.5 transition-colors group ${
                      activeConvId === conv.id
                        ? "bg-[color:var(--primary)]/10 text-[color:var(--primary)]"
                        : "hover:bg-[color:var(--background)] text-[color:var(--foreground)]"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      <MessageSquare
                        className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
                          activeConvId === conv.id
                            ? "text-[color:var(--primary)]"
                            : "text-[color:var(--muted-foreground)]"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-[0.8rem] leading-snug truncate" style={{ fontWeight: 500 }}>
                          {conv.firstMessage
                            ? conv.firstMessage.slice(0, 38) +
                              (conv.firstMessage.length > 38 ? "…" : "")
                            : "New conversation"}
                        </p>
                        <p className="text-[0.7rem] text-[color:var(--muted-foreground)] mt-0.5">
                          {formatDate(conv.created_at)}
                        </p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </aside>

          {/* Chat area */}
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center px-4 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
                    <Bot className="w-7 h-7 text-[color:var(--primary)]" />
                  </div>
                  <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-2" style={{ fontWeight: 600 }}>
                    Your AI Diabetes Coach
                  </h2>
                  <p className="text-[color:var(--muted-foreground)] text-[0.875rem] max-w-xs leading-relaxed">
                    Ask me anything about managing diabetes — blood sugar,
                    nutrition, lifestyle, medications, and more.
                  </p>
                </div>
              ) : (
                <div className="max-w-2xl mx-auto w-full px-4 py-6 space-y-4">
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    >
                      {msg.role === "assistant" && (
                        <div className="w-7 h-7 rounded-lg bg-[color:var(--primary)]/10 flex items-center justify-center shrink-0 mr-2 mt-0.5">
                          <Bot className="w-4 h-4 text-[color:var(--primary)]" />
                        </div>
                      )}
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          msg.role === "user"
                            ? "bg-[color:var(--primary)] text-white"
                            : "bg-white border border-[color:var(--border)]"
                        }`}
                      >
                        {msg.role === "user" ? (
                          <p className="text-[0.9rem] leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        ) : msg.content === "" ? (
                          <div className="flex gap-1 py-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--muted-foreground)] animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--muted-foreground)] animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-[color:var(--muted-foreground)] animate-bounce" style={{ animationDelay: "300ms" }} />
                          </div>
                        ) : (
                          <AssistantMessage content={msg.content} />
                        )}
                      </div>
                    </div>
                  ))}
                  <div ref={bottomRef} />
                </div>
              )}
            </div>

            {/* Input bar */}
            <div className="border-t border-[color:var(--border)] bg-white p-4">
              <div className="max-w-2xl mx-auto flex items-end gap-3">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={handleTextareaChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about blood sugar, nutrition, lifestyle…"
                  rows={1}
                  disabled={streaming}
                  className="flex-1 resize-none rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-[0.9rem] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--primary)] transition-colors disabled:opacity-60 bg-[color:var(--background)]"
                  style={{ minHeight: "44px", maxHeight: "160px" }}
                />
                <button
                  onClick={sendMessage}
                  disabled={!input.trim() || streaming}
                  className="w-11 h-11 rounded-xl bg-[color:var(--primary)] text-white flex items-center justify-center hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-center text-[0.7rem] text-[color:var(--muted-foreground)] mt-2">
                AI Coach is not a medical professional. Always consult your
                healthcare team.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
