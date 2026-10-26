import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "At-home IV hydration in Los Angeles | Sarina Deharo, RN",
  description:
    "Mobile IV hydration delivered anywhere in LA County by a registered nurse with 20+ years of experience. Request an appointment in 30 seconds.",
  openGraph: {
    title: "At-home IV hydration in Los Angeles | Sarina Deharo, RN",
    description:
      "Mobile IV hydration delivered anywhere in LA County by a registered nurse with 20+ years of experience. Request an appointment in 30 seconds.",
    siteName: "Saryn Health",
  },
};

export default function IVLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
