import type { ServiceType } from "@/types/db";

export type ServiceIconKey =
  | "stucco-install"
  | "stucco-repair"
  | "exterior"
  | "interior"
  | "drywall"
  | "decorative";

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
      "From Spanish-style arches to clean modern overhangs, we coordinate every exterior trade so your home reads as one design.",
    bullets: [
      "Whole-home re-stucco & paint",
      "Custom columns & beams",
      "Patio covers & outdoor kitchens",
      "Texture-matched additions",
    ],
  },
  {
    slug: "interior-remodeling",
    type: "remodel",
    iconKey: "interior",
    title: "Interior Remodeling",
    short:
      "Kitchens, bathrooms, and full home remodels — design through final walk-through.",
    description:
      "Licensed and insured general contracting. One project manager from demo to permit close-out, with a vetted subcontractor network.",
    bullets: [
      "Kitchen & bath",
      "Open-concept conversions",
      "Permits & inspections handled",
      "Level-5 smooth walls & arches",
    ],
  },
  {
    slug: "drywall-repair",
    type: "drywall",
    iconKey: "drywall",
    title: "Drywall Repair",
    short:
      "Texture matching, water damage, and full hangs — repairs that disappear.",
    description:
      "Knockdown, orange-peel, smooth — every patch is feathered and sanded so the existing surface stays intact.",
    bullets: [
      "Texture matching",
      "Water-damage repair",
      "Hang & finish",
      "Ceiling & vaulted repairs",
    ],
  },
  {
    slug: "decorative-finishes",
    type: "plastering",
    iconKey: "decorative",
    title: "Decorative Finishes",
    short:
      "Venetian, Tadelakt, lime wash, and polished plaster for high-end interiors.",
    description:
      "Hand-troweled finishes by craftsmen with 20+ years on the wall. We work with designers and architects across LA and the Valley.",
    bullets: [
      "Venetian & polished plaster",
      "Lime wash & Tadelakt",
      "Skim coat & level-5",
      "Curved walls & arches",
    ],
  },
];

export function getService(slug: string) {
  return services.find((s) => s.slug === slug);
}
