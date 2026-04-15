"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Video,
  FileText,
  Users,
  Bot,
  ArrowRight,
  UserPlus,
  GraduationCap,
  Heart,
  Check,
  Shield,
  Award,
  Menu,
  X,
} from "lucide-react";

const NURSE_IMG = "/hero-photo.jpg";

// ─── Nav ───────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-6 h-6 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)] text-[1.1rem]">Saryn Health</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[0.9rem] text-[color:var(--muted-foreground)]">
          <a href="#pricing" className="hover:text-[color:var(--foreground)] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[color:var(--foreground)] transition-colors">FAQ</a>
          <Link href="/login" className="hover:text-[color:var(--foreground)] transition-colors">Log in</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/onboarding"
            className="bg-[color:var(--primary)] text-white text-[0.9rem] px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600 }}
          >
            Join Now
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-[color:var(--foreground)] p-1"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-4 flex flex-col gap-3">
          <a
            href="#pricing"
            onClick={() => setMobileOpen(false)}
            className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2"
          >
            Pricing
          </a>
          <a
            href="#faq"
            onClick={() => setMobileOpen(false)}
            className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2"
          >
            FAQ
          </a>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2"
          >
            Log in
          </Link>
        </div>
      )}
    </header>
  );
}

// ─── Hero ───────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #e8f6f3 0%, #f0f9f7 50%, #e0f0f5 100%)",
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        {/* Text */}
        <div className="flex-1 text-center md:text-left">
          <span
            className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-4 py-1 rounded-full text-[0.8rem] mb-5"
            style={{ fontWeight: 500 }}
          >
            Led by a 20+ Year RN Diabetes Educator
          </span>
          <h1
            className="text-[2rem] md:text-[2.75rem] tracking-tight text-[color:var(--foreground)] leading-tight mb-4"
            style={{ fontWeight: 800 }}
          >
            Finally Understand Why You Feel the Way You Do
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Personalized functional medicine coaching and education — built around your biology, your lifestyle, and your goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3 rounded-full text-[0.95rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              Start Your Health Journey <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#about"
              className="inline-flex items-center justify-center gap-2 border-2 border-[color:var(--primary)] text-[color:var(--primary)] px-7 py-3 rounded-full text-[0.95rem] hover:bg-[color:var(--primary)]/5 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Learn More
            </a>
          </div>
        </div>

        {/* Image */}
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
            <Image
              src={NURSE_IMG}
              alt="Diabetes Educator RN"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1440 60" fill="none" className="w-full">
          <path
            d="M0 60L1440 60L1440 20C1200 50 960 0 720 20C480 40 240 10 0 30L0 60Z"
            fill="#f0f7f7"
          />
        </svg>
      </div>
    </section>
  );
}

// ─── What's Inside ─────────────────────────────────────
const benefits = [
  {
    icon: BookOpen,
    title: "Step-by-step education modules",
    desc: "Structured lessons that build your diabetes knowledge progressively.",
  },
  {
    icon: Video,
    title: "Weekly short video lessons",
    desc: "Bite-sized videos you can watch on your schedule, anytime.",
  },
  {
    icon: FileText,
    title: "Printable guides + checklists",
    desc: "Downloadable resources to keep you organized and on track.",
  },
  {
    icon: Users,
    title: "Private community",
    desc: "A supportive space to connect with others on the same journey.",
  },
  {
    icon: Bot,
    title: "AI Education Coach",
    desc: "Get answers to your education questions — 5/day on Essential, unlimited on Premium.",
    premium: true,
  },
];

