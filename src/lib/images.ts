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
    "exterior-stucco-restoration": off(
      "/services/exterior-stucco-restoration.jpg",
      "Restored stucco elevation, re-lathed and color-matched"
    ),
    "drywall-repair": off(
      "/services/drywall-repair.jpg",
      "Hand-feathered patch & texture repair, sanded smooth"
    ),
    "custom-stucco-finishes": off(
      "/services/custom-stucco-finishes.jpg",
      "Hand-troweled Santa Barbara smooth stucco in warm light"
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
    "spanish-revival-stucco-restoration": off(
      "/projects/stucco-repair/riverside-cover.jpg",
      "Spanish revival stucco restoration in Riverside"
    ),
    "whole-home-exterior-remodel": off(
      "/projects/remodeling/moreno-valley-cover.jpg",
      "Whole-home exterior remodel in Moreno Valley"
    ),
    "smooth-finish-stucco-new-build": off(
      "/projects/stucco-installation/corona-cover.jpg",
      "Smooth finish stucco new build in Corona"
    ),
    "multi-elevation-re-stucco": off(
      "/projects/restoration/eastvale-cover.jpg",
      "Multi-elevation re-stucco in Eastvale"
    ),
    "santa-barbara-smooth-feature-elevation": off(
      "/projects/finishes/menifee-cover.jpg",
      "Santa Barbara smooth feature elevation in Menifee"
    ),
    "adu-exterior-stucco-match": off(
      "/projects/stucco-installation/perris-cover.jpg",
      "ADU exterior stucco texture match in Perris"
    ),
    "exterior-stucco-water-damage-restoration": off(
      "/projects/restoration/jurupa-cover.jpg",
      "Exterior stucco water-damage restoration in Jurupa Valley"
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
