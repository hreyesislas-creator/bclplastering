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

export async function createProject(formData: FormData): Promise<ActionResult> {
  await requireUser("/dashboard/projects");

  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = projectInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    city: formData.get("city"),
    service_type: formData.get("service_type"),
    description: formData.get("description"),
    short_description: formData.get("short_description") ?? undefined,
    featured: formData.get("featured") === "on",
    youtube_url: formData.get("youtube_url") ?? undefined,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error:
        parsed.error.issues[0]?.message ?? "Invalid project data.",
    };
  }

  const cover = formData.get("cover");
  const beforeFiles = formData
    .getAll("before")
    .filter((v): v is File => v instanceof File && v.size > 0);
  const afterFiles = formData
    .getAll("after")
    .filter((v): v is File => v instanceof File && v.size > 0);

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
      description: parsed.data.description,
      short_description: parsed.data.short_description || null,
      cover_image_url: coverUrl,
      before_images: beforeUploads.map((u) => u.url),
      after_images: afterUploads.map((u) => u.url),
      featured: parsed.data.featured ?? false,
      youtube_url: youtubeRaw || null,
      youtube_embed_url: youtubeEmbed,
    });

    if (error) {
      logger.error("[createProject] insert failed", error);
      // Friendly message on slug collision
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

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/gallery");
  revalidatePath("/");
  return { ok: true, id: projectId };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  await requireUser("/dashboard/projects");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);
  if (error) {
    logger.error("[deleteProject] failed", error);
    return { ok: false, error: error.message };
  }
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/gallery");
  revalidatePath("/");
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
