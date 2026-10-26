import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Use | Saryn Health",
  description: "Terms and conditions for using sarynhealth.com.",
  robots: { index: true, follow: true },
};

export default function TermsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
