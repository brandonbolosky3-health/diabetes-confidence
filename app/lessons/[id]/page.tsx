"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { Heart, LogOut, Clock, ArrowLeft, ChevronRight, CheckCircle, PlayCircle, Lock } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
  summary: string;
  content: string;
  track: string;
  duration_minutes: number;
  tier_required: string;
};

type ProgressStatus = "not_started" | "in_progress" | "completed";

const TRACK_COLORS: Record<string, string> = {
  Foundations: "bg-blue-100 text-blue-700",
  "Blood Sugar": "bg-rose-100 text-rose-700",
  Nutrition: "bg-green-100 text-green-700",
  Medications: "bg-purple-100 text-purple-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

function renderContent(content: string) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("## ")) {
      return (
        <h2 key={i} className="text-[1.1rem] text-[color:var(--foreground)] mt-7 mb-2" style={{ fontWeight: 700 }}>
          {line.slice(3)}
        </h2>
      );
    }
    if (line.startsWith("- ")) {
      return (
        <li key={i} className="ml-4 text-[0.95rem] text-[color:var(--foreground)] leading-relaxed list-disc">
          {line.slice(2)}
        </li>
      );
    }
    if (line.trim() === "") {
      return <div key={i} className="h-3" />;
    }
    return (
      <p key={i} className="text-[0.95rem] text-[color:var(--foreground)] leading-relaxed">
        {line}
      </p>
    );
  });
}

export default function LessonDetailPage() {
  const router = useRouter();
  const params = useParams();
  const lessonId = params.id as string;

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [status, setStatus] = useState<ProgressStatus>("not_started");
  const [plan, setPlan] = useState<string>("essential");
  const [userId, setUserId] = useState<string | null>(null);
  const [progressId, setProgressId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setUserId(user.id);

      const [{ data: profile }, { data: lessonData }, { data: progressData }] = await Promise.all([
        supabase.from("profiles").select("plan").eq("id", user.id).single(),
        supabase.from("lessons").select("*").eq("id", lessonId).single(),
        supabase.from("lesson_progress").select("id, status").eq("lesson_id", lessonId).eq("user_id", user.id).single(),
      ]);

      if (profile) setPlan(profile.plan);
      if (lessonData) setLesson(lessonData);
      if (progressData) {
        setStatus(progressData.status as ProgressStatus);
        setProgressId(progressData.id);
      }
      setLoading(false);
    };
    run();
  }, [router, lessonId]);

  const updateProgress = async (newStatus: ProgressStatus) => {
    if (!userId || !lessonId) return;
    setActionLoading(true);
    const supabase = createClient();

    if (progressId) {
      await supabase.from("lesson_progress").update({ status: newStatus }).eq("id", progressId);
    } else {
      const { data } = await supabase
        .from("lesson_progress")
        .insert({ user_id: userId, lesson_id: lessonId, status: newStatus })
        .select("id")
        .single();
      if (data) setProgressId(data.id);
    }

    setStatus(newStatus);
    setActionLoading(false);
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

  if (!lesson) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[color:var(--muted-foreground)] mb-4">Lesson not found.</p>
          <Link href="/lessons" className="text-[color:var(--primary)] hover:underline text-[0.875rem]">
            Back to Lesson Library
          </Link>
        </div>
      </div>
    );
  }

  const locked = lesson.tier_required === "premium" && plan === "essential";

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/member" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">Saryn Health</span>
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
        {/* Breadcrumb + back */}
        <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-6">
          <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">Dashboard</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/lessons" className="hover:text-[color:var(--foreground)] transition-colors">Lesson Library</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-[color:var(--foreground)] truncate max-w-[180px]">{lesson.title}</span>
        </div>

        <Link
          href="/lessons"
          className="inline-flex items-center gap-1.5 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to lessons
        </Link>

        {/* Lesson card */}
        <div className="bg-white rounded-2xl border border-[color:var(--border)] overflow-hidden">
          {/* Header */}
          <div className="p-6 sm:p-8 border-b border-[color:var(--border)]">
            <div className="flex items-start justify-between gap-4 mb-4">
              <span
                className={`text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                  TRACK_COLORS[lesson.track] ?? "bg-gray-100 text-gray-600"
                }`}
                style={{ fontWeight: 600 }}
              >
                {lesson.track}
              </span>
              {locked && (
                <span className="flex items-center gap-1 bg-amber-100 text-amber-700 text-[0.7rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                  <Lock className="w-3 h-3" />
                  Premium
                </span>
              )}
            </div>

            <h1 className="text-[1.5rem] text-[color:var(--foreground)] mb-2 leading-snug" style={{ fontWeight: 700 }}>
              {lesson.title}
            </h1>
            <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mb-4">{lesson.summary}</p>

            <div className="flex items-center gap-1.5 text-[0.825rem] text-[color:var(--muted-foreground)]">
              <Clock className="w-4 h-4" />
              {lesson.duration_minutes} min read
            </div>
          </div>

          {/* Progress actions */}
          {!locked && (
            <div className="px-6 sm:px-8 py-4 bg-[color:var(--background)] border-b border-[color:var(--border)] flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                {status === "completed" && (
                  <span className="flex items-center gap-1.5 text-green-700 text-[0.875rem]" style={{ fontWeight: 600 }}>
                    <CheckCircle className="w-4 h-4" />
                    Completed
                  </span>
                )}
                {status === "in_progress" && (
                  <span className="flex items-center gap-1.5 text-amber-700 text-[0.875rem]" style={{ fontWeight: 600 }}>
                    <PlayCircle className="w-4 h-4" />
                    In progress
                  </span>
                )}
                {status === "not_started" && (
                  <span className="text-[color:var(--muted-foreground)] text-[0.875rem]">Not started</span>
                )}
              </div>

              <div className="flex items-center gap-2">
                {status === "not_started" && (
                  <button
                    onClick={() => updateProgress("in_progress")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    <PlayCircle className="w-4 h-4" />
                    Start Lesson
                  </button>
                )}
                {status === "in_progress" && (
                  <button
                    onClick={() => updateProgress("completed")}
                    disabled={actionLoading}
                    className="flex items-center gap-2 px-5 py-2 rounded-full bg-green-600 text-white text-[0.875rem] hover:opacity-90 transition-opacity disabled:opacity-60"
                    style={{ fontWeight: 600 }}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Mark as Complete
                  </button>
                )}
                {status === "completed" && (
                  <button
                    onClick={() => updateProgress("in_progress")}
                    disabled={actionLoading}
                    className="px-5 py-2 rounded-full border border-[color:var(--border)] text-[color:var(--muted-foreground)] text-[0.875rem] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)] transition-colors disabled:opacity-60"
                    style={{ fontWeight: 500 }}
                  >
                    Mark as incomplete
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Content */}
          {locked ? (
            <div className="p-8 sm:p-12 flex flex-col items-center text-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
                <Lock className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <p className="text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>Premium lesson</p>
                <p className="text-[color:var(--muted-foreground)] text-[0.875rem]">
                  Upgrade your plan to access this lesson and all premium content.
                </p>
              </div>
              <Link
                href="/signup?plan=premium"
                className="mt-2 px-6 py-2.5 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600 }}
              >
                Upgrade — $19.99/mo
              </Link>
            </div>
          ) : (
            <div className="p-6 sm:p-8">
              {renderContent(lesson.content)}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
