import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  Bot,
  FileText,
  Users,
  Video,
  Calendar,
  Sparkles,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import Logo from "@/components/Logo";

export const metadata = {
  title: "Welcome to Saryn Health",
  description:
    "Your 7-day free trial is active. Here's what comes with your Saryn Health membership.",
};

const INCLUDED = [
  {
    icon: BookOpen,
    title: "Full lesson library",
    desc: "Step-by-step functional medicine curriculum, personalized to your health goals.",
  },
  {
    icon: Bot,
    title: "AI health coach",
    desc: "24/7 answers trained on clinical functional medicine content — ask anything between sessions.",
  },
  {
    icon: Video,
    title: "Weekly videos",
    desc: "Bite-sized lessons you can watch on your schedule.",
  },
  {
    icon: FileText,
    title: "Printable guides",
    desc: "Downloadable checklists, trackers, and reference sheets.",
  },
  {
    icon: Users,
    title: "Private community",
    desc: "Connect with others on the same journey. Share wins, ask questions, stay accountable.",
  },
  {
    icon: Calendar,
    title: "1-on-1 with Sarina",
    desc: "Complimentary Discovery Call included with Premium — upgrade anytime.",
  },
];

export default async function WelcomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const localPart = (user.email || "").split("@")[0];
  const firstName =
    (user.user_metadata?.first_name as string | undefined) ||
    (localPart ? localPart.charAt(0).toUpperCase() + localPart.slice(1) : "there");

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="h-16 flex items-center px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95">
        <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-6 w-auto text-[color:var(--foreground)]" />
        </Link>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex items-center gap-2 mb-6">
          <span className="inline-flex items-center gap-1.5 bg-[color:var(--primary)]/10 text-[color:var(--primary)] text-[0.8rem] px-3 py-1 rounded-full font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            Trial active
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-5">
          You&apos;re in, {firstName}.
        </h1>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-3 max-w-2xl">
          Your 7-day free trial of Saryn Health starts now. You&apos;ve got full access to everything below — explore at your own pace.
        </p>
        <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mb-10">
          We&apos;ll email you two days before your trial ends. Cancel anytime from your dashboard.
        </p>

        <div className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8 mb-10">
          <h2 className="text-[1.15rem] font-semibold text-[color:var(--foreground)] mb-5">
            Your membership includes
          </h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {INCLUDED.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[color:var(--primary)]/10 flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[color:var(--primary)]" />
                  </div>
                  <div>
                    <p className="text-[0.95rem] font-semibold text-[color:var(--foreground)]">
                      {item.title}
                    </p>
                    <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/onboarding"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3.5 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
          >
            Let&apos;s personalize your experience <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/dashboard?upgrade=success"
            className="w-full sm:w-auto inline-flex items-center justify-center px-5 py-3 text-[0.9rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Skip for now
          </Link>
        </div>
      </main>
    </div>
  );
}