function WhatsInside() {
  return (
    <section id="whatsinside" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-[1.75rem] md:text-[2.25rem] text-[color:var(--foreground)]"
            style={{ fontWeight: 700 }}
          >
            What&apos;s Inside the Membership
          </h2>
          <p className="mt-3 text-[color:var(--muted-foreground)] text-[1.05rem] max-w-lg mx-auto">
            Everything you need to feel informed, empowered, and supported.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="relative bg-[color:var(--card)] rounded-2xl p-6 shadow-sm border border-[color:var(--border)] hover:shadow-md transition-shadow"
              >
                {b.premium && (
                  <span className="absolute top-4 right-4 bg-amber-100 text-amber-700 text-[0.7rem] px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                    Premium
                  </span>
                )}
                <div className="w-12 h-12 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[color:var(--primary)]" />
                </div>
                <h3 className="text-[1.05rem] text-[color:var(--foreground)] mb-2" style={{ fontWeight: 600 }}>
                  {b.title}
                </h3>
                <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                  {b.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── How It Works ──────────────────────────────────────
const steps = [
  {
    icon: UserPlus,
    num: "1",
    title: "Join",
    desc: "Pick a plan that fits your needs and get instant access.",
  },
  {
    icon: GraduationCap,
    num: "2",
    title: "Follow the lessons",
    desc: "Work through bite-sized modules at your own pace.",
  },
  {
    icon: Heart,
    num: "3",
    title: "Build consistent habits",
    desc: "Apply what you learn and see real improvements in your daily life.",
  },
];

function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className="text-[1.75rem] md:text-[2.25rem] text-[color:var(--foreground)]"
          style={{ fontWeight: 700 }}
        >
          How It Works
        </h2>
        <p className="mt-3 text-[color:var(--muted-foreground)] max-w-lg mx-auto text-[1.05rem]">
          Three simple steps to start your journey.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.num} className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[color:var(--primary)] text-white flex items-center justify-center mb-4">
                  <Icon className="w-7 h-7" />
                </div>
                <span
                  className="text-[color:var(--primary)] text-[0.8rem] mb-1"
                  style={{ fontWeight: 600 }}
                >
                  Step {s.num}
                </span>
                <h3
                  className="text-[1.15rem] text-[color:var(--foreground)] mb-2"
                  style={{ fontWeight: 600 }}
                >
                  {s.title}
                </h3>
                <p className="text-[0.9rem] text-[color:var(--muted-foreground)] max-w-xs leading-relaxed">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── Pricing ───────────────────────────────────────────
const plans = [
  {
    name: "Essential",
    slug: "essential",
    price: "$9.99",
    popular: false,
    features: [
      "Full lesson library",
      "Monthly new content",
      "Printable resources",
      "AI Coach (5 questions/day)",
      "1 free live meet",
    ],
  },
  {
    name: "Premium",
    slug: "premium",
    price: "$19.99",
    popular: true,
    features: [
      "Everything in Essential",
      "Unlimited AI Coach",
      "Monthly live Q&A sessions",
      "Priority support (~2hr)",
      "4 live monthly meets (up to 30 min)",
    ],
  },
];

function PricingPreview() {
  return (
    <section id="pricing" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2
          className="text-[1.75rem] md:text-[2.25rem] text-[color:var(--foreground)]"
          style={{ fontWeight: 700 }}
        >
          Choose Your Plan
        </h2>
        <p className="mt-3 text-[color:var(--muted-foreground)] max-w-lg mx-auto text-[1.05rem]">
          Both plans include access to our AI health coach, trained on clinical functional medicine content by a certified practitioner.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`rounded-2xl p-8 border-2 text-left transition-shadow ${
                plan.popular
                  ? "border-[color:var(--primary)] shadow-lg bg-white relative"
                  : "border-[color:var(--border)] bg-[color:var(--card)] shadow-sm"
              }`}
            >
              {plan.popular && (
                <span
                  className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--primary)] text-white text-[0.75rem] px-4 py-1 rounded-full"
                  style={{ fontWeight: 600 }}
                >
                  Most Popular
                </span>
              )}
              <h3
                className="text-[1.15rem] text-[color:var(--foreground)]"
                style={{ fontWeight: 600 }}
              >
                {plan.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span
                  className="text-[2.5rem] text-[color:var(--foreground)]"
                  style={{ fontWeight: 700 }}
                >
                  {plan.price}
                </span>
                <span className="text-[color:var(--muted-foreground)] text-[0.9rem]">/month</span>
              </div>
              <ul className="mt-6 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-[0.9rem] text-[color:var(--foreground)]">
                    <Check className="w-5 h-5 text-[color:var(--primary)] mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link
                href={`/signup?plan=${plan.slug}`}
                className={`mt-8 w-full py-3 rounded-full transition-opacity text-[0.95rem] flex items-center justify-center ${
                  plan.popular
                    ? "bg-[color:var(--primary)] text-white hover:opacity-90"
                    : "bg-[color:var(--foreground)] text-white hover:opacity-80"
                }`}
                style={{ fontWeight: 600 }}
              >
                Get Started
              </Link>
            </div>
          ))}
        </div>

        <a
          href="#pricing"
          className="mt-8 inline-flex items-center gap-1 text-[color:var(--primary)] text-[0.9rem] hover:underline"
          style={{ fontWeight: 500 }}
        >
          View full pricing details <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </section>
  );
}

