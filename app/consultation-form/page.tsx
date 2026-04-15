"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { saveConsultationForm } from "@/lib/consultation";
import {
  SYMPTOMS_LIST,
  SUFFERING_LIST,
  IMPACT_LIST,
} from "@/types/consultation";
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Sparkles,
  ClipboardList,
  User,
  Stethoscope,
  MessageSquare,
  HeartPulse,
  X,
} from "lucide-react";

// ─── Constants ──────────────────────────────────────────────────────────────

const TOTAL_STEPS = 5;

const STEP_TITLES = [
  "Personal Information",
  "Symptoms & Conditions",
  "Chief Complaint",
  "How It Affects Your Life",
  "Review & Submit",
];

const STEP_ICONS = [User, Stethoscope, MessageSquare, HeartPulse, ClipboardList];

// ─── Initial State ──────────────────────────────────────────────────────────

function getInitialFormState() {
  return {
    full_name: "",
    date_of_birth: "",
    phone: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    how_did_you_hear: "",
    occupation: "",
    is_pregnant: null as boolean | null,

    symptom_headache: false,
    symptom_knee_pain: false,
    symptom_back_neck_pain: false,
    symptom_arthritis: false,
    symptom_digestion: false,
    symptom_cardiovascular: false,
    symptom_hypertension: false,
    symptom_anxiety_depression: false,
    symptom_diabetes: false,
    symptom_memory_decline: false,
    symptom_fatigue: false,
    symptom_breathing: false,
    symptom_sleep: false,
    symptom_nerve_pain_neuropathy: false,
    symptom_skin_issue: false,
    symptom_other_joint_pain: "" as string | null,
    symptom_other_conditions: "" as string | null,

    worst_symptom: "",
    condition_duration: "",
    condition_frequency: "",
    pain_scale: 5 as number | null,
    what_has_not_helped: "",
    life_in_3_years_if_worse: "",
    life_if_resolved: "",

    suffer_irritability: false,
    suffer_interrupted_sleep: false,
    suffer_restricted_activity: false,
    suffer_mood_disorder: false,
    suffer_fatigue: false,
    suffer_decline_in_activity: false,

    impact_family_social: false,
    impact_work_income: false,
    impact_productivity_household: false,
    impact_exercise_sports: false,
    impact_hobbies: false,

    consent_agreed: false,
    signature: "",
  };
}

type FormState = ReturnType<typeof getInitialFormState>;

// ─── Components ─────────────────────────────────────────────────────────────

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

function ToggleButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-2xl border text-left transition-all ${
        selected
          ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 shadow-sm"
          : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/50"
      }`}
    >
      <span
        className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 border ${
          selected
            ? "bg-[color:var(--primary)] border-[color:var(--primary)]"
            : "bg-white border-[color:var(--border)]"
        }`}
      >
        {selected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
      </span>
      <span className="text-[0.9rem] font-medium text-[color:var(--foreground)]">
        {label}
      </span>
    </button>
  );
}

function FormInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  required,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-[0.8rem] font-medium text-[color:var(--foreground)] mb-1">
        {label}
        {optional && (
          <span className="text-[color:var(--muted-foreground)] font-normal">
            {" "}
            (Optional)
          </span>
        )}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-[0.875rem] border border-[color:var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)] transition-colors"
      />
    </div>
  );
}

function FormTextarea({
  label,
  value,
  onChange,
  rows = 3,
  placeholder,
  required,
  optional,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
  required?: boolean;
  optional?: boolean;
}) {
  return (
    <div>
      <label className="block text-[0.8rem] font-medium text-[color:var(--foreground)] mb-1">
        {label}
        {optional && (
          <span className="text-[color:var(--muted-foreground)] font-normal">
            {" "}
            (Optional)
          </span>
        )}
        {required && <span className="text-red-400"> *</span>}
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 text-[0.875rem] border border-[color:var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)] transition-colors resize-none"
      />
    </div>
  );
}

// ─── Step Components ────────────────────────────────────────────────────────

