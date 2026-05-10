"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { statusUpdateSchema } from "@/lib/leads/schema";
import { logger } from "@/lib/logger";

export interface ActionResult {
  ok: boolean;
  error?: string;
}

/**
 * Server Action — update a lead's status. Called from the lead detail
 * page via a small form. No auth wrapper yet; the dashboard is gated
 * at the network/deploy layer until Phase 5.
 */
export async function updateLeadStatus(formData: FormData): Promise<ActionResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Supabase is not configured." };
  }

  const parsed = statusUpdateSchema.safeParse({
    id: formData.get("id"),
    status: formData.get("status"),
  });
  if (!parsed.success) {
    return { ok: false, error: "Invalid status update." };
  }

  const supabase = createAdminSupabase();
  const { error } = await supabase
    .from("leads")
    .update({ status: parsed.data.status })
    .eq("id", parsed.data.id);

  if (error) {
    logger.error("[updateLeadStatus] update failed", error);
    return { ok: false, error: "Could not update status." };
  }

  revalidatePath("/dashboard/leads");
  revalidatePath(`/dashboard/leads/${parsed.data.id}`);
  return { ok: true };
}
