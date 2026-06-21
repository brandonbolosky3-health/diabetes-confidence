"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import Logo from "@/components/Logo";
import Quiz from "@/components/Quiz";
import { type QuizAnswers, QUIZ_SESSION_KEY } from "@/lib/quiz";

export default function ConsultationFormPage() {
  const router = useRouter();

  function handleComplete(answers: QuizAnswers) {
    try {
      sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(answers));
      sessionStorage.setItem("intake_complete", "true");
    } catch {
      // ignore
    }
    router.push("/consultation");
  }

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
        <div className="mb-10">
          <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
            Free Consultation — Step 1 of 2
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
            Consultation intake form
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-2xl">
            Answer three quick questions so Sarina can prepare for your call.
          </p>
        </div>

        <Quiz onComplete={handleComplete} />
      </main>
    </div>
  );
}
