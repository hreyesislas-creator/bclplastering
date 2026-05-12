import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { logger } from "@/lib/logger";
import type { SiteImage, SiteImageMap } from "@/types/db";

export { normalizeYoutubeUrl, extractYoutubeId, youtubeThumbnail } from "./youtube";
export { uploadSiteImage, SiteImageUploadError } from "./storage";

/**
 * List every slot in the site_images table, ordered for the dashboard.
 * Empty list when Supabase is unconfigured — the page should render an
 * informative empty state in that case.
 */
export async function listSiteImages(): Promise<SiteImage[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("site_images")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (data ?? []) as SiteImage[];
  } catch (err) {
    logger.error("[listSiteImages] failed", err);
    return [];
  }
}

/**
 * Returns a `Record<image_key, SiteImage>` for the public site.
 * Components fall back to the static image manifest when a key is
 * missing or has no `image_url`.
 *
 * Safe by design: any failure resolves to `{}` so the public site
 * still renders.
 */
export async function getSiteImages(): Promise<SiteImageMap> {
  const rows = await listSiteImages();
  const map: SiteImageMap = {};
  for (const row of rows) {
    map[row.image_key] = row;
  }
  return map;
}

/** Convenience: pick the public URL for a key. */
export function pickImageUrl(
  map: SiteImageMap,
  key: string
): string | null {
  const row = map[key];
  if (!row) return null;
  if (row.media_type === "image") return row.image_url || null;
  return null;
}

/** Convenience: pick the YouTube embed URL for a key. */
export function pickEmbedUrl(
  map: SiteImageMap,
  key: string
): string | null {
  const row = map[key];
  if (!row || row.media_type !== "youtube") return null;
  return row.youtube_embed_url || null;
}
