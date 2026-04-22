"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Check,
  ArrowRight,
  Menu,
  X,
  Clock,
  Phone,
} from "lucide-react";
import Logo from "@/components/Logo";

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
          <Link href="/signup" className="text-[color:var(--foreground)] transition-colors" style={{ fontWeight: 500 }}>Work With Me</Link>
          <Link href="/#faq" className="hover:text-[color:var(--foreground)] transition-colors">FAQ</Link>
          <Link href="/login" className="hover:text-[color:var(--foreground)] transition-colors">Log in</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="bg-[color:var(--primary)] text-white text-[0.9rem] px-5 py-2 rounded-full hover:opacity-90 transition-opacity"
            style={{ fontWeight: 600 }}
          >
            Try Free for 7 Days
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
          <Link href="/signup" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--foreground)] font-medium py-2">Work With Me</Link>
          <Link href="/#faq" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">FAQ</Link>
          <Link href="/login" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] py-2">Log in</Link>
        </div>
      )}
    </header>
  );
}

// ─── Offerings ────────────────────────────────────────
const offerings = [
  {
    title: "Initial Consultation",
    duration: "75 minutes",
    price: "$197",
    body: "A comprehensive deep-dive into your health history, symptoms, labs, and goals. Sarina will map out your root causes and build your personalized care plan.",
    includes: [
      "Full health history review",
      "Functional lab interpretation",
      "Personalized action plan",
      "Follow-up notes & resources",
    ],
    cta: "Book Initial Consult",
    href: "/schedule",
  },
  {
    title: "Follow-Up Session",
    duration: "45 minutes",
    price: "$125",
    body: "Check in on your progress, adjust your protocol, and go deeper on any areas needing attention.",
    includes: [
      "Progress review",
      "Protocol adjustments",
      "Ongoing support",
      "Lab re-interpretation if needed",
    ],
    cta: "Book Follow-Up",
    href: "/schedule",
  },
  {
    title: "Saryn Health Membership",
    duration: "Monthly",
    price: "From $29/mo",
    badge: "Most Popular",
    body: "Everything you need between sessions — AI health coach, education curriculum, cookbook, and included live meets with Sarina every month.",
    includes: [
      "AI Health Coach (24/7)",
      "Full lesson library",
      "Free Functional Wellness Cookbook",
      "1–4 live meets/month depending on plan",
    ],
    cta: "Start Free for 7 Days",
    href: "/signup",
  },
];

// ─── Page ─────────────────────────────────────────────
export default function WorkWithMePage() {
  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section
          className="py-16 md:py-24"
          style={{
            background: "linear-gradient(135deg, #e8f6f3 0%, #f0f9f7 50%, #e0f0f5 100%)",
          }}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <h1
              className="text-[2rem] md:text-[2.75rem] tracking-tight text-[color:var(--foreground)] leading-tight mb-4"
              style={{ fontWeight: 800 }}
            >
              Work With Sarina
            </h1>
            <p className="text-[1.05rem] text-[color:var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
              Unlike conventional care, Sarina spends time identifying root causes and creating a personalized plan tailored to your biology, lifestyle, and goals — not just your symptoms.
            </p>
          </div>
        </section>

        {/* Approach */}
        <section className="py-12 md:py-16 bg-[color:var(--background)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl border border-[color:var(--border)] p-8">
              <p className="text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed">
                Sarina&apos;s approach is rooted in functional medicine — a science-based framework that asks{" "}
                <span className="text-[color:var(--foreground)]" style={{ fontWeight: 600 }}>
                  why your body is struggling
                </span>
                , not just what label to give it. Every session is personalized. Every plan is built around you.
              </p>
            </div>
          </div>
        </section>

        {/* Offerings */}
        <section className="py-12 md:py-16 bg-[color:var(--secondary)]">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {offerings.map((o) => (
                <div
                  key={o.title}
                  className={`bg-white rounded-2xl p-7 border-2 flex flex-col relative ${
                    o.badge
                      ? "border-[color:var(--primary)] shadow-lg"
                      : "border-[color:var(--border)] shadow-sm"
                  }`}
                >
                  {o.badge && (
                    <span
                      className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[color:var(--primary)] text-white text-[0.75rem] px-4 py-1 rounded-full"
                      style={{ fontWeight: 600 }}
                    >
                      {o.badge}
                    </span>
                  )}

                  <h3
                    className="text-[1.15rem] text-[color:var(--foreground)] mb-1"
                    style={{ fontWeight: 600 }}
                  >
                    {o.title}
                  </h3>

                  <div className="flex items-center gap-3 mb-3">
                    <span className="inline-flex items-center gap-1 text-[0.8rem] text-[color:var(--muted-foreground)]">
                      <Clock className="w-3.5 h-3.5" /> {o.duration}
                    </span>
                  </div>

                  <p
                    className="text-[1.75rem] text-[color:var(--foreground)] mb-3"
                    style={{ fontWeight: 700 }}
                  >
                    {o.price}
                  </p>

                  <p className="text-[0.875rem] text-[color:var(--muted-foreground)] leading-relaxed mb-5">
                    {o.body}
                  </p>

                  <div className="mb-6 flex-1">
                    <p className="text-[0.75rem] text-[color:var(--muted-foreground)] mb-2" style={{ fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                      Includes
                    </p>
                    <ul className="space-y-2">
                      {o.includes.map((item) => (
                        <li key={item} className="flex items-start gap-2 text-[0.85rem] text-[color:var(--foreground)]">
                          <Check className="w-4 h-4 text-[color:var(--primary)] mt-0.5 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link
                    href={o.href}
                    className={`w-full py-3 rounded-full text-[0.9rem] flex items-center justify-center gap-2 transition-opacity ${
                      o.badge
                        ? "bg-[color:var(--primary)] text-white hover:opacity-90"
                        : "bg-[color:var(--foreground)] text-white hover:opacity-80"
                    }`}
                    style={{ fontWeight: 600 }}
                  >
                    {o.cta} <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Discovery Call */}
        <section className="py-12 md:py-16 bg-[color:var(--background)]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div
              className="rounded-2xl p-8 md:p-10 text-center"
              style={{ backgroundColor: "rgba(42, 157, 143, 0.08)" }}
            >
              <div className="w-14 h-14 rounded-full bg-[color:var(--primary)]/10 flex items-center justify-center mx-auto mb-4">
                <Phone className="w-7 h-7 text-[color:var(--primary)]" />
              </div>
              <h2
                className="text-[1.5rem] md:text-[1.75rem] text-[color:var(--foreground)] mb-3"
                style={{ fontWeight: 700 }}
              >
                Not Sure Where to Start?
              </h2>
              <p className="text-[1rem] text-[color:var(--muted-foreground)] max-w-xl mx-auto leading-relaxed mb-6">
                Book a free 15-minute discovery call with Sarina. No pressure — just a conversation about your health and whether we&apos;re the right fit.
              </p>
              <Link
                href="/schedule"
                className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3 rounded-full text-[0.95rem] hover:opacity-90 transition-opacity"
                style={{ fontWeight: 600 }}
              >
                Book a Free Discovery Call <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[color:var(--foreground)] text-white/60 py-8 text-center text-[0.85rem]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-center gap-2 mb-3">
            <Logo className="h-5 w-auto text-neutral-500" />
          </div>
          <p className="mb-1">Saryn Health — Functional medicine education &amp; coaching, personalized to you.</p>
          <p>© {new Date().getFullYear()} Saryn Health. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
