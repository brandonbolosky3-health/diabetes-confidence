"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Heart, ArrowRight, ArrowLeft, Sparkles,
  Activity, Shield, Zap, Pipette, BookOpen,
  Target, Leaf, Flame, Scale, Microscope, Sprout,
  BarChart2, CheckCircle2, BadgeCheck,
} from "lucide-react";

// ─── Data ────────────────────────────────────────────────────────────────────

const INTERESTS = [
  { id: "diabetes",    icon: Activity,   label: "Managing diabetes / blood sugar" },
  { id: "preventive",  icon: Shield,     label: "Preventative health & longevity" },
  { id: "peptides",    icon: Zap,        label: "Peptides & optimization" },
  { id: "vitamins",    icon: Pipette,    label: "Vitamins & supplementation" },
  { id: "education",   icon: BookOpen,   label: "General functional medicine education" },
];

const GOALS = [
  { id: "energy",      icon: Zap,        color: "text-amber-500",   bg: "bg-amber-50",   label: "Optimize energy & performance" },
  { id: "hormones",    icon: Activity,   color: "text-pink-500",    bg: "bg-pink-50",    label: "Balance hormones" },
  { id: "gut",         icon: Leaf,       color: "text-emerald-500", bg: "bg-emerald-50", label: "Improve gut health" },
  { id: "bloodsugar",  icon: Target,     color: "text-teal-600",    bg: "bg-teal-50",    label: "Control blood sugar" },
  { id: "weight",      icon: Scale,      color: "text-blue-500",    bg: "bg-blue-50",    label: "Lose weight / body composition" },
  { id: "inflammation",icon: Flame,      color: "text-orange-500",  bg: "bg-orange-50",  label: "Reduce inflammation" },
  { id: "prevention",  icon: Shield,     color: "text-indigo-500",  bg: "bg-indigo-50",  label: "Build a prevention-first lifestyle" },
];

const LEVELS = [
  { id: "beginner",   icon: Sprout,     label: "Beginner",       desc: "I'm new to functional medicine and want to start from the basics." },
  { id: "some",       icon: BookOpen,   label: "Some knowledge", desc: "I know a bit and want to go deeper — I've read articles, tried supplements, etc." },
  { id: "deep",       icon: Microscope, label: "Deep diver",     desc: "I've done a lot of research and want advanced, evidence-based content." },
];

const INTEREST_LABELS: Record<string, string> = Object.fromEntries(INTERESTS.map(i => [i.id, i.label]));
const GOAL_LABELS:     Record<string, string> = Object.fromEntries(GOALS.map(g => [g.id, g.label]));
const LEVEL_LABELS:    Record<string, string> = Object.fromEntries(LEVELS.map(l => [l.id, l.label]));

// ─── Sub-components ──────────────────────────────────────────────────────────

