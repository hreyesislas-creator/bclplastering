# Production deployment checklist

> Order matters: provision data + secrets first, then deploy. The build
> tolerates missing env vars (it won't crash), but features stay dark
> until the matching service is wired.

## 1. Supabase (data & auth)

1. Create a new project at <https://supabase.com/dashboard>.
2. **SQL editor → New query** → paste the contents of `supabase/schema.sql`
   and run it. This creates:
   - `lead_status`, `service_type`, `review_source` enums
   - `leads`, `projects`, `reviews`, `site_settings` tables
   - RLS policies (public read for projects/reviews/settings; auth writes)
   - Storage buckets `lead-uploads` (8 MB) and `project-gallery` (10 MB)
   - Public read policies on both buckets
3. **Authentication → Providers → Email**: enable email/password.
4. **Authentication → Users → Add user** with the contractor's email
   and a temporary password. Mark it confirmed.
5. **Settings → API**: copy these into Vercel:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (server only)

## 2. Resend (lead emails)

1. Create an account at <https://resend.com>.
2. **Domains → Add domain** → enter your sending domain (e.g.
   `bclplastering.com`) and add the DNS records shown.
3. Once verified, **API Keys → Create API Key** with Sending Access.
4. Add to Vercel:
   - `RESEND_API_KEY` → the key
   - `RESEND_FROM_EMAIL` → e.g. `BCL Plastering <leads@bclplastering.com>`
   - `LEAD_NOTIFICATION_EMAIL` → owner inbox

## 3. SMS — optional (Twilio)

Skip if you don't need text alerts yet — the abstraction stays a no-op.

1. Create a Twilio account, buy a number with SMS capability.
2. Add to Vercel:
   - `TWILIO_ACCOUNT_SID`
   - `TWILIO_AUTH_TOKEN`
   - `TWILIO_FROM_NUMBER` (E.164: `+1...`)
   - `LEAD_NOTIFICATION_PHONE` (E.164: `+19515550123`)

## 4. Analytics — optional

Set these in Vercel to enable each integration. Both are no-ops when
empty, so you can ship without them and add later.

- `NEXT_PUBLIC_GA_ID` — Google Analytics 4 measurement ID (`G-...`)
- `NEXT_PUBLIC_META_PIXEL_ID` — Meta Pixel ID (numeric)

Tracked events: `lead_submit`, `lead_submit_failed`, `phone_click`,
`whatsapp_click`, `estimate_cta`, `contact_cta`. Each event includes a
`source` parameter (`hero`, `mobile_bar`, `cta_section`, `navbar`,
`contact_rows`, `post_submit`, etc.).

In GA4, mark these as conversions:
- `lead_submit`
- `phone_click`
- `whatsapp_click`

## 5. Vercel deploy

```bash
# From the repo root
npm i -g vercel              # if not already
vercel link                  # link to a new or existing project
vercel env add               # walk through every var above (Production)
vercel deploy --prod
```

Or push to a connected GitHub repo with the env vars set in Vercel's
project settings — the platform handles the rest.

### Custom domain

1. Vercel → Project → **Domains → Add** `www.bclplastering.com`.
2. Add the DNS records Vercel shows you.
3. Set `NEXT_PUBLIC_SITE_URL=https://www.bclplastering.com` in Production.

### Image hosts

`next.config.ts` already allows `*.supabase.co/storage/v1/object/public/**`
through `<Image />`. If you add another image host (CDN, Imgix, etc.),
extend `images.remotePatterns`.

## 6. Smoke test the live deploy

- [ ] **Marketing site renders** — homepage, services, projects, gallery,
      reviews, about, contact all 200.
- [ ] **OG / canonical** — `view-source` on `/` shows `<link
      rel="canonical">`, `<meta property="og:image">`, and a
      `<script type="application/ld+json">` LocalBusiness block.
- [ ] **Sitemap** — `/sitemap.xml` lists every static and dynamic route.
- [ ] **Robots** — `/robots.txt` allows root, blocks `/dashboard` and `/api`.
- [ ] **Lead form** — submit a real lead with 1–3 photos.
  - [ ] Success card with WhatsApp + Call CTAs renders.
  - [ ] Email lands in `LEAD_NOTIFICATION_EMAIL` inbox (branded HTML).
  - [ ] Lead row appears in Supabase `leads` table.
  - [ ] Photos appear in `lead-uploads/leads/YYYY/MM/<id>/...`.
- [ ] **Login** — `/dashboard` redirects to `/login`. After signing in
      with the user from step 1.4, the dashboard renders.
- [ ] **Lead detail** — open the test lead, change its status, refresh —
      status persists.
- [ ] **Project create** — add a project with cover + before/after.
      Public `/projects/<slug>` and `/gallery` reflect it.
- [ ] **Review create** — add a review, public `/reviews` and homepage
      pick it up.
- [ ] **Settings save** — change phone in `/dashboard/settings`, watch
      the footer update on the next page load.
- [ ] **Mobile** — same flows on a real iPhone / Android browser:
      hero readable, mobile CTA bar visible, dashboard sidebar
      replaced by sticky pills, photo lightbox works.
- [ ] **Analytics** (if configured) — GA4 Realtime shows pageviews;
      submit a test lead and watch `lead_submit` arrive.

## 7. Post-launch follow-ups

- **Drop real photography**: see `public/README.md`. Most impactful
  files: `hero/primary.jpg`, the three before/after pairs, project
  covers under `projects/<service>/`.
- **Migrate `middleware.ts` → `proxy.ts`** when convenient (Next 16
  deprecation note — current code still works).
- **Generate typed Supabase client**:
  ```bash
  supabase gen types typescript --project-id <id> > src/types/supabase.ts
  ```
  Then re-add the `<Database>` generic to `createAdminSupabase()` for
  full insert/update typing.
- **Set up automated backups** in Supabase Settings → Database.
- **Add Vercel Analytics** for Web Vitals monitoring (separate from
  GA4): just add `@vercel/analytics` and drop `<Analytics />` in
  `app/layout.tsx`.

## 8. Operating the platform

- **Add a new user**: Supabase → Authentication → Users → Add user.
  Share the credentials and have them sign in at `/login`.
- **Reset a password**: Supabase → Users → ⋯ → Send password recovery.
- **Watch for failed lead emails**: Resend → Logs.
- **Investigate a missing lead**: Supabase → Logs → Postgres + Storage
  for the matching `lead-uploads/leads/...` path.
