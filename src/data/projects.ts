import type { Project } from "@/types/db";

/**
 * Static seed. Shape matches the `projects` table — swapping to a Supabase
 * query is a one-line change once the backend lands.
 */
export const projects: Project[] = [
  {
    id: "p_001",
    title: "Spanish revival stucco restoration",
    slug: "riverside-stucco-restoration",
    city: "Riverside, CA",
    service_type: "stucco",
    description:
      "Pulled back failed elevations on a 1960s Spanish revival, re-lathed where needed, and hand-troweled a Santa Barbara smooth finish across all four sides — color-matched in two tones to highlight the original arches.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    created_at: "2026-04-12T00:00:00Z",
  },
  {
    id: "p_002",
    title: "Whole-home exterior remodel",
    slug: "moreno-valley-exterior-remodel",
    city: "Moreno Valley, CA",
    service_type: "exterior-paint",
    description:
      "Full envelope facelift — new stucco on two elevations, custom columns, recessed trim, and a Sherwin-Williams Loxon two-coat system across the entire home. Permitted, inspected, and finished in 18 working days.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    created_at: "2026-03-04T00:00:00Z",
  },
  {
    id: "p_003",
    title: "Smooth finish stucco — new build",
    slug: "corona-smooth-finish-stucco",
    city: "Corona, CA",
    service_type: "stucco",
    description:
      "Three-coat traditional stucco on a new construction with integral pigment and a hand-floated smooth finish. Crack-resistant, weep-screened, and inspected first try.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    created_at: "2026-02-18T00:00:00Z",
  },
  {
    id: "p_004",
    title: "Open-concept kitchen remodel",
    slug: "eastvale-modern-kitchen",
    city: "Eastvale, CA",
    service_type: "remodel",
    description:
      "Removed a load-bearing wall, added a custom island, and finished the entire space with level-5 smooth walls and a Venetian plaster accent above the range. Permits and inspections handled in-house.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: true,
    created_at: "2026-01-22T00:00:00Z",
  },
  {
    id: "p_005",
    title: "Tadelakt powder room",
    slug: "menifee-tadelakt-bath",
    city: "Menifee, CA",
    service_type: "plastering",
    description:
      "Hand-burnished Tadelakt walls in a moody, candlelit powder room. Sealed with traditional black soap for waterproof, fingerprint-friendly performance.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    created_at: "2025-11-09T00:00:00Z",
  },
  {
    id: "p_006",
    title: "ADU exterior stucco match",
    slug: "perris-adu-stucco-match",
    city: "Perris, CA",
    service_type: "stucco",
    description:
      "New 720 sqft ADU finished in a sand-float texture pulled directly from the original 1980s home. The addition reads as part of the original elevation — no transition line.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    created_at: "2025-09-30T00:00:00Z",
  },
  {
    id: "p_007",
    title: "Drywall restoration after water damage",
    slug: "jurupa-valley-drywall-restoration",
    city: "Jurupa Valley, CA",
    service_type: "drywall",
    description:
      "Replaced 320 sqft of water-damaged drywall, feathered the texture into the existing surface, and repainted the affected rooms. Repair lines invisible at finish.",
    cover_image_url: "",
    before_images: [],
    after_images: [],
    featured: false,
    created_at: "2025-08-05T00:00:00Z",
  },
];

export function getProject(slug: string) {
  return projects.find((p) => p.slug === slug);
}
