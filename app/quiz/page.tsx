import Link from "next/link";
import Quiz from "@/components/Quiz";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Find your next step — Saryn Health",
  description:
    "Answer three quick questions to get a personalized recommendation from Sarina Deharo, certified Functional Medicine Practitioner.",
};

export default function QuizPage() {
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
        <div className="mb-10 text-center">
          <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
            Find your next step
          </p>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
            Three quick questions
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] max-w-xl mx-auto">
            We&apos;ll recommend the best path forward based on where you are right now. No login, no commitment.
          </p>
        </div>
        <Quiz />
      </main>
    </div>
  );
}
