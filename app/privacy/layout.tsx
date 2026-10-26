import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Saryn Health",
  description: "How Saryn Health collects, uses, and protects your personal information.",
  robots: { index: true, follow: true },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
