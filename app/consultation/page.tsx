"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import Logo from "@/components/Logo";
import BookingWidget from "@/components/BookingWidget";
import { QUIZ_SESSION_KEY, type QuizAnswers } from "@/lib/quiz";

const MAX_GOALS = 500;

export default function ConsultationPage() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [healthGoals, setHealthGoals] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QUIZ_SESSION_KEY);
      if (raw) setQuizAnswers(JSON.parse(raw) as QuizAnswers);
    } catch {
      // ignore
    }
  }, []);

  const goalsRemaining = MAX_GOALS - healthGoals.length;
  const valid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    healthGoals.trim() !== "";

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/consultation/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          health_goals: healthGoals.trim(),
          quiz_answers: quizAnswers,
        }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to submit intake");
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

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
          Book your free consultation with Sarina
        </h1>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-2xl">
          A 1-on-1 conversation about your health goals. No commitment, no credit card.
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
                  Last name
                </label>
                <input
                  type="text"
                  className={inputClass}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  autoComplete="family-name"
                />
              </div>
            </div>

            <div className="mt-4">
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

            <div className="mt-4">
              <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">
                Phone <span className="font-normal text-[color:var(--muted-foreground)]">(optional)</span>
              </label>
              <input
                type="tel"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                autoComplete="tel"
              />
            </div>

            <div className="mt-4">
              <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">
                What are your top 2–3 health goals?
              </label>
              <textarea
                className={`${inputClass} min-h-[120px] resize-y`}
                value={healthGoals}
                onChange={(e) => setHealthGoals(e.target.value.slice(0, MAX_GOALS))}
                maxLength={MAX_GOALS}
                required
              />
              <p className="mt-1.5 text-[0.75rem] text-[color:var(--muted-foreground)] text-right">
                {goalsRemaining} characters left
              </p>
            </div>

            {error && (
              <p className="mt-4 text-[0.85rem] text-red-600">{error}</p>
            )}

            <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-[0.8rem] text-[color:var(--muted-foreground)]">
                We&apos;ll never share your details. Your information is only used to prepare for your call.
              </p>
              <button
                type="submit"
                disabled={!valid || submitting}
                className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sending…
                  </>
                ) : (
                  <>
                    Continue to scheduling <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {submitted && (
          <div>
            <div className="rounded-2xl border-2 border-[color:var(--primary)] bg-white p-6 sm:p-7 mb-8">
              <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
                Step 2 of 2
              </p>
              <h2 className="text-[1.4rem] sm:text-[1.6rem] font-medium tracking-tight text-[color:var(--foreground)] mb-2">
                Pick a time that works for you
              </h2>
              <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed">
                Sarina has your intake — now choose a slot below. You&apos;ll get a calendar invite as soon as you book.
              </p>
            </div>
            <BookingWidget
              clientName={`${firstName} ${lastName}`.trim()}
              clientEmail={email}
              showConfirmButton={false}
            />
          </div>
        )}
      </main>
    </div>
  );
}
