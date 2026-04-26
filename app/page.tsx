"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  Bot,
  FileText,
  Users,
  ArrowRight,
  UserPlus,
  GraduationCap,
  Heart,
  Check,
  Shield,
  Award,
  Menu,
  X,
  ChevronDown,
  Calendar,
  Brain,
  UtensilsCrossed,
  Quote,
} from "lucide-react";
import Logo from "@/components/Logo";
import HomepageQuiz from "@/components/HomepageQuiz";

const SARINA_IMG = "/hero-photo.jpg";

// ─── Nav ───────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[0.9rem] text-[color:var(--muted-foreground)]">
          <Link href="/consultation" className="hover:text-[color:var(--foreground)] transition-colors">Work With Me</Link>
          <Link href="/membership" className="hover:text-[color:var(--foreground)] transition-colors">Membership</Link>
          <a href="#faq" className="hover:text-[color:var(--foreground)] transition-colors">FAQ</a>
          <Link href="/login" className="hover:text-[color:var(--foreground)] transition-colors">Log in</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/consultation"
            className="bg-[color:var(--primary)] text-white text-[0.8rem] px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap"
            style={{ fontWeight: 600 }}
          >
            Book Free Consultation
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

      {mobileOpen && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-4 flex flex-col gap-3">
          <Link
            href="/consultation"
            onClick={() => setMobileOpen(false)}
            className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2"
          >
            Work With Me
          </Link>
          <Link
            href="/membership"
            onClick={() => setMobileOpen(false)}
            className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2"
          >
            Membership
          </Link>
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
        <div className="flex-1 text-center md:text-left">
          <span
            className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-4 py-1 rounded-full text-[0.8rem] mb-5"
            style={{ fontWeight: 500 }}
          >
            Led by a Certified Functional Medicine Practitioner
          </span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight leading-[1.05] text-[color:var(--foreground)] mb-4">
            Take the first step toward understanding your health
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Start with a free consultation and our functional wellness cookbook — no commitment, no credit card.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <Link
              href="/consultation"
              className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3 rounded-full text-[0.95rem] hover:opacity-90 transition-opacity"
              style={{ fontWeight: 600 }}
            >
              Book a Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/cookbook"
              className="inline-flex items-center justify-center gap-2 border-2 border-[color:var(--primary)] text-[color:var(--primary)] px-7 py-3 rounded-full text-[0.95rem] hover:bg-[color:var(--primary)]/5 transition-colors"
              style={{ fontWeight: 600 }}
            >
              Download the Free Cookbook
            </Link>
          </div>
        </div>

        <div className="flex-1 flex justify-center">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
            <Image
              src="/hero-functional.jpg"
              alt="Healthy functional medicine nutrition"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

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

// ─── Social Proof Bar ─────────────────────────────────
const stats = [
  { value: "20+", label: "Years Clinical Experience" },
  { value: "500+", label: "Patients Helped Personally" },
  { value: "Certified", label: "Functional Medicine Practitioner" },
  { value: "Evidence-Based", label: "Root Cause Approach" },
];

function SocialProof() {
  return (
    <section className="bg-[color:var(--primary)]/5 border-y border-[color:var(--primary)]/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p
                className="text-[1.5rem] md:text-[1.75rem] text-[color:var(--primary)]"
                style={{ fontWeight: 800 }}
              >
                {s.value}
              </p>
              <p className="text-[0.8rem] text-[color:var(--muted-foreground)] mt-1">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Meet Sarina ──────────────────────────────────────
function MeetSarina() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] text-center mb-12">
          Meet Your Practitioner
        </h2>

        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
          <div className="flex-1">
            <span
              className="inline-block bg-[color:var(--primary)]/10 text-[color:var(--primary)] px-4 py-1.5 rounded-full text-[0.8rem] mb-5"
              style={{ fontWeight: 600 }}
            >
              Sarina Deharo — Certified Functional Medicine Practitioner
            </span>
            <p className="text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
              My name is Sarina Deharo and I am a Certified Functional Medicine Practitioner and Registered Nurse with over 20 years of clinical experience. My clinical focus is on diabetes management.
            </p>
            <p className="text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
              I have additional training in functional nutrition, lifestyle medicine, and therapeutic nutrition protocols including anti-inflammatory and root-cause-based dietary approaches.
            </p>
            <p className="text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
              I am very passionate about helping patients with chronic conditions — especially diabetes including pre-diabetes — to make meaningful dietary and lifestyle changes that help reduce inflammation, restore function, and lower the risk of progressive chronic disease.
            </p>
            <p className="text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed mb-6">
              My approach goes beyond symptom management. I use nutrient therapy and personalized care plans to understand why your body is struggling — and build a path to lasting health that is tailored specifically to your body&apos;s own needs.
            </p>

            <div className="space-y-3">
              {[
                "Registered Nurse (RN) — 20+ years clinical practice",
                "Certified Functional Medicine Practitioner",
                "Specialized in diabetes & pre-diabetes management",
                "Trained in functional nutrition & lifestyle medicine",
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-[color:var(--primary)] mt-0.5 shrink-0" />
                  <span className="text-[0.95rem] text-[color:var(--foreground)]" style={{ fontWeight: 500 }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-shrink-0">
            <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-lg" style={{ boxShadow: "0 8px 32px rgba(42, 157, 143, 0.15)" }}>
              <Image
                src={SARINA_IMG}
                alt="Sarina"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Testimonials ─────────────────────────────────────
const testimonials = [
  {
    quote:
      "I am so grateful to have Sarina on my health journey. Sarina really took the time to get to know me and understand my health concerns. Because of this, she was able to make recommendations for testing and treatments including dietary changes. She focuses on the root cause of the issue instead of treating symptoms. I'm so happy to finally have the right care that improved my health!",
    name: "Lupita Lara",
    title: "Patient",
  },
  {
    quote:
      "I was fortunate to be one of Sarina De Haro's first patients, and I'm really glad I said yes. With subtle changes — especially adjusting supplements and when I take them — I noticed improvements in many areas. I have more natural energy, feel less bloated, sleep better, and my weight feels steady and manageable. Overall, I feel more like myself again. Her integrative approach was approachable and individualized.",
    name: "John P. Argott",
    title: "BSN, RN",
  },
];

function Testimonials() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2
            className="text-[1.75rem] md:text-[2.25rem] text-[color:var(--foreground)]"
            style={{ fontWeight: 700 }}
          >
            What Patients Are Saying
          </h2>
          <p className="mt-3 text-[color:var(--muted-foreground)] text-[1.05rem] max-w-lg mx-auto">
            Real stories from people who found answers with Sarina.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-7 shadow-sm border border-[color:var(--border)] flex flex-col"
            >
              <Quote className="w-8 h-8 text-[color:var(--primary)]/30 mb-4" />
              <p className="text-[0.95rem] text-[color:var(--foreground)] leading-relaxed mb-6 flex-1">
                {t.quote}
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-[color:var(--border)]">
                <div className="w-11 h-11 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center text-[color:var(--primary)]" style={{ fontWeight: 700 }}>
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-[0.95rem] text-[color:var(--foreground)]" style={{ fontWeight: 600 }}>
                    {t.name}
                  </p>
                  <p className="text-[0.8rem] text-[color:var(--muted-foreground)]">
                    {t.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── What You'll Get ──────────────────────────────────
const features = [
  {
    icon: Brain,
    title: "Root Cause Education",
    desc: "Structured lessons built on functional medicine principles — explaining the why behind your symptoms.",
  },
  {
    icon: Calendar,
    title: "1-on-1 Live Coaching Calls",
    desc: "Book private consultations with Sarina. Get personalized guidance for your specific health situation.",
  },
  {
    icon: Bot,
    title: "AI Health Coach",
    desc: "Instant answers to your health questions, 24/7 — trained on clinical functional medicine content.",
  },
  {
    icon: UtensilsCrossed,
    title: "Free Functional Wellness Cookbook",
    desc: "Included free with your first consultation — anti-inflammatory recipes and meal plans designed to support gut health, blood sugar balance, and energy.",
  },
  {
    icon: Users,
    title: "Private Community",
    desc: "Connect with others on the same journey. Share wins, ask questions, and stay accountable.",
  },
  {
    icon: FileText,
    title: "Printable Guides & Resources",
    desc: "Downloadable checklists, trackers, and reference sheets to keep you organized and on track.",
  },
];

function WhatYoullGet() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)]">
            Everything You Need to Take Control of Your Health
          </h2>
          <p className="mt-3 text-[color:var(--muted-foreground)] text-[1.05rem] max-w-lg mx-auto">
            Not just information — a full coaching experience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[color:var(--border)] hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-[color:var(--primary)]" />
                </div>
                <h3 className="text-[1.05rem] text-[color:var(--foreground)] mb-2" style={{ fontWeight: 600 }}>
                  {f.title}
                </h3>
                <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">
                  {f.desc}
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
    title: "Book your free consultation",
    desc: "Tell us about your health goals and schedule a 1-on-1 call with Sarina. No login, no commitment.",
  },
  {
    icon: GraduationCap,
    num: "2",
    title: "Get a personalized plan",
    desc: "On your call, Sarina reviews your goals and recommends the right next step — coaching, education, or specialized care.",
  },
  {
    icon: Heart,
    num: "3",
    title: "Start your journey",
    desc: "Whether that's our membership platform, ongoing 1:1 coaching, or a referral to clinical care, you'll have a clear path forward.",
  },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)]">
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
        <h2
          className="text-[1.5rem] md:text-[1.75rem] text-[color:var(--foreground)]"
          style={{ fontWeight: 700 }}
        >
          Built on over 20 Years of Real-World Clinical Experience
        </h2>
        <p className="mt-4 text-[color:var(--muted-foreground)] max-w-2xl mx-auto text-[1rem] leading-relaxed">
          Every lesson is grounded in evidence-based teaching and real clinical experience. You&apos;ll
          learn from a Certified Functional Medicine Practitioner with 20+ years of clinical experience — not
          generic internet advice.
        </p>
        <div className="mt-8 bg-white rounded-2xl p-6 border border-[color:var(--border)] max-w-xl mx-auto">
          <p className="text-[0.9rem] text-[color:var(--muted-foreground)] italic leading-relaxed">
            &ldquo;Saryn Health is an{" "}
            <span style={{ fontWeight: 600 }} className="text-[color:var(--foreground)]">
              educational and coaching platform only
            </span>
            . Our content does not replace individualized medical advice from your healthcare provider. We do not diagnose, treat, or cure any condition.&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────

const FAQ_ITEMS = [
  {
    q: "What is functional medicine and how is it different from conventional medicine?",
    a: "Functional medicine looks for the root cause of your symptoms rather than just treating them. Instead of managing a diagnosis with medication alone, we investigate your biology, lifestyle, nutrition, environment, and history to understand why your body is struggling — and build a personalized plan to address it.",
  },
  {
    q: "Who is Saryn Health for?",
    a: "Saryn Health is for anyone who feels like conventional medicine hasn't given them real answers. Whether you've been recently diagnosed with a chronic condition, told you're \"pre-diabetic,\" dealing with fatigue, gut issues, hormonal imbalances, or simply want to be proactive about your long-term health — this platform was built for you.",
  },
  {
    q: "What does the AI health coach actually do?",
    a: "Our AI coach is trained on clinical functional medicine content developed by a certified functional medicine practitioner. It answers your health questions, explains root cause concepts, walks you through your personalized education curriculum, and helps you prepare for your live calls — available to you 24/7 between appointments.",
  },
  {
    q: "Are the live consultations with real medical professionals?",
    a: "Yes. Live calls are conducted with our certified functional medicine practitioner. These sessions are personalized to your health history, your goals, and the pre-consultation form you complete before each appointment.",
  },
  {
    q: "Is this a replacement for my doctor?",
    a: "No. Saryn Health is an education and coaching platform, not a medical practice. We do not diagnose or prescribe. Our role is to help you understand your health more deeply, ask better questions, and make more informed decisions — ideally alongside your existing care team.",
  },
  {
    q: "What's the difference between the Essential and Premium plans?",
    a: "Both plans include access to the AI health coach and your personalized education curriculum. Premium unlocks higher AI coaching usage, priority access to live call scheduling, and deeper curriculum content across all functional medicine topics.",
  },
  {
    q: "How is my health information kept private?",
    a: "Your data is encrypted and stored securely. We follow strict confidentiality standards in line with local and federal privacy guidelines. Your health information is never sold or shared with third parties.",
  },
  {
    q: "How do I get started?",
    a: "Create your account, complete a short onboarding questionnaire so we can personalize your experience, and you'll have immediate access to your AI health coach and education curriculum. When you're ready, schedule your first live consultation with our practitioner.",
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4"
      >
        <span
          className="text-[0.95rem] text-[color:var(--foreground)]"
          style={{ fontWeight: 600 }}
        >
          {q}
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[color:var(--muted-foreground)] shrink-0 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-5 text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed pr-8">
          {a}
        </p>
      )}
    </div>
  );
}

