# BCL Plastering & Building Remodel

Premium contractor website + lead engine + mini-CRM for the Inland Empire.

* **Public site**: Next.js 16 App Router · Tailwind v4 · Framer Motion ·
  shadcn-style UI primitives. Mobile-first, dark theme, charcoal +
  warm beige + muted gold.
* **Lead engine**: real form submission → Supabase Storage uploads →
  Postgres insert → Resend email + Twilio SMS notifications.
* **Mini-CRM** at `/dashboard`: protected by Supabase Auth.
  Leads, projects, reviews, settings — all editable, all reflected on
  the public site.
* **SEO + analytics**: canonical URLs, OG tags, LocalBusiness /
  Service / FAQ JSON-LD, Google Analytics 4, Meta Pixel.

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 16.2 (App Router, Turbopack) |
| Language | TypeScript 5 |
| Styling | Tailwind CSS v4, OKLCH palette |
| Animation | Framer Motion |
| Forms | React Hook Form + Zod |
| DB / Auth / Storage | Supabase (Postgres + Auth + Storage) |
| Email | Resend (REST) |
| SMS (optional) | Twilio (REST) |
| Hosting | Vercel |

## Getting started

```bash
# Install
npm install

# Copy and fill envs
cp .env.example .env.local

# Dev
npm run dev
```

Without Supabase env vars the marketing site still runs (with seed
data); the dashboard surfaces a clear "connect Supabase" placeholder.

## Repo map

```
src/
├── app/
│   ├── (marketing)/        Public site — home, services, projects,
│   │                       gallery, reviews, about, contact
│   ├── api/leads/          POST handler (intake, validate, upload, insert, notify)
│   ├── dashboard/          CRM — overview, leads, projects, reviews, settings
│   │                       Protected by middleware + requireUser()
│   ├── login/              Email/password sign-in (Supabase Auth)
│   ├── layout.tsx          Root metadata, fonts, analytics scripts
│   ├── sitemap.ts          Dynamic sitemap from data
│   └── robots.ts
├── components/
│   ├── analytics/          GA4 + Meta Pixel scripts + tracked anchor
│   ├── dashboard/          Sidebar, mobile bar, lead/project/review cards
│   ├── forms/              ContactForm, ProjectUploadForm, UploadDropzone
│   ├── layout/             Navbar, Footer, FloatingContactBar, WhatsAppButton
│   ├── sections/           Hero, Reviews, BeforeAfter, FAQ, Service/Project cards
│   ├── seo/                JsonLd component
│   └── ui/                 Button, Input, Textarea, Select, Card, etc.
├── data/                   Static seed (services, projects, reviews, faqs)
├── lib/
│   ├── analytics/          trackEvent + helpers
│   ├── auth.ts             getUser / requireUser
│   ├── env.ts              Centralised env + integration summary
│   ├── images.ts           Image manifest (drop-and-flip)
│   ├── leads/              schema, storage, status helpers
│   ├── logger.ts           Production-safe logger
│   ├── notifications/      Resend email, Twilio SMS, email template
│   ├── projects/           schema, storage
│   ├── public-data.ts      DB-backed reads with seed fallback
│   ├── seo/jsonld.ts       LocalBusiness / Service / FAQ schema builders
│   ├── settings.ts         site_settings reader
│   ├── site.ts             Static brand defaults
│   ├── supabase/           client, server, admin, middleware, env helpers
│   └── utils.ts            cn(), formatPhone(), slugify()
├── middleware.ts           Auth refresh + /dashboard guard
└── types/db.ts             Lead, Project, Review, Database types
public/
├── README.md               Image folder layout & filename conventions
├── hero/ services/ projects/ before-after/ reviews/ textures/
supabase/
└── schema.sql              Tables, enums, RLS, storage buckets
```

## Deploying

See **`DEPLOY.md`** for the full step-by-step.

## Drop-in real photography

`public/README.md` documents the image folder layout. Every component
checks `src/lib/images.ts` first — drop the file in the right folder
and flip `enabled: false → true` on the matching entry.
