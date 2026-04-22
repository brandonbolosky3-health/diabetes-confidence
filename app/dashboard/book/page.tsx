import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getUserSubscription, isPremium } from "@/lib/subscription";
import BookingWidget from "@/components/BookingWidget";
import Logo from "@/components/Logo";

export default async function BookConsultationPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/dashboard/book");
  }

  const [subscription, profileResult] = await Promise.all([
    getUserSubscription(supabase, user.id),
    supabase
      .from("profiles")
      .select("first_name, last_name, free_consultation_used_at")
      .eq("id", user.id)
      .single(),
  ]);

  const profile = profileResult.data;
  const fullName = [profile?.first_name, profile?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim() || undefined;
  const premium = isPremium(subscription);
  const used = Boolean(profile?.free_consultation_used_at);

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <header className="sticky top-0 z-50 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <div className="h-16 flex items-center justify-between px-4 sm:px-6 max-w-6xl mx-auto w-full">
          <Link href="/dashboard" aria-label="Saryn Health home" className="inline-flex items-center">
            <Logo className="h-6 w-auto text-[color:var(--foreground)]" />
          </Link>
          <Link
            href="/dashboard"
            className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-4xl mx-auto w-full px-4 sm:px-6 py-10 sm:py-14">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
          Book your consultation with Sarina
        </h1>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10 max-w-2xl">
          Your complimentary 1-on-1 Discovery Call is included with your Premium trial. Choose a time that works for you.
        </p>

        {!premium && (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-4">
              <Lock className="w-6 h-6 text-amber-600" />
            </div>
            <h2 className="text-[1.25rem] font-semibold text-[color:var(--foreground)] mb-2">
              Consultations are a Premium benefit
            </h2>
            <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mb-6 max-w-lg">
              Upgrade to Premium to book a 1-on-1 with Sarina. You&apos;ll also unlock deeper curriculum content and higher AI coaching usage.
            </p>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-6 py-2.5 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
            >
              Upgrade to Premium <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {premium && used && (
          <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 md:p-8">
            <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h2 className="text-[1.25rem] font-semibold text-[color:var(--foreground)] mb-2">
              You&apos;ve booked your complimentary consultation
            </h2>
            <p className="text-[0.95rem] text-[color:var(--muted-foreground)] max-w-lg">
              Check your email for details. To schedule additional sessions, reach out to Sarina directly after your first appointment.
            </p>
          </div>
        )}

        {premium && !used && (
          <BookingWidget clientName={fullName} clientEmail={user.email ?? undefined} />
        )}
      </main>
    </div>
  );
}
