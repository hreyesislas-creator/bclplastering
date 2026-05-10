import "server-only";
import { logger } from "@/lib/logger";

/**
 * SMS provider abstraction. Twilio is wired by default; add a
 * Telnyx provider by implementing the same interface and swapping
 * `getProvider()`.
 */
export interface SmsProvider {
  send(opts: { to: string; body: string }): Promise<void>;
}

class TwilioProvider implements SmsProvider {
  constructor(
    private readonly accountSid: string,
    private readonly authToken: string,
    private readonly fromNumber: string
  ) {}

  async send({ to, body }: { to: string; body: string }) {
    const auth = Buffer.from(
      `${this.accountSid}:${this.authToken}`
    ).toString("base64");

    const res = await fetch(
      `https://api.twilio.com/2010-04-01/Accounts/${this.accountSid}/Messages.json`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          To: to,
          From: this.fromNumber,
          Body: body,
        }),
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      throw new Error(`Twilio send failed: ${res.status} ${detail}`);
    }
  }
}

let cachedProvider: SmsProvider | null | undefined;

function resolveProvider(): SmsProvider | null {
  if (cachedProvider !== undefined) return cachedProvider;
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  const from = process.env.TWILIO_FROM_NUMBER;
  if (sid && token && from) {
    cachedProvider = new TwilioProvider(sid, token, from);
  } else {
    cachedProvider = null;
  }
  return cachedProvider;
}

/**
 * Best-effort send. Logs and resolves on failure — the caller is
 * never blocked by a notification outage.
 */
export async function sendSms(to: string, body: string): Promise<void> {
  const provider = resolveProvider();
  if (!provider) {
    logger.debug("[sms] provider not configured", {
      to,
      preview: body.slice(0, 80),
    });
    return;
  }
  try {
    await provider.send({ to, body });
  } catch (err) {
    logger.error("[sms] send failed", err);
  }
}

export async function sendNewLeadSms(opts: {
  fullName: string;
  city: string | null;
  serviceLabel: string;
  phone: string;
}) {
  const to = process.env.LEAD_NOTIFICATION_PHONE;
  if (!to) return;
  const cityPart = opts.city ? ` (${opts.city})` : "";
  const body = `BCL: New lead — ${opts.fullName}${cityPart} · ${opts.serviceLabel} · ${opts.phone}`;
  await sendSms(to, body);
}
