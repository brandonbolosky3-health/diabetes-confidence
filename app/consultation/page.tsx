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
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [bookingFinalized, setBookingFinalized] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(QUIZ_SESSION_KEY);
      if (raw) setQuizAnswers(JSON.parse(raw) as QuizAnswers);
    } catch {
      // ignore
    }
    try {
      const prefill = sessionStorage.getItem("intake_prefill");
      if (prefill) {
        const { first_name, last_name, email: prefillEmail, phone: prefillPhone } = JSON.parse(prefill) as {
          first_name?: string;
          last_name?: string;
          email?: string;
          phone?: string;
        };
        if (first_name) setFirstName(first_name);
        if (last_name) setLastName(last_name);
        if (prefillEmail) setEmail(prefillEmail);
        if (prefillPhone) setPhone(prefillPhone);
        sessionStorage.removeItem("intake_prefill");
      }
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

  async function submitIntake(allowDuplicate: boolean) {
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
          allow_duplicate: allowDuplicate,
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(body.error || "Failed to submit intake");
      }
      if (body.duplicate) {
        setDuplicateWarning(true);
        return;
      }
      setDuplicateWarning(false);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || submitting) return;
    await submitIntake(false);
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
          Almost there — confirm your details
        </h1>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-2xl">
          We&apos;ve got your health intake. Just confirm your contact info below and we&apos;ll get you to the scheduler.
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

            {duplicateWarning && (
              <div className="mt-4 rounded-xl border border-amber-300 bg-amber-50 p-4">
                <p className="text-[0.9rem] text-amber-900 leading-relaxed">
                  <strong>Heads up —</strong> we already have a consultation
                  intake on file for <strong>{email.trim()}</strong>. If this
                  is a new request (or you didn&apos;t finish booking last
                  time), you can submit again.
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => submitIntake(true)}
                    disabled={submitting}
                    className="inline-flex items-center justify-center bg-amber-600 text-white px-4 py-2 rounded-full text-[0.85rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
                  >
                    {submitting ? "Submitting…" : "Submit anyway"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setDuplicateWarning(false)}
                    className="text-[0.85rem] font-semibold text-amber-900 hover:opacity-80"
                  >
                    Cancel
                  </button>
                </div>
              </div>
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
            {!bookingFinalized && (
              <>
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

                <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7 text-center">
                  <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
                    Once you&apos;ve picked a time above and seen the confirmation,
                    tap below to see what happens next.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setBookingFinalized(true);
                      // Fire-and-forget: confirmation email is non-critical to
                      // the UI flow, and Sarina still gets the original intake
                      // notification, so a send failure shouldn't block reveal.
                      fetch("/api/consultation/booking-sent", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          email: email.trim(),
                          first_name: firstName.trim(),
                        }),
                      }).catch(() => {});
                      setTimeout(() => {
                        document
                          .getElementById("post-booking")
                          ?.scrollIntoView({ behavior: "smooth", block: "start" });
                      }, 50);
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
                  >
                    I&apos;ve picked my time — what&apos;s next?{" "}
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </>
            )}

            {bookingFinalized && (
              <div id="post-booking">
                <div className="mt-8 rounded-2xl border-2 border-[color:var(--primary)] bg-[color:var(--primary)]/5 p-6 sm:p-7">
                  <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
                    Request sent
                  </p>
                  <h2 className="text-[1.4rem] sm:text-[1.6rem] font-medium tracking-tight text-[color:var(--foreground)] mb-2">
                    You&apos;re all set, {firstName.trim() || "there"}
                  </h2>
                  <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed">
                    Sarina will confirm your session shortly. Here&apos;s what
                    to expect over the next few minutes.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7">
                  <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1.5">
                    After you book
                  </h3>
                  <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                    You&apos;ll get a confirmation email from Sarina with a
                    calendar invite (.ics) attached. Open it on your phone or
                    computer to add the consultation to{" "}
                    <strong>Apple Calendar</strong>,{" "}
                    <strong>Google Calendar</strong>, or{" "}
                    <strong>Outlook</strong>. A reminder will go out before
                    your call.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7">
                  <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1.5">
                    Your secure client portal
                  </h3>
                  <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                    You&apos;ll also get an invite to set up your{" "}
                    <strong>Saryn Health client portal</strong>, powered by{" "}
                    <strong>Practice Better</strong> — a HIPAA-compliant
                    platform where you&apos;ll message Sarina, join your video
                    sessions, and keep your health records and notes in one
                    place. Available on the web and as a mobile app.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7">
                  <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1.5">
                    Optional: complete your pre-consultation form
                  </h3>
                  <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
                    A short health-history form helps Sarina prepare so you can
                    spend the call on what matters most. Takes about 5 minutes.
                  </p>
                  <Link
                    href="/consultation-form"
                    className="inline-flex items-center gap-2 text-[0.9rem] font-semibold text-[color:var(--primary)] hover:opacity-80 transition-opacity"
                  >
                    Fill out the form <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
