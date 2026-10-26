"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Menu,
  X,
  ChevronDown,
  Check,
  Droplets,
  Zap,
  Shield,
  Star,
  ArrowRight,
} from "lucide-react";
import Logo from "@/components/Logo";

const IV_MODE = process.env.NEXT_PUBLIC_SITE_MODE === "iv";

// ─── Nav ──────────────────────────────────────────────────────────────────
function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href={IV_MODE ? "/iv" : "/"} aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[0.9rem] text-[color:var(--muted-foreground)]">
          <Link href="/iv" className="text-[color:var(--primary)] font-medium hover:opacity-80 transition-opacity">IV hydration</Link>
          <Link href="/about" className="hover:text-[color:var(--foreground)] transition-colors">About Sarina</Link>
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#request"
            className="hidden md:inline-flex items-center bg-[color:var(--primary)] text-white text-[0.8rem] px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap font-semibold"
          >
            Request appointment
          </a>
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
          <a href="#request" onClick={() => setMobileOpen(false)} className="bg-[color:var(--primary)] text-white text-[0.9rem] font-semibold text-center py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Request appointment
          </a>
          <Link href="/iv" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2">IV hydration</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">About Sarina</Link>
        </div>
      )}
    </header>
  );
}

// ─── Hero ─────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section
      className="relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #e8f6f3 0%, #f0f9f7 50%, #e0f0f5 100%)" }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-16 md:py-24 flex flex-col-reverse md:flex-row items-center gap-10 md:gap-16">
        <div className="flex-1 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-[1.08] text-[color:var(--foreground)] mb-5">
            At-home IV hydration, anywhere in LA County
          </h1>
          <p className="text-[1.05rem] text-[color:var(--muted-foreground)] mb-8 max-w-lg mx-auto md:mx-0 leading-relaxed">
            Sarina Deharo, RN, comes to you. 20+ years of clinical experience, a licensed provider reviews every order, and you never leave your couch.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center md:justify-start">
            <a
              href="#request"
              className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
            >
              Request an appointment <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <p className="mt-4 text-[0.82rem] text-[color:var(--muted-foreground)]">
            Serving all of Los Angeles County · 30–60 min visits · New clients save 20%
          </p>
        </div>
        <div className="flex-1 flex justify-center">
          <div className="relative w-64 md:w-80 lg:w-96 aspect-square rounded-3xl overflow-hidden shadow-xl ring-4 ring-white">
            <Image
              src="/hero-photo.jpg"
              alt="Sarina Deharo, RN"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Drip Menu ────────────────────────────────────────────────────────────
const TIERS: Record<string, { label: string; color: string; bg: string }> = {
  Basic: { label: "Basic", color: "#6b7280", bg: "#f3f4f6" },
  Full: { label: "Full", color: "#2a9d8f", bg: "#e8f6f3" },
  Signature: { label: "Signature", color: "#1a6b60", bg: "#d0ede9" },
};

const DRIPS = [
  {
    name: "Hydration",
    tier: "Basic",
    list: 249,
    newClient: 199,
    ingredients: "Normal saline (500 mL)",
    desc: "A clean rehydration drip. The foundation when fluids are the goal.",
  },
  {
    name: "Energy",
    tier: "Full",
    list: 299,
    newClient: 239,
    ingredients: "Saline + B-vitamin complex (B1, B2, B3, B5, B6)",
    desc: "A B-vitamin-focused drip for nutrient replenishment. Many clients choose it when they feel run down.",
  },
  {
    name: "Immunity",
    tier: "Full",
    list: 299,
    newClient: 239,
    ingredients: "Saline + mineral blend (magnesium, zinc, manganese, copper)",
    desc: "A mineral-focused drip with electrolytes and trace minerals.",
  },
  {
    name: "Super Immunity",
    tier: "Signature",
    list: 349,
    newClient: 279,
    ingredients: "Saline + vitamin C + mineral blend (magnesium, zinc, manganese, copper)",
    desc: "A vitamin C–forward drip with supporting minerals.",
  },
  {
    name: "Complete Recovery",
    tier: "Signature",
    list: 349,
    newClient: 279,
    ingredients: "Saline + vitamin C + B-vitamin complex",
    desc: "Vitamin C and B vitamins — a common pick after travel, a hard week, or a big weekend.",
  },
  {
    name: "Total Wellness",
    tier: "Signature",
    list: 349,
    newClient: 279,
    ingredients: "Saline + mineral blend + B-vitamin complex",
    desc: "The full combination: minerals plus B vitamins for hydration and replenishment.",
  },
];

