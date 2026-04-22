"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  LogOut,
  ChevronRight,
  Download,
  FileText,
  Activity,
  Utensils,
  Pill,
  Dumbbell,
  BookOpen,
} from "lucide-react";
import Logo from "@/components/Logo";

type Guide = {
  id: string;
  title: string;
  description: string;
  category: string;
  file_url: string | null;
  file_size: string | null;
};

const CATEGORY_COLORS: Record<string, string> = {
  Foundations: "bg-blue-100 text-blue-700",
  "Blood Sugar": "bg-rose-100 text-rose-700",
  Nutrition: "bg-green-100 text-green-700",
  Medications: "bg-purple-100 text-purple-700",
  Lifestyle: "bg-amber-100 text-amber-700",
};

const CATEGORY_ICON_BG: Record<string, string> = {
  Foundations: "bg-blue-50 text-blue-600",
  "Blood Sugar": "bg-rose-50 text-rose-600",
  Nutrition: "bg-green-50 text-green-600",
  Medications: "bg-purple-50 text-purple-600",
  Lifestyle: "bg-amber-50 text-amber-600",
};

function CategoryIcon({ category }: { category: string }) {
  const cls = "w-5 h-5";
  switch (category) {
    case "Nutrition":
      return <Utensils className={cls} />;
    case "Medications":
      return <Pill className={cls} />;
    case "Lifestyle":
      return <Dumbbell className={cls} />;
    case "Blood Sugar":
      return <Activity className={cls} />;
    case "Foundations":
      return <BookOpen className={cls} />;
    default:
      return <FileText className={cls} />;
  }
}

export default function GuidesPage() {
  const router = useRouter();
  const [guides, setGuides] = useState<Guide[]>([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }

      const { data } = await supabase
        .from("guides")
        .select("id, title, description, category, file_url, file_size")
        .order("created_at", { ascending: true });

      if (data) setGuides(data);
      setLoading(false);
    };
    run();
  }, [router]);

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
  };

  const categories = ["All", ...Array.from(new Set(guides.map((g) => g.category)))];
  const filtered =
    activeCategory === "All" ? guides : guides.filter((g) => g.category === activeCategory);

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
      <header className="sticky top-0 z-50 h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/member" aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-6 w-auto text-[color:var(--foreground)]" />
        </Link>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/member"
            className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            Dashboard
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1.5 sm:gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Log out</span>
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-[0.875rem] text-[color:var(--muted-foreground)] mb-3">
            <Link href="/member" className="hover:text-[color:var(--foreground)] transition-colors">
              Dashboard
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[color:var(--foreground)]">Printable Guides</span>
          </div>
          <h1 className="text-[1.75rem] text-[color:var(--foreground)]" style={{ fontWeight: 700 }}>
            Printable Guides
          </h1>
          <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mt-1">
            Download checklists, trackers, and reference sheets to support your daily routine.
          </p>
        </div>

        {/* Category filter tabs */}
        {guides.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-1.5 rounded-full text-[0.875rem] border transition-colors ${
                  activeCategory === cat
                    ? "bg-[color:var(--primary)] text-white border-[color:var(--primary)]"
                    : "bg-white text-[color:var(--muted-foreground)] border-[color:var(--border)] hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                }`}
                style={{ fontWeight: activeCategory === cat ? 600 : 400 }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Empty state */}
        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
              <FileText className="w-6 h-6 text-[color:var(--primary)]" />
            </div>
            <h2 className="text-[1.1rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 600 }}>
              {activeCategory === "All" ? "Guides coming soon" : `No ${activeCategory} guides yet`}
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-[0.875rem] max-w-xs">
              {activeCategory === "All"
                ? "Printable guides and checklists are on the way."
                : `Guides in the ${activeCategory} category will appear here.`}
            </p>
          </div>
        )}

        {/* Guides grid */}
        {filtered.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((guide) => (
              <div
                key={guide.id}
                className="bg-white rounded-2xl border border-[color:var(--border)] p-5 flex flex-col gap-4"
              >
                {/* Icon + category */}
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      CATEGORY_ICON_BG[guide.category] ?? "bg-gray-50 text-gray-600"
                    }`}
                  >
                    <CategoryIcon category={guide.category} />
                  </div>
                  <span
                    className={`text-[0.7rem] px-2.5 py-0.5 rounded-full ${
                      CATEGORY_COLORS[guide.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {guide.category}
                  </span>
                </div>

                {/* Text */}
                <div className="flex-1">
                  <h3
                    className="text-[0.95rem] text-[color:var(--foreground)] mb-1.5 leading-snug"
                    style={{ fontWeight: 600 }}
                  >
                    {guide.title}
                  </h3>
                  <p className="text-[0.825rem] text-[color:var(--muted-foreground)] leading-relaxed line-clamp-3">
                    {guide.description}
                  </p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-1 border-t border-[color:var(--border)]">
                  {guide.file_size && (
                    <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                      PDF · {guide.file_size}
                    </span>
                  )}
                  {guide.file_url ? (
                    <a
                      href={guide.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[color:var(--primary)] text-white text-[0.8rem] hover:opacity-90 transition-opacity ml-auto"
                      style={{ fontWeight: 600 }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download
                    </a>
                  ) : (
                    <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[color:var(--border)] text-[color:var(--muted-foreground)] text-[0.8rem] ml-auto cursor-default" style={{ fontWeight: 500 }}>
                      Coming soon
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
