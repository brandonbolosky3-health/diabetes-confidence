import Link from "next/link";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import Logo from "@/components/Logo";
import { PLANS } from "@/lib/plans";

export const metadata = {
  title: "Saryn Health Membership — Functional medicine education + AI coach",
  description:
    "Two membership tiers — Essential and Premium — built around the Saryn Health curriculum, AI health coach, and live coaching with Sarina.",
};

const TIERS = [
  {
    id: "essential" as const,
    plan: PLANS.essential,
    description:
      "Everything you need to learn at your own pace and build healthier habits with structured guidance.",
    badge: null as string | null,
    highlighted: false,
  },
  {
    id: "premium" as const,
    plan: PLANS.premium,
    description:
      "For people who want unlimited AI coaching plus regular live time with Sarina.",
    badge: "Most popular",
    highlighted: true,
  },
];

export default function MembershipPage() {
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

      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-12 sm:py-16">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-1.5 bg-[color:var(--primary)]/10 text-[color:var(--primary)] text-[0.8rem] px-3 py-1 rounded-full font-semibold mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            Step 2 of the Saryn experience
          </span>
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-5">
            Membership for ongoing support
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-2xl mx-auto">
            After your free consultation, the Saryn membership platform is where you keep learning, get answers between sessions, and build the habits that stick. Try Premium free for 7 days — cancel anytime.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-10">
          {TIERS.map((tier) => (
            <div
              key={tier.id}
              className={`rounded-2xl p-7 sm:p-8 border ${
                tier.highlighted
                  ? "border-[color:var(--primary)] bg-white shadow-md"
                  : "border-[color:var(--border)] bg-white"
              }`}
            >
              {tier.badge && (
                <span className="inline-block bg-[color:var(--primary)] text-white text-[0.7rem] px-2.5 py-1 rounded-full font-semibold mb-4">
                  {tier.badge}
                </span>
              )}
              <h2 className="text-[1.5rem] font-medium tracking-tight text-[color:var(--foreground)] mb-1">
                {tier.plan.name}
              </h2>
              <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mb-5">
                {tier.description}
              </p>
              <p className="mb-6">
                <span className="text-[2.25rem] font-semibold text-[color:var(--foreground)]">
                  ${tier.plan.price}
                </span>
                <span className="text-[0.95rem] text-[color:var(--muted-foreground)] ml-1">
                  /month
                </span>
              </p>
              <ul className="space-y-2.5 mb-7">
                {tier.plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2.5">
                    <Check className="w-5 h-5 text-[color:var(--primary)] mt-0.5 shrink-0" />
                    <span className="text-[0.9rem] text-[color:var(--foreground)]">
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <Link
                href="/signup"
                className={`w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[0.95rem] font-semibold transition ${
                  tier.highlighted
                    ? "bg-[color:var(--primary)] text-white hover:opacity-90"
                    : "border-2 border-[color:var(--primary)] text-[color:var(--primary)] hover:bg-[color:var(--primary)]/5"
                }`}
              >
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white border border-[color:var(--border)] p-6 sm:p-8 text-center">
          <h3 className="text-[1.15rem] font-semibold text-[color:var(--foreground)] mb-2">
            Not sure if membership is right for you?
          </h3>
          <p className="text-[0.95rem] text-[color:var(--muted-foreground)] mb-5 max-w-xl mx-auto">
            Start with a free 1-on-1 call with Sarina. She&apos;ll help you figure out whether membership, ongoing coaching, or specialized care is the right next step.
          </p>
          <Link
            href="/consultation"
            className="inline-flex items-center gap-2 border-2 border-[color:var(--primary)] text-[color:var(--primary)] px-6 py-2.5 rounded-full text-[0.9rem] font-semibold hover:bg-[color:var(--primary)]/5 transition-colors"
          >
            Book a Free Consultation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
