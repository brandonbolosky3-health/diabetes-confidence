import { SupabaseClient } from "@supabase/supabase-js";
import { sendOnboardingCompleteEmail } from "@/lib/email";

// ─── Types ───────────────────────────────────────────────────────────────────

export interface OnboardingAnswers {
  primary_goal: string;
  biggest_challenge: string;
  diagnoses: string[];
  lab_status: string;
  diet_baseline: string;
  interest_tags: string[];
  learning_style: string;
}

export interface MemberProfile {
  user_id: string;
  primary_goal: string;
  biggest_challenge: string;
  diagnoses: string[];
  lab_status: string;
  diet_baseline: string;
  interest_tags: string[];
  learning_style: string;
  primary_track: string;
  secondary_tracks: string[];
  all_tags: string[];
  onboarding_complete: boolean;
}

export interface KnowledgeChunk {
  id: string;
  chunk_title: string;
  doc_title: string;
  primary_track: string;
  content: string;
  reading_time_minutes: number;
  has_blood_sugar_callout: boolean;
  has_clinical_supervision_note: boolean;
  tier_required: string;
  relevance_score?: number;
}

// ─── Track Mapping ───────────────────────────────────────────────────────────

const GOAL_TO_TRACK: Record<string, string> = {
  blood_sugar: "blood_sugar_metabolic",
  diagnosed: "blood_sugar_metabolic",
  optimize: "longevity_optimization",
  inflammation: "inflammation_immune",
  labs: "functional_labs",
  peptides: "peptides_advanced",
  weight: "blood_sugar_metabolic",
};

const GOAL_TO_SECONDARY: Record<string, string[]> = {
  blood_sugar: ["functional_labs", "nutrition_gut"],
  diagnosed: ["functional_labs", "nutrition_gut"],
  optimize: ["peptides_advanced", "functional_labs"],
  inflammation: ["nutrition_gut", "functional_labs"],
  labs: ["blood_sugar_metabolic", "longevity_optimization"],
  peptides: ["longevity_optimization", "functional_labs"],
  weight: ["nutrition_gut", "longevity_optimization"],
};

export const TRACK_LABELS: Record<string, string> = {
  blood_sugar_metabolic: "Blood Sugar & Metabolic Health",
  functional_labs: "Functional Labs & Biomarkers",
  nutrition_gut: "Nutrition & Gut Health",
  inflammation_immune: "Inflammation & Immune Health",
  longevity_optimization: "Longevity & Optimization",
  peptides_advanced: "Peptides & Advanced Protocols",
};

// ─── Profile Builder ─────────────────────────────────────────────────────────

export function buildMemberProfile(answers: OnboardingAnswers): Omit<MemberProfile, "user_id"> {
  const primary_track = GOAL_TO_TRACK[answers.primary_goal] || "blood_sugar_metabolic";
  const secondary_tracks = GOAL_TO_SECONDARY[answers.primary_goal] || [];

  const all_tags = [
    answers.primary_goal,
    answers.biggest_challenge,
    ...answers.diagnoses,
    answers.lab_status,
    answers.diet_baseline,
    ...answers.interest_tags,
    answers.learning_style,
    primary_track,
    ...secondary_tracks,
  ].filter(Boolean);

  return {
    ...answers,
    primary_track,
    secondary_tracks,
    all_tags: [...new Set(all_tags)],
    onboarding_complete: true,
  };
}

// ─── Supabase Operations ─────────────────────────────────────────────────────

export async function saveOnboardingProfile(
  supabase: SupabaseClient,
  userId: string,
  answers: OnboardingAnswers
) {
  const profile = buildMemberProfile(answers);

  const payload = { user_id: userId, ...profile };
  console.log("Saving onboarding profile payload:", JSON.stringify(payload, null, 2));

  const { error } = await supabase
    .from("member_profiles")
    .upsert(payload, { onConflict: "user_id" });

  if (error) {
    console.error("Supabase upsert error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    throw new Error(`${error.message}${error.hint ? ` (${error.hint})` : ""}${error.code ? ` [${error.code}]` : ""}`);
  }

  // Send onboarding complete email
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      const firstName =
        user.user_metadata?.first_name ||
        user.email.split("@")[0].charAt(0).toUpperCase() +
          user.email.split("@")[0].slice(1);
      const topInterests = answers.interest_tags.slice(0, 3);
      sendOnboardingCompleteEmail(
        user.email,
        firstName,
        profile.primary_track,
        topInterests
      ).catch(() => {});
    }
  } catch {
    // email is non-critical
  }

  return profile;
}

export async function getPersonalizedChunks(
  supabase: SupabaseClient,
  userId: string,
  limit: number = 9
): Promise<KnowledgeChunk[]> {
  const { data, error } = await supabase.rpc("get_personalized_chunks", {
    p_user_id: userId,
    p_limit: limit,
  });

  if (error) throw error;
  return data || [];
}

export async function markChunkViewed(
  supabase: SupabaseClient,
  userId: string,
  chunkId: string
) {
  const { error } = await supabase
    .from("member_education_progress")
    .upsert(
      {
        user_id: userId,
        chunk_id: chunkId,
        viewed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,chunk_id" }
    );

  if (error) throw error;
}

// ─── AI Coach Prompt Builder ─────────────────────────────────────────────────

export function buildAICoachSystemPrompt(
  profile: MemberProfile,
  chunks: KnowledgeChunk[]
): string {
  const trackLabel = TRACK_LABELS[profile.primary_track] || profile.primary_track;
  const chunkSummaries = chunks
    .map((c) => `- ${c.chunk_title} (${c.doc_title}): ${c.content.slice(0, 200)}...`)
    .join("\n");

  return `You are a supportive, knowledgeable AI health coach for Saryn Health, a diabetes education platform led by a Registered Nurse diabetes educator with 15+ years of experience.

## Member Profile
- Primary goal: ${profile.primary_goal}
- Biggest challenge: ${profile.biggest_challenge}
- Diagnoses: ${profile.diagnoses.join(", ") || "None reported"}
- Lab status: ${profile.lab_status}
- Diet baseline: ${profile.diet_baseline}
- Learning style: ${profile.learning_style}
- Primary track: ${trackLabel}

## Relevant Educational Context
${chunkSummaries || "No specific context chunks available."}

## Instructions
- Be warm, encouraging, and evidence-based
- Tailor responses to the member's profile, goals, and learning style
- Reference relevant educational content when applicable
- Never diagnose conditions or replace medical advice
- Encourage members to work with their healthcare provider
- Keep responses concise and actionable
- If asked about topics outside your scope, gently redirect to their healthcare provider`;
}
