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

  const firstName = asString(body.first_name);
  const phone     = asString(body.phone);
  const email     = asString(body.email);
  const zip       = asString(body.zip);
  const drip      = asString(body.drip);
  const timing    = asString(body.timing);
  const source    = asString(body.source);
  const consent          = body.consent === true;
  const coachingInterest = body.coaching_interest === true;

  if (!firstName || !phone || !email || !zip || !drip || !timing || !source) {
    return NextResponse.json({ error: "missing required fields" }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "invalid email" }, { status: 400 });
  }
  if (!ZIP_RE.test(zip)) {
    return NextResponse.json({ error: "invalid zip" }, { status: 400 });
  }
  if (!consent) {
    return NextResponse.json({ error: "consent required" }, { status: 400 });
  }

  const supabase = getAdminClient();
  const { error: dbError } = await supabase.from("iv_leads").insert({
    first_name: firstName,
    phone,
    email,
    zip,
    drip,
    timing,
    source,
    consent,
    consent_at: new Date().toISOString(),
    coaching_interest: coachingInterest,
  });

  if (dbError) {
    console.error("iv_leads insert error", dbError);
    return NextResponse.json({ error: "database error" }, { status: 500 });
  }

  // Send notification email to Sarina + Brandon
  try {
    const resend = new Resend(process.env.RESEND_API_KEY || "");
    const from = process.env.RESEND_FROM_EMAIL || "Saryn Health <hello@sarynhealth.com>";
    const notifyTo = [
      "sarina@sarynhealth.com",
      "sarinadeharo3@gmail.com",
      "brandonbolosky3@gmail.com",
      process.env.ADMIN_NOTIFICATION_EMAIL || "boloskys@gmail.com",
    ].filter((v, i, a) => Boolean(v) && a.indexOf(v) === i) as string[];

    const isCoachingOnly = drip === "coaching-only";
    const now = new Date();
    const ts = now.toLocaleString("en-US", {
      timeZone: "America/Los_Angeles",
      month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit", hour12: true,
    }).replace(" at ", " ");
    const emailSubject = isCoachingOnly
      ? `Coaching waitlist — ${firstName} · ${ts}`
      : `New IV request — ${firstName}, ${zip} · ${ts}`;

    await resend.emails.send({
      from,
      to: notifyTo,
      subject: emailSubject,
      html: `
<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:24px;">
  <h2 style="color:#2a9d8f;margin-bottom:16px;">${isCoachingOnly ? "Coaching waitlist signup" : "New IV hydration request"}</h2>
  <table style="width:100%;border-collapse:collapse;font-size:14px;">
    <tr><td style="padding:8px 0;color:#6b7280;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${firstName}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Phone</td><td style="padding:8px 0;"><a href="tel:${phone}">${phone}</a></td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;">${email}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">ZIP</td><td style="padding:8px 0;">${zip}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Drip</td><td style="padding:8px 0;">${drip}</td></tr>
    ${!isCoachingOnly ? `<tr><td style="padding:8px 0;color:#6b7280;">Timing</td><td style="padding:8px 0;">${timing}</td></tr>` : ""}
    <tr><td style="padding:8px 0;color:#6b7280;">Source</td><td style="padding:8px 0;">${source}</td></tr>
    <tr><td style="padding:8px 0;color:#6b7280;">Coaching interest</td><td style="padding:8px 0;">${coachingInterest ? "✅ Yes" : "No"}</td></tr>
  </table>
  ${!isCoachingOnly ? `
  <div style="margin-top:24px;background:#f0faf9;border:1px solid #a7d7d2;border-radius:8px;padding:16px;">
    <p style="margin:0 0 8px;font-size:13px;font-weight:600;color:#2a9d8f;">Suggested first text</p>
    <p style="margin:0;font-size:14px;color:#111827;line-height:1.6;">Hey ${firstName}, it's Sarina from TikTok — got your request for the ${drip} drip. What days/times work for you this week, and what's the address? Once we pick a time I'll send your booking link.</p>
  </div>` : ""}
</div>`,
    });
  } catch (emailErr) {
    console.error("iv_leads email error", emailErr);
    // don't fail the request if email fails
  }

  return NextResponse.json({ ok: true });
}
