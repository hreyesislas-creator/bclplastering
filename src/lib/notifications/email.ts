import "server-only";
import { renderLeadEmail } from "./templates/lead-notification";
import { site } from "@/lib/site";
import { logger } from "@/lib/logger";

interface NewLeadEmailInput {
  leadId: string;
  fullName: string;
  phone: string;
  email: string | null;
  city: string | null;
  serviceLabel: string;
  message: string | null;
  photoCount: number;
  photoUrls: string[];
  dashboardUrl: string;
}

export async function sendNewLeadEmail(input: NewLeadEmailInput) {
  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail =
    process.env.RESEND_FROM_EMAIL || `${site.shortName} <onboarding@resend.dev>`;
  const toEmail = process.env.LEAD_NOTIFICATION_EMAIL;

  if (!apiKey || !toEmail) {
    logger.debug(
      "[email] Resend not configured (set RESEND_API_KEY and LEAD_NOTIFICATION_EMAIL)"
    );
    return { sent: false, reason: "not-configured" as const };
  }

  const html = renderLeadEmail(input);
  const subject = `New lead — ${input.fullName}${input.city ? " · " + input.city : ""}`;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        subject,
        html,
        // Reply directly to the homeowner if they left an email
        reply_to: input.email ?? undefined,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      logger.error("[email] resend failed", res.status, body);
      return { sent: false, reason: "request-failed" as const };
    }
    return { sent: true };
  } catch (err) {
    logger.error("[email] resend error", err);
    return { sent: false, reason: "request-error" as const };
  }
}
