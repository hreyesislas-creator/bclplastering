import "server-only";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { logger } from "@/lib/logger";
import { services as staticServices } from "@/data/services";
import type { ServiceRow } from "@/types/db";
import type { ServiceView } from "./view";

export { uploadServiceImage, ServiceImageUploadError } from "./storage";

function toView(row: ServiceRow): ServiceView {
  return {
    id: row.id,
    slug: row.slug,
    iconKey: row.icon_key ?? "sparkles",
    title: row.title,
    category: row.category ?? null,
    short:
      row.short_description ?? row.description?.slice(0, 220) ?? row.title,
    description: row.description ?? "",
    bullets: row.bullets ?? [],
    startingFrom: row.price_label ?? null,
    imageUrl: row.image_url ?? null,
    featured: row.featured,
    sortOrder: row.sort_order ?? 0,
  };
}

function staticToView(s: (typeof staticServices)[number], i: number): ServiceView {
  return {
    id: `static-${s.slug}`,
    slug: s.slug,
    iconKey: s.iconKey,
    title: s.title,
    category: null,
    short: s.short,
    description: s.description,
    bullets: s.bullets,
    startingFrom: s.startingFrom ?? null,
    imageUrl: null,
    featured: true,
    sortOrder: (i + 1) * 10,
  };
}

/**
 * Dashboard read — returns every row (active + inactive), ordered for
 * the management list view.
 */
export async function listAllServices(): Promise<ServiceRow[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) throw error;
    return (data ?? []) as ServiceRow[];
  } catch (err) {
    logger.error("[listAllServices] failed", err);
    return [];
  }
}

/** Single-row read for the edit page. */
export async function getServiceById(id: string): Promise<ServiceRow | null> {
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    return (data as ServiceRow | null) ?? null;
  } catch (err) {
    logger.error("[getServiceById] failed", err);
    return null;
  }
}

/**
 * Public list — only active rows, sorted for display. Falls back to
 * the static seed when Supabase is unconfigured or empty so the
 * marketing site always renders.
 */
export async function getPublicServices(): Promise<ServiceView[]> {
  if (!isSupabaseConfigured()) {
    return staticServices.map(staticToView);
  }
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("title", { ascending: true });
    if (error) throw error;
    const rows = (data ?? []) as ServiceRow[];
    if (rows.length === 0) return staticServices.map(staticToView);
    return rows.map(toView);
  } catch (err) {
    logger.error("[getPublicServices] failed", err);
    return staticServices.map(staticToView);
  }
}

/** Public detail — DB first, static fallback by slug. */
export async function getPublicServiceBySlug(
  slug: string
): Promise<ServiceView | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = createAdminSupabase();
      const { data, error } = await supabase
        .from("services")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (error) throw error;
      if (data) return toView(data as ServiceRow);
    } catch (err) {
      logger.error("[getPublicServiceBySlug] failed", err);
    }
  }
  const fallback = staticServices.findIndex((s) => s.slug === slug);
  if (fallback === -1) return null;
  return staticToView(staticServices[fallback], fallback);
}
