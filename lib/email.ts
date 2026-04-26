import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) {
    _resend = new Resend(process.env.RESEND_API_KEY || "");
  }
  return _resend;
}
const from = process.env.RESEND_FROM_EMAIL || "Saryn Health <hello@sarynhealth.com>";
const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
// Where intake notifications go. Falls back to RESEND_FROM_EMAIL so we
// never silently drop the message if the env var is unset.
const adminNotifyTo =
  process.env.ADMIN_NOTIFICATION_EMAIL ||
  process.env.RESEND_FROM_EMAIL ||
  "hello@sarynhealth.com";

// ─── Shared Layout ─────────────────────────────────────────────────────────

function emailLayout(body: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:#f0f7f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f0f7f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background-color:#2a9d8f;padding:24px 32px;border-radius:12px 12px 0 0;">
          <span style="color:#ffffff;font-size:24px;font-weight:500;letter-spacing:-0.5px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;">saryn</span><span style="color:rgba(255,255,255,0.65);font-size:11px;font-weight:500;letter-spacing:2.4px;margin-left:12px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Inter,system-ui,sans-serif;">HEALTH</span>
        </td></tr>
        <!-- Body -->
        <tr><td style="background-color:#ffffff;padding:32px;border-radius:0 0 12px 12px;">
          ${body}
        </td></tr>
        <!-- Footer -->
        <tr><td style="padding:24px 32px;text-align:center;">
          <p style="color:#6b7280;font-size:12px;margin:0 0 4px;">Saryn Health — Personalized metabolic health education</p>
          <p style="color:#9ca3af;font-size:11px;margin:0;">You're receiving this because you have an account at Saryn Health.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function ctaButton(href: string, text: string): string {
  return `<table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
    <tr><td align="center">
      <a href="${href}" style="display:inline-block;background-color:#2a9d8f;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;padding:12px 32px;border-radius:9999px;">
        ${text}
      </a>
    </td></tr>
  </table>`;
}

function p(text: string): string {
  return `<p style="color:#1e3a3a;font-size:15px;line-height:1.6;margin:0 0 16px;">${text}</p>`;
}

// ─── Email Functions ────────────────────────────────────────────────────────

