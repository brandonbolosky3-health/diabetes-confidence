"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, BookOpen, Video, FileText, Users, Bot, LogOut } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Lesson Library", desc: "Step-by-step education modules", href: "#" },
  { icon: Video, title: "Weekly Videos", desc: "Bite-sized lessons on your schedule", href: "#" },
  { icon: FileText, title: "Printable Guides", desc: "Checklists and resources to download", href: "#" },
  { icon: Users, title: "Community", desc: "Private support group", href: "#" },
  { icon: Bot, title: "AI Coach", desc: "Ask diabetes education questions", href: "/ai" },
];

export default function MemberPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("essential");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }

      setEmail(user.email ?? null);

      const { data: profile } = await supabase
        .from("profiles")
        .select("plan")
        .eq("id", user.id)
        .single();

      if (profile) setPlan(profile.plan);
      setLoading(false);
    };
    run();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">DiabetesConfidence</span>
        </Link>
        <button
          onClick={logout}
          className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Log out
        </button>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Welcome */}
        <div className="mb-8">
          <p className="text-[0.875rem] text-[color:var(--muted-foreground)] mb-1">Welcome back,</p>
          <h1 className="text-[1.75rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
            {email}
          </h1>
          <span className="inline-block mt-2 bg-[color:var(--primary)]/10 text-[color:var(--primary)] text-[0.75rem] px-3 py-1 rounded-full capitalize" style={{ fontWeight: 600 }}>
            {plan} plan
          </span>
        </div>

        {/* Feature cards */}
        <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-4" style={{ fontWeight: 600 }}>
          Your membership includes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((f) => {
            const Icon = f.icon;
            const isAI = f.icon === Bot;
            const locked = isAI && plan === "essential";
            return (
              <a
                key={f.title}
                href={locked ? undefined : f.href}
                className={`relative bg-white rounded-2xl p-6 border border-[color:var(--border)] transition-shadow ${
                  locked ? "opacity-60 cursor-default" : "hover:shadow-md"
                }`}
              >
                {locked && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[0.7rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                    Premium
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-5 h-5 text-[color:var(--primary)]" />
                </div>
                <h3 className="text-[1rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>
                  {f.title}
                </h3>
                <p className="text-[0.875rem] text-[color:var(--muted-foreground)]">{f.desc}</p>
              </a>
            );
          })}
        </div>

        {/* Upgrade banner for essential */}
        {plan === "essential" && (
          <div className="mt-8 rounded-2xl bg-gradient-to-r from-[color:var(--primary)] to-[#1a7a6e] p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-white text-[0.8rem] mb-1" style={{ fontWeight: 600 }}>Upgrade to Premium</p>
              <p className="text-white/80 text-[0.875rem]">Unlock unlimited AI Coach, live Q&As, and priority support.</p>
            </div>
            <Link
              href="/signup?plan=premium"
              className="shrink-0 bg-white text-[color:var(--primary)] px-6 py-2.5 rounded-full text-[0.875rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              Upgrade — $19.99/mo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
