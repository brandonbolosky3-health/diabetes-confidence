"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, Check, ArrowRight } from "lucide-react";
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
          <Link href="/iv" className="hover:text-[color:var(--foreground)] transition-colors">IV hydration</Link>
          <Link href="/about" className="text-[color:var(--primary)] font-medium hover:opacity-80 transition-opacity">About Sarina</Link>
        </nav>
        <div className="flex items-center gap-3">
          <Link
            href="/iv#request"
            className="hidden md:inline-flex items-center bg-[color:var(--primary)] text-white text-[0.8rem] px-4 py-1.5 rounded-full hover:opacity-90 transition-opacity whitespace-nowrap font-semibold"
          >
            Request appointment
          </Link>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-[color:var(--foreground)] p-1" aria-label="Toggle menu">
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[color:var(--border)] bg-white px-4 py-4 flex flex-col gap-3">
          <Link href="/iv#request" onClick={() => setMobileOpen(false)} className="bg-[color:var(--primary)] text-white text-[0.9rem] font-semibold text-center py-2.5 rounded-full hover:opacity-90 transition-opacity">
            Request appointment
          </Link>
          <Link href="/iv" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">IV hydration</Link>
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--primary)] font-medium py-2">About Sarina</Link>
        </div>
      )}
    </header>
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
        {IV_MODE ? (
          <>
            <p className="mb-2 max-w-2xl mx-auto text-white/40 text-[0.75rem] leading-relaxed">
              Sarina Deharo, RN, provides IV therapy as an independent provider on the June Skin platform. Treatments are ordered by June Skin's affiliated medical practice after a health-history review and administered by licensed nurses. Pricing is set by June Skin and subject to change. Saryn Health is not a medical practice and is not affiliated with June Skin. This page is for general information and is not medical advice; results vary.
            </p>
            <p className="mb-1">
              <Link href="/about" className="hover:text-white/80 transition-colors">About Sarina</Link>
            </p>
          </>
        ) : (
          <p className="mb-1">Saryn Health — Functional medicine education &amp; coaching, personalized to you.</p>
        )}
        <p>© {new Date().getFullYear()} Saryn Health. All rights reserved.</p>
      </div>
    </footer>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────
const CREDENTIALS = [
  "Registered Nurse (RN) — 20+ years clinical practice",
  "Certified Functional Medicine Practitioner",
  "Specialized in diabetes & pre-diabetes management",
  "Trained in functional nutrition & lifestyle medicine",
];

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[color:var(--background)]">
        <section className="py-16 md:py-24">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <div className="flex justify-center mb-10">
              <div
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl overflow-hidden shadow-lg"
                style={{ boxShadow: "0 8px 32px rgba(42, 157, 143, 0.15)" }}
              >
                <Image src="/hero-photo.jpg" alt="Sarina Deharo, RN" fill className="object-cover" priority />
              </div>
            </div>

            <div className="text-center mb-10">
              <p className="text-[1.35rem] md:text-[1.5rem] font-medium tracking-tight text-[color:var(--foreground)]">
                Sarina Deharo
              </p>
              <p className="mt-1 text-[0.9rem] text-[color:var(--muted-foreground)]">
                Registered Nurse · Certified Functional Medicine Practitioner
              </p>
            </div>

            <div className="space-y-4 text-[1rem] text-[color:var(--muted-foreground)] leading-relaxed mb-10">
              <p>
                With 20+ years as an RN and Certified Functional Medicine Practitioner, Sarina helps patients move beyond symptoms to discover the root causes behind their chronic health struggles.
              </p>
              {IV_MODE ? (
                <p>She currently offers at-home IV hydration across Los Angeles County.</p>
              ) : (
                <>
                  <p>
                    My name is Sarina Deharo and I am a Certified Functional Medicine Practitioner and Registered Nurse with over 20 years of clinical experience. My clinical focus is on diabetes management.
                  </p>
                  <p>
                    I have additional training in functional nutrition, lifestyle medicine, and therapeutic nutrition protocols including anti-inflammatory and root-cause-based dietary approaches.
                  </p>
                  <p>
                    I am very passionate about helping patients with chronic conditions — especially diabetes including pre-diabetes — to make meaningful dietary and lifestyle changes that help reduce inflammation, restore function, and lower the risk of progressive chronic disease.
                  </p>
                  <p>
                    My approach goes beyond symptom management. I use nutrient therapy and personalized care plans to understand why your body is struggling — and build a path to lasting health that is tailored specifically to your body's own needs.
                  </p>
                </>
              )}
            </div>

            <div className="space-y-3 mb-12">
              {CREDENTIALS.map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <Check className="w-5 h-5 text-[color:var(--primary)] mt-0.5 shrink-0" />
                  <span className="text-[0.95rem] text-[color:var(--foreground)] font-medium">{item}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/iv#request"
                className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-7 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
              >
                Request an appointment <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
