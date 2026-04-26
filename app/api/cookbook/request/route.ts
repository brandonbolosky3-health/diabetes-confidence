import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { sendCookbookDeliveryEmail } from "@/lib/email";

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

interface CookbookBody {
  first_name?: unknown;
  email?: unknown;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function asString(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

export async function POST(request: NextRequest) {
  let body: CookbookBody;
  try {
    body = (await request.json()) as CookbookBody;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const firstName = asString(body.first_name);
  const email = asString(body.email);

  if (!firstName || !email) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }

  const supabase = getAdminClient();

  const { error } = await supabase
    .from("cookbook_requests")
    .insert({ first_name: firstName, email });

  if (error) {
    console.error("cookbook_requests insert failed:", error);
    return NextResponse.json({ error: "failed to save request" }, { status: 500 });
  }

  // Email is non-critical for the response — the row is captured either way,
  // and Sarina can resend manually if needed.
  sendCookbookDeliveryEmail(email, firstName).catch((e) =>
    console.warn("Cookbook delivery email failed:", e)
  );

  return NextResponse.json({ success: true }, { status: 200 });
}
