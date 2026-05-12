-- ============================================================================
-- Phase 8 — Website Image + Video Manager
-- Adds the site_images table, storage bucket, RLS, and seeded slots.
-- Also extends projects with short_description + youtube fields.
-- Safe to re-run: every statement is guarded with IF NOT EXISTS / ON CONFLICT.
-- ============================================================================

-- --------------------------------------------------------------------------
-- site_images
-- --------------------------------------------------------------------------
create table if not exists public.site_images (
  id uuid primary key default gen_random_uuid(),
  image_key text not null unique,
  label text not null,
  description text,
  recommended_width integer,
  recommended_height integer,
  section text,
  page text,
  image_url text,
  alt_text text,
  media_type text not null default 'image' check (media_type in ('image', 'youtube')),
  youtube_url text,
  youtube_embed_url text,
  sort_order integer not null default 0,
  is_required boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists site_images_sort_idx
  on public.site_images (sort_order, page, section);

-- updated_at trigger
create or replace function public.set_site_images_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists site_images_set_updated_at on public.site_images;
create trigger site_images_set_updated_at
  before update on public.site_images
  for each row execute function public.set_site_images_updated_at();

-- --------------------------------------------------------------------------
-- RLS — public read, authenticated write
-- --------------------------------------------------------------------------
alter table public.site_images enable row level security;

drop policy if exists "site_images readable" on public.site_images;
create policy "site_images readable" on public.site_images
  for select using (true);

drop policy if exists "site_images writable by auth" on public.site_images;
create policy "site_images writable by auth" on public.site_images
  for all to authenticated using (true) with check (true);

-- --------------------------------------------------------------------------
-- Storage bucket
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site-images',
  'site-images',
  true,
  8 * 1024 * 1024,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do nothing;

drop policy if exists "site-images readable" on storage.objects;
create policy "site-images readable" on storage.objects
  for select using (bucket_id = 'site-images');

drop policy if exists "site-images writable by auth" on storage.objects;
create policy "site-images writable by auth" on storage.objects
  for all to authenticated using (bucket_id = 'site-images')
  with check (bucket_id = 'site-images');

-- --------------------------------------------------------------------------
-- Seed required slots — image + youtube
-- --------------------------------------------------------------------------
insert into public.site_images
  (image_key, label, description, recommended_width, recommended_height,
   section, page, media_type, sort_order, is_required)
values
  ('hero_primary', 'Homepage Hero Image',
   'Main cinematic background image. Should show premium finished stucco/remodel work. Dark overlay will be applied.',
   2400, 1400, 'Hero', 'Home', 'image', 10, true),

  ('hero_mobile', 'Mobile Hero Image',
   'Vertical crop for mobile hero. Subject should be centered.',
   1200, 1600, 'Hero', 'Home', 'image', 20, true),

  ('home_featured_project_1', 'Featured Project 1',
   'Appears in the first recent work card.',
   1600, 1200, 'Recent Work', 'Home', 'image', 30, false),

  ('home_featured_project_2', 'Featured Project 2',
   'Appears in the second recent work card.',
   1600, 1200, 'Recent Work', 'Home', 'image', 31, false),

  ('home_featured_project_3', 'Featured Project 3',
   'Appears in the third recent work card.',
   1600, 1200, 'Recent Work', 'Home', 'image', 32, false),

  ('before_after_riverside_before', 'Riverside Before',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 40, false),
  ('before_after_riverside_after', 'Riverside After',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 41, false),

  ('before_after_moreno_before', 'Moreno Valley Before',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 42, false),
  ('before_after_moreno_after', 'Moreno Valley After',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 43, false),

  ('before_after_corona_before', 'Corona Before',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 44, false),
  ('before_after_corona_after', 'Corona After',
   null, 1600, 1200, 'Before / After', 'Home', 'image', 45, false),

  ('og_image', 'Social Share Image',
   'Used when the site is shared on Facebook, WhatsApp, iMessage, etc.',
   1200, 630, 'Open Graph', 'SEO / Social', 'image', 50, true),

  ('hero_video', 'Hero Background Video',
   'Optional cinematic YouTube background video for homepage hero.',
   null, null, 'Hero', 'Home', 'youtube', 60, false),

  ('homepage_feature_video', 'Homepage Featured Video',
   'Main promotional or project showcase video.',
   null, null, 'Featured Video', 'Home', 'youtube', 61, false),

  ('gallery_video_1', 'Gallery Video 1',
   null, null, null, 'Media Gallery', 'Gallery', 'youtube', 70, false),
  ('gallery_video_2', 'Gallery Video 2',
   null, null, null, 'Media Gallery', 'Gallery', 'youtube', 71, false)
on conflict (image_key) do nothing;

-- --------------------------------------------------------------------------
-- Project gallery improvements
-- --------------------------------------------------------------------------
alter table public.projects
  add column if not exists short_description text,
  add column if not exists youtube_url text,
  add column if not exists youtube_embed_url text;
