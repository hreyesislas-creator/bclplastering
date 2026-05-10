/**
 * Image manifest.
 *
 * Single source of truth for every photograph used by the site. Components
 * read from this manifest and fall back to gradient placeholders when an
 * entry is `enabled: false`. Drop a file in `/public/<folder>/<name>` then
 * flip `enabled: true` and the photo replaces the placeholder.
 */

export interface ImageRef {
  /** Absolute path under /public. */
  src: string;
  /** Accessible description. Required even when disabled. */
  alt: string;
  /** Set to true once the file exists in /public. */
  enabled: boolean;
}

export interface BeforeAfterRef {
  before: ImageRef;
  after: ImageRef;
}

const off = (src: string, alt: string): ImageRef => ({ src, alt, enabled: false });

export const images = {
  hero: {
    primary: off(
      "/hero/primary.jpg",
      "Custom Santa Barbara smooth stucco home in the Inland Empire at golden hour"
    ),
    mobile: off(
      "/hero/primary-mobile.jpg",
      "Hand-troweled stucco facade close-up"
    ),
    showcasePortrait: off(
      "/hero/showcase-portrait.jpg",
      "BCL crew finishing a hand-troweled stucco wall"
    ),
  },
  services: {
    "stucco-installation": off(
      "/services/stucco-installation.jpg",
      "Three-coat traditional stucco being hand-floated"
    ),
    "stucco-repair": off(
      "/services/stucco-repair.jpg",
      "Color-matched stucco repair on an existing elevation"
    ),
    "exterior-remodeling": off(
      "/services/exterior-remodeling.jpg",
      "Whole-home exterior remodel with custom columns and trim"
    ),
    "interior-remodeling": off(
      "/services/interior-remodeling.jpg",
      "Open-concept kitchen remodel with level-5 walls"
    ),
    "drywall-repair": off(
      "/services/drywall-repair.jpg",
      "Texture-matched drywall repair, sanded smooth"
    ),
    "decorative-finishes": off(
      "/services/decorative-finishes.jpg",
      "Polished Venetian plaster wall in warm light"
    ),
  },
  beforeAfter: {
    "riverside-stucco-restoration": {
      before: off(
        "/before-after/riverside-before.jpg",
        "Before — failed stucco elevation in Riverside"
      ),
      after: off(
        "/before-after/riverside-after.jpg",
        "After — restored Santa Barbara smooth finish in Riverside"
      ),
    },
    "moreno-valley-exterior-remodel": {
      before: off(
        "/before-after/moreno-valley-before.jpg",
        "Before — dated exterior in Moreno Valley"
      ),
      after: off(
        "/before-after/moreno-valley-after.jpg",
        "After — full envelope remodel in Moreno Valley"
      ),
    },
    "corona-smooth-finish-stucco": {
      before: off(
        "/before-after/corona-before.jpg",
        "Before — original stucco in Corona"
      ),
      after: off(
        "/before-after/corona-after.jpg",
        "After — smooth finish stucco with new color in Corona"
      ),
    },
  } as Record<string, BeforeAfterRef>,
  projects: {
    "riverside-stucco-restoration": off(
      "/projects/stucco-repair/riverside-cover.jpg",
      "Riverside stucco restoration, finished envelope"
    ),
    "moreno-valley-exterior-remodel": off(
      "/projects/remodeling/moreno-valley-cover.jpg",
      "Moreno Valley exterior remodel, finished facade"
    ),
    "corona-smooth-finish-stucco": off(
      "/projects/stucco-installation/corona-cover.jpg",
      "Corona smooth finish stucco, finished home"
    ),
    "eastvale-modern-kitchen": off(
      "/projects/remodeling/eastvale-cover.jpg",
      "Eastvale modern kitchen remodel"
    ),
    "menifee-tadelakt-bath": off(
      "/projects/remodeling/menifee-cover.jpg",
      "Menifee Tadelakt powder room"
    ),
    "perris-adu-stucco-match": off(
      "/projects/stucco-installation/perris-cover.jpg",
      "Perris ADU exterior stucco texture match"
    ),
    "jurupa-valley-drywall-restoration": off(
      "/projects/drywall/jurupa-cover.jpg",
      "Jurupa Valley drywall restoration"
    ),
  } as Record<string, ImageRef>,
  reviewers: {
    "maria-g": off("/reviews/maria-g.jpg", "Maria G., Riverside homeowner"),
    "david-susan-r": off("/reviews/david-susan-r.jpg", "David & Susan R., Corona"),
    "jennifer-p": off("/reviews/jennifer-p.jpg", "Jennifer P., Eastvale"),
  } as Record<string, ImageRef>,
  textures: {
    stucco: off("/textures/stucco-1.jpg", "Stucco texture overlay"),
    concrete: off("/textures/concrete-1.jpg", "Concrete texture overlay"),
  } as Record<string, ImageRef>,
} as const;

/** Returns the ImageRef if enabled, otherwise null. Callers can render
 *  a placeholder when null is returned. */
export function imageOrNull(ref: ImageRef): ImageRef | null {
  return ref.enabled ? ref : null;
}
