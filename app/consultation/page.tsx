"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
import Logo from "@/components/Logo";
import BookingWidget from "@/components/BookingWidget";

export default function ConsultationPage() {
  const [intakeComplete, setIntakeComplete] = useState<boolean | null>(null);
  const [bookingFinalized, setBookingFinalized] = useState(false);

  useEffect(() => {
    try {
      setIntakeComplete(sessionStorage.getItem("intake_complete") === "true");
    } catch {
      setIntakeComplete(false);
    }
  }, []);

  // Still checking
  if (intakeComplete === null) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  // Gate: must complete intake first
  if (!intakeComplete) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
              <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
            </Link>
            <Link href="/" className="text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">← Home</Link>
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="max-w-md w-full bg-white rounded-2xl border border-[color:var(--border)] p-8 text-center">
            <div className="w-14 h-14 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
              <ClipboardList className="w-7 h-7 text-[color:var(--primary)]" />
            </div>
            <h1 className="text-[1.4rem] font-semibold tracking-tight text-[color:var(--foreground)] mb-2">
              Complete your intake form first
            </h1>
            <p className="text-[0.92rem] text-[color:var(--muted-foreground)] leading-relaxed mb-6">
              Before selecting a time, we need a little information about your health so Sarina can prepare for your call.
            </p>
            <Link
              href="/consultation-form"
              className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
            >
              Fill out the intake form <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
            <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
          </Link>
          <Link href="/" className="text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">← Home</Link>
        </div>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        {!bookingFinalized ? (
          <>
            <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
              Free Consultation — Step 2 of 2
            </p>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
              Pick a time with Sarina
            </h1>
            <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-2xl">
              Choose a slot below. No commitment, no credit card.
            </p>

            <BookingWidget showConfirmButton={false} />

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7 text-center">
              <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
                Once you&apos;ve picked a time above and seen the confirmation, tap below to see what happens next.
              </p>
              <button
                type="button"
                onClick={() => {
                  setBookingFinalized(true);
                  try { sessionStorage.removeItem("intake_complete"); } catch { /* ignore */ }
                  setTimeout(() => {
                    document.getElementById("post-booking")?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }, 50);
                }}
                className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
              >
                I&apos;ve picked my time — what&apos;s next? <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div id="post-booking">
            <div className="rounded-2xl border-2 border-[color:var(--primary)] bg-[color:var(--primary)]/5 p-6 sm:p-7">
              <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">Request sent</p>
              <h2 className="text-[1.4rem] sm:text-[1.6rem] font-medium tracking-tight text-[color:var(--foreground)] mb-2">
                You&apos;re all set!
              </h2>
              <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed">
                Sarina will confirm your session shortly.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7">
              <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1.5">After you book</h3>
              <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                You&apos;ll get a confirmation email with a calendar invite (.ics) attached — open it to add the call to <strong>Apple Calendar</strong>, <strong>Google Calendar</strong>, or <strong>Outlook</strong>.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-[color:var(--border)] bg-white p-6 sm:p-7">
              <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1.5">Your secure client portal</h3>
              <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                You&apos;ll also get an invite to set up your <strong>Saryn Health client portal</strong>, powered by <strong>Practice Better</strong> — a HIPAA-compliant platform where you&apos;ll message Sarina, join your video session, and keep your health records in one place.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
