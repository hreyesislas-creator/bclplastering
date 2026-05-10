# Launch checklist

A go / no-go checklist to run on the day the site goes live. Pair
with `DEPLOY.md` (which covers the *setup* of each integration) — this
file is for verifying everything actually works in production.

## Brand & content

- [ ] **Real CSLB number** in `src/lib/site.ts` (replace placeholder).
- [ ] **Real phone & WhatsApp** in `src/lib/site.ts` *and* in the
      Supabase `site_settings` row (Dashboard → Settings).
- [ ] **Real email address** with verified Resend domain.
- [ ] **Real photography** dropped into `/public/`:
      hero, services, projects, before-after pairs.
      Manifest entries flipped to `enabled: true` in `src/lib/images.ts`.
- [ ] **`/og.png`** social-share image in `/public/` (1200×630).
- [ ] **Favicon** replaced with the brand mark.
- [ ] **Year-established + license display** match the contractor's
      actual license card.

## Vercel

- [ ] Project linked (`vercel link`) and connected to GitHub repo.
- [ ] Production env vars set (in this order — feature won't work
      without each):
  - [ ] `NEXT_PUBLIC_SUPABASE_URL`
  - [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - [ ] `SUPABASE_SERVICE_ROLE_KEY`
  - [ ] `NEXT_PUBLIC_SITE_URL` (production domain)
  - [ ] `RESEND_API_KEY`
  - [ ] `RESEND_FROM_EMAIL`
  - [ ] `LEAD_NOTIFICATION_EMAIL`
  - [ ] `NEXT_PUBLIC_GA_ID` *(optional but recommended)*
  - [ ] `NEXT_PUBLIC_META_PIXEL_ID` *(optional)*
  - [ ] `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` *(once GSC issues it)*
  - [ ] `TWILIO_*` + `LEAD_NOTIFICATION_PHONE` *(optional, SMS)*
- [ ] Production deployed: `vercel deploy --prod`.
- [ ] Build logs show `[env] integrations: { ... }` confirming what
      is wired.

## Domain & SSL

- [ ] `www.bclplastering.com` added in Vercel → Domains.
- [ ] DNS records updated at the registrar.
- [ ] Apex (`bclplastering.com`) redirects to `www`.
- [ ] HTTPS issued — green padlock in browser.
- [ ] `https://www.bclplastering.com/sitemap.xml` returns valid XML.
- [ ] `https://www.bclplastering.com/robots.txt` allows root, blocks
      `/dashboard` and `/api`.

## Supabase

- [ ] All four tables created: `leads`, `projects`, `reviews`,
      `site_settings` (singleton row inserted).
- [ ] Storage buckets `lead-uploads` and `project-gallery` exist with
      public read + service-role write.
- [ ] At least **one** Auth user created (Authentication → Users → Add).
- [ ] Logged in once at `/login` to confirm credentials.

## Lead form smoke test

Submit a test request from `/contact`:

- [ ] Form accepts text fields and 1–3 photos.
- [ ] Live progress bar climbs during upload.
- [ ] Success card with WhatsApp + Call CTAs renders.
- [ ] Lead row appears in Supabase `leads` table.
- [ ] Photos appear in `lead-uploads/leads/<year>/<month>/<id>/...`.
- [ ] Email arrives in `LEAD_NOTIFICATION_EMAIL` inbox:
  - [ ] Branded HTML renders correctly in Gmail + Apple Mail.
  - [ ] "Open lead in dashboard" link points to the production URL.
  - [ ] Photo previews are visible inline.
- [ ] (If Twilio configured) SMS arrives at the notification phone.
- [ ] **Delete the test lead** before reviewing analytics.

## Auth & dashboard

- [ ] `/dashboard` redirects to `/login` when signed out.
- [ ] After signing in, every section loads:
  - [ ] `/dashboard` overview shows the pipeline grid + recent leads.
  - [ ] `/dashboard/leads` lists leads (cards on mobile, table on desktop).
  - [ ] `/dashboard/leads/<id>` opens detail view with photos.
  - [ ] Status select changes persist after page reload.
  - [ ] `/dashboard/projects` lists projects + add form works.
  - [ ] `/dashboard/reviews` lists reviews + add form works.
  - [ ] `/dashboard/settings` shows current values; save reflects on
        the public footer within seconds.
- [ ] Sign-out from sidebar (desktop) and top bar icon (mobile)
      both return to `/login`.

## SEO

- [ ] `view-source` on `/`:
  - [ ] `<link rel="canonical" href="https://www.bclplastering.com/">`
  - [ ] `<meta property="og:image" content=".../og.png">`
  - [ ] `<script type="application/ld+json">` containing
        `"@type":"GeneralContractor"` with aggregateRating + reviews.
- [ ] `view-source` on `/services/stucco-installation`:
  - [ ] Canonical points to the slug
  - [ ] `<script type="application/ld+json">` Service block present.
- [ ] `view-source` on `/contact`:
  - [ ] FAQPage JSON-LD with the six questions.
- [ ] **Google Rich Results Test**
      (<https://search.google.com/test/rich-results>) shows zero
      errors on `/`, `/services/stucco-installation`, `/contact`.
- [ ] **Google Search Console**:
  - [ ] Property added (URL prefix or domain).
  - [ ] Verification meta tag added via `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION`
        (or DNS).
  - [ ] Sitemap submitted: `https://www.bclplastering.com/sitemap.xml`.
  - [ ] No coverage errors.
- [ ] **Bing Webmaster Tools** verified (mirror of GSC).

## Analytics & pixels

- [ ] **GA4 → Realtime** shows pageviews when you load the homepage.
- [ ] Submit a test lead → `lead_submit` event arrives in Realtime.
- [ ] Click the hero "Call" → `phone_click` arrives.
- [ ] Click hero "WhatsApp" → `whatsapp_click` arrives.
- [ ] Mark `lead_submit`, `phone_click`, `whatsapp_click` as
      conversions in GA4 Admin → Events.
- [ ] **Meta Pixel Helper** (Chrome extension) shows the pixel
      firing on every page.
- [ ] Submit a test lead → `Lead` standard event in the helper.

## Mobile pass (real device, not just resize)

Test on at least one iPhone and one Android in Safari and Chrome.

- [ ] Hero readable, CTAs reachable with thumb.
- [ ] Sticky bottom CTA bar (Call / WhatsApp / Free Estimate)
      always visible, doesn't overlap content.
- [ ] Service cards tap targets ≥ 44×44 pt.
- [ ] Before/after slider drags smoothly with one finger.
- [ ] Gallery filter pills scroll horizontally without overflow.
- [ ] Contact form opens phone dial-pad / numeric pad on the
      phone field.
- [ ] Photo upload from camera works; from photo library works.
- [ ] Form success card lays out inside the viewport.
- [ ] Dashboard pages pass: cards on mobile, sticky pill nav at top.

## Performance (Lighthouse, mobile)

- [ ] **Performance:** ≥ 85 (target ≥ 90 once real images are tuned).
- [ ] **Accessibility:** ≥ 95.
- [ ] **Best Practices:** ≥ 95.
- [ ] **SEO:** 100.
- [ ] LCP image is the hero photo (priority loaded).
- [ ] No render-blocking third-party scripts above the fold.

## Final scrub

- [ ] No "Lorem ipsum" or `(818) 555-0123` left anywhere.
- [ ] No `console.log` lines in production builds (logger gates them).
- [ ] No links pointing to `localhost`.
- [ ] No `TODO` left in user-facing copy.
- [ ] Site spell-checked end-to-end (Gallery, Reviews, About, FAQ).

When every box above is ticked → ship.
