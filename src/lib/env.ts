/**
 * Centralised env access. Each entry is read once at module load
 * and exposed as a typed property — never reach into `process.env`
 * directly from a feature module.
 *
 * NEXT_PUBLIC_* variables are inlined at build time and safe to
 * reference from client components. Anything without that prefix
 * is server-only.
 */

import { logger } from "./logger";

const read = (name: string) => process.env[name] ?? "";

export const env = {
  // Site
  siteUrl: read("NEXT_PUBLIC_SITE_URL") || "https://www.bclplastering.com",

  // Analytics
  gaId: read("NEXT_PUBLIC_GA_ID"),
  metaPixelId: read("NEXT_PUBLIC_META_PIXEL_ID"),

  // Search Console / verification
  googleSiteVerification: read("NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION"),
  bingSiteVerification: read("NEXT_PUBLIC_BING_SITE_VERIFICATION"),

  // Supabase
  supabaseUrl: read("NEXT_PUBLIC_SUPABASE_URL"),
  supabaseAnonKey: read("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
  supabaseServiceKey: read("SUPABASE_SERVICE_ROLE_KEY"),

  // Resend
  resendApiKey: read("RESEND_API_KEY"),
  resendFromEmail: read("RESEND_FROM_EMAIL"),
  leadNotificationEmail: read("LEAD_NOTIFICATION_EMAIL"),

  // Twilio
  twilioSid: read("TWILIO_ACCOUNT_SID"),
  twilioToken: read("TWILIO_AUTH_TOKEN"),
  twilioFrom: read("TWILIO_FROM_NUMBER"),
  leadNotificationPhone: read("LEAD_NOTIFICATION_PHONE"),
} as const;

export const isProd = process.env.NODE_ENV === "production";

/**
 * Logs which integrations are wired up. Called once at server
 * boot from `app/layout.tsx`. Logs at info level so it appears in
 * Vercel's deployment logs once per cold start.
 */
let loggedOnce = false;
export function logEnvSummary() {
  if (loggedOnce) return;
  loggedOnce = true;
  if (typeof window !== "undefined") return;

  const summary = {
    supabase: Boolean(env.supabaseUrl && env.supabaseAnonKey),
    supabaseServiceRole: Boolean(env.supabaseServiceKey),
    resend: Boolean(env.resendApiKey && env.leadNotificationEmail),
    twilio: Boolean(env.twilioSid && env.twilioToken && env.twilioFrom),
    ga: Boolean(env.gaId),
    metaPixel: Boolean(env.metaPixelId),
  };
  logger.info("[env] integrations:", summary);
}
