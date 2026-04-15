"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveOnboardingProfile, type OnboardingAnswers } from "@/lib/onboarding";
import {
  Heart, ArrowRight, ArrowLeft, CheckCircle2,
  Activity, Zap, Shield, Flame, Microscope, Scale, Droplets,
  BatteryLow, Brain, Stethoscope, HelpCircle,
  Apple, Utensils, Shuffle, CircleHelp,
  BookOpen, Bot, Sparkles, Loader2,
} from "lucide-react";

// ─── Question Data ───────────────────────────────────────────────────────────

interface Option {
  id: string;
  label: string;
  icon: React.ElementType;
}

interface Question {
  key: keyof OnboardingAnswers;
  title: string;
  subtitle: string;
  multiSelect?: boolean;
  maxSelect?: number;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    key: "primary_goal",
    title: "Tell Us About Your Health Goals",
    subtitle: "We'll use your answers to personalize your coaching experience and surface the most relevant functional medicine education for you.",
    options: [
      { id: "blood_sugar", label: "Understand and manage my blood sugar", icon: Droplets },
      { id: "diagnosed", label: "I've been told I'm pre-diabetic or diabetic", icon: Stethoscope },
      { id: "optimize", label: "Optimize my overall health and longevity", icon: Shield },
      { id: "inflammation", label: "Dealing with chronic inflammation, pain, or fatigue", icon: Flame },
      { id: "labs", label: "Understand my lab results and biomarkers", icon: Microscope },
      { id: "peptides", label: "Curious about peptides and advanced optimization", icon: Zap },
      { id: "weight", label: "Lose weight and improve my metabolism", icon: Scale },
    ],
  },
  {
    key: "biggest_challenge",
    title: "What's your biggest health challenge right now?",
    subtitle: "We'll prioritize content to help with this first.",
    options: [
      { id: "blood_sugar_crashes", label: "Blood sugar crashes or spikes", icon: Activity },
      { id: "fatigue", label: "Constant fatigue or low energy", icon: BatteryLow },
      { id: "gut", label: "Gut issues (bloating, digestion)", icon: Apple },

      { id: "brain_fog", label: "Brain fog or poor focus", icon: Brain },
      { id: "pain", label: "Chronic pain or inflammation", icon: Flame },
      { id: "weight_loss", label: "Difficulty losing weight", icon: Scale },
      { id: "unknown", label: "I'm not sure yet", icon: HelpCircle },
    ],
  },
  {
    key: "diagnoses",
    title: "Have you been diagnosed with any of the following?",
    subtitle: "Select all that apply — this helps us tailor your education.",
    multiSelect: true,
    options: [
      { id: "t2dm", label: "Type 2 Diabetes", icon: Droplets },
      { id: "t1dm", label: "Type 1 Diabetes", icon: Droplets },
      { id: "prediabetes", label: "Pre-diabetes", icon: Activity },
      { id: "hypertension", label: "High blood pressure", icon: Stethoscope },
      { id: "cholesterol", label: "High cholesterol", icon: Microscope },
      { id: "none", label: "None of the above", icon: CheckCircle2 },
    ],
  },
  {
    key: "lab_status",
    title: "Do you have recent bloodwork or lab results?",
    subtitle: "This helps us recommend the right starting content.",
    options: [
      { id: "labs_yes_help", label: "Yes — I'd love help understanding them", icon: Microscope },
      { id: "labs_yes_unsure", label: "Yes — but I'm not sure what to look for", icon: HelpCircle },
      { id: "labs_no_want", label: "No — but I want to get labs done", icon: Stethoscope },
      { id: "labs_no_notfocused", label: "No — labs aren't my focus right now", icon: Shield },
    ],
  },
  {
    key: "diet_baseline",
    title: "How would you describe your current eating habits?",
    subtitle: "No judgment — just helps us meet you where you are.",
    options: [
      { id: "diet_healthy_optimize", label: "Pretty healthy — I want to optimize", icon: Apple },
      { id: "diet_sad", label: "Standard American Diet — need a reset", icon: Utensils },
      { id: "diet_specific", label: "Following a specific diet (keto, paleo, etc.)", icon: BookOpen },
      { id: "diet_inconsistent", label: "Inconsistent — good days and bad days", icon: Shuffle },
      { id: "diet_lost", label: "Totally lost — don't know where to start", icon: CircleHelp },
    ],
  },
  {
    key: "interest_tags",
    title: "Which topics are you most curious about?",
    subtitle: "Pick up to 3 — we'll surface these in your feed.",
    multiSelect: true,
    maxSelect: 3,
    options: [
      { id: "sugar_inflammation", label: "Sugar & inflammation", icon: Flame },
      { id: "gut_health", label: "Gut health & microbiome", icon: Apple },
      { id: "hormones_adrenals", label: "Hormones & adrenals", icon: Zap },
      { id: "detox_liver", label: "Detox & liver support", icon: Shield },
      { id: "brain_cognition", label: "Brain health & cognition", icon: Brain },
      { id: "peptides_advanced", label: "Peptides & advanced protocols", icon: Microscope },
      { id: "supplements_nutraceuticals", label: "Supplements & nutraceuticals", icon: Stethoscope },
      { id: "functional_labs", label: "Functional lab interpretation", icon: Activity },
    ],
  },
  {
    key: "learning_style",
    title: "How do you learn best?",
    subtitle: "This shapes how we deliver your content.",
    options: [
      { id: "self_paced", label: "Self-paced — let me explore on my own", icon: BookOpen },
      { id: "ai_guided", label: "AI-guided — coach me through it", icon: Bot },
      { id: "both", label: "A mix of both", icon: Sparkles },
      { id: "unsure", label: "I'm not sure yet", icon: HelpCircle },
    ],
  },
];

