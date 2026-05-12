-- ============================================================================
-- BCL Plastering & Building Remodel — Supabase schema
-- Run inside the SQL editor on a fresh project.
-- ============================================================================

-- --------------------------------------------------------------------------
-- ENUMS
-- --------------------------------------------------------------------------
create type lead_status as enum (
  'new',
  'contacted',
  'estimate_sent',
  'won',
  'lost'
);

create type service_type as enum (
  'stucco',
  'plastering',
  'remodel',
  'exterior-paint',
  'patio-cover',
  'addition',
  'drywall',
  'other'
);

create type review_source as enum (
  'google',
  'yelp',
  'thumbtack',
  'facebook',
  'direct'
);

-- --------------------------------------------------------------------------
-- TABLES
-- --------------------------------------------------------------------------
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text,
  city text,
  service_type service_type not null,
  message text,
  project_photo_urls text[] not null default '{}',
  status lead_status not null default 'new',
  created_at timestamptz not null default now()
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  city text not null,
  service_type service_type not null,
  description text not null,
  short_description text,
  category text,
  cover_image_url text not null,
  before_images text[] not null default '{}',
  after_images text[] not null default '{}',
  featured boolean not null default false,
  sort_order integer not null default 0,
  youtube_url text,
  youtube_embed_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- See supabase/migrations/0001_media_manager.sql for the site_images
-- table, RLS, storage bucket, and seeded media slots used by the
-- dashboard's Website Images + Media Library pages.
--
-- See supabase/migrations/0003_editable_services.sql for the services
-- table, RLS, the service-images bucket, and the seeded service slots
-- that back the public Services pages.

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  source review_source not null default 'direct',
  rating int not null check (rating between 1 and 5),
  review_text text not null,
  created_at timestamptz not null default now()
);

-- Singleton "site settings" row. Constrained to id = 1 so there is
-- exactly one record holding the contractor's editable site info.
create table public.site_settings (
  id smallint primary key default 1 check (id = 1),
  phone text,
  whatsapp text,
  email text,
  service_areas text[] not null default '{}',
  social_links jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (id) values (1) on conflict do nothing;

create index leads_status_idx on public.leads (status, created_at desc);
create index leads_created_idx on public.leads (created_at desc);
create index projects_featured_idx on public.projects (featured, created_at desc);
create index reviews_created_idx on public.reviews (created_at desc);

-- --------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- --------------------------------------------------------------------------
-- The dashboard reads/writes through the service-role client (which
-- bypasses RLS) so these policies are defense-in-depth: they let
-- anonymous users *read* what the marketing site needs, but never
-- write or read leads.
alter table public.leads enable row level security;
alter table public.projects enable row level security;
alter table public.reviews enable row level security;
alter table public.site_settings enable row level security;

-- Public marketing reads
create policy "projects readable" on public.projects
  for select using (true);
create policy "reviews readable" on public.reviews
  for select using (true);
create policy "settings readable" on public.site_settings
  for select using (true);

-- Authenticated dashboard users can insert/update/delete the
-- editable tables. The service role bypasses RLS regardless.
create policy "projects writable by auth" on public.projects
  for all to authenticated using (true) with check (true);
create policy "reviews writable by auth" on public.reviews
  for all to authenticated using (true) with check (true);
create policy "settings writable by auth" on public.site_settings
  for all to authenticated using (true) with check (true);
create policy "leads readable by auth" on public.leads
  for select to authenticated using (true);
create policy "leads updatable by auth" on public.leads
  for update to authenticated using (true) with check (true);

-- Leads inserts come from the server (service role) only.

-- --------------------------------------------------------------------------
-- STORAGE BUCKETS
-- --------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  (
    'lead-uploads',
    'lead-uploads',
    true,
    8 * 1024 * 1024,
    array['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif']
  ),
  (
    'project-gallery',
    'project-gallery',
    true,
    10 * 1024 * 1024,
    array['image/jpeg', 'image/png', 'image/webp']
  )
on conflict (id) do nothing;

-- Public read on both buckets so the dashboard / marketing site can render.
create policy "lead-uploads readable" on storage.objects
  for select using (bucket_id = 'lead-uploads');

create policy "project-gallery readable" on storage.objects
  for select using (bucket_id = 'project-gallery');

-- Authenticated dashboard users can upload to project-gallery.
create policy "project-gallery writable by auth" on storage.objects
  for all to authenticated using (bucket_id = 'project-gallery')
  with check (bucket_id = 'project-gallery');

-- Lead uploads always go through the service role on the server.