export async function sendWelcomeEmail(
  to: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await getResend().emails.send({
      from,
      to,
      subject: "Welcome to Saryn Health 🩺",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`Welcome to <strong>Saryn Health</strong> — your personalized diabetes and metabolic health education platform powered by functional medicine.`)}
        ${p(`We're here to help you understand your numbers, optimize your nutrition, and build lasting confidence in managing your health.`)}
        ${p(`Your first step is completing a short health assessment so we can personalize your curriculum to your specific goals and needs.`)}
        ${ctaButton(`${appUrl}/onboarding`, "Start My Health Assessment")}
        ${p(`We're excited to have you here.`)}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendOnboardingCompleteEmail(
  to: string,
  firstName: string,
  primaryTrack: string,
  topInterests: string[]
): Promise<{ success: boolean; error?: string }> {
  const interestsList = topInterests.map((i) => `<li style="color:#1e3a3a;font-size:14px;padding:2px 0;">${i.replace(/_/g, " ")}</li>`).join("");
  try {
    await getResend().emails.send({
      from,
      to,
      subject: "Your personalized curriculum is ready",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`Congratulations on completing your health assessment! 🎉`)}
        ${p(`Based on your answers, your <strong>primary learning track</strong> is: <strong>${primaryTrack.replace(/_/g, " ")}</strong>.`)}
        ${topInterests.length > 0 ? `${p(`Your top interests:`)}
        <ul style="margin:0 0 16px;padding-left:20px;">${interestsList}</ul>` : ""}
        ${p(`Your dashboard now shows personalized lessons chosen specifically for your health goals. We've curated the best content to get you started.`)}
        ${ctaButton(`${appUrl}/dashboard`, "View My Dashboard")}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendPaymentConfirmationEmail(
  to: string,
  firstName: string,
  tier: string,
  amount: number,
  nextBillingDate: string
): Promise<{ success: boolean; error?: string }> {
  const tierName = tier.charAt(0).toUpperCase() + tier.slice(1);
  const features =
    tier === "premium"
      ? `<ul style="margin:0 0 16px;padding-left:20px;">
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Full educational curriculum</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Personalized learning path</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Anti-inflammatory meal plans</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Community access</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Unlimited AI health coach</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Personalized lab interpretation</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Peptide &amp; advanced optimization content</li>
        </ul>`
      : `<ul style="margin:0 0 16px;padding-left:20px;">
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Full educational curriculum</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Personalized learning path</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Anti-inflammatory meal plans</li>
          <li style="color:#1e3a3a;font-size:14px;padding:2px 0;">Community access</li>
        </ul>`;

  const formattedDate = new Date(nextBillingDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  try {
    await getResend().emails.send({
      from,
      to,
      subject: `Payment confirmed — welcome to Saryn Health ${tierName}`,
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`Your payment of <strong>$${amount.toFixed(2)}</strong> for the <strong>${tierName}</strong> plan has been confirmed.`)}
        ${p(`Here's what's included in your plan:`)}
        ${features}
        ${p(`Your next billing date is <strong>${formattedDate}</strong>.`)}
        ${ctaButton(`${appUrl}/dashboard`, "Go to Dashboard")}
        ${p(`Thank you for investing in your health.`)}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendSubscriptionCanceledEmail(
  to: string,
  firstName: string,
  accessUntil: string
): Promise<{ success: boolean; error?: string }> {
  const formattedDate = new Date(accessUntil).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  try {
    await getResend().emails.send({
      from,
      to,
      subject: "Your Saryn Health subscription has been canceled",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`We've confirmed the cancellation of your subscription.`)}
        ${p(`You'll retain access to your current plan features until <strong>${formattedDate}</strong>.`)}
        ${p(`Your progress, profile, and all completed lessons are saved — they'll be right where you left them if you decide to come back.`)}
        ${ctaButton(`${appUrl}/pricing`, "Resubscribe Anytime")}
        ${p(`We hope to see you again soon.`)}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendUsageLimitWarningEmail(
  to: string,
  firstName: string,
  used: number,
  limit: number,
  resetDate: string
): Promise<{ success: boolean; error?: string }> {
  const formattedDate = new Date(resetDate).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  try {
    await getResend().emails.send({
      from,
      to,
      subject: "You're running low on AI coaching messages",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`You've used <strong>${used}</strong> out of <strong>${limit}</strong> AI coaching messages this month.`)}
        ${p(`Your messages will reset on <strong>${formattedDate}</strong>.`)}
        ${p(`In the meantime, you still have full access to all of your educational content, lessons, and community features.`)}
        ${ctaButton(`${appUrl}/dashboard`, "Go to Dashboard")}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendMonthlyResetEmail(
  to: string,
  firstName: string,
  limit: number
): Promise<{ success: boolean; error?: string }> {
  try {
    await getResend().emails.send({
      from,
      to,
      subject: "Your AI coaching messages have reset",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`Great news — your <strong>${limit}</strong> AI coaching messages have refreshed for the new month! 🎉`)}
        ${p(`Your AI health coach is ready to help you with anything — whether it's understanding your latest lab results, optimizing your nutrition, or building better daily habits.`)}
        ${ctaButton(`${appUrl}/dashboard`, "Ask the AI Coach")}
        ${p(`Here's to another great month of progress.`)}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

export async function sendPreConsultationReminderEmail(
  to: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    await getResend().emails.send({
      from,
      to,
      subject:
        "Your call is coming up — please complete your pre-consultation form",
      html: emailLayout(`
        ${p(`Hi ${firstName},`)}
        ${p(`Your upcoming consultation is approaching! To make the most of your time together, please complete your pre-consultation form so your practitioner can review your health history beforehand.`)}
        ${ctaButton(`${appUrl}/consultation-form`, "Complete Your Form")}
        ${p(`Taking a few minutes to fill this out will help us personalize your session and focus on what matters most to you.`)}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

// ─── Public funnel emails (consultation + cookbook) ─────────────────────────

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export interface IntakeNotificationParams {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  healthGoals: string;
  quizSummary?: string | null;
}

/**
 * Notifies Sarina (or whoever ADMIN_NOTIFICATION_EMAIL points to) that a new
 * free-consultation intake has come in. Includes the goals and any quiz
 * context so she can prep before the Practice Better call.
 */
export async function sendIntakeNotificationEmail(
  params: IntakeNotificationParams
): Promise<{ success: boolean; error?: string }> {
  try {
    const { firstName, lastName, email, phone, healthGoals, quizSummary } = params;
    const fullName = `${firstName} ${lastName}`.trim();
    await getResend().emails.send({
      from,
      to: adminNotifyTo,
      replyTo: email,
      subject: `New free consultation intake — ${fullName}`,
      html: emailLayout(`
        ${p(`<strong>New consultation intake</strong>`)}
        ${p(`<strong>Name:</strong> ${escapeHtml(fullName)}`)}
        ${p(`<strong>Email:</strong> ${escapeHtml(email)}`)}
        ${phone ? p(`<strong>Phone:</strong> ${escapeHtml(phone)}`) : ""}
        ${p(`<strong>Top health goals:</strong><br>${escapeHtml(healthGoals).replace(/\n/g, "<br>")}`)}
        ${quizSummary ? p(`<strong>Quiz answers:</strong><br>${escapeHtml(quizSummary).replace(/\n/g, "<br>")}`) : ""}
        ${p(`Reply directly to this email to reach ${escapeHtml(firstName)}.`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}

/**
 * Sends the cookbook download link to the requester. We send a link to the
 * hosted PDF (rather than an attachment) so it works across email clients
 * without size or attachment-stripping issues.
 */
export async function sendCookbookDeliveryEmail(
  to: string,
  firstName: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const downloadUrl = `${appUrl}/saryn-cookbook.pdf`;
    await getResend().emails.send({
      from,
      to,
      subject: "Your Saryn Health functional wellness cookbook",
      html: emailLayout(`
        ${p(`Hi ${escapeHtml(firstName)},`)}
        ${p(`Thanks for requesting our functional wellness cookbook — your download is ready below.`)}
        ${ctaButton(downloadUrl, "Download the Cookbook")}
        ${p(`Inside you'll find anti-inflammatory recipes and meal plans designed to support gut health, blood sugar balance, and energy.`)}
        ${p(`When you're ready for the next step, a free consultation with Sarina is the easiest way to figure out the right path for your situation.`)}
        ${ctaButton(`${appUrl}/consultation`, "Book a Free Consultation")}
        ${p(`— The Saryn Health Team`)}
      `),
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: (err as Error).message };
  }
}
