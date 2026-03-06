"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const onSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) return setMessage(error.message);

    setMessage("✅ Check your email to confirm your account.");
    // router.push("/login"); // optional
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Create account</h1>
      <p style={{ opacity: 0.8 }}>Sign up to access the membership.</p>

      <form onSubmit={onSignup} style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ padding: 12, borderRadius: 10 }}
        />
        <input
          placeholder="Password (min 6)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          minLength={6}
          style={{ padding: 12, borderRadius: 10 }}
        />

        <button
          disabled={loading}
          style={{ padding: 12, borderRadius: 10, fontWeight: 700 }}
        >
          {loading ? "Creating..." : "Sign up"}
        </button>

        {message && <div style={{ marginTop: 6 }}>{message}</div>}
      </form>

      <div style={{ marginTop: 18, opacity: 0.8 }}>
        Already have an account? <a href="/login">Log in</a>
      </div>
    </div>
  );
}
