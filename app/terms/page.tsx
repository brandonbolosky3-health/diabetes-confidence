"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Logo from "@/components/Logo";

function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-[color:var(--border)]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/iv" aria-label="Saryn Health home" className="inline-flex items-center">
          <Logo className="h-7 w-auto text-[color:var(--foreground)]" />
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-[0.9rem] text-[color:var(--muted-foreground)]">
          <Link href="/iv" className="hover:text-[color:var(--foreground)] transition-colors">IV hydration</Link>
          <Link href="/about" className="hover:text-[color:var(--foreground)] transition-colors">About Sarina</Link>
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
          <Link href="/about" onClick={() => setMobileOpen(false)} className="text-[0.95rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors py-2">About Sarina</Link>
        </div>
      )}
    </header>
  );
}

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

const EMAIL = "sarina@sarynhealth.com";

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[color:var(--background)]">
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] mb-2">Terms of use</h1>
          <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mb-10">Effective October 26, 2026</p>

          <p className="text-[color:var(--muted-foreground)] leading-relaxed mb-6">By using sarynhealth.com (the &ldquo;Site&rdquo;), you agree to these terms. If you don&apos;t agree, please don&apos;t use the Site. The Site is operated by Saryn Health (&ldquo;Saryn Health,&rdquo; &ldquo;we,&rdquo; &ldquo;us&rdquo;).</p>

          {[
            {
              heading: "The Site is informational",
              body: "Content on the Site is for general information only. It is not medical advice, and it is not a treatment plan or a diagnostic plan. Using the Site does not create a nurse-patient or provider-patient relationship with Sarina Deharo or Saryn Health. Always consult a licensed healthcare provider about your own situation. If you are experiencing a medical emergency, call 911.",
            },
            {
              heading: "IV hydration services",
              body: "IV hydration treatments described on the Site are provided through June Skin and its affiliated medical practices, where Sarina Deharo, RN, participates as an independent provider. Those services are governed by June Skin's own terms, consent forms, and policies, which you'll review when you book. Eligibility for any treatment is determined by a licensed provider after a health review; submitting a request on the Site does not guarantee you will be treated.",
            },
            {
              heading: "Requests are not bookings",
              body: "Submitting the request form tells us you're interested and asks us to contact you. It does not reserve a time, create an appointment, or form a contract for services. Appointments are made separately through the booking link we send you.",
            },
            {
              heading: "Pricing",
              body: "Prices shown on the Site are set by June Skin and are subject to change without notice. The price you pay is the price shown at the time of booking on their platform. Promotional codes are subject to their terms.",
            },
            {
              heading: "Eligibility and accuracy",
              body: "You must be at least 18 to use the Site or submit a request. You agree that the information you provide is accurate and that you have the right to provide it.",
            },
            {
              heading: "Acceptable use",
              body: "You agree not to misuse the Site, including by submitting false requests, attempting to access other users' information, interfering with the Site's operation, or using automated tools to scrape or submit forms.",
            },
            {
              heading: "Intellectual property",
              body: "The Site's content, design, and branding belong to Saryn Health or its licensors. June Skin and related marks belong to their owners. You may not copy or reuse Site content without permission.",
            },
            {
              heading: "Third-party links",
              body: "The Site may link to third-party sites, including June Skin. We are not responsible for their content or practices.",
            },
            {
              heading: "No warranties",
              body: "The Site is provided \"as is.\" We do not guarantee it will be error-free, uninterrupted, or that information on it is complete or current.",
            },
            {
              heading: "Limitation of liability",
              body: "To the fullest extent permitted by law, Saryn Health and its owners, officers, and contractors are not liable for any indirect, incidental, or consequential damages arising from your use of the Site. Nothing in these terms limits liability that cannot be limited under applicable law, and nothing here limits or alters your rights or remedies regarding medical services, which are governed by the provider's own terms.",
            },
            {
              heading: "Governing law",
              body: "These terms are governed by the laws of the State of California, and any dispute will be resolved in the state or federal courts located in Los Angeles County.",
            },
            {
              heading: "Changes",
              body: "We may update these terms. The effective date at the top will change when we do. Continued use of the Site means you accept the updated terms.",
            },
          ].map(({ heading, body }) => (
            <div key={heading} className="mt-10">
              <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mb-3">{heading}</h2>
              <p className="text-[color:var(--muted-foreground)] leading-relaxed">{body}</p>
            </div>
          ))}

          <div className="mt-10">
            <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mb-3">Contact</h2>
            <p className="text-[color:var(--muted-foreground)]">
              <a href={`mailto:${EMAIL}`} className="text-[color:var(--primary)] hover:opacity-80">{EMAIL}</a>
            </p>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}
