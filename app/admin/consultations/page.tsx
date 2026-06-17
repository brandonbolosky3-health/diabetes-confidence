import { createAdminClient } from "@/lib/supabase-admin";
import ConsultationsClient, { type FormRow } from "./ConsultationsClient";

export default async function ConsultationsAdminPage() {
  const supabase = createAdminClient();
  const { data } = await supabase
    .from("consultation_forms")
    .select("*")
    .order("submitted_at", { ascending: false });

  return <ConsultationsClient rows={(data ?? []) as FormRow[]} />;
}
