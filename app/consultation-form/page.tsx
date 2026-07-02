"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Loader2, CalendarCheck } from "lucide-react";
import Logo from "@/components/Logo";
import Quiz from "@/components/Quiz";
import BookingWidget from "@/components/BookingWidget";
import { type QuizAnswers, QUIZ_SESSION_KEY } from "@/lib/quiz";

type Stage = "quiz" | "contact" | "booking";

export default function ConsultationFormPage() {
  const [stage, setStage] = useState<Stage>("quiz");
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  // Contact fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const bookingRef = useRef<HTMLDivElement>(null);

  function handleQuizComplete(answers: QuizAnswers) {
    try { sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(answers)); } catch { /* ignore */ }
    setQuizAnswers(answers);
    setStage("contact");
  }

  // Scroll to booking widget when it appears
  useEffect(() => {
    if (stage === "booking" && bookingRef.current) {
      bookingRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [stage]);

  const valid =
    firstName.trim() !== "" &&
    lastName.trim() !== "" &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleContactSubmit(e: React.FormEvent) {
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
          health_goals: notes.trim(),
          quiz_answers: quizAnswers,
          allow_duplicate: false,
        }),
      });
      const body = await res.json().catch(() => ({}));
      // Allow duplicate silently — proceed to booking regardless
      if (!res.ok && !body.duplicate) {
        throw new Error(body.error || "Failed to save your info");
      }
      // Mark intake complete in case user navigates to /consultation directly later
      try { sessionStorage.setItem("intake_complete", "true"); } catch { /* ignore */ }
      setStage("booking");
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
          <Link href="/" className="text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">
            ← Home
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">

        {stage === "quiz" && (
          <>
            <div className="mb-10">
              <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
                Free Consultation — Step 1 of 3
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
                Consultation intake form
              </h1>
              <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-2xl">
                Answer three quick questions so Sarina can prepare for your call.
              </p>
            </div>
            <Quiz onComplete={handleQuizComplete} />
          </>
        )}

        {stage === "contact" && (
          <>
            <div className="mb-10">
              <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
                Free Consultation — Step 2 of 3
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
                Who are we booking for?
              </h1>
              <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-2xl">
                So Sarina knows who to expect on the call.
              </p>
            </div>

            <form
              onSubmit={handleContactSubmit}
              className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8"
              noValidate
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">First name</label>
                  <input
                    type="text"
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                    autoComplete="given-name"
                    autoFocus
                  />
                </div>
                <div>
                  <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">Last name</label>
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
                <label className="block text-[0.85rem] font-semibold text-[color:var(--foreground)] mb-1.5">Email</label>
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
                  Anything specific Sarina should know? <span className="font-normal text-[color:var(--muted-foreground)]">(optional)</span>
                </label>
                <textarea
                  className={`${inputClass} resize-none`}
                  rows={3}
                  placeholder="e.g. medications, recent diagnosis, specific questions…"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              {error && <p className="mt-4 text-[0.85rem] text-red-600">{error}</p>}

              <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setStage("quiz")}
                  className="text-[0.85rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={!valid || submitting}
                  className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {submitting
                    ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving…</>
                    : <>Pick your time slot <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            </form>
          </>
        )}

        {stage === "booking" && (
          <div ref={bookingRef}>
            <div className="mb-10">
              <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
                Free Consultation — Step 3 of 3
              </p>
              <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
                Pick a time that works for you
              </h1>
              <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-2xl">
                Choose a slot below and Sarina will see you then.
              </p>
            </div>

            <div className="mb-6 flex items-center gap-3 bg-teal-50 border border-teal-200 rounded-xl px-5 py-4">
              <CalendarCheck className="w-5 h-5 text-teal-600 shrink-0" />
              <p className="text-[0.9rem] text-teal-800">
                Your intake form was saved — just pick a time below to complete your booking.
              </p>
            </div>

            <BookingWidget
              clientName={`${firstName} ${lastName}`}
              clientEmail={email}
              showConfirmButton={false}
            />
          </div>
        )}
      </main>
    </div>
  );
}
