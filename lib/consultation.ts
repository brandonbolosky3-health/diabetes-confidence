import type { SupabaseClient } from "@supabase/supabase-js";
import type { ConsultationForm, ConsultationFormInput } from "@/types/consultation";

export async function saveConsultationForm(
  supabase: SupabaseClient,
  memberId: string,
  data: Omit<ConsultationFormInput, "member_id">
): Promise<ConsultationForm> {
  const { data: form, error } = await supabase
    .from("consultation_forms")
    .insert({ ...data, member_id: memberId, status: "submitted" })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return form as ConsultationForm;
}

export async function getMemberConsultationForm(
  supabase: SupabaseClient,
  memberId: string
): Promise<ConsultationForm | null> {
  const { data, error } = await supabase
    .from("consultation_forms")
    .select("*")
    .eq("member_id", memberId)
    .order("submitted_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw new Error(error.message);
  return data as ConsultationForm | null;
}

export async function hasSubmittedConsultationForm(
  supabase: SupabaseClient,
  memberId: string
): Promise<boolean> {
  const { count, error } = await supabase
    .from("consultation_forms")
    .select("*", { count: "exact", head: true })
    .eq("member_id", memberId)
    .eq("status", "submitted");

  if (error) return false;
  return (count ?? 0) > 0;
}

export async function getAllConsultationForms(
  supabase: SupabaseClient
): Promise<ConsultationForm[]> {
  const { data, error } = await supabase
    .from("consultation_forms")
    .select("*")
    .order("submitted_at", { ascending: false });

  if (error) throw new Error(error.message);
  return (data ?? []) as ConsultationForm[];
}
