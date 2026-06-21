"use client";

import { useState, useMemo } from "react";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  ArchiveRestore,
} from "lucide-react";
import { Q1_OPTIONS, Q2_OPTIONS, Q3_OPTIONS } from "@/lib/quiz";

export interface IntakeRow {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  health_goals: string | null;
  quiz_answers: {
    q1?: string;
    q2?: string[];
    q3?: string;
  } | null;
  user_id: string | null;
  reviewed?: boolean;
}

const PAGE_SIZE = 20;

function QuizSummary({ answers }: { answers: IntakeRow["quiz_answers"] }) {
  if (!answers) return <p className="text-[color:var(--muted-foreground)] italic text-[0.8rem]">No quiz answers recorded.</p>;

  const q1 = Q1_OPTIONS.find((o) => o.id === answers.q1)?.label;
  const q2 = (answers.q2 ?? [])
    .map((id) => Q2_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean) as string[];
  const q3 = Q3_OPTIONS.find((o) => o.id === answers.q3)?.label;

  return (
    <div className="space-y-2 text-[0.82rem]">
      {q1 && (
        <p className="text-[color:var(--muted-foreground)]">
          <span className="font-medium text-[color:var(--foreground)]">Health journey:</span> {q1}
        </p>
      )}
      {q2.length > 0 && (
        <div>
          <p className="font-medium text-[color:var(--foreground)] mb-1">Goals:</p>
          <div className="flex flex-wrap gap-1.5">
            {q2.map((g) => (
              <span key={g} className="bg-teal-100 text-teal-800 text-[0.7rem] font-medium px-2 py-0.5 rounded-full">{g}</span>
            ))}
          </div>
        </div>
      )}
      {q3 && (
        <p className="text-[color:var(--muted-foreground)]">
          <span className="font-medium text-[color:var(--foreground)]">Support sought:</span> {q3}
        </p>
      )}
      {!q1 && !q3 && q2.length === 0 && (
        <p className="text-[color:var(--muted-foreground)] italic">No answers recorded.</p>
      )}
    </div>
  );
}

function ExpandedRow({ row }: { row: IntakeRow }) {
  return (
    <div className="px-6 pb-6 pt-3 bg-gray-50/70 border-t border-[color:var(--border)] grid grid-cols-1 md:grid-cols-2 gap-6 text-[0.82rem]">
      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Contact</h4>
        <dl className="space-y-1 text-[color:var(--muted-foreground)]">
          <p><span className="font-medium text-[color:var(--foreground)]">Email:</span> {row.email}</p>
          {row.phone && <p><span className="font-medium text-[color:var(--foreground)]">Phone:</span> {row.phone}</p>}
          {row.health_goals && <p><span className="font-medium text-[color:var(--foreground)]">Health goals:</span> {row.health_goals}</p>}
          <p><span className="font-medium text-[color:var(--foreground)]">Type:</span> {row.user_id ? "Member" : "Guest"}</p>
        </dl>
      </div>
      <div>
        <h4 className="font-semibold text-[color:var(--foreground)] mb-2">Intake Answers</h4>
        <QuizSummary answers={row.quiz_answers} />
      </div>
    </div>
  );
}

