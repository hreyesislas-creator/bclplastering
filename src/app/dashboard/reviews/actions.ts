"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import { logger } from "@/lib/logger";

const reviewSchema = z.object({
  customer_name: z.string().trim().min(2, "Name is required").max(120),
  source: z.enum(["google", "yelp", "thumbtack", "facebook", "direct"]),
  rating: z.coerce.number().int().min(1).max(5),
  review_text: z.string().trim().min(10, "Review is too short").max(2000),
});

export interface ActionResult {
  ok: boolean;
  error?: string;
}

export async function createReview(formData: FormData): Promise<ActionResult> {
  await requireUser("/dashboard/reviews");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = reviewSchema.safeParse({
    customer_name: formData.get("customer_name"),
    source: formData.get("source"),
    rating: formData.get("rating"),
    review_text: formData.get("review_text"),
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid review.",
    };
  }

  const supabase = createAdminSupabase();
  const { error } = await supabase.from("reviews").insert(parsed.data);
  if (error) {
    logger.error("[createReview] insert failed", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { ok: true };
}

export async function deleteReview(id: string): Promise<ActionResult> {
  await requireUser("/dashboard/reviews");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }
  const supabase = createAdminSupabase();
  const { error } = await supabase.from("reviews").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/reviews");
  revalidatePath("/reviews");
  revalidatePath("/");
  return { ok: true };
}
