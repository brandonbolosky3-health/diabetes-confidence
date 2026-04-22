import Link from "next/link";
import { ArrowRight } from "lucide-react";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Book with Sarina — Saryn Health",
  description:
    "Start your Saryn Health Premium trial to book a complimentary 1-on-1 Discovery Call with Sarina.",
};

export default function PublicBookPage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
            <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
          </Link>
          <Link
            href="/login"
            className="text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Log in
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-16">
        <div className="max-w-2xl text-center">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-6">
            Start your free trial to book with Sarina
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-xl mx-auto">
            Your complimentary consultation is included with Saryn Health Premium — 7 days free, cancel anytime.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-8 py-3.5 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
          >
            Start Free Trial <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
