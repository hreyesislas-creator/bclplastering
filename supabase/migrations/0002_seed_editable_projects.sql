-- ============================================================================
-- Phase 9 — Editable Projects
-- Adds category / sort_order / updated_at to public.projects and seeds the
-- seven previously-static projects with stable slugs.
--
-- Safe to re-run:
--   • ALTER TABLE uses IF NOT EXISTS
--   • INSERT ... ON CONFLICT (slug) DO UPDATE
--   • The DO UPDATE never overwrites cover/before/after media that the
--     owner has already uploaded.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Schema additions
-- --------------------------------------------------------------------------
alter table public.projects
  add column if not exists category text,
  add column if not exists sort_order integer not null default 0,
  add column if not exists updated_at timestamptz not null default now();

create index if not exists projects_sort_idx
  on public.projects (sort_order, created_at desc);

-- updated_at trigger
create or replace function public.set_projects_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
  before update on public.projects
  for each row execute function public.set_projects_updated_at();

-- --------------------------------------------------------------------------
-- Seed the seven existing public projects with stable slugs.
-- Content (titles, cities, descriptions) mirrors src/data/projects.ts.
-- --------------------------------------------------------------------------
insert into public.projects
  (slug, title, city, service_type, category, short_description, description,
   cover_image_url, before_images, after_images, featured, sort_order,
   created_at)
values
  (
    'spanish-revival-stucco-restoration',
    'Spanish revival stucco restoration',
    'Riverside, CA',
    'stucco',
    'Stucco Installation',
    'Hand-troweled Santa Barbara smooth on a 1960s Spanish revival.',
    'Pulled back failed elevations on a 1960s Spanish revival, re-lathed where needed, and hand-troweled a Santa Barbara smooth finish across all four sides — color-matched in two tones to highlight the original arches.',
    '', '{}', '{}',
    true, 10,
    '2026-04-12T00:00:00Z'
  ),
  (
    'whole-home-exterior-remodel',
    'Whole-home exterior remodel',
    'Moreno Valley, CA',
    'exterior-paint',
    'Exterior Remodeling',
    'Full envelope facelift — stucco, columns, trim, Loxon two-coat.',
    'Full envelope facelift — new stucco on two elevations, custom columns, recessed trim, and a Sherwin-Williams Loxon two-coat system across the entire home. Permitted, inspected, and finished in 18 working days.',
    '', '{}', '{}',
    true, 20,
    '2026-03-04T00:00:00Z'
  ),
  (
    'smooth-finish-stucco-new-build',
    'Smooth finish stucco — new build',
    'Corona, CA',
    'stucco',
    'Stucco Installation',
    'Three-coat traditional stucco with a hand-floated smooth finish.',
    'Three-coat traditional stucco on a new construction with integral pigment and a hand-floated smooth finish. Crack-resistant, weep-screened, and inspected first try.',
    '', '{}', '{}',
    true, 30,
    '2026-02-18T00:00:00Z'
  ),
  (
    'open-concept-kitchen-remodel',
    'Open-concept kitchen remodel',
    'Eastvale, CA',
    'remodel',
    'Interior Remodeling',
    'Load-bearing wall removed; island, level-5 walls, Venetian accent.',
    'Removed a load-bearing wall, added a custom island, and finished the entire space with level-5 smooth walls and a Venetian plaster accent above the range. Permits and inspections handled in-house.',
    '', '{}', '{}',
    true, 40,
    '2026-01-22T00:00:00Z'
  ),
  (
    'tadelakt-powder-room',
    'Tadelakt powder room',
    'Menifee, CA',
    'plastering',
    'Decorative Finishes',
    'Hand-burnished Tadelakt in a moody, candlelit powder room.',
    'Hand-burnished Tadelakt walls in a moody, candlelit powder room. Sealed with traditional black soap for waterproof, fingerprint-friendly performance.',
    '', '{}', '{}',
    false, 50,
    '2025-11-09T00:00:00Z'
  ),
  (
    'adu-exterior-stucco-match',
    'ADU exterior stucco match',
    'Perris, CA',
    'stucco',
    'Stucco Installation',
    'Sand-float texture matched to the original 1980s home.',
    'New 720 sqft ADU finished in a sand-float texture pulled directly from the original 1980s home. The addition reads as part of the original elevation — no transition line.',
    '', '{}', '{}',
    false, 60,
    '2025-09-30T00:00:00Z'
  ),
  (
    'drywall-restoration-after-water-damage',
    'Drywall restoration after water damage',
    'Jurupa Valley, CA',
    'drywall',
    'Drywall Repair',
    '320 sqft replaced; repair lines invisible at finish.',
    'Replaced 320 sqft of water-damaged drywall, feathered the texture into the existing surface, and repainted the affected rooms. Repair lines invisible at finish.',
    '', '{}', '{}',
    false, 70,
    '2025-08-05T00:00:00Z'
  )
on conflict (slug) do update set
  title             = excluded.title,
  city              = excluded.city,
  service_type      = excluded.service_type,
  category          = excluded.category,
  short_description = excluded.short_description,
  description       = excluded.description,
  featured          = excluded.featured,
  sort_order        = excluded.sort_order,
  -- Preserve media the owner has already uploaded.
  cover_image_url = case
    when public.projects.cover_image_url is null
      or public.projects.cover_image_url = ''
    then excluded.cover_image_url
    else public.projects.cover_image_url
  end,
  before_images = case
    when public.projects.before_images is null
      or array_length(public.projects.before_images, 1) is null
    then excluded.before_images
    else public.projects.before_images
  end,
  after_images = case
    when public.projects.after_images is null
      or array_length(public.projects.after_images, 1) is null
    then excluded.after_images
    else public.projects.after_images
  end;