export default function ConsultationsClient({ initialRows }: { initialRows: IntakeRow[] }) {
  const [rows, setRows] = useState<IntakeRow[]>(initialRows);
  const [tab, setTab] = useState<"active" | "archived">("active");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [toggling, setToggling] = useState<string | null>(null);

  async function toggleReviewed(row: IntakeRow) {
    setToggling(row.id);
    const newValue = !row.reviewed;
    try {
      const res = await fetch("/api/admin/consultations", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: row.id, reviewed: newValue }),
      });
      if (!res.ok) throw new Error("Failed");
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, reviewed: newValue } : r)));
      setExpanded(null);
    } catch {
      // ignore
    } finally {
      setToggling(null);
    }
  }

  const tabRows = useMemo(
    () => rows.filter((r) => (tab === "active" ? !r.reviewed : r.reviewed)),
    [rows, tab]
  );

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return tabRows;
    return tabRows.filter(
      (r) =>
        `${r.first_name} ${r.last_name}`.toLowerCase().includes(q) ||
        r.email.toLowerCase().includes(q)
    );
  }, [tabRows, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  const activeCount = rows.filter((r) => !r.reviewed).length;
  const archivedCount = rows.filter((r) => r.reviewed).length;
  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <div className="mb-6">
        <h1 className="text-[1.5rem] font-bold text-[color:var(--foreground)]">Consultation Intakes</h1>
        <p className="text-[0.85rem] text-[color:var(--muted-foreground)] mt-0.5">{rows.length} total submission{rows.length !== 1 ? "s" : ""}</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-5">
        <button
          onClick={() => { setTab("active"); setPage(0); setSearch(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold transition-colors ${tab === "active" ? "bg-[color:var(--primary)] text-white" : "bg-white border border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"}`}
        >
          <Circle className="w-3.5 h-3.5" />
          Active
          <span className={`text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full ${tab === "active" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>{activeCount}</span>
        </button>
        <button
          onClick={() => { setTab("archived"); setPage(0); setSearch(""); }}
          className={`flex items-center gap-2 px-4 py-2 rounded-full text-[0.85rem] font-semibold transition-colors ${tab === "archived" ? "bg-[color:var(--primary)] text-white" : "bg-white border border-[color:var(--border)] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)]"}`}
        >
          <ArchiveRestore className="w-3.5 h-3.5" />
          Archived
          <span className={`text-[0.7rem] font-bold px-1.5 py-0.5 rounded-full ${tab === "archived" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"}`}>{archivedCount}</span>
        </button>
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search by name or email…"
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(0); }}
          className="w-full pl-9 pr-4 py-2 text-[0.875rem] border border-[color:var(--border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)]"
        />
      </div>

      {/* List */}
      <div className="bg-white rounded-xl border border-[color:var(--border)] overflow-hidden">
        {paged.length === 0 ? (
          <p className="text-center text-[color:var(--muted-foreground)] py-12 text-[0.9rem]">
            {tab === "active" ? "No active submissions." : "No archived submissions yet."}
          </p>
        ) : (
          paged.map((row) => (
            <div key={row.id} className="border-b border-[color:var(--border)] last:border-0">
              <div className="flex items-center gap-2 pr-4">
                <button
                  type="button"
                  onClick={() => toggleReviewed(row)}
                  disabled={toggling === row.id}
                  title={row.reviewed ? "Move back to active" : "Mark as reviewed & archive"}
                  className={`ml-4 shrink-0 transition-all disabled:opacity-40 ${row.reviewed ? "text-[color:var(--primary)]" : "text-gray-300 hover:text-[color:var(--primary)]"}`}
                >
                  {toggling === row.id
                    ? <div className="w-5 h-5 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
                    : row.reviewed
                      ? <CheckCircle2 className="w-5 h-5" />
                      : <Circle className="w-5 h-5" />}
                </button>

                <button
                  type="button"
                  onClick={() => toggle(row.id)}
                  className="flex-1 text-left px-3 py-4 hover:bg-gray-50/60 transition-colors flex items-center gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-semibold text-[0.9rem] text-[color:var(--foreground)] truncate">
                        {row.first_name} {row.last_name}
                      </span>
                      <span className={`text-[0.65rem] font-semibold px-2 py-0.5 rounded-full shrink-0 ${row.user_id ? "bg-teal-100 text-teal-700" : "bg-gray-100 text-gray-600"}`}>
                        {row.user_id ? "Member" : "Guest"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[0.78rem] text-[color:var(--muted-foreground)]">
                      <span>{row.email}</span>
                      {row.quiz_answers?.q1 && (
                        <span className="truncate hidden sm:block">
                          {Q1_OPTIONS.find((o) => o.id === row.quiz_answers?.q1)?.label}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                      {new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {expanded === row.id
                      ? <ChevronUp className="w-4 h-4 text-[color:var(--muted-foreground)]" />
                      : <ChevronDown className="w-4 h-4 text-[color:var(--muted-foreground)]" />}
                  </div>
                </button>
              </div>
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
