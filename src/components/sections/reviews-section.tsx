"use client";

import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { ReviewCard } from "./review-card";
import { SourceBadge } from "./source-badge";
import type { Review } from "@/types/db";

interface ReviewsSectionProps {
  reviews: Review[];
  total?: number;
}

export function ReviewsSection({ reviews, total = 220 }: ReviewsSectionProps) {
  const avg =
    reviews.reduce((acc, r) => acc + r.rating, 0) / Math.max(reviews.length, 1);
  const featured = reviews[0];
  const rest = reviews.slice(1, 4);

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden border-y border-border/60">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-surface/40"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, oklch(0.78 0.11 78 / 0.08), transparent 70%)",
        }}
      />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Trusted by California homeowners"
            title={
              <>
                <span className="text-gold-gradient">{total}+</span> five-star
                reviews and counting.
              </>
            }
            description="Honest words from homeowners across LA, the Valley, and Orange County. Word-of-mouth is how we've grown for two decades."
            align="center"
          />
        </Reveal>

        {/* Big rating display */}
        <Reveal delay={0.1} className="mt-12">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 rounded-3xl border border-border surface-elevated px-6 sm:px-10 py-8 sm:py-10">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center sm:text-left">
                <div className="font-display text-5xl sm:text-6xl font-semibold text-gold-gradient leading-none">
                  {avg.toFixed(1)}
                </div>
                <div className="mt-2 flex items-center justify-center sm:justify-start gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-current" />
                  ))}
                </div>
                <div className="mt-2 text-sm text-muted-foreground">
                  Average across {total}+ verified reviews
                </div>
              </div>
              <div className="hidden sm:block h-20 w-px bg-border" />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <SourceBadge source="google" size="md" />
                <SourceBadge source="yelp" size="md" />
                <SourceBadge source="thumbtack" size="md" />
                <SourceBadge source="facebook" size="md" />
              </div>
            </div>
          </div>
        </Reveal>

        {/* Featured + grid */}
        <div className="mt-12 grid gap-6 lg:grid-cols-12">
          <Reveal className="lg:col-span-5" delay={0.05}>
            {featured ? <ReviewCard review={featured} featured /> : null}
          </Reveal>
          <div className="lg:col-span-7 grid gap-6 sm:grid-cols-2 auto-rows-fr">
            {rest.map((r, i) => (
              <Reveal key={r.id} delay={0.1 + i * 0.06}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg">
            <Link href="/reviews">
              Read all reviews <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Container>
    </section>
  );
}
