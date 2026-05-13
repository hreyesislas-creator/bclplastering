-- ============================================================================
-- Phase 11 — Exterior Repositioning
-- Existing services/projects seeded under interior-focused slugs are renamed
-- in place so their IDs, uploaded media, and sort_order survive. The new
-- exterior-focused content lives in migrations 0002 / 0003 for fresh setups.
--
-- Safe to re-run: each UPDATE is keyed by the *old* slug, so once the
-- rename is applied the WHERE clauses match nothing and the statements
-- are no-ops.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Services — rename + repointing
-- --------------------------------------------------------------------------

-- 1) interior-remodeling → exterior-stucco-restoration
update public.services
set
  slug              = 'exterior-stucco-restoration',
  title             = 'Exterior Stucco Restoration',
  category          = 'Exterior Stucco Restoration',
  short_description = 'Re-stucco, crack repair, and full-elevation restoration — engineered to outlast the next storm.',
  description       = 'We strip back failed stucco, re-lath and re-paper where the substrate gave out, and rebuild the elevation in matching texture and color. HOA-compliant, weather-sealed, and inspected end-to-end.',
  bullets           = array[
    'Re-stucco & full elevation restoration',
    'Crack & water-damage repair',
    'Texture and color matching',
    'HOA-compliant exterior packages',
    'Weather sealing & moisture protection'
  ],
  icon_key          = 'wrench'
where slug = 'interior-remodeling';

-- 2) decorative-finishes → custom-stucco-finishes
update public.services
set
  slug              = 'custom-stucco-finishes',
  title             = 'Custom Stucco Finishes',
  category          = 'Custom Stucco Finishes',
  short_description = 'Santa Barbara, smooth, lace, sand, and dash — hand-troweled exterior finishes with integral or acrylic color.',
  description       = 'High-end exterior finish work by craftsmen with 20+ years on the wall. Acrylic and integral color systems, hand-floated textures, and feature elevations that read as one continuous surface.',
  bullets           = array[
    'Santa Barbara smooth',
    'Lace, sand, and dash textures',
    'Acrylic & integral color systems',
    'Feature-elevation finish work'
  ],
  icon_key          = 'sparkles'
where slug = 'decorative-finishes';

-- 3) drywall-repair — title + content neutralised to remove indoor language,
--    slug kept stable so the row identity carries over.
update public.services
set
  title             = 'Patch & Texture Repair',
  category          = 'Repair',
  short_description = 'Stucco patches, texture matching, and water-damage repair — every fix disappears into the wall.',
  description       = 'Hand-feathered patch work and texture matching for elevations that need to read as one surface. Knockdown, orange-peel, lace, sand, smooth — matched to whatever''s already on the wall.',
  bullets           = array[
    'Texture matching',
    'Water-damage repair',
    'Patch work & feathered repairs'
  ]
where slug = 'drywall-repair';

-- --------------------------------------------------------------------------
-- Projects — rename + repointing (IDs / uploaded media preserved)
-- --------------------------------------------------------------------------

-- 4) open-concept-kitchen-remodel → multi-elevation-re-stucco
update public.projects
set
  slug              = 'multi-elevation-re-stucco',
  title             = 'Multi-elevation re-stucco',
  service_type      = 'stucco',
  category          = 'Exterior Stucco Restoration',
  short_description = 'Failed stucco on three elevations stripped, re-lathed, and re-stuccoed in matching texture.',
  description       = 'Stripped failed stucco on three elevations of a two-story home, re-lathed and re-papered the affected substrate, and rebuilt each face in a matching sand-float texture. Color-coated and weather-sealed end-to-end — the new elevations read continuous with the original.'
where slug = 'open-concept-kitchen-remodel';

-- 5) tadelakt-powder-room → santa-barbara-smooth-feature-elevation
update public.projects
set
  slug              = 'santa-barbara-smooth-feature-elevation',
  title             = 'Santa Barbara smooth feature elevation',
  service_type      = 'plastering',
  category          = 'Custom Stucco Finishes',
  short_description = 'Hand-troweled Santa Barbara smooth across a feature elevation with integral color.',
  description       = 'Hand-troweled Santa Barbara smooth finish across the full front elevation, pulled in a warm integral color and burnished to a soft sheen. Tied into the existing texture on the side elevations so the transition disappears.'
where slug = 'tadelakt-powder-room';

-- 6) drywall-restoration-after-water-damage → exterior-stucco-water-damage-restoration
update public.projects
set
  slug              = 'exterior-stucco-water-damage-restoration',
  title             = 'Exterior stucco water-damage restoration',
  service_type      = 'stucco',
  category          = 'Exterior Stucco Restoration',
  short_description = 'Water-damaged stucco elevation stripped, re-lathed, and color-matched.',
  description       = 'Stripped a water-damaged stucco elevation back to studs, replaced the failed paper and lath, and re-floated the finish to match the existing texture. Color-coated and re-sealed so the elevation reads continuous and stays weather-tight.'
where slug = 'drywall-restoration-after-water-damage';
