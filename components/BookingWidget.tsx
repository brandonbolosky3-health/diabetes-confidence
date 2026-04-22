"use client";

import { useState } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";

interface BookingWidgetProps {
  clientName?: string;
  clientEmail?: string;
}

export default function BookingWidget({ clientName, clientEmail }: BookingWidgetProps) {
  const [confirming, setConfirming] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleConfirm() {
    setConfirming(true);
    setError(null);
    try {
      const res = await fetch("/api/consultation/confirm", { method: "POST" });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.error || "Failed to confirm booking");
      }
      setConfirmed(true);
      router.refresh();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Something went wrong";
      setError(msg);
    } finally {
      setConfirming(false);
    }
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border border-neutral-200 bg-white p-4 md:p-6 overflow-hidden">
        {/* Practice Better Booking Widget: start */}
        <style>{`.better-inline-booking-widget{position:relative;overflow:hidden}.better-inline-booking-widget iframe{position:absolute;top:0;left:0;width:100%;height:100%}`}</style>
        <div
          className="better-inline-booking-widget"
          data-url="https://my.practicebetter.io"
          data-service="69e027063012d9e8a637ea96"
          data-hash="69e023653012d9e8a6379a04"
          data-theme="2a9d8f"
          data-theme-accent="1a1a1a"
          data-client-name={clientName}
          data-client-email={clientEmail}
          style={{ width: "100%", maxWidth: "800px", height: "800px" }}
          data-scrollbar-visible="false"
        />
        <Script
          src="https://cdn.practicebetter.io/assets/js/booking.widget.js"
          strategy="afterInteractive"
        />
        {/* Practice Better Booking Widget: end */}
      </div>

      <div className="mt-6 rounded-lg border border-neutral-200 bg-neutral-50 p-4 md:p-6">
        <p className="text-sm text-neutral-700">
          Once you&apos;ve booked your session above, confirm below so we can mark your complimentary consultation as used.
        </p>
        <button
          type="button"
          onClick={handleConfirm}
          disabled={confirming || confirmed}
          className="mt-4 inline-flex items-center justify-center rounded-md bg-[#2a9d8f] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#248577] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {confirmed ? "Confirmed ✓" : confirming ? "Confirming..." : "I've booked my session — confirm"}
        </button>
        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
      </div>
    </div>
  );
}
