"use client";

import { useEffect, useState, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {
  getPersonalizedChunks,
  markChunkViewed,
  TRACK_LABELS,
  type MemberProfile,
  type KnowledgeChunk,
} from "@/lib/onboarding";
import { getUserSubscription, isPremium, isTrialExpired, getTrialTimeRemaining, type Subscription } from "@/lib/subscription";
import { hasSubmittedConsultationForm } from "@/lib/consultation";
import {
  Heart, LogOut, Menu, X, Clock, Lock, Droplets,
  BookOpen, ArrowRight, Sparkles, Bot, AlertTriangle, MessageCircle,
  ClipboardList, CheckCircle2,
} from "lucide-react";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

function getFirstName(email: string | undefined): string {
  if (!email) return "there";
  const local = email.split("@")[0];
  return local.charAt(0).toUpperCase() + local.slice(1);
}

const TRACK_COLORS: Record<string, { bg: string; text: string }> = {
  blood_sugar_metabolic: { bg: "bg-teal-100", text: "text-teal-700" },
  functional_labs: { bg: "bg-indigo-100", text: "text-indigo-700" },
  nutrition_gut: { bg: "bg-emerald-100", text: "text-emerald-700" },
  inflammation_immune: { bg: "bg-orange-100", text: "text-orange-700" },
  longevity_optimization: { bg: "bg-blue-100", text: "text-blue-700" },
  peptides_advanced: { bg: "bg-purple-100", text: "text-purple-700" },
};

// ─── Chunk Card ──────────────────────────────────────────────────────────────

function ChunkCard({
  chunk,
  isPremiumMember,
  onClick,
}: {
  chunk: KnowledgeChunk;
  isPremiumMember: boolean;
  onClick: () => void;
}) {
  const colors = TRACK_COLORS[chunk.primary_track] || { bg: "bg-gray-100", text: "text-gray-700" };
  const locked = chunk.tier_required === "premium" && !isPremiumMember;

  return (
    <button
      onClick={onClick}
      disabled={locked}
      className={`group relative bg-white rounded-2xl border border-[color:var(--border)] p-5 text-left transition-all ${
        locked ? "opacity-60 cursor-default" : "hover:shadow-md hover:border-[color:var(--primary)]/30"
      }`}
    >
      {/* Lock badge */}
      {locked && (
        <span className="absolute top-4 right-4 flex items-center gap-1 bg-amber-100 text-amber-700 text-[0.7rem] px-2 py-0.5 rounded-full font-semibold">
          <Lock className="w-3 h-3" />
          Premium
        </span>
      )}

      {/* Blood sugar callout indicator */}
      {chunk.has_blood_sugar_callout && (
        <span className="absolute top-4 right-4 flex items-center gap-1 bg-teal-100 text-teal-700 text-[0.7rem] px-2 py-0.5 rounded-full font-semibold">
          <Droplets className="w-3 h-3" />
          Blood Sugar
        </span>
      )}

      {/* Track badge */}
      <span className={`inline-flex items-center text-[0.7rem] font-semibold px-2.5 py-0.5 rounded-full ${colors.bg} ${colors.text} mb-3`}>
        {TRACK_LABELS[chunk.primary_track] || chunk.primary_track}
      </span>

      <h3 className="text-[0.95rem] font-semibold text-[color:var(--foreground)] mb-1 leading-snug group-hover:text-[color:var(--primary)] transition-colors">
        {chunk.chunk_title}
      </h3>

      <p className="text-[0.8rem] text-[color:var(--muted-foreground)] mb-3">
        {chunk.doc_title}
      </p>

      <div className="flex items-center gap-3 text-[0.75rem] text-[color:var(--muted-foreground)]">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {chunk.reading_time_minutes} min read
        </span>
      </div>
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

function DashboardContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MemberProfile | null>(null);
  const [chunks, setChunks] = useState<KnowledgeChunk[]>([]);
  const [email, setEmail] = useState<string | undefined>();
  const [plan, setPlan] = useState<string>("essential");
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [aiUsage, setAiUsage] = useState<{ used: number; limit: number; remaining: number; reset_date: string } | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showFormBanner, setShowFormBanner] = useState(false);
  const [showSubmittedMessage, setShowSubmittedMessage] = useState(false);
  const [trialEndsAt, setTrialEndsAt] = useState<string | null>(null);
  const [showTrialBanner, setShowTrialBanner] = useState(false);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setEmail(user.email ?? undefined);

      // Fetch subscription
      const sub = await getUserSubscription(supabase, user.id);
      setSubscription(sub);

      // Determine plan from subscription, falling back to profiles table
      if (sub && sub.status === "active") {
        setPlan(sub.tier);
      } else {
        const userPlan = user.user_metadata?.plan || "essential";
        const { data: profileRow } = await supabase
          .from("profiles")
          .select("plan")
          .eq("id", user.id)
          .single();
        if (profileRow) setPlan(profileRow.plan);
        else setPlan(userPlan);
      }

      // Fetch member profile
      const { data: memberProfile } = await supabase
        .from("member_profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (!memberProfile || !memberProfile.onboarding_complete) {
        router.push("/onboarding");
        return;
      }

      setProfile(memberProfile as MemberProfile);

      // Fetch personalized chunks
      try {
        const personalizedChunks = await getPersonalizedChunks(supabase, user.id, 9);
        setChunks(personalizedChunks);
      } catch (err) {
        console.error("Failed to fetch personalized chunks:", err);
      }

      // Check trial status
      if (sub && (sub.tier === "free_trial" || sub.status === "trialing")) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("trial_ends_at")
          .eq("id", user.id)
          .single();
        if (profileData?.trial_ends_at) {
          setTrialEndsAt(profileData.trial_ends_at);
          const remaining = getTrialTimeRemaining(profileData.trial_ends_at);
          if (remaining.isUrgent) setShowTrialBanner(true);
        }
      }

      // Check consultation form status
      try {
        const hasForm = await hasSubmittedConsultationForm(supabase, user.id);
        if (!hasForm) setShowFormBanner(true);
      } catch {
        // non-critical
      }

      // Fetch AI usage for premium members
      if (sub && sub.tier === "premium" && sub.status === "active") {
        try {
          const res = await fetch("/api/usage");
          if (res.ok) {
            const usageData = await res.json();
            setAiUsage(usageData);
          }
        } catch {
          // non-critical
        }
      }

      setLoading(false);
    };
    load();
  }, [router]);

  // Check for consultation submitted param
  const searchParams = useSearchParams();
  useEffect(() => {
    if (searchParams.get("consultation") === "submitted") {
      setShowSubmittedMessage(true);
      const timer = setTimeout(() => setShowSubmittedMessage(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [searchParams]);

  const handleChunkClick = useCallback(
    async (chunk: KnowledgeChunk) => {
      if (chunk.tier_required === "premium" && plan !== "premium") return;
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await markChunkViewed(supabase, user.id, chunk.id);
      }
      router.push(`/learn/${chunk.id}`);
    },
    [plan, router]
  );

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

  const trackLabel = profile ? (TRACK_LABELS[profile.primary_track] || profile.primary_track) : "";

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
            <span className="text-[color:var(--foreground)]">Saryn Health</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/dashboard" className="text-[0.875rem] text-[color:var(--primary)] font-medium">Dashboard</Link>
            <Link href="/lessons" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Lessons</Link>
            <Link href="/community" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Community</Link>
            {plan === "premium" && (
              <Link href="/ai" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors flex items-center gap-1">
                <Bot className="w-3.5 h-3.5" /> AI Coach
              </Link>
            )}
            <button onClick={logout} className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[color:var(--foreground)] p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-3 flex flex-col gap-1">
            <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2">Dashboard</Link>
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">Lessons</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">Community</Link>
            {plan === "premium" && (
              <Link href="/ai" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">AI Coach</Link>
            )}
            <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2 text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2 text-left">
              <LogOut className="w-4 h-4" /> Log out
            </button>
          </div>
        )}
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10">
        {/* Subscription warning banner */}
        {subscription && (subscription.status === "past_due" || subscription.status === "canceled") && (
          <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-semibold text-amber-800">
                {subscription.status === "past_due"
                  ? "Your payment is past due"
                  : "Your subscription has been canceled"}
              </p>
              <p className="text-[0.8rem] text-amber-700 mt-0.5">
                {subscription.status === "past_due"
                  ? "Please update your payment method to continue accessing your plan features."
                  : "You can resubscribe anytime to regain access to premium features."}
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[color:var(--primary)] mt-2 hover:underline"
              >
                {subscription.status === "past_due" ? "Update payment" : "View plans"} <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Trial expired modal */}
        {subscription && isTrialExpired(subscription, trialEndsAt) && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl">
              <div className="w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-amber-600" />
              </div>
              <h2 className="text-[1.5rem] font-bold text-[color:var(--foreground)] mb-2">
                Your Free Trial Has Ended
              </h2>
              <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mb-6">
                Upgrade to continue accessing your lessons, AI coach, and live sessions.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[color:var(--primary)] text-white text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
              >
                Choose a Plan <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}

        {/* Trial expiry warning banner */}
        {showTrialBanner && !isTrialExpired(subscription, trialEndsAt) && (() => {
          const remaining = getTrialTimeRemaining(trialEndsAt);
          const timeText = remaining.days > 0
            ? `${remaining.days} day${remaining.days !== 1 ? "s" : ""}`
            : `${remaining.hours} hour${remaining.hours !== 1 ? "s" : ""}`;
          return (
            <div className="mb-6 rounded-xl bg-amber-50 border border-amber-200 p-4 flex items-start gap-3 relative">
              <button
                onClick={() => setShowTrialBanner(false)}
                className="absolute top-3 right-3 text-amber-400 hover:text-amber-600 transition-colors"
                aria-label="Dismiss"
              >
                <X className="w-4 h-4" />
              </button>
              <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-[0.875rem] font-semibold text-amber-800">
                  Your free trial ends in {timeText}
                </p>
                <p className="text-[0.8rem] text-amber-700 mt-0.5">
                  Upgrade to Essential to keep your access.
                </p>
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[color:var(--primary)] mt-2 hover:underline"
                >
                  Upgrade Now <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })()}

        {/* Consultation submitted success toast */}
        {showSubmittedMessage && (
          <div className="mb-6 rounded-xl bg-green-50 border border-green-200 p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-semibold text-green-800">
                Your pre-consultation form has been submitted.
              </p>
              <p className="text-[0.8rem] text-green-700 mt-0.5">
                Your practitioner will review it before your call.
              </p>
            </div>
          </div>
        )}

        {/* Consultation form banner */}
        {showFormBanner && (
          <div className="mb-6 rounded-xl bg-teal-50 border border-teal-200 p-4 flex items-start gap-3 relative">
            <button
              onClick={() => setShowFormBanner(false)}
              className="absolute top-3 right-3 text-teal-400 hover:text-teal-600 transition-colors"
              aria-label="Dismiss"
            >
              <X className="w-4 h-4" />
            </button>
            <ClipboardList className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.875rem] font-semibold text-teal-800">
                Complete your pre-consultation form
              </p>
              <p className="text-[0.8rem] text-teal-700 mt-0.5">
                Complete your pre-consultation form so your practitioner is prepared for your call.
              </p>
              <Link
                href="/consultation-form"
                className="inline-flex items-center gap-1 text-[0.8rem] font-semibold text-[color:var(--primary)] mt-2 hover:underline"
              >
                Complete Now <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        )}

        {/* Welcome */}
        <div className="mb-8">
          <h1 className="text-[1.75rem] sm:text-[2rem] font-bold text-[color:var(--foreground)]">
            Welcome to Saryn Health, {getFirstName(email)}
          </h1>
          <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mt-1 mb-2">
            Your personalized functional medicine coaching experience is ready. Let&apos;s start exploring the root causes behind your health and building a plan that works for your body.
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1.5 text-[0.85rem] text-[color:var(--primary)] font-medium">
              <BookOpen className="w-4 h-4" />
              Your track: {trackLabel}
            </span>
            <span className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] text-[0.75rem] px-3 py-0.5 rounded-full capitalize font-semibold">
              {plan} plan
            </span>
          </div>
        </div>

        {/* Content grid */}
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-[1.1rem] font-semibold text-[color:var(--foreground)]">
            Recommended for you
          </h2>
          <span className="text-[0.8rem] text-[color:var(--muted-foreground)]">
            {chunks.length} lessons
          </span>
        </div>

        {chunks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {chunks.map((chunk) => (
              <ChunkCard
                key={chunk.id}
                chunk={chunk}
                isPremiumMember={plan === "premium"}
                onClick={() => handleChunkClick(chunk)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[color:var(--border)] p-10 text-center">
            <Sparkles className="w-10 h-10 text-[color:var(--primary)] mx-auto mb-3" />
            <p className="text-[color:var(--foreground)] font-semibold mb-1">
              Your personalized content is being prepared
            </p>
            <p className="text-[0.875rem] text-[color:var(--muted-foreground)]">
              Check back soon — we&apos;re curating lessons based on your profile.
            </p>
          </div>
        )}

        {/* AI Coach usage for premium */}
        {plan === "premium" && aiUsage && (
          <div className="mt-8 bg-white rounded-2xl border border-[color:var(--border)] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[0.95rem] font-semibold text-[color:var(--foreground)] flex items-center gap-2">
                <Bot className="w-4 h-4 text-[color:var(--primary)]" />
                AI Coach
              </h3>
              <Link
                href="/ai"
                className="text-[0.8rem] text-[color:var(--primary)] font-medium hover:underline flex items-center gap-1"
              >
                Open Coach <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${
                    aiUsage.remaining === 0
                      ? "bg-red-500"
                      : aiUsage.remaining < 10
                        ? "bg-amber-500"
                        : "bg-[color:var(--primary)]"
                  }`}
                  style={{ width: `${(aiUsage.used / aiUsage.limit) * 100}%` }}
                />
              </div>
              <span
                className={`text-[0.8rem] font-medium flex items-center gap-1 ${
                  aiUsage.remaining === 0
                    ? "text-red-600"
                    : aiUsage.remaining < 10
                      ? "text-amber-600"
                      : "text-[color:var(--muted-foreground)]"
                }`}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                {aiUsage.remaining} / {aiUsage.limit} remaining
              </span>
            </div>
            {aiUsage.remaining === 0 && (
              <p className="text-[0.75rem] text-red-600 mt-2">
                Limit reached. Resets {new Date(aiUsage.reset_date).toLocaleDateString("en-US", { month: "long", day: "numeric" })}.
              </p>
            )}
            {aiUsage.remaining > 0 && aiUsage.remaining < 10 && (
              <p className="text-[0.75rem] text-amber-600 mt-2">
                Running low on messages this month.
              </p>
            )}
          </div>
        )}

        {/* Upgrade banner for essential */}
        {plan === "essential" && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-[#1a7a6e] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white text-[0.9rem] font-semibold mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Unlock Premium
              </p>
              <p className="text-white/80 text-[0.875rem]">
                Get AI coaching, advanced content, and personalized guidance.
              </p>
            </div>
            <Link
              href="/pricing"
              className="shrink-0 bg-white text-[color:var(--primary)] px-6 py-2.5 rounded-full text-[0.875rem] font-semibold hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              Upgrade — $19.99/mo <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
