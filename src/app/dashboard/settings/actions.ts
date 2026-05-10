"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { requireUser } from "@/lib/auth";
import { logger } from "@/lib/logger";

const optionalUrl = z
  .union([z.string().url(), z.literal(""), z.null()])
  .optional()
  .transform((v) => (v ? String(v) : ""));

const settingsSchema = z.object({
  phone: z.string().trim().min(10, "Phone is too short").max(40),
  whatsapp: z.string().trim().min(10, "WhatsApp link required").max(200),
  email: z.string().trim().email("Enter a valid email"),
  service_areas: z.array(z.string().trim()).max(40),
  social_links: z.object({
    instagram: optionalUrl,
    facebook: optionalUrl,
    yelp: optionalUrl,
    google: optionalUrl,
  }),
});

export interface ActionResult {
  ok: boolean;
  error?: string;
}

function parseServiceAreas(raw: FormDataEntryValue | null): string[] {
  if (typeof raw !== "string") return [];
  return raw
    .split(/[\n,]+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 40);
}

export async function updateSettings(formData: FormData): Promise<ActionResult> {
  await requireUser("/dashboard/settings");
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const social = {
    instagram: (formData.get("instagram") as string | null) || "",
    facebook: (formData.get("facebook") as string | null) || "",
    yelp: (formData.get("yelp") as string | null) || "",
    google: (formData.get("google") as string | null) || "",
  };

  const parsed = settingsSchema.safeParse({
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp"),
    email: formData.get("email"),
    service_areas: parseServiceAreas(formData.get("service_areas")),
    social_links: social,
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Invalid settings.",
    };
  }

  // Strip empty social links before storing.
  const social_links = Object.fromEntries(
    Object.entries(parsed.data.social_links).filter(([, v]) => v && v.length > 0)
  );

  const supabase = createAdminSupabase();
  const { error } = await supabase.from("site_settings").upsert({
    id: 1,
    phone: parsed.data.phone,
    whatsapp: parsed.data.whatsapp,
    email: parsed.data.email,
    service_areas: parsed.data.service_areas,
    social_links,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    logger.error("[updateSettings] failed", error);
    return { ok: false, error: error.message };
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/", "layout");
  return { ok: true };
}
