"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV = [
  { href: "/admin", label: "Members" },
  { href: "/admin/consultations", label: "Intakes" },
];

export default function AdminNav() {
  const pathname = usePathname();
  return (
    <nav className="flex items-center gap-1 ml-3">
      {NAV.map((n) => {
        const active =
          n.href === "/admin" ? pathname === "/admin" : pathname.startsWith(n.href);
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`px-3 py-1 rounded-full text-[0.8rem] font-medium transition-colors ${
              active
                ? "bg-[color:var(--primary)] text-white"
                : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
            }`}
          >
            {n.label}
          </Link>
        );
      })}
    </nav>
  );
}