function Header({ step }: { step: number }) {
  const total = 3;
  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[color:var(--border)] bg-white/95">
      <Link href="/" className="flex items-center gap-2 font-bold">
        <Heart className="w-5 h-5 text-[color:var(--primary)] fill-[color:var(--primary)]" />
        <span className="text-[color:var(--foreground)]">DiabetesConfidence</span>
      </Link>
      {step > 0 && step <= total && (
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <div
                key={i}
                className={`h-1.5 rounded-full transition-all ${
                  i < step
                    ? "w-8 bg-[color:var(--primary)]"
                    : "w-4 bg-[color:var(--muted)]"
                }`}
              />
            ))}
          </div>
          <span className="text-[0.8rem] text-[color:var(--muted-foreground)] font-medium">
            {step} of {total}
          </span>
        </div>
      )}
    </header>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Continue",
  nextDisabled = false,
  isLast = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  nextDisabled?: boolean;
  isLast?: boolean;
}) {
  return (
    <div className="flex items-center justify-between mt-8">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-[color:var(--primary)] text-white text-[0.875rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40"
      >
        {isLast && <Sparkles className="w-4 h-4" />}
        {nextLabel}
        {!isLast && <ArrowRight className="w-4 h-4" />}
      </button>
    </div>
  );
}

// ─── Screens ─────────────────────────────────────────────────────────────────

function IntroScreen({ onStart }: { onStart: () => void }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 text-center">
      <div className="w-full max-w-sm">
        <div className="mx-auto mb-6 w-44 h-44 rounded-[2rem] overflow-hidden shadow-md">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=400&q=80"
            alt="Healthy path"
            className="w-full h-full object-cover"
          />
        </div>

        <span className="inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-[color:var(--muted-foreground)] bg-white border border-[color:var(--border)] rounded-full px-3 py-1 mb-5">
          <Sparkles className="w-3.5 h-3.5 text-[color:var(--primary)]" />
          Takes 30 seconds
        </span>

        <h1 className="text-[1.9rem] font-bold text-[color:var(--foreground)] leading-tight mb-3">
          Let&apos;s personalize your{" "}
          <span className="text-[color:var(--primary)]">health journey</span>
        </h1>
        <p className="text-[color:var(--muted-foreground)] text-[0.95rem] mb-8">
          Answer a few quick questions so we can tailor your experience and recommend the right content for you.
        </p>

        <button
          onClick={onStart}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[color:var(--primary)] text-white font-semibold text-[1rem] hover:opacity-90 transition-opacity"
        >
          Get Started <ArrowRight className="w-4 h-4" />
        </button>

        <p className="mt-4 text-[0.85rem] text-[color:var(--muted-foreground)]">
          Already a member?{" "}
          <Link href="/login" className="text-[color:var(--primary)] hover:underline font-medium">
            Log in
          </Link>
        </p>

        <div className="flex items-center justify-center gap-5 mt-8 text-[0.75rem] text-[color:var(--muted-foreground)]">
          {["Evidence-based", "RN-led curriculum", "Cancel anytime"].map((t) => (
            <span key={t} className="flex items-center gap-1">
              <BadgeCheck className="w-3.5 h-3.5 text-[color:var(--primary)]" />
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Step1({
  selected,
  onToggle,
  onBack,
  onNext,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="w-12 h-12 rounded-xl bg-[color:var(--secondary)] flex items-center justify-center mb-5">
          <Leaf className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <h2 className="text-[1.6rem] font-bold text-[color:var(--foreground)] mb-1">
          What brings you here?
        </h2>
        <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-6">
          Pick all that apply — this helps us recommend the right content.
        </p>

        <div className="flex flex-col gap-3">
          {INTERESTS.map(({ id, icon: Icon, label }) => {
            const active = selected.includes(id);
            return (
              <button
                key={id}
                onClick={() => onToggle(id)}
                className={`flex items-center gap-3 w-full px-4 py-4 rounded-2xl border text-left transition-all ${
                  active
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 shadow-sm"
                    : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/50"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                  active ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--secondary)] text-[color:var(--primary)]"
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className={`text-[0.95rem] font-medium ${active ? "text-[color:var(--foreground)]" : "text-[color:var(--foreground)]"}`}>
                  {label}
                </span>
                {active && <CheckCircle2 className="w-4 h-4 text-[color:var(--primary)] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>

        <NavButtons onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
      </div>
    </div>
  );
}

function Step2({
  selected,
  onToggle,
  onBack,
  onNext,
}: {
  selected: string[];
  onToggle: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const max = 3;
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="w-12 h-12 rounded-xl bg-[color:var(--secondary)] flex items-center justify-center mb-5">
          <Target className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <h2 className="text-[1.6rem] font-bold text-[color:var(--foreground)] mb-1">
          Your Health Goals
        </h2>
        <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-1">
          Pick up to {max} goals — we&apos;ll prioritize content around these.
        </p>
        <p className="text-[0.8rem] text-[color:var(--primary)] font-medium mb-6">
          {selected.length}/{max} selected
        </p>

        <div className="grid grid-cols-2 gap-3">
          {GOALS.map(({ id, icon: Icon, color, bg, label }) => {
            const active = selected.includes(id);
            const atMax = selected.length >= max && !active;
            return (
              <button
                key={id}
                onClick={() => !atMax && onToggle(id)}
                disabled={atMax}
                className={`flex items-center gap-3 px-4 py-4 rounded-2xl border text-left transition-all ${
                  active
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 shadow-sm"
                    : atMax
                    ? "border-[color:var(--border)] bg-white opacity-40 cursor-not-allowed"
                    : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/50"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${active ? "bg-[color:var(--primary)] text-white" : `${bg} ${color}`}`}>
                  <Icon className="w-4 h-4" />
                </span>
                <span className="text-[0.875rem] font-medium text-[color:var(--foreground)] leading-tight">{label}</span>
              </button>
            );
          })}
        </div>

        <NavButtons onBack={onBack} onNext={onNext} nextDisabled={selected.length === 0} />
      </div>
    </div>
  );
}

function Step3({
  selected,
  onSelect,
  onBack,
  onNext,
}: {
  selected: string;
  onSelect: (id: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col items-center px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="w-12 h-12 rounded-xl bg-[color:var(--secondary)] flex items-center justify-center mb-5">
          <BarChart2 className="w-5 h-5 text-[color:var(--primary)]" />
        </div>
        <h2 className="text-[1.6rem] font-bold text-[color:var(--foreground)] mb-1">
          Your Experience Level
        </h2>
        <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-6">
          How familiar are you with functional medicine?
        </p>

        <div className="flex flex-col gap-3">
          {LEVELS.map(({ id, icon: Icon, label, desc }) => {
            const active = selected === id;
            return (
              <button
                key={id}
                onClick={() => onSelect(id)}
                className={`flex items-center gap-4 w-full px-4 py-4 rounded-2xl border text-left transition-all ${
                  active
                    ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 shadow-sm"
                    : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/50"
                }`}
              >
                <span className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                  active ? "bg-[color:var(--primary)] text-white" : "bg-[color:var(--secondary)] text-[color:var(--primary)]"
                }`}>
                  <Icon className="w-4 h-4" />
                </span>
                <div>
                  <p className="text-[0.95rem] font-semibold text-[color:var(--foreground)]">{label}</p>
                  <p className="text-[0.8rem] text-[color:var(--muted-foreground)] mt-0.5">{desc}</p>
                </div>
                {active && <CheckCircle2 className="w-4 h-4 text-[color:var(--primary)] ml-auto shrink-0" />}
              </button>
            );
          })}
        </div>

        <NavButtons
          onBack={onBack}
          onNext={onNext}
          nextLabel="See my results"
          nextDisabled={!selected}
          isLast
        />
      </div>
    </div>
  );
}

function AllSetScreen({
  interests,
  goals,
  level,
}: {
  interests: string[];
  goals: string[];
  level: string;
}) {
  const router = useRouter();
  const levelData = LEVELS.find((l) => l.id === level);
  const LevelIcon = levelData?.icon ?? Sprout;

  return (
    <div className="flex-1 flex flex-col items-center px-4 py-12 text-center">
      <div className="w-full max-w-md">
        <div className="w-16 h-16 rounded-full bg-[color:var(--secondary)] flex items-center justify-center mx-auto mb-5">
          <CheckCircle2 className="w-8 h-8 text-[color:var(--primary)]" />
        </div>

        <h2 className="text-[1.75rem] font-bold text-[color:var(--foreground)] mb-2">
          All set! Your personalized{" "}
          <span className="text-[color:var(--primary)]">curriculum is ready</span>
        </h2>
        <p className="text-[color:var(--muted-foreground)] text-[0.9rem] mb-8">
          Based on your answers, we&apos;ve tailored your experience. Here&apos;s what we&apos;ve customized for you:
        </p>

        <div className="flex flex-col gap-3 text-left mb-8">
          {/* Interests */}
          <div className="bg-white rounded-2xl border border-[color:var(--border)] px-5 py-4">
            <p className="text-[0.7rem] font-bold tracking-widest text-[color:var(--muted-foreground)] uppercase mb-2 flex items-center gap-1.5">
              <Leaf className="w-3.5 h-3.5 text-[color:var(--primary)]" />
              Your Interests
            </p>
            <div className="flex flex-wrap gap-2">
              {interests.map((id) => (
                <span
                  key={id}
                  className="inline-flex items-center gap-1 text-[0.8rem] font-medium text-[color:var(--primary)] bg-[color:var(--secondary)] rounded-full px-3 py-1"
                >
                  <Activity className="w-3 h-3" />
                  {INTEREST_LABELS[id]}
                </span>
              ))}
            </div>
          </div>

          {/* Goals */}
          <div className="bg-white rounded-2xl border border-[color:var(--border)] px-5 py-4">
            <p className="text-[0.7rem] font-bold tracking-widest text-[color:var(--muted-foreground)] uppercase mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-[color:var(--primary)]" />
              Your Top Goals
            </p>
            <div className="flex flex-col gap-1.5">
              {goals.map((id) => {
                const g = GOALS.find((x) => x.id === id)!;
                const GIcon = g.icon;
                return (
                  <span key={id} className={`inline-flex items-center gap-2 text-[0.85rem] font-medium ${g.color}`}>
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center ${g.bg}`}>
                      <GIcon className="w-3.5 h-3.5" />
                    </span>
                    {GOAL_LABELS[id]}
                  </span>
                );
              })}
            </div>
          </div>

          {/* Level */}
          <div className="bg-white rounded-2xl border border-[color:var(--border)] px-5 py-4">
            <p className="text-[0.7rem] font-bold tracking-widest text-[color:var(--muted-foreground)] uppercase mb-2 flex items-center gap-1.5">
              <BarChart2 className="w-3.5 h-3.5 text-[color:var(--primary)]" />
              Your Level
            </p>
            <span className="inline-flex items-center gap-2 text-[0.875rem] font-semibold text-[color:var(--foreground)]">
              <span className="w-7 h-7 rounded-md bg-[color:var(--secondary)] flex items-center justify-center">
                <LevelIcon className="w-4 h-4 text-[color:var(--primary)]" />
              </span>
              {LEVEL_LABELS[level]}
            </span>
          </div>
        </div>

        <button
          onClick={() => router.push("/signup")}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-full bg-[color:var(--primary)] text-white font-semibold text-[1rem] hover:opacity-90 transition-opacity"
        >
          Choose My Plan <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const [step, setStep] = useState(0);
  const [interests, setInterests] = useState<string[]>([]);
  const [goals, setGoals] = useState<string[]>([]);
  const [level, setLevel] = useState("");

  const toggleInterest = (id: string) =>
    setInterests((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const toggleGoal = (id: string) =>
    setGoals((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  return (
    <div className="min-h-screen bg-[color:var(--background)] flex flex-col">
      <Header step={step} />

      {step === 0 && <IntroScreen onStart={() => setStep(1)} />}
      {step === 1 && (
        <Step1
          selected={interests}
          onToggle={toggleInterest}
          onBack={() => setStep(0)}
          onNext={() => setStep(2)}
        />
      )}
      {step === 2 && (
        <Step2
          selected={goals}
          onToggle={toggleGoal}
          onBack={() => setStep(1)}
          onNext={() => setStep(3)}
        />
      )}
      {step === 3 && (
        <Step3
          selected={level}
          onSelect={setLevel}
          onBack={() => setStep(2)}
          onNext={() => setStep(4)}
        />
      )}
      {step === 4 && (
        <AllSetScreen interests={interests} goals={goals} level={level} />
      )}
    </div>
  );
}
