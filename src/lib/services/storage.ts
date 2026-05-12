import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

const BUCKET = "service-images";
const MAX_BYTES = 8 * 1024 * 1024;
const ACCEPTED_MIME = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

export class ServiceImageUploadError extends Error {
  readonly code = "SERVICE_IMAGE_UPLOAD_ERROR";
}

function safeName(name: string) {
  const dot = name.lastIndexOf(".");
  const base = dot > 0 ? name.slice(0, dot) : name;
  const ext = dot > 0 ? name.slice(dot + 1).toLowerCase() : "";
  const slug = base
    .normalize("NFKD")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  const safeExt = ext.replace(/[^a-z0-9]/g, "").slice(0, 6);
  return safeExt ? `${slug || "photo"}.${safeExt}` : slug || "photo";
}

export async function uploadServiceImage(
  supabase: SupabaseClient,
  serviceSlug: string,
  file: File
): Promise<{ url: string; path: string }> {
  if (file.size > MAX_BYTES) {
    throw new ServiceImageUploadError(`"${file.name}" is over the 8 MB limit.`);
  }
  if (!ACCEPTED_MIME.has(file.type)) {
    throw new ServiceImageUploadError(
      `"${file.name}" must be JPG, PNG, or WEBP.`
    );
  }
  const path = `${serviceSlug}/${Date.now()}-${safeName(file.name)}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    cacheControl: "31536000, immutable",
    upsert: false,
  });
  if (error) {
    throw new ServiceImageUploadError(
      `Failed to upload "${file.name}": ${error.message}`
    );
  }
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return { url: data.publicUrl, path };
}
