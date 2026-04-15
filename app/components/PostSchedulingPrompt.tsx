"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardCheck, ArrowRight, X } from "lucide-react";

export default function PostSchedulingPrompt({
  consultationFormUrl = "/consultation-form",
}: {
  consultationFormUrl?: string;
}) {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  return (
    <div className="rounded-2xl border border-[color:var(--border)] bg-white p-6 border-l-4 border-l-[color:var(--primary)] relative">
      <button
        onClick={() => setVisible(false)}
        className="absolute top-3 right-3 text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
        aria-label="Dismiss"
      >
        <X className="w-4 h-4" />
      </button>

      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center shrink-0">
          <ClipboardCheck className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <div className="flex-1">
          <h3
            className="text-[1rem] text-[color:var(--foreground)] mb-1"
            style={{ fontWeight: 600 }}
          >
            One More Step Before Your Call
          </h3>
          <p className="text-[0.875rem] text-[color:var(--muted-foreground)] leading-relaxed mb-4">
            Please complete your pre-consultation form so your practitioner can
            review your health history before your appointment.
          </p>
          <Link
            href={consultationFormUrl}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[color:var(--primary)] text-white text-[0.85rem] font-semibold hover:opacity-90 transition-opacity"
          >
            Complete Pre-Consultation Form
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
