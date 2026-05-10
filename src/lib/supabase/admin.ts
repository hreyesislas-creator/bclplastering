import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { supabaseEnv } from "./env";

/**
 * Service-role client. Bypasses RLS — use only inside trusted
 * server contexts (Route Handlers / Server Actions). Never import
 * this file from a client module.
 *
 * The Database generic is intentionally omitted here; once
 * `supabase gen types typescript` is wired into the project, swap
 * to `createClient<Database>(...)` for full table-level typing.
 */
export function createAdminSupabase(): SupabaseClient {
  if (!supabaseEnv.serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  }
  return createClient(supabaseEnv.url, supabaseEnv.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
