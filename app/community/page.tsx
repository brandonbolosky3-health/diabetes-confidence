"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Heart,
  LogOut,
  ChevronRight,
  MessageSquare,
  ThumbsUp,
  Plus,
  X,
  Users,
} from "lucide-react";

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

function NewPostModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between px-6 py-4 border-b border-[color:var(--border)]">
          <h2 className="text-[1rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
            New Post
          </h2>
          <button
            onClick={onClose}
            className="text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 flex flex-col gap-4">
          <div>
            <label className="block text-[0.8rem] text-[color:var(--foreground)] mb-1.5" style={{ fontWeight: 600 }}>
              Title
            </label>
            <input
              type="text"
              placeholder="Give your post a title…"
              className="w-full rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-[0.875rem] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--primary)] transition-colors bg-[color:var(--background)]"
            />
          </div>
          <div>
            <label className="block text-[0.8rem] text-[color:var(--foreground)] mb-1.5" style={{ fontWeight: 600 }}>
              Category
            </label>
            <select className="w-full rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-[0.875rem] text-[color:var(--foreground)] focus:outline-none focus:border-[color:var(--primary)] transition-colors bg-[color:var(--background)]">
              {Object.keys(CATEGORY_COLORS).map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[0.8rem] text-[color:var(--foreground)] mb-1.5" style={{ fontWeight: 600 }}>
              Content
            </label>
            <textarea
              rows={5}
              placeholder="Share your thoughts, questions, or story…"
              className="w-full resize-none rounded-xl border border-[color:var(--border)] px-4 py-2.5 text-[0.875rem] text-[color:var(--foreground)] placeholder:text-[color:var(--muted-foreground)] focus:outline-none focus:border-[color:var(--primary)] transition-colors bg-[color:var(--background)]"
            />
          </div>
          <div className="flex items-center justify-between pt-1">
            <p className="text-[0.75rem] text-[color:var(--muted-foreground)]">
              Posting coming soon — stay tuned!
            </p>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-full border border-[color:var(--border)] text-[0.875rem] text-[color:var(--muted-foreground)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors"
              >
                Cancel
              </button>
              <button
                disabled
                className="px-4 py-2 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] opacity-40 cursor-not-allowed"
                style={{ fontWeight: 600 }}
              >
                Post
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CommunityPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showNewPost, setShowNewPost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const { data } = await supabase
        .from("community_posts")
        .select("id, author_name, title, content, category, like_count, reply_count, created_at")
        .order("created_at", { ascending: false });

      if (data) setPosts(data);
      setLoading(false);
    };
    run();
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const categories = ["All", ...Array.from(new Set(posts.map((p) => p.category)))];
  const filtered = activeCategory === "All" ? posts : posts.filter((p) => p.category === activeCategory);

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {showNewPost && <NewPostModal onClose={() => setShowNewPost(false)} />}

      {/* Nav */}
      <header className="sticky top-0 z-40 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/member" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">DiabetesConfidence</span>
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-3">
            <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[color:var(--foreground)]">Community</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-[1.75rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
                Community
              </h1>
              <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mt-1">
                Connect, share, and support each other on the journey.
              </p>
            </div>
            <button
              onClick={() => setShowNewPost(true)}
              className="shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          </div>
        </div>

        {/* Category tabs */}
        {posts.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[0.875rem] border transition-colors ${
                  activeCategory === cat
                    ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)]"
                    : "bg-white text-[color:var(--muted-foreground)] border-[color:var(--border)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                }`}
                style={{ fontWeight: activeCategory === cat ? 600 : 400 }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-[color:var(--primary)]" />
            </div>
            <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>
              No posts yet
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-[0.875rem]">
              Be the first to start a conversation.
            </p>
          </div>
        )}

        {/* Post feed */}
        {filtered.length > 0 && (
          <div className="flex flex-col gap-3">
            {filtered.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="bg-white rounded-2xl border border-[color:var(--border)] p-5 hover:shadow-md transition-shadow block"
              >
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span
                    className={`text-[0.7rem] px-2.5 py-0.5 rounded-full shrink-0 ${
                      CATEGORY_COLORS[post.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {post.category}
                  </span>
                  <span className="text-[0.75rem] text-[color:var(--muted-foreground)] shrink-0">
                    {timeAgo(post.created_at)}
                  </span>
                </div>

                <h2
                  className="text-[1rem] text-[color:var(--foreground)] mb-1 leading-snug"
                  style={{ fontWeight: 600 }}
                >
                  {post.title}
                </h2>
                <p className="text-[0.875rem] text-[color:var(--muted-foreground)] line-clamp-2 leading-relaxed mb-3">
                  {post.content}
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-[0.8rem] text-[color:var(--muted-foreground)]">
                    {post.author_name}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-[0.8rem] text-[color:var(--muted-foreground)]">
                      <MessageSquare className="w-3.5 h-3.5" />
                      {post.reply_count}
                    </span>
                    <span className="flex items-center gap-1.5 text-[0.8rem] text-[color:var(--muted-foreground)]">
                      <ThumbsUp className="w-3.5 h-3.5" />
                      {post.like_count}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
