"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  markChunkViewed,
  TRACK_LABELS,
  type KnowledgeChunk,
} from "@/lib/onboarding";
import {
  Heart, ArrowLeft, ArrowRight, Clock, Droplets,
  AlertTriangle, Bot, ChevronRight, BookOpen,
} from "lucide-react";

export default function LearnChunkPage() {
  const params = useParams();
  const router = useRouter();
  const chunkId = params.chunkId as string;

  const [loading, setLoading] = useState(true);
  const [chunk, setChunk] = useState<KnowledgeChunk | null>(null);
  const [nextChunk, setNextChunk] = useState<KnowledgeChunk | null>(null);
  const [plan, setPlan] = useState<string>("essential");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      // Get plan
      const userPlan = user.user_metadata?.plan || "essential";
      const { data: profileRow } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();
      setPlan(profileRow?.plan || userPlan);

      // Fetch chunk
      const { data: chunkData, error } = await supabase
        .from("knowledge_chunks")
        .select("*")
        .eq("id", chunkId)
        .single();

      if (error || !chunkData) {
        router.push("/dashboard");
        return;
      }

      setChunk(chunkData as KnowledgeChunk);

      // Mark as viewed
      await markChunkViewed(supabase, user.id, chunkId);

      // Fetch next unseen chunk in same track
      const { data: nextData } = await supabase
        .from("knowledge_chunks")
        .select("*")
        .eq("primary_track", chunkData.primary_track)
        .neq("id", chunkId)
        .not(
          "id",
          "in",
          `(select chunk_id from member_education_progress where user_id = '${user.id}')`
        )
        .limit(1);

      if (nextData && nextData.length > 0) {
        setNextChunk(nextData[0] as KnowledgeChunk);
      }

      setLoading(false);
    };
    load();
  }, [chunkId, router]);

  const handleAskCoach = useCallback(() => {
    if (!chunk) return;
    const query = encodeURIComponent(`I just read "${chunk.chunk_title}" and I have a question about it.`);
    router.push(`/ai?context=${query}`);
  }, [chunk, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!chunk) return null;

  const trackLabel = TRACK_LABELS[chunk.primary_track] || chunk.primary_track;

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">Saryn Health</span>
        </Link>
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-[0.8rem] text-[color:var(--muted-foreground)] mb-6">
          <Link href="/dashboard" className="hover:text-[color:var(--foreground)] transition-colors">
            Dashboard
          </Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[color:var(--primary)] font-medium">{trackLabel}</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-[color:var(--foreground)]">{chunk.chunk_title}</span>
        </nav>

        {/* Meta */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-[color:var(--muted-foreground)] bg-white border border-[color:var(--border)] rounded-full px-3 py-1">
            <Clock className="w-3 h-3" />
            {chunk.reading_time_minutes} min read
          </span>
          <span className="inline-flex items-center gap-1 text-[0.75rem] font-medium text-[color:var(--primary)] bg-[color:var(--secondary)] rounded-full px-3 py-1">
            <BookOpen className="w-3 h-3" />
            {trackLabel}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[color:var(--foreground)] leading-tight mb-2">
          {chunk.chunk_title}
        </h1>
        <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-8">
          From: {chunk.doc_title}
        </p>

        {/* Blood sugar callout */}
        {chunk.has_blood_sugar_callout && (
          <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/20 rounded-xl p-4 mb-6 flex gap-3">
            <Droplets className="w-5 h-5 text-[color:var(--primary)] shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.85rem] font-semibold text-[color:var(--primary)] mb-1">
                Blood Sugar Impact
              </p>
              <p className="text-[0.85rem] text-[color:var(--foreground)]">
                This topic has a direct impact on blood sugar regulation. Pay special attention to the actionable takeaways.
              </p>
            </div>
          </div>
        )}

        {/* Clinical supervision note */}
        {chunk.has_clinical_supervision_note && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.85rem] font-semibold text-amber-700 mb-1">
                Clinical Supervision Recommended
              </p>
              <p className="text-[0.85rem] text-amber-900/80">
                The protocols discussed in this lesson should be implemented under the guidance of a qualified healthcare provider.
              </p>
            </div>
          </div>
        )}

        {/* Content */}
        <article className="prose prose-sm sm:prose max-w-none mb-10">
          <div className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8">
            {chunk.content.split("\n").map((paragraph, i) =>
              paragraph.trim() ? (
                <p key={i} className="text-[color:var(--foreground)] text-[0.95rem] leading-relaxed mb-4 last:mb-0">
                  {paragraph}
                </p>
              ) : null
            )}
          </div>
        </article>

        {/* Bottom actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Next lesson */}
          {nextChunk && (
            <Link
              href={`/learn/${nextChunk.id}`}
              className="flex-1 flex items-center justify-between bg-white rounded-2xl border border-[color:var(--border)] p-4 hover:shadow-md hover:border-[color:var(--primary)]/30 transition-all"
            >
              <div>
                <p className="text-[0.7rem] font-bold tracking-widest text-[color:var(--muted-foreground)] uppercase mb-1">
                  Next lesson
                </p>
                <p className="text-[0.9rem] font-semibold text-[color:var(--foreground)]">
                  {nextChunk.chunk_title}
                </p>
              </div>
              <ArrowRight className="w-5 h-5 text-[color:var(--primary)] shrink-0 ml-3" />
            </Link>
          )}

          {/* Ask AI Coach (Premium only) */}
          {plan === "premium" && (
            <button
              onClick={handleAskCoach}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[color:var(--primary)] text-white text-[0.875rem] font-semibold hover:opacity-90 transition-opacity"
            >
              <Bot className="w-4 h-4" />
              Ask the AI Coach about this
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
