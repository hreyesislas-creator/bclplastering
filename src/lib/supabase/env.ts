/**
 * Centralised Supabase env access. Keeps a single failure point
 * if a key is missing in dev. Server-only secrets live in
 * SUPABASE_SERVICE_ROLE_KEY and must NEVER be referenced from a
 * client component.
 */

export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "",
  serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
} as const;

export const supabaseStorageBuckets = {
  leadUploads: "lead-uploads",
  projectGallery: "project-gallery",
  beforeAfter: "before-after",
} as const;

export type SupabaseStorageBucket =
  (typeof supabaseStorageBuckets)[keyof typeof supabaseStorageBuckets];

export function isSupabaseConfigured() {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}