function FAQ() {
  return (
    <section id="faq" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] text-center mb-10">
          Frequently Asked Questions
        </h2>
        <div className="bg-white rounded-2xl border border-[color:var(--border)] px-6 sm:px-8">
          {FAQ_ITEMS.map((item) => (
            <FAQItem key={item.q} q={item.q} a={item.a} />
          ))}
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
        <h2 className="text-[1.75rem] md:text-[2.5rem] font-medium tracking-tight text-white">
          Take the first step.
        </h2>
        <p className="mt-4 text-white/80 max-w-lg mx-auto text-[1.05rem] leading-relaxed">
          A free consultation with Sarina is the easiest way to start.
        </p>
        <Link
          href="/consultation"
          className="inline-flex items-center gap-2 mt-8 bg-white text-[color:var(--primary)] px-8 py-3.5 rounded-full hover:opacity-90 transition-opacity"
          style={{ fontWeight: 600 }}
        >
          Book Your Free Consultation <ArrowRight className="w-4 h-4" />
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
        <div className="flex items-center justify-center mb-3">
          <Logo className="h-5 w-auto text-neutral-500" />
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
        <SocialProof />
        <HomepageQuiz />
        <MeetSarina />
        <Testimonials />
        <WhatYoullGet />
        <HowItWorks />
        <Trust />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
