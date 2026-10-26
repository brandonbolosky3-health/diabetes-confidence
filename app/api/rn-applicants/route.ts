import { NextRequest, NextResponse } from "next/server";
import { createClient as createSupabaseAdmin } from "@supabase/supabase-js";
import { Resend } from "resend";

function getAdminClient() {
  return createSupabaseAdmin(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ZIP_RE = /^\d{5}$/;

function asString(v: unknown, max = 200): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim();
  return t ? t.slice(0, max) : null;
}

export async function POST(request: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  const firstName      = asString(body.first_name);
  const lastName       = asString(body.last_name);
  const phone          = asString(body.phone);
  const email          = asString(body.email);
  const ivExperience   = asString(body.iv_experience);
  const zip            = asString(body.zip);
  const licenseConfirm = body.license_confirm === true;
  const contactConsent = body.contact_consent === true;

  const availability = Array.isArray(body.availability)
    ? (body.availability as unknown[]).filter((v): v is string => typeof v === "string").join(", ")
    : "";

  if (!firstName || !lastName || !phone || !email || !ivExperience || !zip || !availability) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!ZIP_RE.test(zip)) {
    return NextResponse.json({ error: "invalid zip" }, { status: 400 });
  }
  if (!licenseConfirm || !contactConsent) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error: dbError } = await supabase.from("rn_applicants").insert({
    first_name: firstName,
    last_name: lastName,
    phone,
    email,
    iv_experience: ivExperience,
    availability,
    zip,
    license_confirm: licenseConfirm,
    contact_consent: contactConsent,
  });

  if (dbError) {
    console.error("rn_applicants insert error", dbError);
    return NextResponse.json({ error: "database error" }, { status: 500 });
  }

  try {
    const resend = new Resend(process.env.RESEND_API_KEY || "");
    const from = process.env.RESEND_FROM_EMAIL || "Saryn Health <hello@sarynhealth.com>";
    const notifyTo = [
      "sarina@sarynhealth.com",
      "brandonbolosky3@gmail.com",
    ] as string[];

    await resend.emails.send({
      from,
      to: notifyTo,
      subject: `RN applicant — ${firstName} ${lastName}, ${zip}`,
      html: `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#2a9d8f;margin-bottom:16px;">New RN applicant</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px 0;color:#6b7280;width:160px;">Name</td><td style="padding:8px 0;font-weight:600;">${firstName} ${lastName}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;">${email}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">IV experience</td><td style="padding:8px 0;">${ivExperience}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Availability</td><td style="padding:8px 0;">${availability}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Home ZIP</td><td style="padding:8px 0;">${zip}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">CA RN license</td><td style="padding:8px 0;">${licenseConfirm ? "✅ Confirmed" : "No"}</td></tr>
  </table>
</div>`,
    });
  } catch (emailErr) {
    console.error("rn_applicants email error", emailErr);
  }

  return NextResponse.json({ ok: true });
}
