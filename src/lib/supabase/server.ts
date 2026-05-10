import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { Database } from "@/types/db";
import { supabaseEnv } from "./env";

/**
 * Server client (App Router). Reads/writes the auth cookie via
 * Next's cookies() store. Use inside Server Components, Route
 * Handlers, and Server Actions.
 */
export async function createServerSupabase() {
  const cookieStore = await cookies();

  return createServerClient<Database>(supabaseEnv.url, supabaseEnv.anonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          for (const { name, value, options } of cookiesToSet) {
            cookieStore.set(name, value, options);
          }
        } catch {
          // setAll may be called from a Server Component where the
          // cookie store is read-only — that's fine, the middleware
          // will refresh the session on the next request.
        }
      },
    },
  });
}
