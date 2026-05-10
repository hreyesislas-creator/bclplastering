import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  ACCEPTED_PROJECT_TYPES,
  MAX_PROJECT_FILE_BYTES,
} from "./schema";

const BUCKET = "project-gallery";

export type Folder = "covers" | "before" | "after";

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

function buildPath(projectId: string, folder: Folder, file: File) {
  return `projects/${projectId}/${folder}/${Date.now()}-${safeName(file.name)}`;
}

export interface ProjectUploadResult {
  url: string;
  path: string;
}

export class ProjectUploadError extends Error {
  readonly code = "PROJECT_UPLOAD_ERROR";
}

/**
 * Upload a list of project images into a sub-folder of the project's
 * folder. Returns public URLs in submission order.
 */
export async function uploadProjectImages(
  supabase: SupabaseClient,
  projectId: string,
  files: File[],
  folder: Folder
): Promise<ProjectUploadResult[]> {
  if (files.length === 0) return [];

  for (const file of files) {
    if (file.size > MAX_PROJECT_FILE_BYTES) {
      throw new ProjectUploadError(`"${file.name}" is over the 10 MB limit.`);
    }
    if (
      !ACCEPTED_PROJECT_TYPES.includes(
        file.type as (typeof ACCEPTED_PROJECT_TYPES)[number]
      )
    ) {
      throw new ProjectUploadError(
        `"${file.name}" is not an accepted format (JPG, PNG, WEBP).`
      );
    }
  }

  const out: ProjectUploadResult[] = [];
  for (const file of files) {
    const path = buildPath(projectId, folder, file);
    const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
      contentType: file.type,
      cacheControl: "31536000, immutable",
      upsert: false,
    });
    if (error) {
      throw new ProjectUploadError(
        `Failed to upload "${file.name}": ${error.message}`
      );
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
    out.push({ url: data.publicUrl, path });
  }
  return out;
}
