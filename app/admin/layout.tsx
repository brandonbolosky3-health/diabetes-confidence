import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft, Shield } from "lucide-react";
import Logo from "@/components/Logo";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  const userEmail = (user.email || "").toLowerCase();

  if (!adminEmails.includes(userEmail)) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <div className="h-14 flex items-center justify-between px-4 sm:px-6 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              aria-label="Saryn Health admin home"
              className="inline-flex items-center"
            >
              <Logo className="h-6 w-auto text-[color:var(--foreground)]" />
            </Link>
            <span className="flex items-center gap-1 bg-gray-900 text-white text-[0.65rem] font-semibold px-2 py-0.5 rounded">
              <Shield className="w-3 h-3" />
              Admin
            </span>
          </div>
          <Link
            href="/dashboard"
            className="text-[0.8rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors flex items-center gap-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to site
          </Link>
        </div>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
