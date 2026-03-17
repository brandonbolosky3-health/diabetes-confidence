"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import {
  Users,
  CreditCard,
  Crown,
  Star,
  Search,
  ChevronLeft,
  ChevronRight,
  Copy,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface MemberRow {
  user_id: string;
  email: string;
  joined_at: string;
  first_name: string | null;
  primary_track: string | null;
  primary_goal: string | null;
  onboarding_complete: boolean | null;
  tier: string | null;
  subscription_status: string | null;
  stripe_customer_id: string | null;
  ai_messages_this_month: number;
  chunks_viewed: number;
}

type SortField = "joined_at" | "tier" | "ai_messages_this_month";
type SortDir = "asc" | "desc";

const PAGE_SIZE = 25;

const TIER_STYLES: Record<string, string> = {
  premium: "bg-amber-100 text-amber-800",
  essential: "bg-teal-100 text-teal-700",
  free: "bg-gray-100 text-gray-600",
};

const STATUS_STYLES: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  inactive: "bg-gray-100 text-gray-600",
  canceled: "bg-red-100 text-red-700",
  past_due: "bg-amber-100 text-amber-700",
  trialing: "bg-blue-100 text-blue-700",
};

export default function AdminPage() {
  const [members, setMembers] = useState<MemberRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<SortField>("joined_at");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [page, setPage] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("admin_member_overview")
        .select("*")
        .order("joined_at", { ascending: false });

      if (data) setMembers(data as MemberRow[]);
      setLoading(false);
    };
    load();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    let result = members;
    if (q) {
      result = result.filter(
        (m) =>
          (m.email || "").toLowerCase().includes(q) ||
          (m.first_name || "").toLowerCase().includes(q)
      );
    }
    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === "joined_at") {
        cmp =
          new Date(a.joined_at).getTime() - new Date(b.joined_at).getTime();
      } else if (sortField === "tier") {
        const order: Record<string, number> = {
          premium: 3,
          essential: 2,
          free: 1,
        };
        cmp = (order[a.tier || "free"] || 0) - (order[b.tier || "free"] || 0);
      } else if (sortField === "ai_messages_this_month") {
        cmp = a.ai_messages_this_month - b.ai_messages_this_month;
      }
      return sortDir === "desc" ? -cmp : cmp;
    });
    return result;
  }, [members, search, sortField, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paged = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("desc");
    }
    setPage(0);
  };

  const copyStripeId = (id: string | null) => {
    if (!id) return;
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Stats
  const totalMembers = members.length;
  const activeSubscriptions = members.filter(
    (m) => m.subscription_status === "active"
  ).length;
  const premiumMembers = members.filter((m) => m.tier === "premium").length;
  const essentialMembers = members.filter((m) => m.tier === "essential").length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-2 border-[color:var(--primary)] border-t-transparent animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 py-8">
      <h1 className="text-[1.5rem] font-bold text-[color:var(--foreground)] mb-6">
        Member Dashboard
      </h1>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Total Members"
          value={totalMembers}
        />
        <StatCard
          icon={<CreditCard className="w-5 h-5" />}
          label="Active Subscriptions"
          value={activeSubscriptions}
          color="text-green-600"
        />
        <StatCard
          icon={<Crown className="w-5 h-5" />}
          label="Premium Members"
          value={premiumMembers}
          color="text-amber-600"
        />
        <StatCard
          icon={<Star className="w-5 h-5" />}
          label="Essential Members"
          value={essentialMembers}
          color="text-teal-600"
        />
      </div>

      {/* Search */}
      <div className="mb-4 relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[color:var(--muted-foreground)]" />
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full pl-9 pr-4 py-2 text-[0.875rem] border border-[color:var(--border)] rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[color:var(--primary)]/30 focus:border-[color:var(--primary)]"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-[color:var(--border)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-[0.8rem]">
            <thead>
              <tr className="border-b border-[color:var(--border)] bg-gray-50/50">
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Name / Email
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)] cursor-pointer select-none"
                  onClick={() => toggleSort("joined_at")}
                >
                  <span className="flex items-center gap-1">
                    Joined <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Onboarding
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Track
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)] cursor-pointer select-none"
                  onClick={() => toggleSort("tier")}
                >
                  <span className="flex items-center gap-1">
                    Tier <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Status
                </th>
                <th
                  className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)] cursor-pointer select-none"
                  onClick={() => toggleSort("ai_messages_this_month")}
                >
                  <span className="flex items-center gap-1">
                    AI Msgs <ArrowUpDown className="w-3 h-3" />
                  </span>
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Chunks
                </th>
                <th className="text-left px-4 py-3 font-semibold text-[color:var(--foreground)]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {paged.map((m) => (
                <tr
                  key={m.user_id}
                  className="border-b border-[color:var(--border)] last:border-0 hover:bg-gray-50/50 transition-colors"
                >
                  <td className="px-4 py-3">
                    <div className="font-medium text-[color:var(--foreground)]">
                      {m.first_name || "—"}
                    </div>
                    <div className="text-[color:var(--muted-foreground)] text-[0.75rem]">
                      {m.email}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted-foreground)]">
                    {new Date(m.joined_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-full ${
                        m.onboarding_complete
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {m.onboarding_complete ? "Complete" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted-foreground)] capitalize">
                    {(m.primary_track || "—").replace(/_/g, " ")}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        TIER_STYLES[m.tier || "free"] || TIER_STYLES.free
                      }`}
                    >
                      {m.tier || "free"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[0.7rem] font-semibold px-2 py-0.5 rounded-full capitalize ${
                        STATUS_STYLES[m.subscription_status || "inactive"] ||
                        STATUS_STYLES.inactive
                      }`}
                    >
                      {(m.subscription_status || "inactive").replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted-foreground)]">
                    {m.ai_messages_this_month}
                  </td>
                  <td className="px-4 py-3 text-[color:var(--muted-foreground)]">
                    {m.chunks_viewed}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Link
                        href={`/admin/members/${m.user_id}`}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[color:var(--primary)] transition-colors"
                        title="View member"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => copyStripeId(m.stripe_customer_id)}
                        disabled={!m.stripe_customer_id}
                        className="p-1.5 rounded-md hover:bg-gray-100 text-[color:var(--muted-foreground)] transition-colors disabled:opacity-30"
                        title={
                          m.stripe_customer_id
                            ? copiedId === m.stripe_customer_id
                              ? "Copied!"
                              : "Copy Stripe ID"
                            : "No Stripe ID"
                        }
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {paged.length === 0 && (
                <tr>
                  <td
                    colSpan={9}
                    className="px-4 py-8 text-center text-[color:var(--muted-foreground)]"
                  >
                    No members found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-[color:var(--border)] bg-gray-50/50">
            <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
              Showing {page * PAGE_SIZE + 1}–
              {Math.min((page + 1) * PAGE_SIZE, filtered.length)} of{" "}
              {filtered.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-[0.75rem] text-[color:var(--muted-foreground)] px-2">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() =>
                  setPage((p) => Math.min(totalPages - 1, p + 1))
                }
                disabled={page >= totalPages - 1}
                className="p-1.5 rounded-md hover:bg-gray-200 disabled:opacity-30 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  color?: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-[color:var(--border)] p-4">
      <div
        className={`mb-2 ${color || "text-[color:var(--muted-foreground)]"}`}
      >
        {icon}
      </div>
      <p className="text-[1.5rem] font-bold text-[color:var(--foreground)]">
        {value}
      </p>
      <p className="text-[0.75rem] text-[color:var(--muted-foreground)]">
        {label}
      </p>
    </div>
  );
}
