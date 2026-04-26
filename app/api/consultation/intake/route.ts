import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { sendIntakeNotificationEmail } from "@/lib/email";
import { Q1_OPTIONS, Q2_OPTIONS, Q3_OPTIONS, type QuizAnswers } from "@/lib/quiz";

// Service-role client so the public form can write through RLS without
// requiring an authenticated session. The "Allow public insert" RLS policy
// would also work via the anon key, but using the service role keeps the
// behavior predictable across environments.
function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface IntakeBody {
  first_name?: unknown;
  last_name?: unknown;
  email?: unknown;
  phone?: unknown;
  health_goals?: unknown;
  quiz_answers?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_GOALS = 500;

function asString(value: unknown, max?: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  if (!trimmed) return null;
  if (max && trimmed.length > max) return trimmed.slice(0, max);
  return trimmed;
}

function summarizeQuiz(answers: unknown): string | null {
  if (!answers || typeof answers !== "object") return null;
  const a = answers as Partial<QuizAnswers>;
  const lines: string[] = [];
  const q1 = Q1_OPTIONS.find((o) => o.id === a.q1)?.label;
  if (q1) lines.push(`Where are you in your health journey? ${q1}`);
  if (Array.isArray(a.q2) && a.q2.length) {
    const labels = a.q2
      .map((id) => Q2_OPTIONS.find((o) => o.id === id)?.label)
      .filter(Boolean) as string[];
    if (labels.length) lines.push(`Main goals: ${labels.join(", ")}`);
  }
  const q3 = Q3_OPTIONS.find((o) => o.id === a.q3)?.label;
  if (q3) lines.push(`Support sought: ${q3}`);
  return lines.length ? lines.join("\n") : null;
}

export async function POST(request: NextRequest) {
  let body: IntakeBody;
  try {
    body = (await request.json()) as IntakeBody;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const firstName = asString(body.first_name);
  const lastName = asString(body.last_name);
  const email = asString(body.email);
  const healthGoals = asString(body.health_goals, MAX_GOALS);
  const phone = asString(body.phone);

  if (!firstName || !lastName || !email || !healthGoals) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { data, error } = await supabase
    .from("consultation_intakes")
    .insert({
      first_name: firstName,
      last_name: lastName,
      email,
      phone: phone ?? null,
      health_goals: healthGoals,
      quiz_answers: body.quiz_answers ?? null,
    })
    .select("id")
    .single();

  if (error) {
    console.error("consultation_intakes insert failed:", error);
    return NextResponse.json({ error: "failed to save intake" }, { status: 500 });
  }

  // Notify Sarina. Email is non-critical — the intake row is the source of
  // truth, so we don't fail the request if the send errors out.
  sendIntakeNotificationEmail({
    firstName,
    lastName,
    email,
    phone,
    healthGoals,
    quizSummary: summarizeQuiz(body.quiz_answers),
  }).catch((e) => console.warn("Intake notification email failed:", e));

  return NextResponse.json({ success: true, id: data.id }, { status: 200 });
}
