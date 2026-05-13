"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Phone,
  ShieldCheck,
  Star,
  ArrowRight,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";
import { images } from "@/lib/images";
import type { SiteImageMap } from "@/types/db";
import {
  trackEstimateCta,
  trackPhone,
  trackWhatsApp,
} from "@/lib/analytics/events";

const stats = [
  { value: site.yearsExperience, label: "Years on the trowel" },
  { value: `${site.homesFinished.toLocaleString()}+`, label: "Homes finished" },
  { value: "5.0", label: "Google rating" },
];

const trustWords = [
  "Stucco Installation",
  "Stucco Repair",
  "Santa Barbara Smooth",
  "Custom Stucco Finishes",
  "Re-Stucco",
  "Texture Matching",
  "Crack Repair",
  "HOA Compliance",
  "ADUs",
  "Exterior Restoration",
];

const ease = [0.22, 1, 0.36, 1] as const;

interface HeroSectionProps {
  siteImages?: SiteImageMap;
}

export function HeroSection({ siteImages }: HeroSectionProps = {}) {
  // Dashboard-uploaded media wins. Bracket access keeps the key
  // exactly as it lives in the site_images table.
  const dbPrimaryUrl = siteImages?.["hero_primary"]?.image_url || null;
  const dbPrimaryAlt = siteImages?.["hero_primary"]?.alt_text || null;
  const dbMobileUrl = siteImages?.["hero_mobile"]?.image_url || null;
  const dbVideoEmbed = siteImages?.["hero_video"]?.youtube_embed_url || null;

  // Static manifest is the second-tier fallback. The gradient
  // background underneath the section is the final safety net.
  const manifestPrimary = images.hero.primary.enabled
    ? images.hero.primary
    : null;
  const manifestMobile = images.hero.mobile.enabled ? images.hero.mobile : null;

  const heroPrimaryUrl = dbPrimaryUrl || manifestPrimary?.src || null;
  const heroPrimaryAlt =
    dbPrimaryAlt || manifestPrimary?.alt || "Finished BCL Plastering project";
  // Mobile-specific crop is currently unused at the section level —
  // the hero image lives inside the right card and is responsive on
  // its own. The slot is still read so the admin sees the upload
  // status; we'll wire a separate mobile layer back in when needed.
  void dbMobileUrl;
  void manifestMobile;

  const heroVideoEmbed = isValidYoutubeEmbed(dbVideoEmbed)
    ? dbVideoEmbed
    : null;

  // Hero image renders inside the right card — see below. We only
  // need to darken the surrounding section when a hero VIDEO is
  // playing behind everything.
  const showDarkenedSection = Boolean(heroVideoEmbed);

  const showcase = images.hero.showcasePortrait.enabled
    ? images.hero.showcasePortrait
    : null;

  // The right-side card prefers the dashboard hero photo, then the
  // legacy portrait showcase, then a gradient placeholder.
  const cardImageUrl = heroPrimaryUrl || showcase?.src || null;
  const cardImageAlt = heroPrimaryUrl
    ? heroPrimaryAlt
    : showcase?.alt || "BCL Plastering finished work";
  const showHeroBadge =
    process.env.NODE_ENV !== "production" && Boolean(heroPrimaryUrl);

  return (
    <section className="relative overflow-hidden">
      {/* Cinematic background VIDEO only — the still hero image lives
          inside the right-side card so it stays clearly visible. */}
      {heroVideoEmbed ? (
        <div aria-hidden className="absolute inset-0 -z-20 overflow-hidden">
          <iframe
            title="Hero background video"
            src={buildHeroVideoEmbed(heroVideoEmbed)}
            allow="autoplay; encrypted-media; picture-in-picture"
            loading="lazy"
            className="pointer-events-none absolute left-1/2 top-1/2 h-[120vh] min-h-full w-[177vh] min-w-full -translate-x-1/2 -translate-y-1/2 object-cover"
          />
        </div>
      ) : null}

      {/* Layered light & overlay */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* darken only when a hero VIDEO is playing behind the section */}
        <div
          className="absolute inset-0"
          style={{
            background: showDarkenedSection
              ? "linear-gradient(105deg, oklch(0.10 0.005 60 / 0.85) 0%, oklch(0.10 0.005 60 / 0.55) 50%, oklch(0.10 0.005 60 / 0.30) 100%), linear-gradient(180deg, oklch(0.10 0.005 60 / 0.20) 0%, oklch(0.10 0.005 60 / 0.55) 60%, oklch(0.10 0.005 60) 100%)"
              : "radial-gradient(60% 50% at 70% 0%, oklch(0.34 0.05 78 / 0.65), transparent 70%), radial-gradient(50% 60% at 0% 30%, oklch(0.78 0.11 78 / 0.10), transparent 70%), radial-gradient(40% 50% at 50% 100%, oklch(0.78 0.11 78 / 0.06), transparent 70%)",
          }}
        />
        {/* warm spot light from upper-right */}
        <div
          className="absolute -top-40 right-[-10%] h-[700px] w-[700px] rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(closest-side, oklch(0.78 0.11 78 / 0.20), transparent 70%)",
          }}
        />
        <div className="absolute inset-0 dot-grid opacity-50" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-background" />
      </div>

      <Container>
        <div className="grid lg:grid-cols-12 gap-12 pt-16 sm:pt-24 lg:pt-32 pb-20 lg:pb-32">
          {/* LEFT */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/8 px-3.5 py-1.5 text-xs font-medium text-gold w-fit backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Family-owned · {site.license} · Bonded · Insured
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.05, ease }}
              className="h-display mt-6 text-balance text-[2.6rem] sm:text-6xl lg:text-7xl xl:text-[5.4rem] font-semibold text-foreground"
            >
              Exterior stucco{" "}
              <span className="text-gold-gradient">finished by hand.</span>
              <br className="hidden sm:block" />
              Built to last in the Inland Empire.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15, ease }}
              className="mt-7 max-w-xl text-base sm:text-lg text-muted-foreground leading-relaxed"
            >
              Two decades of hand-troweled stucco, custom finishes, and
              exterior restoration across Riverside, Moreno Valley, Corona, and
              the rest of the Inland Empire. One project manager from
              walk-through to final inspection — and a clean job site every
              day.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.25, ease }}
              className="mt-9 flex flex-col sm:flex-row gap-3"
            >
              <Button asChild size="xl" className="shadow-[var(--shadow-glow)]">
                <Link href="/contact" onClick={() => trackEstimateCta("hero")}>
                  Get a free estimate <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <a href={site.phoneHref} onClick={() => trackPhone("hero")}>
                  <Phone className="h-4 w-4" />
                  {site.phone}
                </a>
              </Button>
              <Button
                asChild
                size="xl"
                variant="ghost"
                className="text-emerald-300 hover:text-emerald-200"
              >
                <a
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => trackWhatsApp("hero")}
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.4, ease }}
              className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-3"
            >
              <div className="flex items-center gap-1.5">
                <div className="flex items-center gap-0.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="ml-1 text-sm font-medium text-foreground">
                  5.0
                </span>
                <span className="text-sm text-muted-foreground">
                  · {site.reviewsCount}+ verified reviews
                </span>
              </div>
              <span className="hidden sm:block h-4 w-px bg-border" />
              <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-gold" />
                Free estimate within {site.responseWindow}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
              className="mt-12 grid grid-cols-3 gap-4 max-w-md"
            >
              {stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-3xl sm:text-4xl font-semibold text-foreground tracking-tight">
                    {s.value}
                  </div>
                  <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                    {s.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

          {/* RIGHT — showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden surface-elevated">
              {/* Layer 1 — the hero image itself (or a premium gradient fallback) */}
              {cardImageUrl ? (
                <Image
                  src={cardImageUrl}
                  alt={cardImageAlt}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 45vw"
                  className="object-cover"
                />
              ) : (
                <>
                  <div
                    aria-hidden
                    className="absolute inset-0"
                    style={{
                      background:
                        "linear-gradient(140deg, oklch(0.30 0.012 60) 0%, oklch(0.18 0.006 60) 60%, oklch(0.14 0.006 60) 100%)",
                    }}
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 opacity-50"
                    style={{
                      backgroundImage:
                        "radial-gradient(50% 40% at 30% 20%, oklch(0.86 0.04 75 / 0.35), transparent 70%), radial-gradient(50% 40% at 80% 90%, oklch(0.78 0.11 78 / 0.30), transparent 70%)",
                    }}
                  />
                  <div className="absolute inset-0 stucco-texture" />
                </>
              )}

              {/* Layer 2 — bottom dark gradient for testimonial legibility.
                  Stops near 55% so the upper half of the photo stays clear. */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-background/85 via-background/45 to-transparent"
              />

              {/* Layer 3 — subtle side vignette (max 20% black) */}
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, oklch(0 0 0 / 0.18) 0%, transparent 14%, transparent 86%, oklch(0 0 0 / 0.18) 100%)",
                }}
              />

              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/15 px-3 py-1 text-xs font-medium text-emerald-200 backdrop-blur">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
                </span>
                Booking estimates this week
              </div>

              {showHeroBadge ? (
                <div className="absolute top-5 right-5 rounded-md bg-gold/95 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-gold-foreground shadow-soft">
                  Hero image loaded
                </div>
              ) : null}

              <div className="absolute inset-0 p-7 sm:p-9 flex flex-col justify-end">
                <div className="flex items-center gap-1.5 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <h3 className="font-display text-[1.6rem] sm:text-3xl mt-4 leading-tight text-foreground">
                  &ldquo;Re-stucco came out flawless. The crew was on-site at 7
                  AM every morning — neighbors keep asking who did the
                  work.&rdquo;
                </h3>
                <div className="mt-5 flex items-center gap-3">
                  <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sand to-gold-soft text-sand-foreground font-medium text-sm">
                    MG
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">
                      Maria G.
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Riverside · Santa Barbara smooth
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7, delay: 0.55, ease }}
              className="hidden lg:flex absolute -left-7 -bottom-7 items-center gap-3 rounded-2xl border border-border bg-card/95 backdrop-blur px-5 py-4 shadow-[var(--shadow-elev)]"
            >
              <div className="grid h-10 w-10 place-items-center rounded-full bg-gold/15 text-gold">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                  Today
                </div>
                <div className="font-medium text-foreground">3 quotes booked</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </Container>

      <div className="relative border-y border-border/60 bg-surface/40 py-5 overflow-hidden">
        <div className="marquee text-sm font-medium text-muted-foreground/80 uppercase tracking-[0.18em]">
          {[...trustWords, ...trustWords].map((w, i) => (
            <span
              key={`${w}-${i}`}
              className="inline-flex items-center gap-3 whitespace-nowrap"
            >
              <span className="h-1 w-1 rounded-full bg-gold/70" />
              {w}
            </span>
          ))}
        </div>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-background to-transparent"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-background to-transparent"
        />
      </div>
    </section>
  );
}

function isValidYoutubeEmbed(value: string | null | undefined): value is string {
  if (!value) return false;
  return /^https:\/\/www\.youtube\.com\/embed\/[a-zA-Z0-9_-]{11}(?:[?&].*)?$/.test(
    value
  );
}

function buildHeroVideoEmbed(embedUrl: string): string {
  const match = embedUrl.match(/\/embed\/([a-zA-Z0-9_-]{11})/);
  const id = match ? match[1] : "";
  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    loop: "1",
    controls: "0",
    showinfo: "0",
    modestbranding: "1",
    rel: "0",
    playsinline: "1",
    playlist: id,
  });
  return `${embedUrl}?${params.toString()}`;
}
