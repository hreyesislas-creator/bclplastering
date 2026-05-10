import Link from "next/link";
import { Phone, MessageCircle, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "./reveal";
import { TrackAnchor } from "@/components/analytics/track-anchor";
import { site } from "@/lib/site";

interface CTASectionProps {
  title?: string;
  description?: string;
  primaryHref?: string;
  primaryLabel?: string;
  urgency?: string;
}

export function CTASection({
  title = "Stop looking. Start finishing.",
  description = "Free on-site estimates within 48 hours — no payment until the work is done. Send us a few photos and a project manager will be in touch.",
  primaryHref = "/contact",
  primaryLabel = "Get my free estimate",
  urgency = "Booking estimates this week",
}: CTASectionProps) {
  return (
    <section className="relative py-24 sm:py-32 overflow-hidden">
      {/* atmospheric backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 0%, oklch(0.78 0.11 78 / 0.18), transparent 65%), radial-gradient(40% 50% at 50% 100%, oklch(0.34 0.05 78 / 0.45), transparent 70%)",
        }}
      />

      <Container>
        <Reveal>
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-[2rem] border border-gold/20 surface-elevated stucco-texture px-6 sm:px-12 py-16 sm:py-20 text-center">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-72 w-[120%] rounded-full bg-gold/15 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"
            />

            {/* Urgency tag */}
            <div className="relative inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-1.5 text-xs font-medium text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {urgency}
            </div>

            <h2 className="h-display relative mx-auto mt-6 max-w-3xl text-balance text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
              {title}
            </h2>
            <p className="relative mx-auto mt-5 max-w-2xl text-base sm:text-lg text-muted-foreground leading-relaxed">
              {description}
            </p>

            <div className="relative mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button asChild size="xl" className="shadow-[var(--shadow-glow)]">
                <Link href={primaryHref}>
                  {primaryLabel} <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="xl" variant="outline">
                <TrackAnchor
                  event="phone_click"
                  source="cta_section"
                  href={site.phoneHref}
                >
                  <Phone className="h-4 w-4" />
                  {site.phone}
                </TrackAnchor>
              </Button>
              <Button asChild size="xl" variant="ghost" className="text-emerald-300 hover:text-emerald-200">
                <TrackAnchor
                  event="whatsapp_click"
                  source="cta_section"
                  href={site.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </TrackAnchor>
              </Button>
            </div>

            <div className="relative mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-gold" />
                Free on-site estimate
              </span>
              <span className="hidden sm:block h-3 w-px bg-border" />
              <span>No-obligation written quote</span>
              <span className="hidden sm:block h-3 w-px bg-border" />
              <span>Licensed · Bonded · Insured</span>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
