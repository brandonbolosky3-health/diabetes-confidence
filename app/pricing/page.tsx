"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, Check, Loader2, ArrowRight, Menu, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { PLANS, type PlanTier } from "@/lib/plans";

export default function PricingPage() {
  const router = useRouter();
  const [user, setUser] = useState<{ id: string } | null>(null);
  const [loadingTier, setLoadingTier] = useState<PlanTier | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setUser({ id: user.id });
    });
  }, []);

  const handleSubscribe = async (tier: PlanTier) => {
    if (!user) {
      router.push(`/signup?plan=${tier}`);
      return;
    }

    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      setLoadingTier(null);
    }
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
            <span className="text-[color:var(--foreground)]">Saryn Health</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/lessons" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Lessons</Link>
            <Link href="/community" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Community</Link>
            {user ? (
              <Link href="/dashboard" className="text-[0.875rem] text-[color:var(--primary)] font-medium">Dashboard</Link>
            ) : (
              <Link href="/login" className="text-[0.875rem] text-[color:var(--primary)] font-medium">Log in</Link>
            )}
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
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">Lessons</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">Community</Link>
            {user ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2">Dashboard</Link>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2">Log in</Link>
            )}
          </div>
        )}
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-[2rem] sm:text-[2.5rem] font-bold text-[color:var(--foreground)] mb-3">
            Choose your plan
          </h1>
          <p className="text-[1rem] text-[color:var(--muted-foreground)] max-w-lg mx-auto">
            Start your journey to better health with personalized education and AI-powered coaching.
          </p>
        </div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {(Object.entries(PLANS) as [PlanTier, (typeof PLANS)[PlanTier]][]).map(
            ([tier, plan]) => {
              const isRecommended = tier === "premium";

              return (
                <div
                  key={tier}
                  className={`relative bg-white rounded-2xl p-6 sm:p-8 flex flex-col ${
                    isRecommended
                      ? "border-2 border-[color:var(--primary)] shadow-lg"
                      : "border border-[color:var(--border)]"
                  }`}
                >
                  {isRecommended && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--primary)] text-white text-[0.75rem] font-semibold px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  )}

                  <h2 className="text-[1.25rem] font-bold text-[color:var(--foreground)] mb-1">
                    {plan.name}
                  </h2>
                  <div className="mb-5">
                    <span className="text-[2rem] font-bold text-[color:var(--foreground)]">
                      ${plan.price}
                    </span>
                    <span className="text-[0.875rem] text-[color:var(--muted-foreground)]">
                      /month
                    </span>
                  </div>

                  <ul className="flex-1 space-y-3 mb-6">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-[0.875rem] text-[color:var(--foreground)]">
                        <Check className="w-4 h-4 text-[color:var(--primary)] mt-0.5 shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <button
                    onClick={() => handleSubscribe(tier)}
                    disabled={loadingTier !== null}
                    className={`w-full py-3 rounded-full text-[0.875rem] font-semibold transition-all flex items-center justify-center gap-2 ${
                      isRecommended
                        ? "bg-[color:var(--primary)] text-white hover:opacity-90"
                        : "bg-[color:var(--foreground)] text-white hover:opacity-90"
                    } disabled:opacity-60`}
                  >
                    {loadingTier === tier ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Get {plan.name} <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              );
            }
          )}
        </div>
      </main>
    </div>
  );
}
