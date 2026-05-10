import "server-only";
import { createAdminSupabase } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import { site } from "./site";
import { logger } from "./logger";

export interface SocialLinks {
  instagram?: string;
  facebook?: string;
  yelp?: string;
  google?: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  service_areas: string[];
  social_links: SocialLinks;
}

const defaults: SiteSettings = {
  phone: site.phone,
  whatsapp: site.whatsapp,
  email: site.email,
  service_areas: [...site.serviceAreas],
  social_links: { ...site.social },
};

interface SettingsRow {
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  service_areas: string[] | null;
  social_links: SocialLinks | null;
}

/**
 * Reads the singleton site_settings row, layered on top of the
 * static defaults from `lib/site.ts`. Empty / missing values
 * always fall back to defaults so the public site stays valid.
 */
export async function getSiteSettings(): Promise<SiteSettings> {
  if (!isSupabaseConfigured()) return defaults;
  try {
    const supabase = createAdminSupabase();
    const { data } = await supabase
      .from("site_settings")
      .select("phone, whatsapp, email, service_areas, social_links")
      .eq("id", 1)
      .maybeSingle();
    if (!data) return defaults;
    const row = data as SettingsRow;
    return {
      phone: row.phone || defaults.phone,
      whatsapp: row.whatsapp || defaults.whatsapp,
      email: row.email || defaults.email,
      service_areas:
        Array.isArray(row.service_areas) && row.service_areas.length > 0
          ? row.service_areas
          : defaults.service_areas,
      social_links: { ...defaults.social_links, ...(row.social_links || {}) },
    };
  } catch (err) {
    logger.error("[getSiteSettings] failed", err);
    return defaults;
  }
}
