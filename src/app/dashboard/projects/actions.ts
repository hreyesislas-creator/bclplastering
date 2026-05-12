"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import { projectInputSchema } from "@/lib/projects/schema";
import {
  uploadProjectImages,
  ProjectUploadError,
} from "@/lib/projects/storage";
import { normalizeYoutubeUrl } from "@/lib/site-images";
import { logger } from "@/lib/logger";

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

function parseInputFromFormData(formData: FormData) {
  return projectInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    city: formData.get("city"),
    service_type: formData.get("service_type"),
    category: formData.get("category") ?? undefined,
    description: formData.get("description"),
    short_description: formData.get("short_description") ?? undefined,
    featured: formData.get("featured") === "on",
    sort_order: formData.get("sort_order") ?? undefined,
    youtube_url: formData.get("youtube_url") ?? undefined,
  });
}

function readFiles(formData: FormData, name: string): File[] {
  return formData
    .getAll(name)
    .filter((v): v is File => v instanceof File && v.size > 0);
}

function bustPublicCache() {
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/gallery");
  revalidatePath("/");
}

export async function createProject(formData: FormData): Promise<ActionResult> {
  await requireUser("/dashboard/projects");

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = parseInputFromFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  const cover = formData.get("cover");
  const beforeFiles = readFiles(formData, "before");
  const afterFiles = readFiles(formData, "after");

  const supabase = createAdminSupabase();
  const projectId = crypto.randomUUID();

  let coverUrl = "";
  try {
    if (cover instanceof File && cover.size > 0) {
      const result = await uploadProjectImages(
        supabase,
        projectId,
        [cover],
        "covers"
      );
      coverUrl = result[0]?.url ?? "";
    }
    const beforeUploads = await uploadProjectImages(
      supabase,
      projectId,
      beforeFiles,
      "before"
    );
    const afterUploads = await uploadProjectImages(
      supabase,
      projectId,
      afterFiles,
      "after"
    );

    const youtubeRaw = parsed.data.youtube_url?.trim();
    const youtubeEmbed = youtubeRaw ? normalizeYoutubeUrl(youtubeRaw) : null;
    if (youtubeRaw && !youtubeEmbed) {
      return {
        ok: false,
        error: "YouTube URL didn't look right — paste the full link.",
      };
    }

    const { error } = await supabase.from("projects").insert({
      id: projectId,
      title: parsed.data.title,
      slug: parsed.data.slug,
      city: parsed.data.city,
      service_type: parsed.data.service_type,
      category: parsed.data.category || null,
      description: parsed.data.description,
      short_description: parsed.data.short_description || null,
      cover_image_url: coverUrl,
      before_images: beforeUploads.map((u) => u.url),
      after_images: afterUploads.map((u) => u.url),
      featured: parsed.data.featured ?? false,
      sort_order: parsed.data.sort_order ?? 0,
      youtube_url: youtubeRaw || null,
      youtube_embed_url: youtubeEmbed,
    });

    if (error) {
      logger.error("[createProject] insert failed", error);
      if (error.code === "23505") {
        return { ok: false, error: "A project with that slug already exists." };
      }
      return { ok: false, error: error.message };
    }
  } catch (err) {
    if (err instanceof ProjectUploadError) {
      return { ok: false, error: err.message };
    }
    logger.error("[createProject] unexpected", err);
    return { ok: false, error: "Could not save project. Please try again." };
  }

  bustPublicCache();
  return { ok: true, id: projectId };
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<ActionResult> {
  await requireUser("/dashboard/projects");

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = parseInputFromFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  const supabase = createAdminSupabase();

  // Look up existing row so we can preserve its current media URLs
  // when nothing new was uploaded.
  const { data: existing, error: lookupErr } = await supabase
    .from("projects")
    .select("cover_image_url, before_images, after_images, slug")
    .eq("id", id)
    .maybeSingle();
  if (lookupErr) {
    logger.error("[updateProject] lookup failed", lookupErr);
    return { ok: false, error: lookupErr.message };
  }
  if (!existing) {
    return { ok: false, error: "Project not found." };
  }

  const cover = formData.get("cover");
  const beforeFiles = readFiles(formData, "before");
  const afterFiles = readFiles(formData, "after");
  const replaceBefore = formData.get("replace_before") === "on";
  const replaceAfter = formData.get("replace_after") === "on";

  let coverUrl = existing.cover_image_url ?? "";
  let beforeUrls = (existing.before_images ?? []) as string[];
  let afterUrls = (existing.after_images ?? []) as string[];

  try {
    if (cover instanceof File && cover.size > 0) {
      const result = await uploadProjectImages(supabase, id, [cover], "covers");
      coverUrl = result[0]?.url ?? coverUrl;
    }
    if (beforeFiles.length > 0) {
      const uploaded = await uploadProjectImages(
        supabase,
        id,
        beforeFiles,
        "before"
      );
      const fresh = uploaded.map((u) => u.url);
      beforeUrls = replaceBefore ? fresh : [...beforeUrls, ...fresh];
    }
    if (afterFiles.length > 0) {
      const uploaded = await uploadProjectImages(
        supabase,
        id,
        afterFiles,
        "after"
      );
      const fresh = uploaded.map((u) => u.url);
      afterUrls = replaceAfter ? fresh : [...afterUrls, ...fresh];
    }
  } catch (err) {
    if (err instanceof ProjectUploadError) {
      return { ok: false, error: err.message };
    }
    logger.error("[updateProject] upload failed", err);
    return { ok: false, error: "Could not upload images. Please try again." };
  }

  const youtubeRaw = parsed.data.youtube_url?.trim();
  const youtubeEmbed = youtubeRaw ? normalizeYoutubeUrl(youtubeRaw) : null;
  if (youtubeRaw && !youtubeEmbed) {
    return {
      ok: false,
      error: "YouTube URL didn't look right — paste the full link.",
    };
  }

  const { error: updateErr } = await supabase
    .from("projects")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      city: parsed.data.city,
      service_type: parsed.data.service_type,
      category: parsed.data.category || null,
      description: parsed.data.description,
      short_description: parsed.data.short_description || null,
      cover_image_url: coverUrl,
      before_images: beforeUrls,
      after_images: afterUrls,
      featured: parsed.data.featured ?? false,
      sort_order: parsed.data.sort_order ?? 0,
      youtube_url: youtubeRaw || null,
      youtube_embed_url: youtubeEmbed,
    })
    .eq("id", id);

  if (updateErr) {
    logger.error("[updateProject] update failed", updateErr);
    if (updateErr.code === "23505") {
      return { ok: false, error: "Another project already uses that slug." };
    }
    return { ok: false, error: updateErr.message };
  }

  bustPublicCache();
  if (existing.slug !== parsed.data.slug) {
    revalidatePath(`/projects/${existing.slug}`);
  }
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { ok: true, id };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireUser("/dashboard/projects");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();

  // TODO: also remove the project's folder from the project-gallery
  // bucket once we have a robust path-extraction helper. Skipping for
  // now so a Storage failure can't block deletion of the DB row.

  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    logger.error("[deleteProject] failed", error);
    return { ok: false, error: error.message };
  }
  bustPublicCache();
  return { ok: true };
}

export async function toggleFeatured(
  id: string,
  featured: boolean
): Promise<ActionResult> {
  await requireUser("/dashboard/projects");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("projects")
    .update({ featured })
    .eq("id", id);
  if (error) {
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard/projects");
  revalidatePath("/");
  return { ok: true };
}
