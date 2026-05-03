import { NextRequest, NextResponse } from "next/server";
import { sendConsultationLeadConfirmationEmail } from "@/lib/email";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Body {
  email?: unknown;
  first_name?: unknown;
}

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function POST(request: NextRequest) {
  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const email = asString(body.email);
  const firstName = asString(body.first_name);

  if (!email || !firstName || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "missing or invalid fields" }, { status: 400 });
  }

  const result = await sendConsultationLeadConfirmationEmail({ email, firstName });
  if (!result.success) {
    console.warn("Lead confirmation email failed:", result.error);
    return NextResponse.json({ error: "failed to send" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
