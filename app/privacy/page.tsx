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

const ENTITY = "Saryn Health";
const EMAIL = "sarina@sarynhealth.com";

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[color:var(--background)]">
        <article className="max-w-2xl mx-auto px-4 sm:px-6 py-16 md:py-24 prose prose-neutral prose-headings:font-medium prose-headings:tracking-tight prose-headings:text-[color:var(--foreground)] prose-p:text-[color:var(--muted-foreground)] prose-li:text-[color:var(--muted-foreground)] prose-strong:text-[color:var(--foreground)] max-w-none">
          <h1 className="text-[1.75rem] md:text-[2.25rem] font-medium tracking-tight text-[color:var(--foreground)] mb-2">Privacy policy</h1>
          <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mb-10">Effective October 26, 2026</p>

          <p>Saryn Health (&ldquo;we,&rdquo; &ldquo;us&rdquo;) operates sarynhealth.com. This policy explains what we collect, how we use it, and your choices. {ENTITY} is the business behind Saryn Health.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">What we collect</h2>
          <p><strong>Information you give us.</strong> When you submit the IV hydration request form, we collect your first name, phone number, email address, ZIP code, the drip you&apos;re interested in, your preferred timing, how you heard about us, and the date and time you gave consent to be contacted. If you create an account or book a consultation elsewhere on the site, we collect the information you enter there.</p>
          <p><strong>Information collected automatically.</strong> Like most websites, we collect basic technical information such as your IP address, browser type, device type, pages visited, and referring site. We may use cookies or similar tools for site functionality and analytics.</p>
          <p><strong>Payment information.</strong> If you pay for anything through this site, payments are processed by Stripe. We do not store your card number.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">What we do not collect here</h2>
          <p>This website does not collect health or medical information. IV hydration treatments are provided through June Skin and its affiliated medical practices. Any health questionnaire, consent form, treatment record, or payment for IV services is collected and held by them under their own privacy policy, not by us. This website is not a medical record and we are not your healthcare provider.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">How we use your information</h2>
          <ul className="space-y-1 text-[color:var(--muted-foreground)] list-disc list-inside">
            <li>To respond to your request, including by text message, phone call, or email</li>
            <li>To coordinate your appointment and send you your booking link</li>
            <li>To operate, secure, and improve the site</li>
            <li>To comply with legal obligations</li>
          </ul>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Text messages</h2>
          <p>When you check the consent box on our request form, you agree that we may contact you by text message at the number you provided about your request. Message and data rates may apply. Message frequency varies. Reply STOP to opt out at any time or HELP for help. Consent is not a condition of receiving services.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">How we share information</h2>
          <p>We do not sell your personal information. We share it only with:</p>
          <ul className="space-y-2 text-[color:var(--muted-foreground)] list-disc list-inside">
            <li><strong>Service providers</strong> that help us run the site, such as hosting (Vercel), database (Supabase), email delivery (Resend), payment processing (Stripe), and analytics, under agreements that limit how they use it</li>
            <li><strong>June Skin</strong>, limited to your name and contact details, so your booking and health review can be set up on their platform</li>
            <li><strong>Legal and safety purposes</strong>, if required by law or to protect rights, safety, or property</li>
          </ul>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Retention</h2>
          <p>We keep request-form information for as long as needed to respond to your request and for reasonable business records, and delete or anonymize it when no longer needed.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Security</h2>
          <p>We use reasonable technical and organizational measures to protect your information. No method of transmission or storage is completely secure.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Your choices</h2>
          <p>You may ask us to access, correct, or delete the personal information we hold about you, or to stop contacting you, by emailing <a href={`mailto:${EMAIL}`} className="text-[color:var(--primary)] hover:opacity-80">{EMAIL}</a>. We will respond within a reasonable time. California residents may have additional rights under California law, including the right to know what we collect and to request deletion; we honor these requests and do not discriminate for exercising them.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Do Not Track</h2>
          <p>Our site does not currently respond to browser &ldquo;Do Not Track&rdquo; signals.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Children</h2>
          <p>This site is intended for adults 18 and over. We do not knowingly collect information from anyone under 18.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Changes</h2>
          <p>We may update this policy from time to time. We&apos;ll post the new effective date at the top of this page.</p>

          <h2 className="text-[1.2rem] font-medium tracking-tight text-[color:var(--foreground)] mt-10 mb-3">Contact</h2>
          <p><a href={`mailto:${EMAIL}`} className="text-[color:var(--primary)] hover:opacity-80">{EMAIL}</a></p>
        </article>
      </main>
      <Footer />
    </>
  );
}
