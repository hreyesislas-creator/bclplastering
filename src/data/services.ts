import type { ServiceType } from "@/types/db";

export type ServiceIconKey =
  | "stucco-install"
  | "stucco-repair"
  | "exterior"
  | "restoration"
  | "patch"
  | "finishes";

export interface ServiceItem {
  slug: string;
  type: ServiceType;
  iconKey: ServiceIconKey;
  title: string;
  short: string;
  description: string;
  bullets: string[];
  startingFrom?: string;
}

export const services: ServiceItem[] = [
  {
    slug: "stucco-installation",
    type: "stucco",
    iconKey: "stucco-install",
    title: "Stucco Installation",
    short:
      "Hand-applied California stucco — smooth, sand, lace, and Santa Barbara finishes.",
    description:
      "Three-coat traditional stucco and one-coat systems for new construction, additions, and full re-stucco. Crack-resistant, color-matched, and inspected to code.",
    bullets: [
      "Smooth, sand, lace, dash, Santa Barbara",
      "Color-coat & integral pigments",
      "Lath, paper & weep screed up to code",
      "New construction & additions",
    ],
    startingFrom: "$8 / sqft",
  },
  {
    slug: "stucco-repair",
    type: "stucco",
    iconKey: "stucco-repair",
    title: "Stucco Repair",
    short:
      "Hairline cracks, water damage, blown elevations — diagnosed and repaired so they don't come back.",
    description:
      "We pull back failed sections, re-lath where needed, and color-match the existing texture. The repair disappears into the wall.",
    bullets: [
      "Crack & spall repair",
      "Water-damaged elevations",
      "Texture & color matching",
      "Failed-lath re-builds",
    ],
    startingFrom: "$1,200",
  },
  {
    slug: "exterior-remodeling",
    type: "exterior-paint",
    iconKey: "exterior",
    title: "Exterior Remodeling",
    short:
      "Full-envelope facelifts — re-stucco, paint, trim, columns, and outdoor living rooms.",
    description:
      "From Spanish-style arches to clean modern overhangs, we coordinate every exterior trade so your home reads as one elevation.",
    bullets: [
      "Whole-home re-stucco & paint",
      "Custom columns & beams",
      "Patio covers & outdoor kitchens",
      "Texture-matched additions",
    ],
  },
  {
    slug: "exterior-stucco-restoration",
    type: "stucco",
    iconKey: "restoration",
    title: "Exterior Stucco Restoration",
    short:
      "Re-stucco, crack repair, and full-elevation restoration — engineered to outlast the next storm.",
    description:
      "We strip back failed stucco, re-lath and re-paper where the substrate gave out, and rebuild the elevation in matching texture and color. HOA-compliant, weather-sealed, and inspected end-to-end.",
    bullets: [
      "Re-stucco & full elevation restoration",
      "Crack & water-damage repair",
      "Texture and color matching",
      "HOA-compliant exterior packages",
      "Weather sealing & moisture protection",
    ],
    startingFrom: "By estimate",
  },
  {
    slug: "drywall-repair",
    type: "drywall",
    iconKey: "patch",
    title: "Patch & Texture Repair",
    short:
      "Stucco patches, texture matching, and water-damage repair — every fix disappears into the wall.",
    description:
      "Hand-feathered patch work and texture matching for elevations that need to read as one surface. Knockdown, orange-peel, lace, sand, smooth — matched to whatever's already on the wall.",
    bullets: [
      "Texture matching",
      "Water-damage repair",
      "Patch work & feathered repairs",
      "Cured, sanded, and color-ready",
    ],
  },
  {
    slug: "custom-stucco-finishes",
    type: "plastering",
    iconKey: "finishes",
    title: "Custom Stucco Finishes",
    short:
      "Santa Barbara, smooth, lace, sand, and dash — hand-troweled exterior finishes with integral or acrylic color.",
    description:
      "High-end exterior finish work by craftsmen with 20+ years on the wall. Acrylic and integral color systems, hand-floated textures, and feature elevations that read as one continuous surface.",
    bullets: [
      "Santa Barbara smooth",
      "Lace, sand, and dash textures",
      "Acrylic & integral color systems",
      "Feature-elevation finish work",
    ],
    startingFrom: "By estimate",
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