function DripMenu() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-3">
          <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)]">
            The drips
          </h2>
          <p className="mt-2 text-[color:var(--muted-foreground)] text-[0.9rem] max-w-lg mx-auto">
            Prices are set by June Skin. New-client price reflects the 20% WELCOMEHOME discount.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DRIPS.map((d) => {
            const tier = TIERS[d.tier];
            return (
              <div
                key={d.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-[color:var(--border)] flex flex-col"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-[1.05rem] font-medium tracking-tight text-[color:var(--foreground)]">
                    {d.name}
                  </h3>
                  <span
                    className="text-[0.7rem] font-semibold px-2 py-0.5 rounded-full ml-2 shrink-0"
                    style={{ color: tier.color, background: tier.bg }}
                  >
                    {tier.label}
                  </span>
                </div>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-[1.35rem] font-semibold text-[color:var(--foreground)]">${d.newClient}</span>
                  <span className="text-[0.82rem] text-[color:var(--muted-foreground)] line-through">${d.list}</span>
                  <span className="text-[0.75rem] text-[color:var(--primary)] font-medium">new client</span>
                </div>
                <p className="text-[0.8rem] text-[color:var(--muted-foreground)] mb-3 leading-snug">
                  <span className="font-medium text-[color:var(--foreground)]">Ingredients: </span>
                  {d.ingredients}
                </p>
                <p className="text-[0.88rem] text-[color:var(--muted-foreground)] leading-relaxed flex-1">
                  {d.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Add-ons */}
        <div className="mt-8 bg-white rounded-2xl border border-[color:var(--border)] px-6 py-4 flex flex-wrap gap-x-6 gap-y-2 items-center justify-center text-[0.88rem]">
          <span className="font-medium text-[color:var(--foreground)]">Add-ons:</span>
          <span className="text-[color:var(--muted-foreground)]">B12 push <span className="font-medium text-[color:var(--foreground)]">$30</span></span>
          <span className="text-[color:var(--muted-foreground)] hidden sm:inline">·</span>
          <span className="text-[color:var(--muted-foreground)]">Anti-nausea medication (when clinically appropriate) <span className="font-medium text-[color:var(--foreground)]">$30</span></span>
          <span className="text-[color:var(--muted-foreground)] hidden sm:inline">·</span>
          <span className="text-[color:var(--muted-foreground)]">+500 mL hydration <span className="font-medium text-[color:var(--foreground)]">$30</span></span>
        </div>
        <p className="mt-4 text-center text-[0.82rem] text-[color:var(--muted-foreground)]">
          Not sure which one? Pick "Help me choose" on the form and Sarina will walk you through it.
        </p>
      </div>
    </section>
  );
}

// ─── How It Works ─────────────────────────────────────────────────────────
const STEPS = [
  {
    num: "1",
    title: "Tell us what you want",
    desc: "Fill out the 30-second request below.",
    icon: <Droplets className="w-6 h-6" />,
  },
  {
    num: "2",
    title: "Book and get cleared",
    desc: "Sarina texts you a booking link. You pick an open slot, fill out a short health questionnaire, and a licensed provider approves your drip — usually within 24 hours.",
    icon: <Check className="w-6 h-6" />,
  },
  {
    num: "3",
    title: "Sarina comes to you",
    desc: "Home, office, or hotel. 30–60 minutes, and you can get back to your day.",
    icon: <Star className="w-6 h-6" />,
  },
];

function HowItWorks() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] mb-12">
          How it works
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {STEPS.map((s) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[color:var(--primary)] text-white flex items-center justify-center mb-4">
                {s.icon}
              </div>
              <span className="text-[color:var(--primary)] text-[0.8rem] font-semibold mb-1">Step {s.num}</span>
              <h3 className="text-[1.05rem] font-medium text-[color:var(--foreground)] mb-2">{s.title}</h3>
              <p className="text-[0.9rem] text-[color:var(--muted-foreground)] max-w-xs leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Why Sarina ───────────────────────────────────────────────────────────
const WHY = [
  { icon: <Zap className="w-5 h-5 text-[color:var(--primary)]" />, text: "20+ years as a registered nurse" },
  { icon: <Shield className="w-5 h-5 text-[color:var(--primary)]" />, text: "Certified Functional Medicine Practitioner and diabetes educator" },
  { icon: <Check className="w-5 h-5 text-[color:var(--primary)]" />, text: "Every drip ordered by a licensed provider after a health review" },
];

function WhySarina() {
  return (
    <section className="py-14 md:py-20 bg-[color:var(--secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] text-center mb-10">
          Why Sarina
        </h2>
        <div className="space-y-4">
          {WHY.map((w) => (
            <div key={w.text} className="flex items-start gap-3 bg-white rounded-2xl p-5 border border-[color:var(--border)] shadow-sm">
              <div className="mt-0.5 shrink-0">{w.icon}</div>
              <p className="text-[0.95rem] text-[color:var(--foreground)] font-medium">{w.text}</p>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/about" className="text-[0.88rem] text-[color:var(--primary)] underline underline-offset-2 hover:opacity-80 transition-opacity">
            About Sarina →
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── Request Form ─────────────────────────────────────────────────────────
const DRIP_OPTIONS = [
  { value: "Hydration",         label: "Hydration — $199" },
  { value: "Energy",            label: "Energy — $239" },
  { value: "Immunity",          label: "Immunity — $239" },
  { value: "Super Immunity",    label: "Super Immunity — $279" },
  { value: "Complete Recovery", label: "Complete Recovery — $279" },
  { value: "Total Wellness",    label: "Total Wellness — $279" },
  { value: "Help me choose",    label: "Help me choose" },
];

const LS_KEY = "iv_request_submitted";
const LS_DRIP_KEY = "iv_request_drip";

function dripLabel(value: string): string {
  return value === "Help me choose" ? "your drip" : value;
}

function RequestForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submittedDrip, setSubmittedDrip] = useState("");
  const [firstName, setFirstName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [zip, setZip] = useState("");
  const [drip, setDrip] = useState("");
  const [timing, setTiming] = useState("");
  const [source, setSource] = useState("");
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      if (localStorage.getItem(LS_KEY) === "1") {
        setSubmitted(true);
        setSubmittedDrip(localStorage.getItem(LS_DRIP_KEY) || "");
      }
    } catch { /* ignore */ }
  }, []);

  const valid =
    firstName.trim() &&
    phone.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    /^\d{5}$/.test(zip.trim()) &&
    drip &&
    timing &&
    source &&
    consent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/iv-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          zip: zip.trim(),
          drip,
          timing,
          source,
          consent,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error((b as { error?: string }).error || "Something went wrong");
      }
      try {
        localStorage.setItem(LS_KEY, "1");
        localStorage.setItem(LS_DRIP_KEY, drip);
      } catch { /* ignore */ }
      setSubmittedDrip(drip);
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-white text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 transition";
  const selectClass = inputClass + " appearance-none";

  return (
    <section id="request" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] text-center mb-10">
          Request an appointment
        </h2>

        {submitted ? (
          <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/20 rounded-2xl p-8">
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-[color:var(--primary)]/30 mb-4">
                <Image src="/hero-photo.jpg" alt="Sarina Deharo, RN" fill className="object-cover" />
              </div>
              <h3 className="text-[1.35rem] font-medium tracking-tight text-[color:var(--foreground)]">
                Got it — thank you!
              </h3>
            </div>
            <div className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-md mx-auto space-y-3">
              <p>Hi, it&apos;s Sarina.</p>
              <p>I&apos;ll text you within 48 hours from my cell to set up your <span className="font-medium text-[color:var(--foreground)]">{dripLabel(submittedDrip)}</span> drip. To make it quick, have two things ready when I reach out:</p>
              <ol className="list-decimal list-inside space-y-1 pl-1">
                <li>A couple of days and times that work for you</li>
                <li>The address where you&apos;d like the IV</li>
              </ol>
              <p>Once we lock in a time, I&apos;ll send your personal booking link. It takes you to a short health questionnaire that a licensed provider reviews before your visit. You&apos;ll put your card down there — it&apos;s only charged upon completion of your service.</p>
              <p>New clients get <span className="font-medium text-[color:var(--foreground)]">20% off</span> with code <span className="font-mono font-semibold text-[color:var(--foreground)]">WELCOMEHOME</span>.</p>
              <p className="pt-1">Talk soon,<br /><span className="font-medium text-[color:var(--foreground)]">Sarina</span></p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  First name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className={inputClass}
                  placeholder="Sarina"
                />
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className={inputClass}
                  placeholder="(310) 555-0100"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClass}
                  placeholder="you@email.com"
                />
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  ZIP code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={zip}
                  onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
                  className={inputClass}
                  placeholder="90210"
                  pattern="\d{5}"
                  maxLength={5}
                />
              </div>
            </div>
            <div>
              <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                Which drip? <span className="text-red-500">*</span>
              </label>
              <select required value={drip} onChange={(e) => setDrip(e.target.value)} className={selectClass}>
                <option value="">Select a drip…</option>
                {DRIP_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  Preferred timing <span className="text-red-500">*</span>
                </label>
                <select required value={timing} onChange={(e) => setTiming(e.target.value)} className={selectClass}>
                  <option value="">Select…</option>
                  <option>ASAP</option>
                  <option>This week</option>
                  <option>Next week</option>
                  <option>Flexible</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  How did you hear about us? <span className="text-red-500">*</span>
                </label>
                <select required value={source} onChange={(e) => setSource(e.target.value)} className={selectClass}>
                  <option value="">Select…</option>
                  <option>TikTok</option>
                  <option>Instagram</option>
                  <option>Friend</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#2a9d8f] shrink-0"
              />
              <span className="text-[0.85rem] text-[color:var(--muted-foreground)] leading-snug">
                I agree to receive calls, texts, and emails from Saryn Health about my request. Message and data rates may apply. Reply STOP to opt out. See our{" "}
                <Link href="/privacy" className="underline hover:text-[color:var(--foreground)] transition-colors">Privacy Policy</Link>.{" "}
                <span className="text-red-500">*</span>
              </span>
            </label>

            {error && (
              <p className="text-red-500 text-[0.85rem]">{error}</p>
            )}

            <button
              type="submit"
              disabled={!valid || loading}
              className="w-full bg-[color:var(--primary)] text-white py-3.5 rounded-full font-semibold text-[1rem] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Send request"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

// ─── FAQ ──────────────────────────────────────────────────────────────────
const FAQ_ITEMS = [
  {
    q: "Where do you go?",
    a: "Anywhere in Los Angeles County — home, office, hotel, event.",
  },
  {
    q: "How long does it take?",
    a: "Most visits are 30–60 minutes including setup.",
  },
  {
    q: "Who decides if I can get an IV?",
    a: "A licensed provider on the June Skin platform reviews your health history and approves your drip before Sarina arrives. IV therapy isn't right for everyone; if you have a medical condition or take medications, note it in that review.",
  },
  {
    q: "Can I ask about my medical condition in the comments or DMs?",
    a: "We can't give medical advice over social media. Submit a request and raise it during the health review.",
  },
  {
    q: "Does it hurt?",
    a: "A quick pinch when the IV goes in, then it's comfortable.",
  },
  {
    q: "Can I book for a group or an event?",
    a: "Yes — submit a request and put \"Flexible\" for timing, and mention the group when Sarina texts you.",
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
        <span className="text-[0.95rem] font-semibold text-[color:var(--foreground)]">{q}</span>
        <ChevronDown className={`w-5 h-5 text-[color:var(--muted-foreground)] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <p className="pb-5 text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed pr-8">{a}</p>}
    </div>
  );
}

function FAQ() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] text-center mb-10">
          Frequently asked questions
        </h2>
        <div className="bg-white rounded-2xl border border-[color:var(--border)] px-6 sm:px-8">
          {FAQ_ITEMS.map((item) => <FAQItem key={item.q} q={item.q} a={item.a} />)}
        </div>
      </div>
    </section>
  );
}

// ─── Nurses Callout ───────────────────────────────────────────────────────
function NursesCallout() {
  return (
    <div className="bg-[color:var(--primary)]/5 border-t border-[color:var(--primary)]/10 py-5 text-center text-[0.85rem] text-[color:var(--muted-foreground)]">
      Are you an RN in LA interested in per-diem IV work?{" "}
      <a href="mailto:sarina@sarynhealth.com" className="text-[color:var(--primary)] underline underline-offset-2 hover:opacity-80 transition-opacity">
        Email sarina@sarynhealth.com
      </a>
    </div>
  );
}

// ─── Footer ───────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[color:var(--foreground)] text-white/60 py-8 text-center text-[0.85rem]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-center mb-3">
          <Logo className="h-5 w-auto text-neutral-500" />
        </div>
        <p className="mb-2 max-w-2xl mx-auto text-white/40 text-[0.75rem] leading-relaxed">
          Sarina Deharo, RN, provides IV therapy as an independent provider on the June Skin platform. Treatments are ordered by June Skin's affiliated medical practice after a health-history review and administered by licensed nurses. Pricing is set by June Skin and subject to change. Saryn Health is not a medical practice and is not affiliated with June Skin. This page is for general information and is not medical advice; results vary.
        </p>
        <p className="mb-2 flex items-center justify-center gap-4 flex-wrap">
          <Link href="/about" className="hover:text-white/80 transition-colors">About Sarina</Link>
          <Link href="/privacy" className="hover:text-white/80 transition-colors">Privacy Policy</Link>
          <Link href="/terms" className="hover:text-white/80 transition-colors">Terms of Use</Link>
        </p>
        <p>© {new Date().getFullYear()} Saryn Health. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
export default function IVPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <DripMenu />
        <HowItWorks />
        <WhySarina />
        <RequestForm />
        <FAQ />
        <NursesCallout />
      </main>
      <Footer />
    </>
  );
}
