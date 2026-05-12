import "server-only";
import { createAdminSupabase } from "./supabase/admin";
import { isSupabaseConfigured } from "./supabase/env";
import { projects as seedProjects } from "@/data/projects";
import { reviews as seedReviews } from "@/data/reviews";
import type { Project, Review } from "@/types/db";
import { logger } from "./logger";

/**
 * Public reads of projects/reviews. Falls back to local seed data
 * when Supabase is unconfigured *or* the table is empty — that
 * keeps the marketing site looking finished while the contractor
 * builds out their real archive.
 */
export async function getPublicProjects(): Promise<Project[]> {
  if (!isSupabaseConfigured()) return seedProjects;
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data ?? []) as Project[];
    return rows.length > 0 ? rows : seedProjects;
  } catch (err) {
    logger.error("[getPublicProjects] failed", err);
    return seedProjects;
  }
}

export async function getPublicReviews(): Promise<Review[]> {
  if (!isSupabaseConfigured()) return seedReviews;
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    const rows = (data ?? []) as Review[];
    return rows.length > 0 ? rows : seedReviews;
  } catch (err) {
    logger.error("[getPublicReviews] failed", err);
    return seedReviews;
  }
}
