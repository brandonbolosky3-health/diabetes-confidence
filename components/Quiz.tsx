"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, RotateCcw } from "lucide-react";
import {
  Q1_OPTIONS,
  Q2_OPTIONS,
  Q3_OPTIONS,
  QUIZ_SESSION_KEY,
  getRecommendation,
  type Q1Answer,
  type Q2Answer,
  type Q3Answer,
  type QuizAnswers,
} from "@/lib/quiz";

type Step = 1 | 2 | 3 | "result";

const MAX_Q2 = 3;

export default function Quiz({
  className = "",
}: {
  className?: string;
}) {
  const [step, setStep] = useState<Step>(1);
  const [q1, setQ1] = useState<Q1Answer | null>(null);
  const [q2, setQ2] = useState<Q2Answer[]>([]);
  const [q3, setQ3] = useState<Q3Answer | null>(null);

  function persistAnswers(answers: QuizAnswers) {
    if (typeof window === "undefined") return;
    try {
      sessionStorage.setItem(QUIZ_SESSION_KEY, JSON.stringify(answers));
    } catch {
      // sessionStorage may be unavailable; non-critical
    }
  }

  function reset() {
    setQ1(null);
    setQ2([]);
    setQ3(null);
    setStep(1);
    if (typeof window !== "undefined") {
      try {
        sessionStorage.removeItem(QUIZ_SESSION_KEY);
      } catch {
        /* noop */
      }
    }
  }

  function pickQ1(answer: Q1Answer) {
    setQ1(answer);
    setStep(2);
  }

  function toggleQ2(answer: Q2Answer) {
    setQ2((prev) => {
      if (prev.includes(answer)) return prev.filter((a) => a !== answer);
      if (prev.length >= MAX_Q2) return prev;
      return [...prev, answer];
    });
  }

  function nextFromQ2() {
    if (q2.length === 0) return;
    setStep(3);
  }

  function pickQ3(answer: Q3Answer) {
    setQ3(answer);
    const final: QuizAnswers = { q1, q2, q3: answer };
    persistAnswers(final);
    setStep("result");
  }

  return (
    <div className={className}>
      {step === 1 && (
        <Question
          eyebrow="Question 1 of 3"
          title="Where are you in your health journey?"
        >
          <SingleSelectList<Q1Answer>
            options={Q1_OPTIONS}
            value={q1}
            onSelect={pickQ1}
          />
        </Question>
      )}

      {step === 2 && (
        <Question
          eyebrow="Question 2 of 3"
          title="What's your main goal right now?"
          subtitle={`Pick up to ${MAX_Q2}.`}
        >
          <MultiSelectList<Q2Answer>
            options={Q2_OPTIONS}
            value={q2}
            onToggle={toggleQ2}
            max={MAX_Q2}
          />
          <div className="mt-6 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
            >
              Back
            </button>
            <button
              type="button"
              onClick={nextFromQ2}
              disabled={q2.length === 0}
              className="inline-flex items-center gap-2 bg-[color:var(--primary)] text-white px-6 py-2.5 rounded-full text-[0.9rem] font-semibold hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </Question>
      )}

      {step === 3 && (
        <Question
          eyebrow="Question 3 of 3"
          title="What kind of support are you looking for?"
        >
          <SingleSelectList<Q3Answer>
            options={Q3_OPTIONS}
            value={q3}
            onSelect={pickQ3}
          />
          <div className="mt-6">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-[0.875rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
            >
              Back
            </button>
          </div>
        </Question>
      )}

      {step === "result" && q1 && q3 && (
        <Result answers={{ q1, q2, q3 }} onReset={reset} />
      )}
    </div>
  );
}

function Question({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-[color:var(--border)] p-6 sm:p-8">
      <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-2">
        {eyebrow}
      </p>
      <h3 className="text-[1.4rem] sm:text-[1.6rem] font-medium tracking-tight text-[color:var(--foreground)]">
        {title}
      </h3>
      {subtitle && (
        <p className="text-[0.9rem] text-[color:var(--muted-foreground)] mt-1.5">
          {subtitle}
        </p>
      )}
      <div className="mt-5 sm:mt-6">{children}</div>
    </div>
  );
}

function SingleSelectList<T extends string>({
  options,
  value,
  onSelect,
}: {
  options: { id: T; label: string }[];
  value: T | null;
  onSelect: (id: T) => void;
}) {
  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt) => {
        const selected = value === opt.id;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onSelect(opt.id)}
            className={`text-left px-4 py-3.5 rounded-xl border transition-all ${
              selected
                ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5 text-[color:var(--foreground)]"
                : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/40 hover:bg-[color:var(--primary)]/5 text-[color:var(--foreground)]"
            }`}
          >
            <span className="text-[0.95rem] font-medium">{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MultiSelectList<T extends string>({
  options,
  value,
  onToggle,
  max,
}: {
  options: { id: T; label: string }[];
  value: T[];
  onToggle: (id: T) => void;
  max: number;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
      {options.map((opt) => {
        const selected = value.includes(opt.id);
        const atLimit = !selected && value.length >= max;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onToggle(opt.id)}
            disabled={atLimit}
            className={`text-left px-4 py-3.5 rounded-xl border transition-all flex items-center justify-between gap-3 ${
              selected
                ? "border-[color:var(--primary)] bg-[color:var(--primary)]/5"
                : atLimit
                  ? "border-[color:var(--border)] bg-white opacity-50 cursor-not-allowed"
                  : "border-[color:var(--border)] bg-white hover:border-[color:var(--primary)]/40 hover:bg-[color:var(--primary)]/5"
            }`}
          >
            <span className="text-[0.95rem] font-medium text-[color:var(--foreground)]">
              {opt.label}
            </span>
            {selected && <Check className="w-4 h-4 text-[color:var(--primary)] shrink-0" />}
          </button>
        );
      })}
    </div>
  );
}

