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
          <a href="#pricing" className="hover:text-[color:var(--foreground)] transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-[color:var(--foreground)] transition-colors">FAQ</a>
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
        <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-4 flex flex-col gap-1">
          <a href="#request" onClick={() => setMobileOpen(false)} className="bg-[color:var(--primary)] text-white text-[0.9rem] font-semibold text-center py-2.5 rounded-full hover:opacity-90 transition-opacity mb-2">
            Request appointment
          </a>
          <Link href="/iv" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2.5 border-b border-[color:var(--border)]">IV hydration</Link>
          <a href="#pricing" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2.5 border-b border-[color:var(--border)]">Pricing</a>
          <a href="#faq" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2.5 border-b border-[color:var(--border)]">FAQ</a>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2.5">About Sarina</Link>
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
            Serving all of Los Angeles County · No travel fee · New clients save 20%
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
    <section id="pricing" className="py-16 md:py-24 bg-[color:var(--secondary)]">
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

// ─── What's in the Bag ────────────────────────────────────────────────────
const BAG_ITEMS = [
  {
    label: "Normal saline",
    does: "Sterile water with the same salt concentration as your blood. It restores fluid volume directly, which is why it's the base of every drip. If you're dehydrated from heat, travel, exercise, illness, or a long night, this is the part doing the heavy lifting.",
    why: "Every drip starts with 500 mL. The Hydration drip is saline only; the +500 mL add-on doubles it.",
    side: "Coolness at the IV site, mild bloating, or needing the bathroom sooner than usual. Rarely, swelling at the site if the IV shifts.",
  },
  {
    label: "B vitamins (B1, B2, B3, B5, B6)",
    does: "The B-vitamin family is what your cells use to turn food into usable energy. B1 (thiamine) helps convert carbohydrates into energy and supports nerve and muscle function. B2 (riboflavin) helps break down fats, proteins, and carbs. B3 (niacin) is involved in circulation, skin health, and brain function. B5 (pantothenic acid) is needed to make coenzyme A, a core piece of metabolism. B6 (pyridoxine) is involved in mood regulation, immune function, and brain health. They're water-soluble, so your body uses what it needs and clears the rest.",
    why: "Energy, Complete Recovery, and Total Wellness all include the full B complex. Clients commonly choose these when they feel run down, burned out, or depleted after travel or a demanding stretch, and many report feeling more alert and less fatigued afterward.",
    side: "Mild flushing, headache, nausea, dizziness, or temporary discomfort at the IV site. Bright yellow urine for a day is normal (that's riboflavin). Allergic reactions are rare.",
  },
  {
    label: "Vitamin C (ascorbic acid)",
    does: "An antioxidant your body can't make on its own. It's required for collagen production (skin, joints, connective tissue), supports normal immune function, helps with iron absorption, and helps neutralize oxidative stress. Your body stores very little of it, so levels drop quickly during illness, stress, or heavy training.",
    why: "Super Immunity and Complete Recovery each carry a high dose. It's the one people reach for around travel, when they feel something coming on, or after a stretch of poor sleep and stress. Clients often describe feeling less run down and notice their skin looks brighter.",
    side: "Mild irritation at the IV site, nausea, headache, dizziness, or flushing. High doses can occasionally contribute to kidney stones in people prone to them; tell your provider if you have a history. Your reviewing provider screens for G6PD deficiency, a rare condition that makes high-dose vitamin C unsafe.",
  },
  {
    label: "Magnesium chloride",
    does: "A mineral involved in over 300 enzyme reactions. It's central to muscle relaxation, nerve signaling, heart rhythm, blood sugar regulation, and sleep. It's one of the most common deficiencies, because stress, alcohol, sweating, and many medications all deplete it.",
    why: "Immunity, Super Immunity, and Total Wellness all include it. It's the ingredient people ask about most for muscle tension, cramps, tension headaches, and sleep. Clients often describe feeling calmer and sleeping better the night of their drip.",
    side: "A warm, flushed feeling as it runs in is common and passes quickly. Lightheadedness, nausea, tingling, or mild irritation at the site can occur. Your nurse controls the rate to keep this comfortable. At very high doses, muscle weakness or heart rhythm changes are possible, which is why dosing is provider-ordered.",
  },
  {
    label: "Zinc",
    does: "A trace mineral that supports normal immune function, wound healing, skin integrity, hormone balance, and taste and smell. Your body doesn't store it, so intake has to be steady.",
    why: "Part of the mineral blend in Immunity, Super Immunity, and Total Wellness. Commonly chosen when recovering from being sick, for skin concerns, or for frequent travelers.",
    side: "Mild nausea, a metallic taste, headache, or irritation at the IV site. Dizziness and allergic reactions are rare.",
  },
  {
    label: "Manganese",
    does: "A trace mineral your body uses in small amounts for bone formation, connective tissue, blood clotting, and antioxidant enzymes that protect cells.",
    why: "A small amount is included in the mineral blend to round out trace-mineral support.",
    side: "Uncommon at the amounts used. Mild nausea or site irritation are the most likely.",
  },
  {
    label: "Copper",
    does: "Works alongside iron to form red blood cells, supports nerve health and immune balance, and helps your body absorb iron. Stress, digestive issues, and high zinc intake can deplete it, so it's paired with zinc to keep the two in balance.",
    why: "Included in the mineral blend specifically to balance the zinc.",
    side: "Mild nausea, metallic taste, headache, flushing, or site irritation. Dizziness and allergic reactions are rare.",
  },
  {
    label: "B12 (hydroxocobalamin) — add-on",
    does: "Essential for red blood cell formation, nerve function, and turning fats and carbohydrates into energy. Many people absorb it poorly from food (especially with age, certain medications, or digestive conditions), which is why the injectable form is popular.",
    why: "Given as a quick push through the IV line, not mixed into the bag. The usual pairing with Energy or Total Wellness. Clients often choose it for fatigue, focus, or endurance.",
    side: "Pain or redness at the site, itching, mild diarrhea, or a temporary sensation of body swelling. Less commonly, changes in blood pressure or potassium levels. Your urine may run pink or red for a day; that's the hydroxocobalamin, not blood.",
  },
  {
    label: "Anti-nausea medication (ondansetron) — add-on",
    does: "A prescription medication that blocks the serotonin receptors in the brain and gut that trigger nausea and vomiting. It's non-sedating and works within minutes.",
    why: "Given as a push at the start when your provider approves it. The obvious choice for a rough morning or a queasy stomach that makes it hard to keep fluids down.",
    side: "Mild headache, dizziness, constipation, fatigue, or flushing. Because it's a prescription, it's only included when your reviewing provider decides it's appropriate for you.",
  },
];

