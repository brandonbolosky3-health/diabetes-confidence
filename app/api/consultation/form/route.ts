import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { sendConsultationFormSubmittedEmail } from "@/lib/email";

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Whitelist of columns we accept verbatim from the client. Mirrors the
// shape the in-page wizard already uses, so the same form can submit to
// either the auth'd Supabase client (for members) or this route (for
// anonymous leads) without reshaping.
const STRING_FIELDS = [
  "full_name",
  "date_of_birth",
  "phone",
  "email",
  "address",
  "city",
  "state",
  "zip",
  "how_did_you_hear",
  "occupation",
  "symptom_other_joint_pain",
  "symptom_other_conditions",
  "worst_symptom",
  "condition_duration",
  "condition_frequency",
  "what_has_not_helped",
  "life_in_3_years_if_worse",
  "life_if_resolved",
] as const;

const BOOL_FIELDS = [
  "symptom_headache",
  "symptom_knee_pain",
  "symptom_back_neck_pain",
  "symptom_arthritis",
  "symptom_digestion",
  "symptom_cardiovascular",
  "symptom_hypertension",
  "symptom_anxiety_depression",
  "symptom_diabetes",
  "symptom_memory_decline",
  "symptom_fatigue",
  "symptom_breathing",
  "symptom_sleep",
  "symptom_nerve_pain_neuropathy",
  "symptom_skin_issue",
  "suffer_irritability",
  "suffer_interrupted_sleep",
  "suffer_restricted_activity",
  "suffer_mood_disorder",
  "suffer_fatigue",
  "suffer_decline_in_activity",
  "impact_family_social",
  "impact_work_income",
  "impact_productivity_household",
  "impact_exercise_sports",
  "impact_hobbies",
] as const;

function asString(value: unknown, max = 5000): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  return trimmed.slice(0, max);
}

function asDateOrNull(value: unknown): string | null {
  const s = asString(value, 32);
  if (!s) return null;
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : null;
}

function asPainScale(value: unknown): number | null {
  const n =
    typeof value === "number"
      ? value
      : typeof value === "string" && /^\d+$/.test(value.trim())
      ? parseInt(value, 10)
      : NaN;
  return Number.isInteger(n) && n >= 1 && n <= 10 ? n : null;
}

function asPregnant(value: unknown): boolean | null {
  if (value === true || value === "yes") return true;
  if (value === false || value === "no") return false;
  return null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const fullName = asString(body.full_name, 200);
  const email = asString(body.email, 200);

  if (!fullName || !email) {
    return NextResponse.json(
      { error: "name and email are required" },
      { status: 400 }
    );
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const row: Record<string, unknown> = {
    member_id: null,
    status: "submitted",
    submitted_at: new Date().toISOString(),
    pain_scale: asPainScale(body.pain_scale),
    is_pregnant: asPregnant(body.is_pregnant),
    date_of_birth: asDateOrNull(body.date_of_birth),
  };

  for (const key of STRING_FIELDS) {
    if (key === "date_of_birth") continue;
    row[key] = asString(body[key]);
  }
  for (const key of BOOL_FIELDS) {
    row[key] = body[key] === true;
  }

  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("consultation_forms")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    console.error("consultation_forms insert failed:", error);
    return NextResponse.json({ error: "failed to save form" }, { status: 500 });
  }

  const collectSelected = (prefix: string, labels: Record<string, string>) =>
    Object.entries(labels)
      .filter(([k]) => row[prefix + k] === true)
      .map(([, label]) => label);

  const symptomLabels: Record<string, string> = {
    symptom_headache: "Headache",
    symptom_knee_pain: "Knee pain / degenerative disease",
    symptom_back_neck_pain: "Lower back or neck pain",
    symptom_arthritis: "Arthritis",
    symptom_digestion: "Digestion symptoms",
    symptom_cardiovascular: "Cardiovascular problems",
    symptom_hypertension: "Hypertension",
    symptom_anxiety_depression: "Anxiety and/or depression",
    symptom_diabetes: "Diabetes",
    symptom_memory_decline: "Forgetfulness or memory decline",
    symptom_fatigue: "Fatigue",
    symptom_breathing: "Breathing problems",
    symptom_sleep: "Sleep problems",
    symptom_nerve_pain_neuropathy: "Nerve pain or neuropathy",
    symptom_skin_issue: "Skin-related issue",
  };
  const sufferLabels: Record<string, string> = {
    suffer_irritability: "Irritability or anger",
    suffer_interrupted_sleep: "Interrupted sleep",
    suffer_restricted_activity: "Restricted daily activity",
    suffer_mood_disorder: "Frustration or mood disorder",
    suffer_fatigue: "Fatigue",
    suffer_decline_in_activity: "Decline in physical activity",
  };
  const impactLabels: Record<string, string> = {
    impact_family_social: "Family or social life",
    impact_work_income: "Work / income",
    impact_productivity_household: "Productivity / household",
    impact_exercise_sports: "Exercise or sports",
    impact_hobbies: "Hobbies",
  };

  sendConsultationFormSubmittedEmail({
    fullName,
    email,
    phone: row.phone as string | null,
    formId: data.id as string,
    symptoms: Object.entries(symptomLabels)
      .filter(([k]) => row[k] === true)
      .map(([, v]) => v),
    suffer: collectSelected("", sufferLabels),
    impact: collectSelected("", impactLabels),
    painScale: row.pain_scale as number | null,
    worstSymptom: row.worst_symptom as string | null,
    duration: row.condition_duration as string | null,
    frequency: row.condition_frequency as string | null,
    whatHasNotHelped: row.what_has_not_helped as string | null,
    lifeIn3YearsIfWorse: row.life_in_3_years_if_worse as string | null,
    lifeIfResolved: row.life_if_resolved as string | null,
    otherJointPain: row.symptom_other_joint_pain as string | null,
    otherConditions: row.symptom_other_conditions as string | null,
    signatureName: asString(body.signature) ?? fullName,
    signatureDate: new Date().toISOString().slice(0, 10),
  }).catch((e) => console.warn("Consultation form email failed:", e));

  return NextResponse.json({ success: true, id: data.id }, { status: 200 });
}
