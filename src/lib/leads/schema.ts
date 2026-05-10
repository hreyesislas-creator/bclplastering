import { z } from "zod";

export const SERVICE_TYPES = [
  "stucco",
  "plastering",
  "remodel",
  "exterior-paint",
  "patio-cover",
  "addition",
  "drywall",
  "other",
] as const;

export const LEAD_STATUSES = [
  "new",
  "contacted",
  "estimate_sent",
  "won",
  "lost",
] as const;

export const ACCEPTED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
] as const;

export const MAX_FILE_BYTES = 8 * 1024 * 1024; // 8 MB
export const MAX_FILES = 6;

/** Server-side validation schema for the lead form. Files are validated
 *  separately in the route handler since FormData carries them as Blobs. */
export const leadInputSchema = z.object({
  full_name: z.string().trim().min(2, "Full name is required").max(120),
  phone: z
    .string()
    .trim()
    .min(10, "Phone is required")
    .max(40)
    .regex(/^[\d\s().+-]+$/, "Invalid characters in phone"),
  email: z
    .union([z.string().trim().email("Invalid email"), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? String(v) : null)),
  city: z.string().trim().min(1).max(120),
  service_type: z.enum(SERVICE_TYPES),
  message: z
    .union([z.string().max(2000), z.literal(""), z.null()])
    .optional()
    .transform((v) => (v ? String(v) : null)),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const statusUpdateSchema = z.object({
  id: z.string().uuid(),
  status: z.enum(LEAD_STATUSES),
});
