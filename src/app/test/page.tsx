"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestPage() {
  const [status, setStatus] = useState("Checking Supabase connection...");

  useEffect(() => {
    const run = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) setStatus("❌ Supabase error: " + error.message);
        else setStatus("✅ Connected to Supabase (session fetched)");
      } catch (e: any) {
        setStatus("❌ Client exception: " + e?.message);
      }
    };

    run();
  }, []);

  return (
    <main className="p-8">
      <h1 className="text-2xl font-semibold">Supabase Test</h1>
      <p className="mt-4">{status}</p>
    </main>
  );
}
