"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import { logger } from "@/lib/logger";
import { serviceInputSchema } from "@/lib/services/schema";
import {
  uploadServiceImage,
  ServiceImageUploadError,
} from "@/lib/services/storage";

export interface ServiceActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

function parseInputFromFormData(formData: FormData) {
  const bullets = formData
    .getAll("bullets")
    .map((v) => String(v ?? "").trim())
    .filter((v) => v.length > 0);

  const rawSortOrder = formData.get("sort_order");
  const sort_order =
    rawSortOrder === null || rawSortOrder === ""
      ? undefined
      : Number(rawSortOrder);

  return serviceInputSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    category: formData.get("category") ?? undefined,
    short_description: formData.get("short_description") ?? undefined,
    description: formData.get("description") ?? undefined,
    bullets,
    price_label: formData.get("price_label") ?? undefined,
    icon_key: formData.get("icon_key") ?? undefined,
    is_active: formData.get("is_active") === "on",
    featured: formData.get("featured") === "on",
    sort_order,
  });
}

function bustCache() {
  revalidatePath("/dashboard/services");
  revalidatePath("/services");
  revalidatePath("/");
}

export async function createService(
  formData: FormData
): Promise<ServiceActionResult> {
  await requireUser("/dashboard/services");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = parseInputFromFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service data.",
    };
  }

  const supabase = createAdminSupabase();

  let imageUrl: string | null = null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      const { url } = await uploadServiceImage(supabase, parsed.data.slug, file);
      imageUrl = url;
    } catch (err) {
      if (err instanceof ServiceImageUploadError) {
        return { ok: false, error: err.message };
      }
      logger.error("[createService] upload failed", err);
      return { ok: false, error: "Image upload failed." };
    }
  }

  const { data, error } = await supabase
    .from("services")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      category: parsed.data.category || null,
      short_description: parsed.data.short_description || null,
      description: parsed.data.description || null,
      bullets: parsed.data.bullets ?? [],
      price_label: parsed.data.price_label || null,
      icon_key: parsed.data.icon_key || null,
      image_url: imageUrl,
      is_active: parsed.data.is_active ?? true,
      featured: parsed.data.featured ?? true,
      sort_order: parsed.data.sort_order ?? 0,
    })
    .select("id")
    .single();

  if (error) {
    logger.error("[createService] insert failed", error);
    if (error.code === "23505") {
      return { ok: false, error: "A service with that slug already exists." };
    }
    return { ok: false, error: error.message };
  }

  bustCache();
  return { ok: true, id: data?.id };
}

export async function updateService(
  id: string,
  formData: FormData
): Promise<ServiceActionResult> {
  await requireUser("/dashboard/services");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = parseInputFromFormData(formData);
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid service data.",
    };
  }

  const supabase = createAdminSupabase();

  const { data: existing, error: lookupErr } = await supabase
    .from("services")
    .select("image_url, slug")
    .eq("id", id)
    .maybeSingle();
  if (lookupErr) {
    logger.error("[updateService] lookup failed", lookupErr);
    return { ok: false, error: lookupErr.message };
  }
  if (!existing) return { ok: false, error: "Service not found." };

  let imageUrl: string | null = existing.image_url ?? null;
  const file = formData.get("image");
  if (file instanceof File && file.size > 0) {
    try {
      const { url } = await uploadServiceImage(supabase, parsed.data.slug, file);
      imageUrl = url;
    } catch (err) {
      if (err instanceof ServiceImageUploadError) {
        return { ok: false, error: err.message };
      }
      logger.error("[updateService] upload failed", err);
      return { ok: false, error: "Image upload failed." };
    }
  }

  const { error: updateErr } = await supabase
    .from("services")
    .update({
      title: parsed.data.title,
      slug: parsed.data.slug,
      category: parsed.data.category || null,
      short_description: parsed.data.short_description || null,
      description: parsed.data.description || null,
      bullets: parsed.data.bullets ?? [],
      price_label: parsed.data.price_label || null,
      icon_key: parsed.data.icon_key || null,
      image_url: imageUrl,
      is_active: parsed.data.is_active ?? true,
      featured: parsed.data.featured ?? true,
      sort_order: parsed.data.sort_order ?? 0,
    })
    .eq("id", id);
  if (updateErr) {
    logger.error("[updateService] update failed", updateErr);
    if (updateErr.code === "23505") {
      return { ok: false, error: "Another service already uses that slug." };
    }
    return { ok: false, error: updateErr.message };
  }

  bustCache();
  if (existing.slug !== parsed.data.slug) {
    revalidatePath(`/services/${existing.slug}`);
  }
  revalidatePath(`/services/${parsed.data.slug}`);
  return { ok: true, id };
}

export async function deleteService(
  id: string
): Promise<ServiceActionResult> {
  await requireUser("/dashboard/services");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  // TODO: also clean up the service's folder in the service-images bucket
  // once we have a path-extraction helper. Skipping for now so a Storage
  // failure can't block deletion.
  const { error } = await supabase.from("services").delete().eq("id", id);
  if (error) {
    logger.error("[deleteService] failed", error);
    return { ok: false, error: error.message };
  }
  bustCache();
  return { ok: true };
}

export async function toggleServiceActive(
  id: string,
  is_active: boolean
): Promise<ServiceActionResult> {
  await requireUser("/dashboard/services");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("services")
    .update({ is_active })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustCache();
  return { ok: true };
}

export async function toggleServiceFeatured(
  id: string,
  featured: boolean
): Promise<ServiceActionResult> {
  await requireUser("/dashboard/services");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("services")
    .update({ featured })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  bustCache();
  return { ok: true };
}