function Result({
  answers,
  onReset,
}: {
  answers: QuizAnswers;
  onReset: () => void;
}) {
  const rec = getRecommendation(answers);
  const cookbookOffered =
    rec.primaryCta.href === "/cookbook" || rec.secondaryCta.href === "/cookbook";
  return (
    <div className="bg-white rounded-2xl border-2 border-[color:var(--primary)] p-7 sm:p-9 shadow-sm">
      <p className="text-[0.75rem] font-semibold tracking-wide uppercase text-[color:var(--primary)] mb-3">
        Your recommendation
      </p>
      <h3 className="text-[1.5rem] sm:text-[1.75rem] font-medium tracking-tight text-[color:var(--foreground)] leading-tight">
        {rec.headline}
      </h3>
      <p className="text-[0.95rem] text-[color:var(--muted-foreground)] leading-relaxed mt-3 mb-7 max-w-prose">
        {rec.body}
      </p>

      {cookbookOffered && <CookbookPreview />}

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          href={rec.primaryCta.href}
          className="inline-flex items-center justify-center gap-2 bg-[color:var(--primary)] text-white px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:opacity-90 transition-opacity"
        >
          {rec.primaryCta.label} <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href={rec.secondaryCta.href}
          className="inline-flex items-center justify-center gap-2 border-2 border-[color:var(--primary)] text-[color:var(--primary)] px-6 py-3 rounded-full text-[0.95rem] font-semibold hover:bg-[color:var(--primary)]/5 transition-colors"
        >
          {rec.secondaryCta.label}
        </Link>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="mt-6 inline-flex items-center gap-1.5 text-[0.85rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors"
      >
        <RotateCcw className="w-3.5 h-3.5" /> Retake the quiz
      </button>
    </div>
  );
}

const COOKBOOK_INSIDE = [
  "30-day meal plan to build healthier eating habits",
  "Anti-inflammatory recipes designed for blood sugar balance",
  "Gut-friendly meals that support steady energy",
  "Practical shopping lists and prep tips",
];

function CookbookPreview() {
  return (
    <div className="mb-7 rounded-xl bg-[color:var(--primary)]/5 border border-[color:var(--primary)]/15 p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row gap-5 sm:gap-6">
        <div className="shrink-0 mx-auto sm:mx-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/saryn-cookbook-cover.jpg"
            alt="The Healthy Cookbook & 30 Day Meal Plan cover"
            className="w-32 sm:w-36 rounded-lg shadow-sm border border-[color:var(--border)]"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[0.7rem] font-semibold tracking-wide uppercase text-[color:var(--primary)]">
              What&apos;s inside
            </span>
            <span className="text-[0.7rem] text-[color:var(--muted-foreground)]">
              · Free PDF
            </span>
          </div>
          <ul className="space-y-2">
            {COOKBOOK_INSIDE.map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <Check className="w-4 h-4 text-[color:var(--primary)] mt-0.5 shrink-0" />
                <span className="text-[0.875rem] text-[color:var(--foreground)] leading-snug">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
