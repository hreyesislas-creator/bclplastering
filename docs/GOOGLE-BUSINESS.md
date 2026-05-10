# Google Business Profile — setup & content

A complete content kit for the BCL Google Business Profile. Open
<https://business.google.com> and copy each field below into the
matching prompt. Re-use the same wording across Yelp, Thumbtack,
Facebook, and Apple Maps for consistency — local SEO rewards
matching name + phone + address (NAP) data across listings.

## Business identity

| Field | Value |
|---|---|
| **Name** | BCL Plastering & Building Remodel |
| **Short name** | BCL Plastering |
| **Phone** | (951) 555-0123 *(replace with real number before publishing)* |
| **Website** | <https://www.bclplastering.com> |
| **Email** | info@bclplastering.com |
| **Service area** | Riverside County, California *(set as service-area business — no storefront)* |
| **Hours** | Mon – Sat · 7:00 AM – 6:00 PM. Closed Sunday. |
| **Year established** | 2004 |
| **License** | CSLB Lic. #1098765 *(replace with real number)* |

## Categories

Pick **one primary** and **up to nine secondary** categories.

* **Primary:** *Plastering Contractor*
* **Secondary** (in priority order):
  - Stucco Contractor
  - General Contractor
  - Drywall Contractor
  - Bathroom Remodeler
  - Kitchen Remodeler
  - Painter
  - Construction Company
  - Home Builder
  - Building Restoration Service

## Description (750 chars max)

> BCL Plastering & Building Remodel is a family-owned California
> craftsmanship company serving the Inland Empire. We specialize in
> hand-troweled stucco installation and repair, exterior and interior
> remodels, drywall repair, and decorative finishes — Venetian
> plaster, lime wash, Tadelakt. Two decades, 1,200+ Inland Empire
> homes, and the same project manager from the first walk-through to
> the final inspection. Licensed (CSLB), bonded, and insured. Free
> on-site estimates within 48 hours. Riverside, Moreno Valley,
> Corona, Eastvale, Menifee, Perris, Jurupa Valley, Norco, Mira Loma.

## Service entries

Add each service in the GBP "Services" tab. The descriptions below
mirror the website so search results stay consistent.

### 1. Stucco Installation
*Three-coat traditional stucco and one-coat systems for new
construction, additions, and full re-stucco. Smooth, sand, lace,
dash, and Santa Barbara finishes. Crack-resistant, color-matched,
inspected to code. From $8 / sqft.*

### 2. Stucco Repair
*Hairline cracks, water damage, blown elevations — diagnosed and
repaired so they don't come back. Failed-lath rebuilds and texture
+ color matching. From $1,200.*

### 3. Exterior Remodeling
*Whole-envelope facelifts: re-stucco, paint, trim, columns, patio
covers, and outdoor living rooms. Permitted, inspected, and
coordinated as a single design.*

### 4. Interior Remodeling
*Licensed general contracting for kitchens, bathrooms, and full
home remodels. Permits + inspections handled in-house. Level-5
smooth walls and decorative-finish accents.*

### 5. Drywall Repair
*Knockdown, orange-peel, smooth — texture matching that disappears
into the existing surface. Water-damage repair, ceiling fixes, and
full hangs.*

### 6. Decorative Finishes
*Venetian, polished plaster, lime wash, Tadelakt, and skim coat by
craftsmen with 20+ years on the trowel. Designer / architect
collaborations welcome.*

## Photos — recommended dimensions and counts

Upload these in this order. Google rotates whichever performs.

| Slot | Use | Spec |
|---|---|---|
| **Logo** | Profile mark | Square, 250×250+, transparent or charcoal background |
| **Cover** | Top of GBP | 1080×608 (16:9), the strongest hero shot |
| **Exterior** | 3 photos | 1024×768, daylight, full elevation |
| **At work** | 5+ photos | 1024×768, crew on a real job site |
| **Team** | 1–2 photos | 1024×768, owners + crew |
| **Before** | 1 per project | 1024×768, before transformation |
| **After** | 1 per project | 1024×768, same angle as the before |
| **Video** | optional | Up to 30 seconds, 1080p |

The website's `/public/before-after/` folder already contains the
expected paths. Re-use the same files on GBP, sized down to 1024px
wide.

## FAQ — paste into the GBP "Q&A" tab

Use the same six questions that live on the website's `/contact`
page so structured data matches user-facing copy.

1. **How fast can you give me an estimate?** Free on-site estimates
   within 48 hours. Send photos for a written ballpark first.
2. **Do you charge for estimates?** Never. No obligation either.
3. **Are you licensed, bonded, and insured?** Yes — CSLB Lic.
   #1098765, full liability and workers' comp.
4. **What cities do you cover?** Riverside, Moreno Valley, Corona,
   Eastvale, Menifee, Perris, Jurupa Valley, Norco, Mira Loma.
5. **Do you handle permits and inspections?** Yes — for remodels,
   additions, and ADUs we pull permits and run inspections.
6. **When do I pay?** Staged with the work. No large deposits and
   no final balance until the walk-through is complete.

## Posts — first 30 days

Plan to publish two GBP "Updates" per week. Source material:

* New project from `/dashboard/projects` — share the cover image
  with a one-sentence story.
* Five-star review from `/dashboard/reviews` — quote the customer.
* Service spotlight — link directly to the matching
  `/services/<slug>` page.

Each post drives traffic + signal to the local pack.

## Outbound links from each photo

Add the website URL to **every** photo's caption ("Finished by BCL
Plastering — bclplastering.com"). This pushes link equity to the
right pages and keeps the brand visible when GBP photos are
re-shared.

## Verification

Service-area businesses verify by **postcard** by default. Order
the postcard the day the profile goes live; verification can take
14 days and the listing won't surface in maps until it's complete.

## After verification

1. Add **NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION** to Vercel using the
   token Search Console gives you (separate from GBP postcard).
2. Submit the sitemap (`/sitemap.xml`) to Search Console.
3. Add the same business URL to Bing Places to mirror visibility.
