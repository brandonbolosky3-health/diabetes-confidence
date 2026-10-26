import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: true, follow: true },
  title: "About Sarina Deharo, RN | Saryn Health",
  description:
    "Sarina Deharo is a Registered Nurse with 20+ years of clinical experience and a Certified Functional Medicine Practitioner. She offers at-home IV hydration across Los Angeles County.",
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
