import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACCEPTED_IMAGE_TYPES,
  MAX_FILE_BYTES,
  MAX_FILES,
} from "./schema";

const BUCKET = "lead-uploads";

/** ASCII-safe + length-capped filename. */
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

function buildPath(leadId: string, file: File) {
  const now = new Date();
  const yyyy = now.getUTCFullYear();
  const mm = String(now.getUTCMonth() + 1).padStart(2, "0");
  return `leads/${yyyy}/${mm}/${leadId}/${Date.now()}-${safeName(file.name)}`;
}

export interface UploadResult {
  url: string;
  path: string;
}

/**
 * Validates and uploads a list of incoming Files to the `lead-uploads`
 * bucket. Returns public URLs in submission order. Throws on validation
 * failure so the caller can surface a 400.
 */
export async function uploadLeadPhotos(
  supabase: SupabaseClient,
  leadId: string,
  files: File[]
): Promise<UploadResult[]> {
  if (files.length === 0) return [];
  if (files.length > MAX_FILES) {
    throw new UploadError(`Too many files. Limit is ${MAX_FILES}.`);
  }

  for (const file of files) {
    if (file.size > MAX_FILE_BYTES) {
      throw new UploadError(`"${file.name}" is over the 8 MB limit.`);
    }
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type as (typeof ACCEPTED_IMAGE_TYPES)[number])) {
      throw new UploadError(
        `"${file.name}" is not an accepted format (JPG, PNG, WEBP).`
      );
    }
  }

  const out: UploadResult[] = [];
  for (const file of files) {
    const path = buildPath(leadId, file);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000, immutable",
      upsert: false,
    });
    if (error) {
      throw new UploadError(`Failed to upload "${file.name}": ${error.message}`);
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    out.push({ url: data.publicUrl, path });
  }
  return out;
}

export class UploadError extends Error {
  readonly code = "UPLOAD_ERROR";
}
