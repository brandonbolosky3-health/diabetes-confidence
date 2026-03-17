import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase-admin";
import {
  ArrowLeft,
  User,
  CreditCard,
  MessageCircle,
  BookOpen,
  Bot,
  ExternalLink,
} from "lucide-react";

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function MemberDetailPage({ params }: PageProps) {
  const { userId } = await params;

  // Verify admin access
  const supabase = await createClient();
  const {
    data: { user: adminUser },
  } = await supabase.auth.getUser();
  if (!adminUser) redirect("/login");

  const adminEmails = (process.env.ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!adminEmails.includes((adminUser.email || "").toLowerCase()))
    redirect("/dashboard");

  // Use admin client for all queries
  const admin = createAdminClient();

  // Fetch all data in parallel
  const [
    { data: userAuth },
    { data: memberProfile },
    { data: subscriptionRow },
    { data: aiUsageRows },
    { data: progressRows },
    { data: sessionRows },
  ] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    admin
      .from("member_profiles")
      .select("*")
      .eq("user_id", userId)
      .single(),
    admin
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .single(),
    admin
      .from("ai_usage")
      .select("*")
      .eq("user_id", userId)
      .order("month", { ascending: false }),
    admin
      .from("member_education_progress")
      .select("*, knowledge_chunks(chunk_title, primary_track)")
      .eq("user_id", userId)
      .order("last_viewed_at", { ascending: false }),
    admin
      .from("coaching_sessions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const authUser = userAuth?.user;
  if (!authUser) redirect("/admin");

  const profile = memberProfile as Record<string, unknown> | null;
  const sub = subscriptionRow as Record<string, unknown> | null;

  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-[0.8rem] text-[color:var(--muted-foreground)] hover:text-[color:var(--foreground)] transition-colors mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        Back to members
      </Link>

      <h1 className="text-[1.5rem] font-bold text-[color:var(--foreground)] mb-1">
        {authUser.user_metadata?.first_name || authUser.email}
      </h1>
      <p className="text-[0.875rem] text-[color:var(--muted-foreground)] mb-8">
        {authUser.email}
      </p>

      <div className="space-y-6">
        {/* Profile Section */}
        <Section icon={<User className="w-4 h-4" />} title="Profile">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Email" value={authUser.email || "—"} />
            <Field
              label="Joined"
              value={new Date(authUser.created_at).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            />
            <Field
              label="Onboarding"
              value={profile?.onboarding_complete ? "Complete" : "Pending"}
              badge={profile?.onboarding_complete ? "green" : "amber"}
            />
            {Boolean(profile?.onboarding_completed_at) && (
              <Field
                label="Completed At"
                value={new Date(
                  profile!.onboarding_completed_at as string
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            )}
            <Field
              label="Primary Goal"
              value={
                ((profile?.primary_goal as string) || "—").replace(/_/g, " ")
              }
            />
            <Field
              label="Primary Track"
              value={
                ((profile?.primary_track as string) || "—").replace(/_/g, " ")
              }
            />
            <Field
              label="Diagnoses"
              value={
                Array.isArray(profile?.diagnoses)
                  ? (profile.diagnoses as string[]).join(", ") || "None"
                  : "—"
              }
            />
            <Field
              label="Challenge"
              value={
                ((profile?.challenge as string) || "—").replace(/_/g, " ")
              }
            />
            <Field
              label="Interests"
              value={
                Array.isArray(profile?.interests)
                  ? (profile.interests as string[]).join(", ") || "None"
                  : "—"
              }
            />
            <Field
              label="Learning Style"
              value={
                ((profile?.learning_style as string) || "—").replace(/_/g, " ")
              }
            />
          </div>
        </Section>

        {/* Subscription Section */}
        <Section icon={<CreditCard className="w-4 h-4" />} title="Subscription">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field
              label="Tier"
              value={((sub?.tier as string) || "free")}
              badge={
                sub?.tier === "premium"
                  ? "amber"
                  : sub?.tier === "essential"
                    ? "teal"
                    : "gray"
              }
            />
            <Field
              label="Status"
              value={((sub?.status as string) || "inactive").replace("_", " ")}
              badge={
                sub?.status === "active"
                  ? "green"
                  : sub?.status === "past_due"
                    ? "amber"
                    : sub?.status === "canceled"
                      ? "red"
                      : "gray"
              }
            />
            <Field
              label="Stripe Customer ID"
              value={(sub?.stripe_customer_id as string) || "—"}
              mono
            />
            <Field
              label="Stripe Subscription ID"
              value={(sub?.stripe_subscription_id as string) || "—"}
              mono
            />
            {Boolean(sub?.current_period_end) && (
              <Field
                label="Current Period End"
                value={new Date(
                  sub!.current_period_end as string
                ).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            )}
            {Boolean(sub?.stripe_customer_id) && (
              <div>
                <p className="text-[0.7rem] text-[color:var(--muted-foreground)] mb-1">
                  Stripe Dashboard
                </p>
                <a
                  href={`https://dashboard.stripe.com/customers/${sub!.stripe_customer_id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.8rem] text-[color:var(--primary)] font-medium hover:underline inline-flex items-center gap-1"
                >
                  View in Stripe <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>
        </Section>

        {/* AI Usage Section */}
        <Section icon={<MessageCircle className="w-4 h-4" />} title="AI Usage">
          {aiUsageRows && aiUsageRows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-[0.8rem]">
                <thead>
                  <tr className="border-b border-[color:var(--border)]">
                    <th className="text-left px-3 py-2 font-semibold text-[color:var(--foreground)]">
                      Month
                    </th>
                    <th className="text-left px-3 py-2 font-semibold text-[color:var(--foreground)]">
                      Messages
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {aiUsageRows.map(
                    (row: { month: string; message_count: number }) => (
                      <tr
                        key={row.month}
                        className="border-b border-[color:var(--border)] last:border-0"
                      >
                        <td className="px-3 py-2 text-[color:var(--foreground)]">
                          {row.month}
                        </td>
                        <td className="px-3 py-2 text-[color:var(--muted-foreground)]">
                          {row.message_count} / 50
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-[0.8rem] text-[color:var(--muted-foreground)]">
              No AI usage yet.
            </p>
          )}
        </Section>

        {/* Education Progress Section */}
        <Section
          icon={<BookOpen className="w-4 h-4" />}
          title="Education Progress"
        >
          {progressRows && progressRows.length > 0 ? (
            <div className="space-y-2">
              {(() => {
                // Group by track
                const byTrack: Record<
                  string,
                  Array<{
                    chunk_title: string;
                    last_viewed_at: string;
                    view_count: number;
                  }>
                > = {};
                for (const row of progressRows) {
                  const chunk = row.knowledge_chunks as {
                    chunk_title: string;
                    primary_track: string;
                  } | null;
                  const track = chunk?.primary_track || "unknown";
                  if (!byTrack[track]) byTrack[track] = [];
                  byTrack[track].push({
                    chunk_title: chunk?.chunk_title || "Unknown chunk",
                    last_viewed_at: row.last_viewed_at as string,
                    view_count: (row.view_count as number) || 1,
                  });
                }
                return Object.entries(byTrack).map(([track, items]) => (
                  <div key={track} className="mb-4">
                    <p className="text-[0.75rem] font-semibold text-[color:var(--foreground)] capitalize mb-2">
                      {track.replace(/_/g, " ")}
                    </p>
                    <div className="space-y-1">
                      {items.map((item, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-[0.8rem] py-1.5 px-3 rounded-lg bg-gray-50"
                        >
                          <span className="text-[color:var(--foreground)]">
                            {item.chunk_title}
                          </span>
                          <span className="text-[0.7rem] text-[color:var(--muted-foreground)] shrink-0 ml-3">
                            {item.view_count}x &middot;{" "}
                            {new Date(item.last_viewed_at).toLocaleDateString(
                              "en-US",
                              { month: "short", day: "numeric" }
                            )}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ));
              })()}
            </div>
          ) : (
            <p className="text-[0.8rem] text-[color:var(--muted-foreground)]">
              No chunks viewed yet.
            </p>
          )}
        </Section>

        {/* Recent Coaching Sessions */}
        <Section
          icon={<Bot className="w-4 h-4" />}
          title="Recent Coaching Sessions"
        >
          {sessionRows && sessionRows.length > 0 ? (
            <div className="space-y-3">
              {sessionRows.map(
                (session: {
                  id: string;
                  created_at: string;
                  messages: Array<{ role: string; content: string }> | null;
                }) => {
                  const msgs = session.messages || [];
                  const firstUserMsg = msgs.find((m) => m.role === "user");
                  return (
                    <div
                      key={session.id}
                      className="p-3 rounded-lg bg-gray-50 border border-[color:var(--border)]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[0.75rem] text-[color:var(--muted-foreground)]">
                          {new Date(session.created_at).toLocaleDateString(
                            "en-US",
                            {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </span>
                        <span className="text-[0.7rem] text-[color:var(--muted-foreground)]">
                          {msgs.length} messages
                        </span>
                      </div>
                      {firstUserMsg && (
                        <p className="text-[0.8rem] text-[color:var(--foreground)] line-clamp-2">
                          {firstUserMsg.content}
                        </p>
                      )}
                    </div>
                  );
                }
              )}
            </div>
          ) : (
            <p className="text-[0.8rem] text-[color:var(--muted-foreground)]">
              No coaching sessions yet.
            </p>
          )}
        </Section>
      </div>
    </div>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-[color:var(--border)] p-5">
      <h2 className="text-[0.95rem] font-semibold text-[color:var(--foreground)] flex items-center gap-2 mb-4">
        <span className="text-[color:var(--primary)]">{icon}</span>
        {title}
      </h2>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  badge,
  mono,
}: {
  label: string;
  value: string;
  badge?: "green" | "amber" | "red" | "teal" | "gray";
  mono?: boolean;
}) {
  const badgeStyles: Record<string, string> = {
    green: "bg-green-100 text-green-700",
    amber: "bg-amber-100 text-amber-800",
    red: "bg-red-100 text-red-700",
    teal: "bg-teal-100 text-teal-700",
    gray: "bg-gray-100 text-gray-600",
  };

  return (
    <div>
      <p className="text-[0.7rem] text-[color:var(--muted-foreground)] mb-1">
        {label}
      </p>
      {badge ? (
        <span
          className={`text-[0.75rem] font-semibold px-2 py-0.5 rounded-full capitalize ${badgeStyles[badge]}`}
        >
          {value}
        </span>
      ) : (
        <p
          className={`text-[0.8rem] text-[color:var(--foreground)] capitalize ${mono ? "font-mono text-[0.75rem]" : ""}`}
        >
          {value}
        </p>
      )}
    </div>
  );
}
