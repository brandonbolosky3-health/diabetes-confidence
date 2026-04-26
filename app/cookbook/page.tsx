"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Loader2, UtensilsCrossed } from "lucide-react";
import Logo from "@/components/Logo";

export default function CookbookPage() {
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    firstName.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/cookbook/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          email: email.trim(),
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to send cookbook");
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-white text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 transition";

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
            <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
          </Link>
          <Link
            href="/"
            className="text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="w-12 h-12 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-6">
          <UtensilsCrossed className="w-6 h-6 text-[color:var(--primary)]" />
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
          Get your free functional wellness cookbook
        </h1>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-xl">
          Anti-inflammatory recipes and meal plans designed to support gut health, blood sugar balance, and energy.
        </p>

        {!submitted && (
          <form
            onSubmit={onSubmit}
            className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8"
            noValidate
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  autoComplete="given-name"
                />
              </div>
              <div>
                <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  className={inputClass}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p className="mt-4 text-[0.85rem] text-red-600">{error}</p>
            )}

            <button
              type="submit"
              disabled={!valid || submitting}
              className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                </>
              ) : (
                <>
                  Send me the cookbook <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <p className="mt-4 text-[0.75rem] text-[color:var(--muted-foreground)] text-center">
              No spam. Unsubscribe anytime.
            </p>
          </form>
        )}

        {submitted && (
          <div className="rounded-2xl border-2 border-[color:var(--primary)] bg-white p-7 sm:p-9">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle2 className="w-7 h-7 text-[color:var(--primary)] shrink-0 mt-0.5" />
              <div>
                <h2 className="text-[1.4rem] font-medium tracking-tight text-[color:var(--foreground)]">
                  Check your email — your cookbook is on the way.
                </h2>
                <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed mt-2">
                  We just sent the download link to <strong>{email}</strong>. If you don&apos;t see it within a few minutes, check spam.
                </p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-[color:var(--border)]">
              <p className="text-[0.95rem] text-[color:var(--foreground)] mb-4">
                Want a personalized plan to go with the recipes? A free 1-on-1 call with Sarina is the fastest way to figure out what&apos;s right for you.
              </p>
              <Link
                href="/consultation"
                className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
              >
                Book a free consultation <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
