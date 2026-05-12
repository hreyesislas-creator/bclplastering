import { z } from "zod";

export const SERVICE_ICON_KEYS = [
  "building",
  "wrench",
  "sun",
  "sofa",
  "paint-roller",
  "sparkles",
  // Legacy keys preserved so existing static seed cards keep rendering.
  "stucco-install",
  "stucco-repair",
  "exterior",
  "interior",
  "drywall",
  "decorative",
] as const;

export const SERVICE_CATEGORY_SUGGESTIONS = [
  "Stucco",
  "Stucco Installation",
  "Stucco Repair",
  "Exterior",
  "Exterior Remodeling",
  "Interior",
  "Interior Remodeling",
  "Drywall",
  "Drywall Repair",
  "Plastering",
  "Decorative Finishes",
  "Remodels",
] as const;

export const serviceInputSchema = z.object({
  title: z.string().trim().min(3, "Title is required").max(160),
  slug: z
    .string()
    .trim()
    .min(3)
    .max(120)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be kebab-case"),
  category: z.string().trim().max(120).optional(),
  short_description: z.string().trim().max(280).optional(),
  description: z.string().trim().max(4000).optional(),
  bullets: z
    .array(z.string().trim().min(1).max(200))
    .max(12)
    .optional(),
  price_label: z.string().trim().max(80).optional(),
  icon_key: z.string().trim().max(60).optional(),
  is_active: z.boolean().optional().default(true),
  featured: z.boolean().optional().default(true),
  sort_order: z
    .number({ message: "Sort order must be a number" })
    .int()
    .min(0)
    .max(9999)
    .optional(),
});

export type ServiceInput = z.infer<typeof serviceInputSchema>;
