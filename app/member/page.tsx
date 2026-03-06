"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function MemberPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) router.push("/login");
      else setEmail(data.user.email ?? null);
    };
    run();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  return (
    <div style={{ maxWidth: 900, margin: "60px auto", padding: 20 }}>
      <h1 style={{ fontSize: 28, fontWeight: 800 }}>Member Dashboard</h1>
      <p style={{ opacity: 0.8 }}>Logged in as: {email ?? "..."}</p>

      <div style={{ marginTop: 20, display: "flex", gap: 12 }}>
        <a href="/ai" style={{ padding: 12, borderRadius: 10, border: "1px solid #333" }}>
          Go to AI Coach
        </a>
        <button onClick={logout} style={{ padding: 12, borderRadius: 10, fontWeight: 700 }}>
          Log out
        </button>
      </div>
    </div>
  );
}
