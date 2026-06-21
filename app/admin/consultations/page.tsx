import { createAdminClient } from "@/lib/supabase-admin";
import ConsultationsClient, { type IntakeRow } from "./ConsultationsClient";

export default async function ConsultationsAdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("consultation_intakes")
    .select("*")
    .order("created_at", { ascending: false });

  return <ConsultationsClient initialRows={(data ?? []) as IntakeRow[]} />;
}
