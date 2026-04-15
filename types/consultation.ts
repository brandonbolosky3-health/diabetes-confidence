export interface ConsultationForm {
  id: string;
  member_id: string;
  appointment_id: string | null;
  submitted_at: string;
  status: "pending" | "submitted";

  // Personal info
  full_name: string;
  date_of_birth: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  how_did_you_hear: string;
  occupation: string;
  is_pregnant: boolean | null;

  // Symptoms
  symptom_headache: boolean;
  symptom_knee_pain: boolean;
  symptom_back_neck_pain: boolean;
  symptom_arthritis: boolean;
  symptom_digestion: boolean;
  symptom_cardiovascular: boolean;
  symptom_hypertension: boolean;
  symptom_anxiety_depression: boolean;
  symptom_diabetes: boolean;
  symptom_memory_decline: boolean;
  symptom_fatigue: boolean;
  symptom_breathing: boolean;
  symptom_sleep: boolean;
  symptom_nerve_pain_neuropathy: boolean;
  symptom_skin_issue: boolean;
  symptom_other_joint_pain: string | null;
  symptom_other_conditions: string | null;

  // Chief complaint
  worst_symptom: string;
  condition_duration: string;
  condition_frequency: string;
  pain_scale: number | null;
  what_has_not_helped: string;
  life_in_3_years_if_worse: string;
  life_if_resolved: string;

  // Quality of life - suffering
  suffer_irritability: boolean;
  suffer_interrupted_sleep: boolean;
  suffer_restricted_activity: boolean;
  suffer_mood_disorder: boolean;
  suffer_fatigue: boolean;
  suffer_decline_in_activity: boolean;

  // Quality of life - impact
  impact_family_social: boolean;
  impact_work_income: boolean;
  impact_productivity_household: boolean;
  impact_exercise_sports: boolean;
  impact_hobbies: boolean;
}

export type ConsultationFormInput = Omit<
  ConsultationForm,
  "id" | "submitted_at" | "status" | "appointment_id"
>;

export const SYMPTOMS_LIST: { key: string; label: string }[] = [
  { key: "symptom_headache", label: "Headache" },
  { key: "symptom_knee_pain", label: "Knee Pain" },
  { key: "symptom_back_neck_pain", label: "Back / Neck Pain" },
  { key: "symptom_arthritis", label: "Arthritis" },
  { key: "symptom_digestion", label: "Digestive Issues" },
  { key: "symptom_cardiovascular", label: "Cardiovascular" },
  { key: "symptom_hypertension", label: "Hypertension" },
  { key: "symptom_anxiety_depression", label: "Anxiety / Depression" },
  { key: "symptom_diabetes", label: "Diabetes" },
  { key: "symptom_memory_decline", label: "Memory Decline" },
  { key: "symptom_fatigue", label: "Fatigue" },
  { key: "symptom_breathing", label: "Breathing Issues" },
  { key: "symptom_sleep", label: "Sleep Issues" },
  { key: "symptom_nerve_pain_neuropathy", label: "Nerve Pain / Neuropathy" },
  { key: "symptom_skin_issue", label: "Skin Issues" },
];

export const SUFFERING_LIST: { key: string; label: string }[] = [
  { key: "suffer_irritability", label: "Irritability" },
  { key: "suffer_interrupted_sleep", label: "Interrupted Sleep" },
  { key: "suffer_restricted_activity", label: "Restricted Activity" },
  { key: "suffer_mood_disorder", label: "Mood Disorder" },
  { key: "suffer_fatigue", label: "Fatigue" },
  { key: "suffer_decline_in_activity", label: "Decline in Activity" },
];

export const IMPACT_LIST: { key: string; label: string }[] = [
  { key: "impact_family_social", label: "Family / Social Life" },
  { key: "impact_work_income", label: "Work / Income" },
  { key: "impact_productivity_household", label: "Productivity / Household" },
  { key: "impact_exercise_sports", label: "Exercise / Sports" },
  { key: "impact_hobbies", label: "Hobbies" },
];
