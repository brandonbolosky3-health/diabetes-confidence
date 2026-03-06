"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

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

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) return setMessage(error.message);

    router.push("/member");
  };

  return (
    <div style={{ maxWidth: 420, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 700 }}>Welcome back</h1>
      <p style={{ opacity: 0.8 }}>Log in to continue.</p>

      <form onSubmit={onLogin} style={{ display: "grid", gap: 12, marginTop: 20 }}>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          required
          style={{ padding: 12, borderRadius: 10 }}
        />
        <input
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          required
          style={{ padding: 12, borderRadius: 10 }}
        />

        <button
          disabled={loading}
          style={{ padding: 12, borderRadius: 10, fontWeight: 700 }}
        >
          {loading ? "Logging in..." : "Log in"}
        </button>

        {message && <div style={{ marginTop: 6 }}>{message}</div>}
      </form>

      <div style={{ marginTop: 18, opacity: 0.8 }}>
        No account yet? <a href="/signup">Sign up</a>
      </div>
    </div>
  );
}
