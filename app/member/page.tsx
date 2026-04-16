"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart, BookOpen, Video, FileText, Users, Bot, LogOut, Menu, X } from "lucide-react";

const features = [
  { icon: BookOpen, title: "Lesson Library", desc: "Step-by-step education modules", href: "/lessons" },
  { icon: Video, title: "Weekly Videos", desc: "Bite-sized lessons on your schedule", href: "/videos" },
  { icon: FileText, title: "Printable Guides", desc: "Checklists and resources to download", href: "/guides" },
  { icon: Users, title: "Community", desc: "Private support group", href: "/community" },
  { icon: Bot, title: "AI Coach", desc: "Ask diabetes education questions", href: "/ai" },
];

export default function MemberPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);
  const [plan, setPlan] = useState<string>("essential");
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
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
    const supabase = createClient();
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
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6">
          <Link href="/member" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
            <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
            <span className="text-[color:var(--foreground)]">Saryn Health</span>
          </Link>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/lessons" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Lessons</Link>
            <Link href="/videos" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Videos</Link>
            <Link href="/guides" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Guides</Link>
            <Link href="/community" className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">Community</Link>
            <button onClick={logout} className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[color:var(--foreground)] p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-3 flex flex-col gap-1">
            <Link href="/lessons" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">Lessons</Link>
            <Link href="/videos" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">Videos</Link>
            <Link href="/guides" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">Guides</Link>
            <Link href="/community" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">Community</Link>
            <button onClick={() => { setMobileOpen(false); logout(); }} className="flex items-center gap-2 text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2 text-left">
              <LogOut className="w-4 h-4" />
              Log out
            </button>
          </div>
        )}
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
                href={f.href === "#" ? undefined : f.href}
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
              Upgrade — $49/mo
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