// ─── Trust ─────────────────────────────────────────────
function Trust() {
  return (
    <section id="about" className="py-16 md:py-20 bg-[color:var(--secondary)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        <div className="flex justify-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center">
            <Shield className="w-6 h-6 text-[color:var(--primary)]" />
          </div>
          <div className="w-12 h-12 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center">
            <Award className="w-6 h-6 text-[color:var(--primary)]" />
          </div>
        </div>
        <p className="text-[1.05rem] text-[color:var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed mb-6">
          Our functional nutrition and lifestyle program is designed to educate and support diabetic patients towards better health and function in a natural way.
        </p>
        <h2
          className="text-[1.5rem] md:text-[1.75rem] text-[color:var(--foreground)]"
          style={{ fontWeight: 700 }}
        >
          Built on over 20 Years of Real-World RN Experience
        </h2>
        <p className="mt-4 text-[color:var(--muted-foreground)] max-w-2xl mx-auto text-[1rem] leading-relaxed">
          Every lesson is grounded in evidence-based teaching and real clinical experience. You&apos;ll
          learn from a Registered Nurse who has dedicated their career to diabetes education — not
          generic internet advice.
        </p>
        <div className="mt-8 bg-white rounded-2xl p-6 border border-[color:var(--border)] max-w-xl mx-auto">
          <p className="text-[0.9rem] text-[color:var(--muted-foreground)] italic leading-relaxed">
            &ldquo;This program is for{" "}
            <span style={{ fontWeight: 600 }} className="text-[color:var(--foreground)]">
              educational purposes only
            </span>{" "}
            and does not replace individualized medical advice from your healthcare provider. We do not diagnose, treat, or cure diseases.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── Final CTA ─────────────────────────────────────────
function FinalCTA() {
  return (
    <section
      className="py-16 md:py-24"
      style={{
        background: "linear-gradient(135deg, rgba(42,157,143,0.9) 0%, #1a7a6e 100%)",
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <Heart className="w-10 h-10 text-white/80 mx-auto mb-4" />
        <h2
          className="text-[1.75rem] md:text-[2.5rem] text-white"
          style={{ fontWeight: 700 }}
        >
          Feel Confident Managing Diabetes
        </h2>
        <p className="mt-4 text-white/80 max-w-lg mx-auto text-[1.05rem] leading-relaxed">
          Join a growing community of people taking control of their health with clear,
          nurse-led education.
        </p>
        <Link
          href="/onboarding"
          className="inline-flex items-center gap-2 mt-8 bg-white text-[color:var(--primary)] px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity"
          style={{ fontWeight: 600 }}
        >
          Join Today <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}

// ─── Footer ────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[color:var(--foreground)] text-white/60 py-8 text-center text-[0.85rem]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center gap-2 mb-3">
          <Heart className="w-4 h-4 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-white" style={{ fontWeight: 600 }}>Saryn Health</span>
        </div>
        <p className="mb-1">Saryn Health — Functional medicine education &amp; coaching, personalized to you.</p>
        <p>© {new Date().getFullYear()} Saryn Health. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Page ──────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatsInside />
        <HowItWorks />
        <PricingPreview />
        <Trust />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
