"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import { logger } from "@/lib/logger";
import {
  normalizeYoutubeUrl,
  uploadSiteImage,
  SiteImageUploadError,
} from "@/lib/site-images";

export interface SiteImageActionResult {
  ok: boolean;
  error?: string;
}

const inputSchema = z.object({
  image_key: z.string().min(1),
  alt_text: z.string().trim().max(280).optional(),
  youtube_url: z.string().trim().max(500).optional(),
});

/**
 * Single entry point used by both the Website Images page and the
 * Media Library page. Updates the alt text, optionally uploads a new
 * image file, and optionally re-links a YouTube URL.
 */
export async function saveSiteImage(
  formData: FormData
): Promise<SiteImageActionResult> {
  await requireUser("/dashboard/images");

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = inputSchema.safeParse({
    image_key: formData.get("image_key"),
    alt_text: formData.get("alt_text") ?? undefined,
    youtube_url: formData.get("youtube_url") ?? undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid input.",
    };
  }
  const { image_key, alt_text, youtube_url } = parsed.data;

  const supabase = createAdminSupabase();

  // Confirm the slot exists so we never create stray rows.
  const { data: existing, error: lookupErr } = await supabase
    .from("site_images")
    .select("id, media_type, image_url, youtube_embed_url")
    .eq("image_key", image_key)
    .maybeSingle();
  if (lookupErr) {
    logger.error("[saveSiteImage] lookup failed", lookupErr);
    return { ok: false, error: "Could not load slot." };
  }
  if (!existing) {
    return { ok: false, error: `Unknown media slot: ${image_key}` };
  }

  const update: Record<string, unknown> = {};

  // Optional image upload (image-type slots only).
  const file = formData.get("file");
  if (
    existing.media_type === "image" &&
    file instanceof File &&
    file.size > 0
  ) {
    try {
      const { url } = await uploadSiteImage(supabase, image_key, file);
      update.image_url = url;
    } catch (err) {
      if (err instanceof SiteImageUploadError) {
        return { ok: false, error: err.message };
      }
      logger.error("[saveSiteImage] upload failed", err);
      return { ok: false, error: "Upload failed. Please try again." };
    }
  }

  // YouTube handling (youtube-type slots only).
  if (existing.media_type === "youtube") {
    const raw = youtube_url?.trim() ?? "";
    if (raw.length === 0) {
      update.youtube_url = null;
      update.youtube_embed_url = null;
    } else {
      const embed = normalizeYoutubeUrl(raw);
      if (!embed) {
        return {
          ok: false,
          error: "That YouTube URL didn't look right — paste the full link.",
        };
      }
      update.youtube_url = raw;
      update.youtube_embed_url = embed;
    }
  }

  if (typeof alt_text === "string") {
    update.alt_text = alt_text.length === 0 ? null : alt_text;
  }

  if (Object.keys(update).length === 0) {
    return { ok: true };
  }

  const { error: updateErr } = await supabase
    .from("site_images")
    .update(update)
    .eq("image_key", image_key);

  if (updateErr) {
    logger.error("[saveSiteImage] update failed", updateErr);
    return { ok: false, error: updateErr.message };
  }

  revalidatePath("/dashboard/images");
  revalidatePath("/dashboard/media");
  revalidatePath("/");
  revalidatePath("/gallery");
  revalidatePath("/projects");
  return { ok: true };
}

/**
 * Clear the URL/embed on a slot, returning it to the "Missing" state.
 * Does not delete the slot itself — required slots stay listed.
 */
export async function clearSiteImage(
  image_key: string
): Promise<SiteImageActionResult> {
  await requireUser("/dashboard/images");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("site_images")
    .update({
      image_url: null,
      youtube_url: null,
      youtube_embed_url: null,
    })
    .eq("image_key", image_key);
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard/images");
  revalidatePath("/dashboard/media");
  revalidatePath("/");
  revalidatePath("/gallery");
  return { ok: true };
}
