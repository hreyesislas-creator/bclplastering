import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { createServerSupabase } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";

/**
 * Returns the current authenticated user, or null. Always uses the
 * SSR cookie-bound client so it reflects the request's session.
 */
export async function getUser(): Promise<User | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Redirects to /login when no session is present. Use inside
 * Server Components / Server Actions that require auth as a
 * defense-in-depth check on top of the middleware.
 */
export async function requireUser(nextPath?: string): Promise<User> {
  const user = await getUser();
  if (!user) {
    const target = nextPath
      ? `/login?next=${encodeURIComponent(nextPath)}`
      : "/login";
    redirect(target);
  }
  return user;
}