// ─── Components ──────────────────────────────────────────────────────────────

function ProgressBar({ step, total }: { step: number; total: number }) {
  const pct = (step / total) * 100;
  return (
    <div className="w-full bg-[color:var(--muted)] h-1.5 rounded-full overflow-hidden">
      <div
        className="h-full bg-[color:var(--primary)] rounded-full transition-all duration-500 ease-out"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

function OptionButton({
  option,
  selected,
  disabled,
  onClick,
}: {
  option: Option;
  selected: boolean;
  disabled: boolean;
  onClick: () => void;
}) {
  const Icon = option.icon;
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-3 w-full px-4 py-4 rounded-2xl border text-left transition-all ${
        selected
          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 shadow-sm"
          : disabled
          ? "border-[color:var(--border)] bg-white opacity-40 cursor-not-allowed"
          : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/50"
      }`}
    >
      <span
        className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
          selected
            ? "bg-[color:var(--primary)] text-white"
            : "bg-[color:var(--secondary)] text-[color:var(--primary)]"
        }`}
      >
        <Icon className="w-4 h-4" />
      </span>
      <span className="text-[0.95rem] font-medium text-[color:var(--foreground)] flex-1">
        {option.label}
      </span>
      {selected && (
        <CheckCircle2 className="w-4 h-4 text-[color:var(--primary)] shrink-0" />
      )}
    </button>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [direction, setDirection] = useState<"forward" | "back">("forward");

  const [answers, setAnswers] = useState<OnboardingAnswers>({
    primary_goal: "",
    biggest_challenge: "",
    diagnoses: [],
    lab_status: "",
    diet_baseline: "",
    interest_tags: [],
    learning_style: "",
  });

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push("/login");
      } else {
        setUserId(user.id);
      }
    });
  }, [router]);

  const question = QUESTIONS[step];

  const currentValue = question
    ? answers[question.key]
    : undefined;

  const handleSelect = useCallback(
    (optionId: string) => {
      if (!question) return;

      if (question.multiSelect) {
        const current = answers[question.key] as string[];
        // "none" clears others; selecting others clears "none"
        if (question.key === "diagnoses") {
          if (optionId === "none") {
            setAnswers((prev) => ({ ...prev, [question.key]: ["none"] }));
            return;
          }
          const withoutNone = current.filter((x) => x !== "none");
          if (withoutNone.includes(optionId)) {
            setAnswers((prev) => ({
              ...prev,
              [question.key]: withoutNone.filter((x) => x !== optionId),
            }));
          } else {
            const maxSel = question.maxSelect;
            if (maxSel && withoutNone.length >= maxSel) return;
            setAnswers((prev) => ({
              ...prev,
              [question.key]: [...withoutNone, optionId],
            }));
          }
          return;
        }

        if (current.includes(optionId)) {
          setAnswers((prev) => ({
            ...prev,
            [question.key]: (current as string[]).filter((x) => x !== optionId),
          }));
        } else {
          const maxSel = question.maxSelect;
          if (maxSel && current.length >= maxSel) return;
          setAnswers((prev) => ({
            ...prev,
            [question.key]: [...(current as string[]), optionId],
          }));
        }
      } else {
        setAnswers((prev) => ({ ...prev, [question.key]: optionId }));
      }
    },
    [question, answers]
  );

  const canProceed = question
    ? question.multiSelect
      ? (currentValue as string[]).length > 0
      : (currentValue as string) !== ""
    : false;

  const goNext = useCallback(async () => {
    if (step < QUESTIONS.length - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
    } else {
      // Final step — save and redirect
      if (!userId) {
        router.push("/login");
        return;
      }
      setSaving(true);
      setSaveError(null);
      try {
        const supabase = createClient();
        await saveOnboardingProfile(supabase, userId, answers);
        router.push("/dashboard");
      } catch (err) {
        console.error("Failed to save onboarding profile:", err);
        setSaveError("Something went wrong saving your profile. Please try again.");
        setSaving(false);
      }
    }
  }, [step, userId, answers, router]);

  const goBack = useCallback(() => {
    if (step > 0) {
      setDirection("back");
      setStep((s) => s - 1);
    }
  }, [step]);

  if (!userId) {
    return (
      <div className="min-h-screen bg-[color:var(--background)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">Saryn Health</span>
        </Link>
        <span className="text-[0.8rem] text-[color:var(--muted-foreground)] font-medium">
          Step {step + 1} of {QUESTIONS.length}
        </span>
      </header>

      {/* Progress bar */}
      <div className="px-4 sm:px-6 pt-3">
        <ProgressBar step={step + 1} total={QUESTIONS.length} />
      </div>

      {/* Question */}
      {question && (
        <div
          key={step}
          className={`flex-1 flex flex-col items-center px-4 py-8 sm:py-10 ${
            direction === "forward" ? "animate-[fadeSlideIn_0.3s_ease-out]" : "animate-[fadeSlideBack_0.3s_ease-out]"
          }`}
        >
          <div className="w-full max-w-lg">
            <h2 className="text-[1.5rem] sm:text-[1.6rem] font-bold text-[color:var(--foreground)] mb-1 leading-tight">
              {question.title}
            </h2>
            <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-6">
              {question.subtitle}
              {question.multiSelect && question.maxSelect && (
                <span className="ml-1 text-[color:var(--primary)] font-medium">
                  ({(currentValue as string[]).length}/{question.maxSelect} selected)
                </span>
              )}
            </p>

            <div className="flex flex-col gap-3">
              {question.options.map((opt) => {
                const selected = question.multiSelect
                  ? (currentValue as string[]).includes(opt.id)
                  : currentValue === opt.id;
                const atMax =
                  question.multiSelect &&
                  question.maxSelect &&
                  (currentValue as string[]).length >= question.maxSelect &&
                  !selected;

                return (
                  <OptionButton
                    key={opt.id}
                    option={opt}
                    selected={selected}
                    disabled={!!atMax}
                    onClick={() => handleSelect(opt.id)}
                  />
                );
              })}
            </div>

            {saveError && (
              <p className="text-red-600 text-sm text-center mt-4">{saveError}</p>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8">
              <button
                onClick={goBack}
                disabled={step === 0}
                className={`flex items-center gap-1.5 text-[0.875rem] transition-colors ${
                  step === 0
                    ? "text-transparent cursor-default"
                    : "text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"
                }`}
              >
                <ArrowLeft className="w-4 h-4" /> Back
              </button>

              <button
                onClick={goNext}
                disabled={!canProceed || saving}
                className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
              >
                {saving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : step === QUESTIONS.length - 1 ? (
                  <>
                    <Sparkles className="w-4 h-4" />
                    See my personalized plan
                  </>
                ) : (
                  <>
                    Continue
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Inline keyframes for animations */}
      <style jsx global>{`
        @keyframes fadeSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes fadeSlideBack {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
