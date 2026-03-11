"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, LogOut, Clock, ChevronRight, BookOpen, Lock } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  track: string;
  duration_minutes: number;
  tier_required: string;
  lesson_order: number;
};

type ProgressStatus = "not_started" | "in_progress" | "completed";

const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "bg-blue-100 text-blue-700",
  "Blood Sugar": "bg-rose-100 text-rose-700",
  Nutrition: "bg-green-100 text-green-700",
  Medications: "bg-purple-100 text-purple-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

const STATUS_STYLES: Record<ProgressStatus, string> = {
  not_started: "bg-gray-100 text-gray-500",
  in_progress: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
};

const STATUS_LABELS: Record<ProgressStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
};

export default function LessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progressMap, setProgressMap] = useState<Record<string, ProgressStatus>>({});
  const [plan, setPlan] = useState<string>("essential");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      const [{ data: profile }, { data: lessonsData }, { data: progressData }] = await Promise.all([
        supabase.from("profiles").select("plan").eq("id", user.id).single(),
        supabase.from("lessons").select("*").order("lesson_order", { ascending: true }),
        supabase.from("lesson_progress").select("lesson_id, status").eq("user_id", user.id),
      ]);

      if (profile) setPlan(profile.plan);
      if (lessonsData) setLessons(lessonsData);
      if (progressData) {
        const map: Record<string, ProgressStatus> = {};
        progressData.forEach((p) => { map[p.lesson_id] = p.status as ProgressStatus; });
        setProgressMap(map);
      }
      setLoading(false);
    };
    run();
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const categories = ["All", ...Array.from(new Set(lessons.map((l) => l.track)))];
  const filtered = activeCategory === "All" ? lessons : lessons.filter((l) => l.track === activeCategory);

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
            <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">Dashboard</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[color:var(--foreground)]">Lesson Library</span>
          </div>
          <h1 className="text-[1.75rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
            Lesson Library
          </h1>
          <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mt-1">
            Step-by-step education modules to build your diabetes confidence.
          </p>
        </div>

        {/* Category filter tabs */}
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

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[color:var(--primary)]" />
            </div>
            <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>
              No lessons yet
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-[0.875rem]">
              {activeCategory === "All"
                ? "Lessons will appear here once they're published."
                : `No lessons in the ${activeCategory} category yet.`}
            </p>
          </div>
        )}

        {/* Lesson grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((lesson) => {
              const locked = lesson.tier_required === "premium" && plan === "essential";
              const status = progressMap[lesson.id] ?? "not_started";

              return (
                <Link
                  key={lesson.id}
                  href={locked ? "#" : `/lessons/${lesson.id}`}
                  onClick={locked ? (e) => e.preventDefault() : undefined}
                  className={`relative bg-white rounded-2xl p-5 border border-[color:var(--border)] flex flex-col gap-3 transition-shadow ${
                    locked ? "opacity-70 cursor-default" : "hover:shadow-md"
                  }`}
                >
                  {/* Premium badge */}
                  {locked && (
                    <span className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 text-[0.7rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                      <Lock className="w-3 h-3" />
                      Premium
                    </span>
                  )}

                  {/* Category */}
                  <span
                    className={`self-start text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                      CATEGORY_COLORS[lesson.track] ?? "bg-gray-100 text-gray-600"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {lesson.track}
                  </span>

                  {/* Title + description */}
                  <div className="flex-1">
                    <h3 className="text-[0.95rem] text-[color:var(--foreground)] mb-1 leading-snug" style={{ fontWeight: 600 }}>
                      {lesson.title}
                    </h3>
                    <p className="text-[0.825rem] text-[color:var(--muted-foreground)] leading-relaxed line-clamp-2">
                      {lesson.summary}
                    </p>
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-1">
                    <span className="flex items-center gap-1 text-[0.775rem] text-[color:var(--muted-foreground)]">
                      <Clock className="w-3.5 h-3.5" />
                      {lesson.duration_minutes} min
                    </span>
                    <span
                      className={`text-[0.7rem] px-2 py-0.5 rounded-full ${STATUS_STYLES[status]}`}
                      style={{ fontWeight: 600 }}
                    >
                      {STATUS_LABELS[status]}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Upgrade banner for essential */}
        {plan === "essential" && lessons.some((l) => l.tier_required === "premium") && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-[#1a7a6e] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white text-[0.8rem] mb-1" style={{ fontWeight: 600 }}>Unlock Premium Lessons</p>
              <p className="text-white/80 text-[0.875rem]">Upgrade to access all lessons, plus AI Coach and live Q&As.</p>
            </div>
            <Link
              href="/signup?plan=premium"
              className="shrink-0 bg-white text-[color:var(--primary)] px-6 py-2.5 rounded-full text-[0.875rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              Upgrade — $19.99/mo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
