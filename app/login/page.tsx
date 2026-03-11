"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);
    if (error) return setMessage(error.message);
    router.push("/member");
  };

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Nav */}
      <header className="h-16 flex items-center px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95">
        <Link href="/" className="flex items-center gap-2" style={{ fontWeight: 700 }}>
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">DiabetesConfidence</span>
        </Link>
      </header>

      {/* Card */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-white rounded-2xl border border-[color:var(--border)] shadow-sm p-8">
          <h1 className="text-[1.75rem] text-[color:var(--foreground)] mb-1" style={{ fontWeight: 700 }}>
            Welcome back
          </h1>
          <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mb-8">
            Log in to access your membership.
          </p>

          <form onSubmit={onLogin} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] text-[color:var(--foreground)]" style={{ fontWeight: 500 }}>
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 transition"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[0.85rem] text-[color:var(--foreground)]" style={{ fontWeight: 500 }}>
                Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-[color:var(--border)] bg-[color:var(--background)] text-[color:var(--foreground)] text-[0.95rem] outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 transition"
              />
            </div>

            {message && (
              <div className="text-[0.875rem] text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-full bg-[color:var(--primary)] text-white text-[0.95rem] hover:opacity-90 transition-opacity disabled:opacity-60 mt-2"
              style={{ fontWeight: 600 }}
            >
              {loading ? "Logging in…" : "Log in"}
            </button>
          </form>

          <p className="text-center text-[0.875rem] text-[color:var(--muted-foreground)] mt-6">
            No account yet?{" "}
            <Link href="/signup" className="text-[color:var(--primary)] hover:underline" style={{ fontWeight: 500 }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