function BagItem({ label, does, why, side }: { label: string; does: string; why: string; side: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-[color:var(--border)] last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left gap-4 px-6 sm:px-8"
      >
        <span className="text-[0.95rem] font-semibold text-[color:var(--foreground)]">{label}</span>
        <ChevronDown className={`w-5 h-5 text-[color:var(--muted-foreground)] shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="pb-6 px-6 sm:px-8 space-y-4 pr-10">
          {[
            { heading: "What it does", text: does },
            { heading: "Why it's in the drip", text: why },
            { heading: "Possible side effects", text: side },
          ].map(({ heading, text }) => (
            <div key={heading}>
              <p className="text-[0.8rem] font-semibold text-[color:var(--foreground)] uppercase tracking-wide mb-1">{heading}</p>
              <p className="text-[0.9rem] text-[color:var(--muted-foreground)] leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function WhatsInTheBag() {
  return (
    <section className="py-16 md:py-24 bg-[color:var(--secondary)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] mb-3">
            What&apos;s in the bag
          </h2>
          <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed">
            Plain-English notes on each ingredient. Your provider decides what&apos;s right for you.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-[color:var(--border)]">
          {BAG_ITEMS.map((item) => (
            <BagItem key={item.label} {...item} />
          ))}
        </div>
        <p className="mt-6 text-[0.82rem] text-[color:var(--muted-foreground)] text-center leading-relaxed">
          Doses are set by your reviewing provider based on your health questionnaire. IV therapy replenishes fluids and nutrients. It doesn&apos;t treat or cure medical conditions, and it isn&apos;t a substitute for seeing your doctor.
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
  { value: "coaching-only",    label: "No IV — just the diabetes/coaching waitlist" },
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
  const [coachingInterest, setCoachingInterest] = useState(false);
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

  const isCoachingOnly = drip === "coaching-only";

  const valid =
    firstName.trim() &&
    phone.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    /^\d{5}$/.test(zip.trim()) &&
    drip &&
    (isCoachingOnly || timing) &&
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
          coaching_interest: coachingInterest,
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
            {submittedDrip === "coaching-only" ? (
              <div className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed max-w-md mx-auto space-y-3">
                <p>You&apos;re on the list. Sarina will email you when diabetes education and coaching open up. In the meantime, if you ever want a drip, you know where to find her.</p>
                <p className="pt-2 text-[0.8rem]">
                  <button
                    onClick={() => {
                      try { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_DRIP_KEY); } catch { /* ignore */ }
                      setSubmitted(false);
                      setSubmittedDrip("");
                    }}
                    className="underline underline-offset-2 hover:text-[color:var(--foreground)] transition-colors"
                  >
                    Submit another request
                  </button>
                </p>
                <p className="pt-4 text-[0.72rem] text-[color:var(--muted-foreground)]/60 leading-relaxed border-t border-[color:var(--primary)]/10 mt-2">
                  <span className="font-semibold">Scope of services:</span> The provider is a Registered Nurse (RN), not a physician or other independently authorized diagnosing and prescribing practitioner. Services are provided within the provider&apos;s applicable legal scope of practice. This does not establish a medical diagnosis or replace an evaluation by a licensed healthcare practitioner.
                </p>
              </div>
            ) : (
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
              <p className="pt-4 text-[0.8rem]">
                <button
                  onClick={() => {
                    try { localStorage.removeItem(LS_KEY); localStorage.removeItem(LS_DRIP_KEY); } catch { /* ignore */ }
                    setSubmitted(false);
                    setSubmittedDrip("");
                  }}
                  className="underline underline-offset-2 hover:text-[color:var(--foreground)] transition-colors"
                >
                  Submit another request
                </button>
              </p>
              <p className="pt-4 text-[0.72rem] text-[color:var(--muted-foreground)]/60 leading-relaxed border-t border-[color:var(--primary)]/10 mt-2">
                <span className="font-semibold">Scope of services:</span> The provider is a Registered Nurse (RN), not a physician or other independently authorized diagnosing and prescribing practitioner. Services are provided within the provider&apos;s applicable legal scope of practice. This does not establish a medical diagnosis or replace an evaluation by a licensed healthcare practitioner.
              </p>
            </div>
            )}
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
              <select required value={drip} onChange={(e) => {
                setDrip(e.target.value);
                if (e.target.value === "coaching-only") setCoachingInterest(true);
              }} className={selectClass}>
                <option value="">Select a drip…</option>
                {DRIP_OPTIONS.map((d) => <option key={d.value} value={d.value}>{d.label}</option>)}
              </select>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={coachingInterest}
                onChange={(e) => setCoachingInterest(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#2a9d8f] shrink-0"
              />
              <span className="text-[0.85rem] text-[color:var(--muted-foreground)] leading-snug">
                Keep me posted when diabetes education and functional medicine coaching launch.
              </span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {!isCoachingOnly && (
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">
                  Preferred timing <span className="text-red-500">*</span>
                </label>
                <select required={!isCoachingOnly} value={timing} onChange={(e) => setTiming(e.target.value)} className={selectClass}>
                  <option value="">Select…</option>
                  <option>ASAP</option>
                  <option>This week</option>
                  <option>Next week</option>
                  <option>Flexible</option>
                </select>
              </div>
              )}
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
    q: "Which drips do you offer?",
    a: "The six on this page, plus three add-ons. That's the full menu right now. If you want something you don't see, pick \"Help me choose\" and ask Sarina.",
  },
  {
    q: "Do you do a \"banana bag\" for hangovers?",
    a: "\"Banana bag\" is the nickname for saline plus B vitamins, which is our Energy drip ($239 new client). Complete Recovery ($279) adds vitamin C. If your stomach's rough, ask about the anti-nausea add-on — your provider decides whether it's appropriate.",
  },
  {
    q: "Do you offer iron, NAD+, glutathione, or vitamin D?",
    a: "Not currently. The menu above is everything available right now. If that changes, it'll show up here first.",
  },
  {
    q: "Where do you go?",
    a: "Anywhere in Los Angeles County — home, office, hotel, Airbnb, backyard. Outside LA County? Submit a request anyway; if there's enough interest in your area, you'll be the first to hear.",
  },
  {
    q: "How much does it cost, and is there a travel fee?",
    a: "Prices are listed above and include the visit — no travel fee, no hidden charges. Add-ons are $30 each. New clients get 20% off with code WELCOMEHOME. Prices are set by June Skin and may change.",
  },
  {
    q: "How do I pay? Do you take insurance?",
    a: "Card only, through the June Skin booking link. Your card goes on file when you book and you're charged after your visit. IV hydration isn't covered by insurance.",
  },
  {
    q: "How long does it take?",
    a: "Most visits are 30–60 minutes including setup. Plan to sit or lie down comfortably.",
  },
  {
    q: "Who decides if I can get an IV?",
    a: "A licensed provider (physician or nurse practitioner) on the June Skin platform reviews your health questionnaire before your visit and approves your drip. IV therapy isn't right for everyone — if you have a medical condition, are pregnant or breastfeeding, or take medications, note it in that questionnaire.",
  },
  {
    q: "I have a medical condition. Can I ask about it in the comments or DMs?",
    a: "We can't give medical advice over social media. Submit a request, and bring it up in the health questionnaire — that goes straight to the reviewing provider.",
  },
  {
    q: "Does it hurt?",
    a: "A quick pinch when the IV goes in, then it's comfortable. Sarina has been placing IVs for over 20 years.",
  },
  {
    q: "How often can I get one?",
    a: "That depends on you and what your provider recommends. Some clients book monthly, some only after travel or a big weekend.",
  },
  {
    q: "Can I book for a group, party, or event?",
    a: "Yes. Submit a request, choose \"Flexible\" for timing, and mention the group when Sarina texts you.",
  },
  {
    q: "Sarina is a diabetes educator — can she help me with that?",
    a: "Right now she's focused on IV hydration. Diabetes education and functional medicine coaching are coming back later. Tick the \"keep me posted\" box on the request form and you'll be the first to know.",
  },
  {
    q: "How do I join the team?",
    a: "Sarina is building a per-diem team of IV-certified RNs in LA County. Fill out the short form at the bottom of this page.",
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
    <section id="faq" className="py-16 md:py-24 bg-[color:var(--secondary)]">
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

// ─── Nurse Form ───────────────────────────────────────────────────────────
const AVAIL_OPTIONS = ["Weekdays", "Evenings", "Weekends"] as const;

function NurseForm() {
  const [submitted, setSubmitted] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [ivExp, setIvExp] = useState("");
  const [avail, setAvail] = useState<string[]>([]);
  const [zip, setZip] = useState("");
  const [licenseConfirm, setLicenseConfirm] = useState(false);
  const [contactConsent, setContactConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid =
    firstName.trim() && lastName.trim() && phone.trim() &&
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) &&
    ivExp && avail.length > 0 && /^\d{5}$/.test(zip.trim()) &&
    licenseConfirm && contactConsent;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!valid || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/rn-applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
          email: email.trim(),
          iv_experience: ivExp,
          availability: avail,
          zip: zip.trim(),
          license_confirm: licenseConfirm,
          contact_consent: contactConsent,
        }),
      });
      if (!res.ok) {
        const b = await res.json().catch(() => ({}));
        throw new Error((b as { error?: string }).error || "Something went wrong");
      }
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
    <section id="nurses" className="py-16 md:py-24 bg-[color:var(--background)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] mb-3">
            Nurses: join the team
          </h2>
          <p className="text-[0.95rem] text-[color:var(--muted-foreground)]">
            Per-diem IV work across LA County. Active California RN license required.
          </p>
        </div>

        {submitted ? (
          <div className="bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/20 rounded-2xl p-8 text-center">
            <p className="text-[1.1rem] font-medium text-[color:var(--foreground)] mb-2">Thanks — Sarina will reach out within a week.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8 shadow-sm space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">First name <span className="text-red-500">*</span></label>
                <input type="text" required value={firstName} onChange={(e) => setFirstName(e.target.value)} className={inputClass} placeholder="Sarina" />
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">Last name <span className="text-red-500">*</span></label>
                <input type="text" required value={lastName} onChange={(e) => setLastName(e.target.value)} className={inputClass} placeholder="Deharo" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">Phone <span className="text-red-500">*</span></label>
                <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className={inputClass} placeholder="(310) 555-0100" />
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">Email <span className="text-red-500">*</span></label>
                <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} placeholder="you@email.com" />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">IV experience <span className="text-red-500">*</span></label>
                <select required value={ivExp} onChange={(e) => setIvExp(e.target.value)} className={selectClass}>
                  <option value="">Select…</option>
                  <option>Under 1 year</option>
                  <option>1–3 years</option>
                  <option>3+ years</option>
                </select>
              </div>
              <div>
                <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-1.5">Current home ZIP <span className="text-red-500">*</span></label>
                <input type="text" required value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))} className={inputClass} placeholder="90210" pattern="\d{5}" maxLength={5} />
              </div>
            </div>
            <div>
              <label className="block text-[0.82rem] font-medium text-[color:var(--foreground)] mb-2">Availability <span className="text-red-500">*</span></label>
              <div className="flex flex-wrap gap-3">
                {AVAIL_OPTIONS.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={avail.includes(opt)}
                      onChange={(e) => setAvail(e.target.checked ? [...avail, opt] : avail.filter((v) => v !== opt))}
                      className="w-4 h-4 accent-[#2a9d8f]"
                    />
                    <span className="text-[0.9rem] text-[color:var(--foreground)]">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={licenseConfirm} onChange={(e) => setLicenseConfirm(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2a9d8f] shrink-0" />
              <span className="text-[0.85rem] text-[color:var(--muted-foreground)] leading-snug">
                I hold an active California RN license. <span className="text-red-500">*</span>
              </span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" required checked={contactConsent} onChange={(e) => setContactConsent(e.target.checked)} className="mt-1 w-4 h-4 accent-[#2a9d8f] shrink-0" />
              <span className="text-[0.85rem] text-[color:var(--muted-foreground)] leading-snug">
                I agree to be contacted about per-diem work. <span className="text-red-500">*</span>
              </span>
            </label>
            {error && <p className="text-red-500 text-[0.85rem]">{error}</p>}
            <button
              type="submit"
              disabled={!valid || loading}
              className="w-full bg-[color:var(--primary)] text-white py-3.5 rounded-full font-semibold text-[1rem] hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Sending…" : "Submit"}
            </button>
          </form>
        )}
      </div>
    </section>
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
        <WhatsInTheBag />
        <HowItWorks />
        <WhySarina />
        <RequestForm />
        <FAQ />
        <NurseForm />
      </main>
      <Footer />
    </>
  );
}
