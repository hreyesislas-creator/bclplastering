import { z } from "zod";
import { SERVICE_TYPES } from "@/lib/leads/schema";

export const ACCEPTED_PROJECT_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_PROJECT_FILE_BYTES = 10 * 1024 * 1024; // 10 MB
export const MAX_BEFORE_AFTER = 8;

export const projectInputSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  city: z.string().trim().min(2).max(120),
  service_type: z.enum(SERVICE_TYPES),
  description: z.string().trim().min(20).max(2000),
  featured: z.boolean().optional().default(false),
});

export type ProjectInput = z.infer<typeof projectInputSchema>;
