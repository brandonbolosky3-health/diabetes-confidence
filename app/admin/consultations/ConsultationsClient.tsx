"use client";

import { useState, useMemo } from "react";
import { Search, ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";

const SYMPTOM_KEYS = [
  { key: "symptom_headache", label: "Headache" },
  { key: "symptom_knee_pain", label: "Knee pain" },
  { key: "symptom_back_neck_pain", label: "Back/neck pain" },
  { key: "symptom_arthritis", label: "Arthritis" },
  { key: "symptom_digestion", label: "Digestion" },
  { key: "symptom_cardiovascular", label: "Cardiovascular" },
  { key: "symptom_hypertension", label: "Hypertension" },
  { key: "symptom_anxiety_depression", label: "Anxiety/depression" },
  { key: "symptom_diabetes", label: "Diabetes" },
  { key: "symptom_memory_decline", label: "Memory decline" },
  { key: "symptom_fatigue", label: "Fatigue" },
  { key: "symptom_breathing", label: "Breathing" },
  { key: "symptom_sleep", label: "Sleep" },
  { key: "symptom_nerve_pain_neuropathy", label: "Neuropathy" },
  { key: "symptom_skin_issue", label: "Skin issue" },
];

export interface FormRow {
  id: string;
  submitted_at: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  date_of_birth: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  occupation: string | null;
  how_did_you_hear: string | null;
  is_pregnant: boolean | null;
  member_id: string | null;
  worst_symptom: string | null;
  condition_duration: string | null;
  condition_frequency: string | null;
  pain_scale: number | null;
  what_has_not_helped: string | null;
  life_in_3_years_if_worse: string | null;
  life_if_resolved: string | null;
  symptom_other_joint_pain: string | null;
  symptom_other_conditions: string | null;
  suffer_irritability: boolean;
  suffer_interrupted_sleep: boolean;
  suffer_restricted_activity: boolean;
  suffer_mood_disorder: boolean;
  suffer_fatigue: boolean;
  suffer_decline_in_activity: boolean;
  impact_family_social: boolean;
  impact_work_income: boolean;
  impact_productivity_household: boolean;
  impact_exercise_sports: boolean;
  impact_hobbies: boolean;
  [key: string]: unknown;
}

const PAGE_SIZE = 20;

function ExpandedRow({ row }: { row: FormRow }) {
  const symptoms = SYMPTOM_KEYS.filter((s) => row[s.key] === true).map((s) => s.label);
  const suffering = [
    row.suffer_irritability && "Irritability",
    row.suffer_interrupted_sleep && "Interrupted sleep",
    row.suffer_restricted_activity && "Restricted activity",
    row.suffer_mood_disorder && "Mood disorder",
    row.suffer_fatigue && "Fatigue",
    row.suffer_decline_in_activity && "Decline in activity",
  ].filter(Boolean) as string[];
  const impacts = [
    row.impact_family_social && "Family/social",
    row.impact_work_income && "Work/income",
    row.impact_productivity_household && "Productivity",
    row.impact_exercise_sports && "Exercise/sports",
    row.impact_hobbies && "Hobbies",
  ].filter(Boolean) as string[];

  return (
    <div className="px-6 pb-6 pt-2 bg-gray-50/70 border-t border-[color:var(--border)] grid grid-cols-1 md:grid-cols-2 gap-6 text-[0.82rem]">
      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Personal</h4>
        <dl className="space-y-1 text-[color:var(--muted-foreground)]">
          {row.date_of_birth && <><dt className="inline font-medium text-[color:var(--foreground)]">DOB: </dt><dd className="inline">{row.date_of_birth}</dd><br /></>}
          {row.phone && <><dt className="inline font-medium text-[color:var(--foreground)]">Phone: </dt><dd className="inline">{row.phone}</dd><br /></>}
          {(row.city || row.state) && <><dt className="inline font-medium text-[color:var(--foreground)]">Location: </dt><dd className="inline">{[row.city, row.state, row.zip].filter(Boolean).join(", ")}</dd><br /></>}
          {row.occupation && <><dt className="inline font-medium text-[color:var(--foreground)]">Occupation: </dt><dd className="inline">{row.occupation}</dd><br /></>}
          {row.how_did_you_hear && <><dt className="inline font-medium text-[color:var(--foreground)]">Heard via: </dt><dd className="inline">{row.how_did_you_hear}</dd><br /></>}
          {row.is_pregnant !== null && <><dt className="inline font-medium text-[color:var(--foreground)]">Pregnant: </dt><dd className="inline">{row.is_pregnant ? "Yes" : "No"}</dd><br /></>}
        </dl>
      </div>

      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Symptoms</h4>
        {symptoms.length > 0 ? (
          <div className="flex flex-wrap gap-1.5">
            {symptoms.map((s) => (
              <span key={s} className="bg-teal-100 text-teal-800 text-[0.7rem] font-medium px-2 py-0.5 rounded-full">{s}</span>
            ))}
          </div>
        ) : <p className="text-[color:var(--muted-foreground)]">None selected</p>}
        {row.symptom_other_joint_pain && <p className="mt-1 text-[color:var(--muted-foreground)]"><span className="font-medium text-[color:var(--foreground)]">Other joint pain:</span> {row.symptom_other_joint_pain}</p>}
        {row.symptom_other_conditions && <p className="mt-1 text-[color:var(--muted-foreground)]"><span className="font-medium text-[color:var(--foreground)]">Other conditions:</span> {row.symptom_other_conditions}</p>}
      </div>

      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Chief Complaint</h4>
        {row.worst_symptom && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">Worst symptom:</span> {row.worst_symptom}</p>}
        {row.condition_duration && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">Duration:</span> {row.condition_duration}</p>}
        {row.condition_frequency && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">Frequency:</span> {row.condition_frequency}</p>}
        {row.pain_scale && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">Pain scale:</span> {row.pain_scale}/10</p>}
        {row.what_has_not_helped && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">What hasn&apos;t helped:</span> {row.what_has_not_helped}</p>}
        {row.life_in_3_years_if_worse && <p className="text-[color:var(--muted-foreground)] mb-1"><span className="font-medium text-[color:var(--foreground)]">Life if worse:</span> {row.life_in_3_years_if_worse}</p>}
        {row.life_if_resolved && <p className="text-[color:var(--muted-foreground)]"><span className="font-medium text-[color:var(--foreground)]">Life if resolved:</span> {row.life_if_resolved}</p>}
      </div>

      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Quality of Life</h4>
        {suffering.length > 0 && (
          <div className="mb-2">
            <p className="font-medium text-[color:var(--foreground)] mb-1">Currently suffering from:</p>
            <div className="flex flex-wrap gap-1.5">
              {suffering.map((s) => <span key={s} className="bg-amber-100 text-amber-800 text-[0.7rem] font-medium px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
          </div>
        )}
        {impacts.length > 0 && (
          <div>
            <p className="font-medium text-[color:var(--foreground)] mb-1">Life areas impacted:</p>
            <div className="flex flex-wrap gap-1.5">
              {impacts.map((s) => <span key={s} className="bg-red-100 text-red-700 text-[0.7rem] font-medium px-2 py-0.5 rounded-full">{s}</span>)}
            </div>
          </div>
        )}
        {suffering.length === 0 && impacts.length === 0 && <p className="text-[color:var(--muted-foreground)]">None selected</p>}
      </div>
    </div>
  );
}

export default function ConsultationsClient({ rows }: { rows: FormRow[] }) {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (r) =>
        (r.full_name || "").toLowerCase().includes(q) ||
        (r.email || "").toLowerCase().includes(q) ||
        (r.worst_symptom || "").toLowerCase().includes(q)
    );
  }, [rows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[1.5rem] font-bold text-[color:var(--foreground)]">Consultation Intakes</h1>
        <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mt-0.5">{rows.length} total submission{rows.length !== 1 ? "s" : ""}</p>
      </div>

      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search by name, email, or symptom…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-9 pr-4 py-2 text-[0.875rem] border border-[color:var(--border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)]"
        />
      </div>

      <div className="bg-white rounded-xl border border-[color:var(--border)] overflow-hidden">
        {paged.length === 0 ? (
          <p className="text-center text-[color:var(--muted-foreground)] py-12 text-[0.9rem]">No submissions found.</p>
        ) : (
          paged.map((row) => (
            <div key={row.id} className="border-b border-[color:var(--border)] last:border-0">
              <button
                type="button"
                onClick={() => toggle(row.id)}
                className="w-full text-left px-5 py-4 hover:bg-gray-50/60 transition-colors flex items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-semibold text-[0.9rem] text-[color:var(--foreground)] truncate">
                      {row.full_name || "Unknown"}
                    </span>
                    <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full shrink-0 ${row.member_id ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"}`}>
                      {row.member_id ? "Member" : "Guest"}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[0.78rem] text-[color:var(--muted-foreground)]">
                    <span>{row.email || "—"}</span>
                    {row.pain_scale && <span className="shrink-0">Pain: <strong className="text-[color:var(--foreground)]">{row.pain_scale}/10</strong></span>}
                    {row.worst_symptom && <span className="truncate hidden sm:block">{row.worst_symptom}</span>}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                    {new Date(row.submitted_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                  </span>
                  {expanded === row.id ? <ChevronUp className="w-4 h-4 text-[color:var(--muted-foreground)]" /> : <ChevronDown className="w-4 h-4 text-[color:var(--muted-foreground)]" />}
                </div>
              </button>
              {expanded === row.id && <ExpandedRow row={row} />}
            </div>
          ))
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[color:var(--border)] bg-gray-50/50">
            <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
              Showing {page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[0.75rem] text-[color:var(--muted-foreground)] px-2">Page {page + 1} of {totalPages}</span>
              <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1} className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
