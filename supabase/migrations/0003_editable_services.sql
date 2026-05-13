-- ============================================================================
-- Phase 10 — Editable Services
-- Creates public.services + RLS + a dedicated service-images storage bucket
-- and seeds the six current public services with stable slugs.
--
-- Safe to re-run:
--   * IF NOT EXISTS on the table / bucket
--   * INSERT ... ON CONFLICT (slug) DO UPDATE
--   * The DO UPDATE preserves image_url whenever a value is already set.
-- ============================================================================

-- --------------------------------------------------------------------------
-- Table
-- --------------------------------------------------------------------------
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  category text,
  short_description text,
  description text,
  bullets text[] not null default '{}',
  price_label text,
  icon_key text,
  image_url text,
  is_active boolean not null default true,
  featured boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists services_sort_idx
  on public.services (is_active, sort_order, title);

-- updated_at trigger
create or replace function public.set_services_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists services_set_updated_at on public.services;
create trigger services_set_updated_at
  before update on public.services
  for each row execute function public.set_services_updated_at();

-- --------------------------------------------------------------------------
-- RLS — public read of active rows, authenticated full access
-- --------------------------------------------------------------------------
alter table public.services enable row level security;

drop policy if exists "services readable when active" on public.services;
create policy "services readable when active" on public.services
  for select using (is_active = true);

drop policy if exists "services writable by auth" on public.services;
create policy "services writable by auth" on public.services
  for all to authenticated using (true) with check (true);

-- --------------------------------------------------------------------------
-- Storage bucket for hero/cover images attached to a service
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'service-images',
  'service-images',
  true,
  8 * 1024 * 1024,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "service-images readable" on storage.objects;
create policy "service-images readable" on storage.objects
  for select using (bucket_id = 'service-images');

drop policy if exists "service-images writable by auth" on storage.objects;
create policy "service-images writable by auth" on storage.objects
  for all to authenticated using (bucket_id = 'service-images')
  with check (bucket_id = 'service-images');

-- --------------------------------------------------------------------------
-- Seed the six current services (exterior-focused positioning)
-- --------------------------------------------------------------------------
insert into public.services
  (slug, title, category, short_description, description, bullets,
   price_label, icon_key, is_active, featured, sort_order)
values
  (
    'stucco-installation',
    'Stucco Installation',
    'Stucco',
    'Hand-applied California stucco — smooth, sand, lace, and Santa Barbara finishes.',
    'Three-coat traditional stucco and one-coat systems for new construction, additions, and full re-stucco. Crack-resistant, color-matched, and inspected to code.',
    array[
      'Smooth, sand, lace, dash, Santa Barbara',
      'Color-coat & integral pigments',
      'Lath, paper & weep screed up to code'
    ],
    'From $8 / SQFT',
    'building',
    true, true, 10
  ),
  (
    'stucco-repair',
    'Stucco Repair',
    'Stucco',
    'Hairline cracks, water damage, blown elevations — diagnosed and repaired so they don''t come back.',
    'We pull back failed sections, re-lath where needed, and color-match the existing texture. The repair disappears into the wall.',
    array[
      'Crack & spall repair',
      'Water-damaged elevations',
      'Texture & color matching'
    ],
    'From $1,200',
    'wrench',
    true, true, 20
  ),
  (
    'exterior-remodeling',
    'Exterior Remodeling',
    'Exterior',
    'Full-envelope facelifts — re-stucco, paint, trim, columns, and outdoor living rooms.',
    'From Spanish-style arches to clean modern overhangs, we coordinate every exterior trade so your home reads as one elevation.',
    array[
      'Whole-home re-stucco & paint',
      'Custom columns & beams',
      'Patio covers & outdoor kitchens'
    ],
    'By estimate',
    'sun',
    true, true, 30
  ),
  (
    'exterior-stucco-restoration',
    'Exterior Stucco Restoration',
    'Exterior Stucco Restoration',
    'Re-stucco, crack repair, and full-elevation restoration — engineered to outlast the next storm.',
    'We strip back failed stucco, re-lath and re-paper where the substrate gave out, and rebuild the elevation in matching texture and color. HOA-compliant, weather-sealed, and inspected end-to-end.',
    array[
      'Re-stucco & full elevation restoration',
      'Crack & water-damage repair',
      'Texture and color matching',
      'HOA-compliant exterior packages',
      'Weather sealing & moisture protection'
    ],
    'By estimate',
    'wrench',
    true, true, 40
  ),
  (
    'drywall-repair',
    'Patch & Texture Repair',
    'Repair',
    'Stucco patches, texture matching, and water-damage repair — every fix disappears into the wall.',
    'Hand-feathered patch work and texture matching for elevations that need to read as one surface. Knockdown, orange-peel, lace, sand, smooth — matched to whatever''s already on the wall.',
    array[
      'Texture matching',
      'Water-damage repair',
      'Patch work & feathered repairs'
    ],
    'By estimate',
    'paint-roller',
    true, true, 50
  ),
  (
    'custom-stucco-finishes',
    'Custom Stucco Finishes',
    'Custom Stucco Finishes',
    'Santa Barbara, smooth, lace, sand, and dash — hand-troweled exterior finishes with integral or acrylic color.',
    'High-end exterior finish work by craftsmen with 20+ years on the wall. Acrylic and integral color systems, hand-floated textures, and feature elevations that read as one continuous surface.',
    array[
      'Santa Barbara smooth',
      'Lace, sand, and dash textures',
      'Acrylic & integral color systems',
      'Feature-elevation finish work'
    ],
    'By estimate',
    'sparkles',
    true, true, 60
  )
on conflict (slug) do update set
  title             = excluded.title,
  category          = excluded.category,
  short_description = excluded.short_description,
  description       = excluded.description,
  bullets           = excluded.bullets,
  price_label       = excluded.price_label,
  icon_key          = excluded.icon_key,
  is_active         = excluded.is_active,
  featured          = excluded.featured,
  sort_order        = excluded.sort_order,
  -- Preserve any image the owner has already uploaded.
  image_url = case
    when public.services.image_url is null
      or public.services.image_url = ''
    then excluded.image_url
    else public.services.image_url
  end;
