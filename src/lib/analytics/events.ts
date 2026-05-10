/**
 * Conversion-tracking glue. Fires events into both GA4 and Meta
 * Pixel from a single call site so the rest of the app stays
 * provider-agnostic.
 *
 * Safe to import from any client component — no-ops on the server
 * and silently ignored when neither analytics provider is loaded.
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { q?: unknown[] };
  }
}

export type AnalyticsEvent =
  | "lead_submit"
  | "lead_submit_failed"
  | "phone_click"
  | "whatsapp_click"
  | "contact_cta"
  | "estimate_cta"
  | "project_view"
  | "service_view";

interface TrackOptions {
  /** Where the click happened — e.g. "hero", "mobile_bar", "cta_section" */
  source?: string;
  /** Optional value (used as conversion value in pixel) */
  value?: number;
  /** Free-form context */
  meta?: Record<string, string | number | boolean | null | undefined>;
}

const PIXEL_EVENT_MAP: Partial<Record<AnalyticsEvent, string>> = {
  lead_submit: "Lead",
  contact_cta: "Contact",
  phone_click: "Contact",
  whatsapp_click: "Contact",
  estimate_cta: "Schedule",
};

export function trackEvent(name: AnalyticsEvent, options: TrackOptions = {}) {
  if (typeof window === "undefined") return;
  const params = {
    source: options.source,
    value: options.value,
    ...options.meta,
  };

  // GA4
  if (typeof window.gtag === "function") {
    window.gtag("event", name, params);
  }

  // Meta Pixel — map to standard events where appropriate.
  if (typeof window.fbq === "function") {
    const standard = PIXEL_EVENT_MAP[name];
    if (standard) {
      window.fbq("track", standard, params);
    } else {
      window.fbq("trackCustom", name, params);
    }
  }
}

export const trackPhone = (source: string) =>
  trackEvent("phone_click", { source });
export const trackWhatsApp = (source: string) =>
  trackEvent("whatsapp_click", { source });
export const trackEstimateCta = (source: string) =>
  trackEvent("estimate_cta", { source });
export const trackContactCta = (source: string) =>
  trackEvent("contact_cta", { source });
