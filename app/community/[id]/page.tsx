"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  ChevronRight,
  ArrowLeft,
  ThumbsUp,
  MessageSquare,
  Send,
} from "lucide-react";
import Logo from "@/components/Logo";

type Post = {
  id: string;
  author_name: string;
  title: string;
  content: string;
  category: string;
  like_count: number;
  reply_count: number;
  created_at: string;
};

type Reply = {
  id: string;
  author_name: string;
  content: string;
  created_at: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  General: "bg-gray-100 text-gray-600",
  Nutrition: "bg-green-100 text-green-700",
  Recipes: "bg-orange-100 text-orange-700",
  "Success Stories": "bg-teal-100 text-teal-700",
  Questions: "bg-blue-100 text-blue-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString(undefined, { month: "short", day: "numeric" });
}

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full bg-[color:var(--primary)]/15 flex items-center justify-center shrink-0">
      <span className="text-[0.7rem] text-[color:var(--primary)]" style={{ fontWeight: 700 }}>
        {initials}
      </span>
    </div>
  );
}

export default function CommunityPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: postData }, { data: replyData }] = await Promise.all([
        supabase.from("community_posts").select("*").eq("id", postId).single(),
        supabase
          .from("community_replies")
          .select("id, author_name, content, created_at")
          .eq("post_id", postId)
          .order("created_at", { ascending: true }),
      ]);

      if (postData) setPost(postData);
      if (replyData) setReplies(replyData);
      setLoading(false);
    };
    run();
  }, [router, postId]);

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

  if (!post) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--muted-foreground)] mb-4">Post not found.</p>
          <Link href="/community" className="text-[color:var(--primary)] hover:underline text-[0.875rem]">
            Back to Community
          </Link>
        </div>
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

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-6">
          <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/community" className="hover:text-[color:var(--foreground)] transition-colors">
            Community
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[color:var(--foreground)] truncate max-w-[160px]">{post.title}</span>
        </div>

        <Link
          href="/community"
          className="inline-flex items-center gap-1.5 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to community
        </Link>

        {/* Post */}
        <div className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span
              className={`text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"
              }`}
              style={{ fontWeight: 600 }}
            >
              {post.category}
            </span>
            <span className="text-[0.8rem] text-[color:var(--muted-foreground)]">
              {timeAgo(post.created_at)}
            </span>
          </div>

          <h1
            className="text-[1.4rem] text-[color:var(--foreground)] leading-snug mb-4"
            style={{ fontWeight: 700 }}
          >
            {post.title}
          </h1>

          <p className="text-[0.95rem] text-[color:var(--foreground)] leading-relaxed whitespace-pre-wrap mb-6">
            {post.content}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-[color:var(--border)]">
            <div className="flex items-center gap-2">
              <Avatar name={post.author_name} />
              <span className="text-[0.875rem] text-[color:var(--foreground)]" style={{ fontWeight: 500 }}>
                {post.author_name}
              </span>
            </div>
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 text-[0.8rem] text-[color:var(--muted-foreground)]">
                <MessageSquare className="w-4 h-4" />
                {post.reply_count} {post.reply_count === 1 ? "reply" : "replies"}
              </span>
              <button className="flex items-center gap-1.5 text-[0.8rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--primary)] transition-colors">
                <ThumbsUp className="w-4 h-4" />
                {post.like_count}
              </button>
            </div>
          </div>
        </div>

        {/* Replies */}
        <div className="mb-6">
          <h2
            className="text-[0.9rem] text-[color:var(--foreground)] mb-4"
            style={{ fontWeight: 600 }}
          >
            {replies.length > 0
              ? `${replies.length} ${replies.length === 1 ? "Reply" : "Replies"}`
              : "No replies yet"}
          </h2>

          {replies.length > 0 && (
            <div className="flex flex-col gap-3">
              {replies.map((reply) => (
                <div
                  key={reply.id}
                  className="bg-white rounded-2xl border border-[color:var(--border)] p-5"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Avatar name={reply.author_name} />
                      <span
                        className="text-[0.875rem] text-[color:var(--foreground)]"
                        style={{ fontWeight: 500 }}
                      >
                        {reply.author_name}
                      </span>
                    </div>
                    <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                      {timeAgo(reply.created_at)}
                    </span>
                  </div>
                  <p className="text-[0.875rem] text-[color:var(--foreground)] leading-relaxed">
                    {reply.content}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Reply input */}
        <div className="bg-white rounded-2xl border border-[color:var(--border)] p-5">
          <h3
            className="text-[0.875rem] text-[color:var(--foreground)] mb-3"
            style={{ fontWeight: 600 }}
          >
            Write a reply
          </h3>
          <textarea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            rows={3}
            placeholder="Share your thoughts or support…"
            className="w-full resize-none rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-[0.875rem] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--primary)] transition-colors bg-[color:var(--background)] mb-3"
          />
          <div className="flex items-center justify-between">
            <p className="text-[0.75rem] text-[color:var(--muted-foreground)]">
              Replies coming soon — stay tuned!
            </p>
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] opacity-40 cursor-not-allowed"
              style={{ fontWeight: 600 }}
            >
              <Send className="w-3.5 h-3.5" />
              Post Reply
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
