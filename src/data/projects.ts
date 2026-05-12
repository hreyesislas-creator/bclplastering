import type { Project } from "@/types/db";

/**
 * Static fallback seed. The dashboard now writes the same shape to
 * Supabase — `getPublicProjects()` prefers DB rows and only falls
 * back here when Supabase is unconfigured or empty.
 *
 * Slugs here match the seeded rows in
 * `supabase/migrations/0002_seed_editable_projects.sql` so URLs
 * stay consistent in either path.
 */
export const projects: Project[] = [
  {
    id: "p_001",
    title: "Spanish revival stucco restoration",
    slug: "spanish-revival-stucco-restoration",
    city: "Riverside, CA",
    service_type: "stucco",
    category: "Stucco Installation",
    short_description:
      "Hand-troweled Santa Barbara smooth on a 1960s Spanish revival.",
    description:
      "Pulled back failed elevations on a 1960s Spanish revival, re-lathed where needed, and hand-troweled a Santa Barbara smooth finish across all four sides — color-matched in two tones to highlight the original arches.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    sort_order: 10,
    created_at: "2026-04-12T00:00:00Z",
  },
  {
    id: "p_002",
    title: "Whole-home exterior remodel",
    slug: "whole-home-exterior-remodel",
    city: "Moreno Valley, CA",
    service_type: "exterior-paint",
    category: "Exterior Remodeling",
    short_description:
      "Full envelope facelift — stucco, columns, trim, Loxon two-coat.",
    description:
      "Full envelope facelift — new stucco on two elevations, custom columns, recessed trim, and a Sherwin-Williams Loxon two-coat system across the entire home. Permitted, inspected, and finished in 18 working days.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    sort_order: 20,
    created_at: "2026-03-04T00:00:00Z",
  },
  {
    id: "p_003",
    title: "Smooth finish stucco — new build",
    slug: "smooth-finish-stucco-new-build",
    city: "Corona, CA",
    service_type: "stucco",
    category: "Stucco Installation",
    short_description:
      "Three-coat traditional stucco with a hand-floated smooth finish.",
    description:
      "Three-coat traditional stucco on a new construction with integral pigment and a hand-floated smooth finish. Crack-resistant, weep-screened, and inspected first try.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    sort_order: 30,
    created_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "p_004",
    title: "Open-concept kitchen remodel",
    slug: "open-concept-kitchen-remodel",
    city: "Eastvale, CA",
    service_type: "remodel",
    category: "Interior Remodeling",
    short_description:
      "Load-bearing wall removed; island, level-5 walls, Venetian accent.",
    description:
      "Removed a load-bearing wall, added a custom island, and finished the entire space with level-5 smooth walls and a Venetian plaster accent above the range. Permits and inspections handled in-house.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    sort_order: 40,
    created_at: "2026-01-22T00:00:00Z",
  },
  {
    id: "p_005",
    title: "Tadelakt powder room",
    slug: "tadelakt-powder-room",
    city: "Menifee, CA",
    service_type: "plastering",
    category: "Decorative Finishes",
    short_description:
      "Hand-burnished Tadelakt in a moody, candlelit powder room.",
    description:
      "Hand-burnished Tadelakt walls in a moody, candlelit powder room. Sealed with traditional black soap for waterproof, fingerprint-friendly performance.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    sort_order: 50,
    created_at: "2025-11-09T00:00:00Z",
  },
  {
    id: "p_006",
    title: "ADU exterior stucco match",
    slug: "adu-exterior-stucco-match",
    city: "Perris, CA",
    service_type: "stucco",
    category: "Stucco Installation",
    short_description: "Sand-float texture matched to the original 1980s home.",
    description:
      "New 720 sqft ADU finished in a sand-float texture pulled directly from the original 1980s home. The addition reads as part of the original elevation — no transition line.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    sort_order: 60,
    created_at: "2025-09-30T00:00:00Z",
  },
  {
    id: "p_007",
    title: "Drywall restoration after water damage",
    slug: "drywall-restoration-after-water-damage",
    city: "Jurupa Valley, CA",
    service_type: "drywall",
    category: "Drywall Repair",
    short_description: "320 sqft replaced; repair lines invisible at finish.",
    description:
      "Replaced 320 sqft of water-damaged drywall, feathered the texture into the existing surface, and repainted the affected rooms. Repair lines invisible at finish.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    sort_order: 70,
    created_at: "2025-08-05T00:00:00Z",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
