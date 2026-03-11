"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, LogOut, Clock, ChevronRight, PlayCircle, Video } from "lucide-react";

type VideoItem = {
  id: string;
  title: string;
  description: string;
  category: string;
  duration_minutes: number;
  week_number: number | null;
  thumbnail_url: string | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "bg-blue-100 text-blue-700",
  "Blood Sugar": "bg-rose-100 text-rose-700",
  Nutrition: "bg-green-100 text-green-700",
  Medications: "bg-purple-100 text-purple-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

const THUMBNAIL_GRADIENTS: Record<string, string> = {
  Foundations: "from-blue-400 to-blue-600",
  "Blood Sugar": "from-rose-400 to-rose-600",
  Nutrition: "from-green-400 to-green-600",
  Medications: "from-purple-400 to-purple-600",
  Lifestyle: "from-amber-400 to-amber-600",
};

export default function VideosPage() {
  const router = useRouter();
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

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

      const { data } = await supabase
        .from("videos")
        .select("id, title, description, category, duration_minutes, week_number, thumbnail_url")
        .order("week_number", { ascending: true });

      if (data) setVideos(data);
      setLoading(false);
    };
    run();
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const categories = ["All", ...Array.from(new Set(videos.map((v) => v.category)))];
  const filtered =
    activeCategory === "All" ? videos : videos.filter((v) => v.category === activeCategory);

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

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-3">
            <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[color:var(--foreground)]">Weekly Videos</span>
          </div>
          <h1 className="text-[1.75rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
            Weekly Videos
          </h1>
          <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mt-1">
            Bite-sized video lessons to watch on your schedule.
          </p>
        </div>

        {/* Category filter tabs */}
        {videos.length > 0 && (
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

        {/* Empty / coming soon state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
              <Video className="w-6 h-6 text-[color:var(--primary)]" />
            </div>
            <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>
              {activeCategory === "All" ? "Videos coming soon" : `No ${activeCategory} videos yet`}
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-[0.875rem] max-w-xs">
              {activeCategory === "All"
                ? "New weekly videos are on the way. Check back soon."
                : `Videos in the ${activeCategory} category will appear here.`}
            </p>
          </div>
        )}

        {/* Video grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filtered.map((video) => (
              <Link
                key={video.id}
                href={`/videos/${video.id}`}
                className="group bg-white rounded-2xl border border-[color:var(--border)] overflow-hidden hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden">
                  {video.thumbnail_url ? (
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div
                      className={`w-full h-full bg-gradient-to-br ${
                        THUMBNAIL_GRADIENTS[video.category] ?? "from-teal-400 to-teal-600"
                      } flex items-center justify-center`}
                    >
                      <PlayCircle className="w-12 h-12 text-white/80 group-hover:scale-110 transition-transform duration-200" />
                    </div>
                  )}
                  {/* Duration badge */}
                  <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[0.7rem] px-2 py-0.5 rounded-md" style={{ fontWeight: 500 }}>
                    {video.duration_minutes} min
                  </span>
                </div>

                {/* Card body */}
                <div className="p-4 flex flex-col gap-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                        CATEGORY_COLORS[video.category] ?? "bg-gray-100 text-gray-600"
                      }`}
                      style={{ fontWeight: 600 }}
                    >
                      {video.category}
                    </span>
                    {video.week_number && (
                      <span className="text-[0.7rem] text-[color:var(--muted-foreground)]">
                        Week {video.week_number}
                      </span>
                    )}
                  </div>

                  <h3
                    className="text-[0.95rem] text-[color:var(--foreground)] leading-snug"
                    style={{ fontWeight: 600 }}
                  >
                    {video.title}
                  </h3>
                  <p className="text-[0.825rem] text-[color:var(--muted-foreground)] leading-relaxed line-clamp-2 flex-1">
                    {video.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[0.775rem] text-[color:var(--muted-foreground)] pt-1">
                    <Clock className="w-3.5 h-3.5" />
                    {video.duration_minutes} min watch
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
