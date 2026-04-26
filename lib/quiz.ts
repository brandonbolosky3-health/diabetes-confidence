// Quiz definitions and recommendation logic for the public homepage / /quiz funnel.
// Pure: no React, no Supabase. Both the homepage embed and the standalone /quiz
// page render the same Quiz component, which calls getRecommendation() once all
// three questions are answered.

export type Q1Answer =
  | "managing_diabetes"
  | "prediabetic"
  | "optimize";

export type Q2Answer =
  | "blood_sugar"
  | "weight_loss"
  | "energy"
  | "nutrition"
  | "habits"
  | "chronic_symptoms";

export type Q3Answer =
  | "education"
  | "coaching"
  | "advanced_clinical";

export interface QuizAnswers {
  q1: Q1Answer | null;
  q2: Q2Answer[];
  q3: Q3Answer | null;
}

export interface QuizCta {
  label: string;
  href: string;
}

export interface Recommendation {
  headline: string;
  body: string;
  primaryCta: QuizCta;
  secondaryCta: QuizCta;
}

export const Q1_OPTIONS: { id: Q1Answer; label: string }[] = [
  { id: "managing_diabetes", label: "Currently managing diabetes" },
  { id: "prediabetic", label: "Prediabetic or at risk" },
  { id: "optimize", label: "Generally healthy, want to optimize" },
];

export const Q2_OPTIONS: { id: Q2Answer; label: string }[] = [
  { id: "blood_sugar", label: "Blood sugar control" },
  { id: "weight_loss", label: "Weight loss" },
  { id: "energy", label: "More energy" },
  { id: "nutrition", label: "Better nutrition" },
  { id: "habits", label: "Build healthier habits" },
  { id: "chronic_symptoms", label: "Address chronic symptoms" },
];

export const Q3_OPTIONS: { id: Q3Answer; label: string }[] = [
  { id: "education", label: "Education and resources I can use on my own" },
  { id: "coaching", label: "1-on-1 coaching with a practitioner" },
  {
    id: "advanced_clinical",
    label: "Help exploring advanced clinical options (peptides, hormone therapy, advanced labs)",
  },
];

const CONSULTATION_CTA: QuizCta = { label: "Book Free Consultation", href: "/consultation" };
const COOKBOOK_CTA: QuizCta = { label: "Download Free Cookbook", href: "/cookbook" };
const MEMBERSHIP_CTA: QuizCta = { label: "Learn About Membership", href: "/membership" };

// TODO(sarina): Confirm whether the "advanced clinical" branch should mention
// the clinical partner (Regenics) by name. Defaulting to generic phrasing for
// v1 — Sarina handles the referral conversation on the call.
export function getRecommendation(answers: QuizAnswers): Recommendation {
  const { q1, q3 } = answers;

  if (q3 === "advanced_clinical") {
    return {
      headline: "It sounds like you're ready for clinical-grade support.",
      body:
        "Sarina works closely with a trusted clinical partner for medically supervised options. Book a free consultation to discuss whether this path is right for you.",
      primaryCta: CONSULTATION_CTA,
      secondaryCta: COOKBOOK_CTA,
    };
  }

  if ((q1 === "managing_diabetes" || q1 === "prediabetic") && q3 === "coaching") {
    return {
      headline: "A 1-on-1 consultation is your best next step.",
      body:
        "Sarina specializes in diabetes and prediabetes care. Book a free consultation to start with a personalized plan.",
      primaryCta: CONSULTATION_CTA,
      secondaryCta: COOKBOOK_CTA,
    };
  }

  if (q3 === "education") {
    return {
      headline: "Start with our free functional wellness cookbook.",
      body:
        "Anti-inflammatory recipes and meal plans designed for blood sugar balance, gut health, and energy. After that, you can explore Saryn membership for deeper education on your own time.",
      primaryCta: COOKBOOK_CTA,
      secondaryCta: MEMBERSHIP_CTA,
    };
  }

  return {
    headline: "Let's start with a free consultation.",
    body:
      "Sarina will help you figure out the right path based on your specific situation.",
    primaryCta: CONSULTATION_CTA,
    secondaryCta: COOKBOOK_CTA,
  };
}

export const QUIZ_SESSION_KEY = "saryn_quiz_answers_v1";