function StepPersonalInfo({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const set = (key: keyof FormState, val: string | boolean | null) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Full Name"
          value={form.full_name}
          onChange={(v) => set("full_name", v)}
          required
        />
        <FormInput
          label="Date of Birth"
          value={form.date_of_birth}
          onChange={(v) => set("date_of_birth", v)}
          type="date"
          required
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Phone"
          value={form.phone}
          onChange={(v) => set("phone", v)}
          type="tel"
          placeholder="(555) 123-4567"
          required
        />
        <FormInput
          label="Email"
          value={form.email}
          onChange={(v) => set("email", v)}
          type="email"
          placeholder="you@example.com"
          required
        />
      </div>
      <FormInput
        label="Address"
        value={form.address}
        onChange={(v) => set("address", v)}
        optional
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <FormInput
          label="City"
          value={form.city}
          onChange={(v) => set("city", v)}
          optional
        />
        <FormInput
          label="State"
          value={form.state}
          onChange={(v) => set("state", v)}
          optional
        />
        <FormInput
          label="ZIP"
          value={form.zip}
          onChange={(v) => set("zip", v)}
          optional
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="Occupation"
          value={form.occupation}
          onChange={(v) => set("occupation", v)}
          optional
        />
        <FormInput
          label="How did you hear about us?"
          value={form.how_did_you_hear}
          onChange={(v) => set("how_did_you_hear", v)}
          optional
        />
      </div>
      <div>
        <label className="block text-[0.8rem] font-medium text-[color:var(--foreground)] mb-2">
          Are you currently pregnant?
        </label>
        <div className="flex gap-3">
          {[
            { label: "Yes", value: true },
            { label: "No", value: false },
            { label: "N/A", value: null },
          ].map((opt) => (
            <button
              key={String(opt.value)}
              type="button"
              onClick={() => set("is_pregnant", opt.value)}
              className={`px-5 py-2 rounded-full text-[0.85rem] font-medium border transition-all ${
                form.is_pregnant === opt.value
                  ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 text-[color:var(--primary)]"
                  : "border-[color:var(--border)] bg-white text-[color:var(--muted-foreground)] hover:border-[color:var(--primary)]/50"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepSymptoms({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const toggle = (key: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: !prev[key as keyof FormState],
    }));

  return (
    <div className="space-y-5">
      <p className="text-[0.9rem] text-[color:var(--muted-foreground)]">
        Select all symptoms or conditions that apply to you.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {SYMPTOMS_LIST.map((s) => (
          <ToggleButton
            key={s.key}
            label={s.label}
            selected={form[s.key as keyof FormState] as boolean}
            onClick={() => toggle(s.key)}
          />
        ))}
      </div>
      <FormInput
        label="Other joint pain (please specify)"
        value={form.symptom_other_joint_pain || ""}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            symptom_other_joint_pain: v || null,
          }))
        }
        optional
      />
      <FormTextarea
        label="Other conditions not listed above"
        value={form.symptom_other_conditions || ""}
        onChange={(v) =>
          setForm((prev) => ({
            ...prev,
            symptom_other_conditions: v || null,
          }))
        }
        rows={2}
        optional
      />
    </div>
  );
}

function StepChiefComplaint({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const set = (key: keyof FormState, val: string | number | null) =>
    setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div className="space-y-5">
      <FormTextarea
        label="What is your worst symptom or health concern right now?"
        value={form.worst_symptom}
        onChange={(v) => set("worst_symptom", v)}
        rows={3}
        required
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormInput
          label="How long have you had this condition?"
          value={form.condition_duration}
          onChange={(v) => set("condition_duration", v)}
          placeholder="e.g., 2 weeks, 3 months, 5 years"
        />
        <FormInput
          label="How often does it occur?"
          value={form.condition_frequency}
          onChange={(v) => set("condition_frequency", v)}
          placeholder="e.g., daily, weekly, intermittent"
        />
      </div>

      {/* Pain Scale */}
      <div>
        <label className="block text-[0.8rem] font-medium text-[color:var(--foreground)] mb-2">
          Pain / Discomfort Scale
        </label>
        <div className="bg-white rounded-2xl border border-[color:var(--border)] p-5">
          <div className="flex items-center justify-center mb-3">
            <span
              className="w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-bold"
              style={{ backgroundColor: "#2a9d8f" }}
            >
              {form.pain_scale}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={form.pain_scale ?? 5}
            onChange={(e) => set("pain_scale", parseInt(e.target.value))}
            className="w-full accent-[#2a9d8f]"
          />
          <div className="flex justify-between text-[0.75rem] text-[color:var(--muted-foreground)] mt-1">
            <span>1 — Minimal</span>
            <span>10 — Severe</span>
          </div>
        </div>
      </div>

      <FormTextarea
        label="What have you tried that has NOT helped?"
        value={form.what_has_not_helped}
        onChange={(v) => set("what_has_not_helped", v)}
        rows={2}
        optional
      />
      <FormTextarea
        label="If your condition gets worse over the next 3 years, what would your life look like?"
        value={form.life_in_3_years_if_worse}
        onChange={(v) => set("life_in_3_years_if_worse", v)}
        rows={2}
        optional
      />
      <FormTextarea
        label="If your condition were resolved, what would your life look like?"
        value={form.life_if_resolved}
        onChange={(v) => set("life_if_resolved", v)}
        rows={2}
        optional
      />
    </div>
  );
}

function StepLifeImpact({
  form,
  setForm,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
}) {
  const toggle = (key: string) =>
    setForm((prev) => ({
      ...prev,
      [key]: !prev[key as keyof FormState],
    }));

  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-[1rem] font-semibold text-[color:var(--foreground)] mb-1">
          Are you currently suffering from any of the following?
        </h3>
        <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mb-4">
          Select all that apply.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {SUFFERING_LIST.map((s) => (
            <ToggleButton
              key={s.key}
              label={s.label}
              selected={form[s.key as keyof FormState] as boolean}
              onClick={() => toggle(s.key)}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-[1rem] font-semibold text-[color:var(--foreground)] mb-1">
          Has your condition impacted any of these areas of your life?
        </h3>
        <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mb-4">
          Select all that apply.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {IMPACT_LIST.map((s) => (
            <ToggleButton
              key={s.key}
              label={s.label}
              selected={form[s.key as keyof FormState] as boolean}
              onClick={() => toggle(s.key)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function ReviewSection({
  title,
  onEdit,
  children,
}: {
  title: string;
  onEdit: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[color:var(--border)] p-5 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-[0.95rem] font-semibold text-[color:var(--foreground)]">
          {title}
        </h3>
        <button
          type="button"
          onClick={onEdit}
          className="text-[0.8rem] font-medium text-[color:var(--primary)] hover:underline"
        >
          Edit
        </button>
      </div>
      {children}
    </div>
  );
}

function ReviewField({
  label,
  value,
}: {
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="mb-2">
      <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
        {label}
      </span>
      <p className="text-[0.875rem] text-[color:var(--foreground)]">{value}</p>
    </div>
  );
}

function StepReview({
  form,
  setForm,
  goToStep,
}: {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  goToStep: (step: number) => void;
}) {
  const selectedSymptoms = SYMPTOMS_LIST.filter(
    (s) => form[s.key as keyof FormState] === true
  )
    .map((s) => s.label)
    .join(", ");

  const selectedSuffering = SUFFERING_LIST.filter(
    (s) => form[s.key as keyof FormState] === true
  )
    .map((s) => s.label)
    .join(", ");

  const selectedImpacts = IMPACT_LIST.filter(
    (s) => form[s.key as keyof FormState] === true
  )
    .map((s) => s.label)
    .join(", ");

  return (
    <div className="space-y-4">
      <p className="text-[0.9rem] text-[color:var(--muted-foreground)] mb-2">
        Please review your information below before submitting.
      </p>

      <ReviewSection title="Personal Information" onEdit={() => goToStep(0)}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <ReviewField label="Full Name" value={form.full_name} />
          <ReviewField label="Date of Birth" value={form.date_of_birth} />
          <ReviewField label="Phone" value={form.phone} />
          <ReviewField label="Email" value={form.email} />
          <ReviewField
            label="Address"
            value={
              [form.address, form.city, form.state, form.zip]
                .filter(Boolean)
                .join(", ") || undefined
            }
          />
          <ReviewField label="Occupation" value={form.occupation} />
          <ReviewField
            label="How did you hear about us?"
            value={form.how_did_you_hear}
          />
          <ReviewField
            label="Pregnant"
            value={
              form.is_pregnant === null
                ? "N/A"
                : form.is_pregnant
                ? "Yes"
                : "No"
            }
          />
        </div>
      </ReviewSection>

      <ReviewSection title="Symptoms & Conditions" onEdit={() => goToStep(1)}>
        <ReviewField
          label="Selected Symptoms"
          value={selectedSymptoms || "None selected"}
        />
        <ReviewField
          label="Other Joint Pain"
          value={form.symptom_other_joint_pain}
        />
        <ReviewField
          label="Other Conditions"
          value={form.symptom_other_conditions}
        />
      </ReviewSection>

      <ReviewSection title="Chief Complaint" onEdit={() => goToStep(2)}>
        <ReviewField label="Worst Symptom" value={form.worst_symptom} />
        <ReviewField label="Duration" value={form.condition_duration} />
        <ReviewField label="Frequency" value={form.condition_frequency} />
        <ReviewField
          label="Pain Scale"
          value={form.pain_scale ? `${form.pain_scale} / 10` : undefined}
        />
        <ReviewField
          label="What Has Not Helped"
          value={form.what_has_not_helped}
        />
        <ReviewField
          label="Life in 3 Years if Worse"
          value={form.life_in_3_years_if_worse}
        />
        <ReviewField
          label="Life if Resolved"
          value={form.life_if_resolved}
        />
      </ReviewSection>

      <ReviewSection title="How It Affects Your Life" onEdit={() => goToStep(3)}>
        <ReviewField
          label="Suffering From"
          value={selectedSuffering || "None selected"}
        />
        <ReviewField
          label="Life Impact Areas"
          value={selectedImpacts || "None selected"}
        />
      </ReviewSection>

      {/* Consent */}
      <div className="bg-[color:var(--secondary)] rounded-2xl border border-[color:var(--border)] p-5">
        <p className="text-[0.875rem] text-[color:var(--foreground)] leading-relaxed mb-4 italic">
          &ldquo;I understand the purpose of the consultation is to better
          understand my health concerns. I understand that this consultation is
          not a medical evaluation or treatment and does not establish a
          provider-patient relationship.&rdquo;
        </p>
        <label className="flex items-start gap-3 cursor-pointer mb-4">
          <input
            type="checkbox"
            checked={form.consent_agreed}
            onChange={() =>
              setForm((prev) => ({
                ...prev,
                consent_agreed: !prev.consent_agreed,
              }))
            }
            className="mt-0.5 w-5 h-5 rounded accent-[#2a9d8f]"
          />
          <span className="text-[0.875rem] font-medium text-[color:var(--foreground)]">
            I have read and agree to the above statement
          </span>
        </label>

        <div>
          <label className="block text-[0.8rem] font-medium text-[color:var(--foreground)] mb-1">
            Signature — Type your full name as your digital signature
            <span className="text-red-400"> *</span>
          </label>
          <input
            type="text"
            value={form.signature}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, signature: e.target.value }))
            }
            placeholder="Your full name"
            className="w-full px-4 py-2.5 text-[0.875rem] border border-[color:var(--border)] rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)] transition-colors italic"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Page ───────────────────────────────────────────────────────────────────

export default function ConsultationFormPage() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(getInitialFormState);

  // Auth check
  useEffect(() => {
    (async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/login");
        return;
      }
      setUserId(user.id);
      // Pre-fill email
      if (user.email) {
        setForm((prev) => ({ ...prev, email: user.email ?? "" }));
      }
    })();
  }, [router]);

  const goToStep = useCallback(
    (target: number) => {
      setDirection(target > step ? "forward" : "back");
      setStep(target);
    },
    [step]
  );

  const canProceed = (() => {
    switch (step) {
      case 0:
        return (
          form.full_name.trim() !== "" &&
          form.date_of_birth !== "" &&
          form.phone.trim() !== "" &&
          form.email.trim() !== ""
        );
      case 1:
        return true; // symptoms are optional
      case 2:
        return form.worst_symptom.trim() !== "";
      case 3:
        return true; // life impact is optional
      case 4:
        return form.consent_agreed && form.signature.trim() !== "";
      default:
        return false;
    }
  })();

  const goNext = useCallback(async () => {
    if (step < TOTAL_STEPS - 1) {
      setDirection("forward");
      setStep((s) => s + 1);
      return;
    }

    // Submit
    if (!userId) return;
    setSaving(true);
    setSaveError(null);

    try {
      const supabase = createClient();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { consent_agreed, signature, ...formData } = form;
      await saveConsultationForm(supabase, userId, formData);
      router.push("/dashboard?consultation=submitted");
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Something went wrong. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }, [step, userId, form, router]);

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

  const StepIcon = STEP_ICONS[step];

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      {/* Header */}
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95 backdrop-blur">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
          <span className="text-[color:var(--foreground)]">Saryn Health</span>
        </Link>
        <span className="text-[0.8rem] text-[color:var(--muted-foreground)] font-medium">
          Step {step + 1} of {TOTAL_STEPS}
        </span>
      </header>

      {/* Progress bar */}
      <div className="px-4 sm:px-6 pt-3">
        <ProgressBar step={step + 1} total={TOTAL_STEPS} />
      </div>

      {/* Step content */}
      <div
        key={step}
        className="flex-1 flex flex-col items-center px-4 sm:px-6 py-8"
        style={{
          animation: `${
            direction === "forward" ? "fadeSlideIn" : "fadeSlideBack"
          } 0.3s ease-out`,
        }}
      >
        <div className="w-full max-w-2xl">
          {/* Step header */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[color:var(--primary)]/10 flex items-center justify-center mx-auto mb-3">
              <StepIcon className="w-6 h-6 text-[color:var(--primary)]" />
            </div>
            <h2
              className="text-[1.5rem] text-[color:var(--foreground)]"
              style={{ fontWeight: 700 }}
            >
              {STEP_TITLES[step]}
            </h2>
          </div>

          {/* Step body */}
          {step === 0 && <StepPersonalInfo form={form} setForm={setForm} />}
          {step === 1 && <StepSymptoms form={form} setForm={setForm} />}
          {step === 2 && <StepChiefComplaint form={form} setForm={setForm} />}
          {step === 3 && <StepLifeImpact form={form} setForm={setForm} />}
          {step === 4 && (
            <StepReview form={form} setForm={setForm} goToStep={goToStep} />
          )}

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
                  Submitting...
                </>
              ) : step === TOTAL_STEPS - 1 ? (
                <>
                  <Sparkles className="w-4 h-4" />
                  Submit Form
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
