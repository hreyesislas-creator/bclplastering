"use client";

import * as React from "react";
import { PlayCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { youtubeThumbnail } from "@/lib/site-images/youtube";

interface FeaturedVideoSectionProps {
  embedUrl: string;
  title?: string;
  description?: string;
}

/**
 * Lazy-loaded YouTube embed. Renders a high-quality thumbnail first
 * and only swaps in the iframe after the user clicks — keeps the
 * homepage CWV scores intact.
 */
export function FeaturedVideoSection({
  embedUrl,
  title,
  description,
}: FeaturedVideoSectionProps) {
  const [playing, setPlaying] = React.useState(false);
  const thumb = youtubeThumbnail(embedUrl);

  return (
    <section className="relative py-20 sm:py-28 border-y border-border/60 bg-surface/20">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Watch the work"
            title={
              title ? (
                <>{title}</>
              ) : (
                <>
                  See the difference{" "}
                  <span className="text-gold-gradient">by hand.</span>
                </>
              )
            }
            description={
              description ??
              "Real footage from real Inland Empire job sites — start to finish."
            }
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-border surface-elevated aspect-video">
              {playing ? (
                <iframe
                  title={title ?? "Featured video"}
                  src={`${embedUrl}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                  className="absolute inset-0 h-full w-full"
                />
              ) : (
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label="Play featured video"
                  className="group absolute inset-0"
                >
                  {thumb ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={thumb}
                      alt={title ?? "Featured video"}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                  ) : null}
                  <div className="absolute inset-0 grid place-items-center bg-background/30 transition-colors group-hover:bg-background/20">
                    <span className="grid h-20 w-20 place-items-center rounded-full bg-gold text-gold-foreground shadow-[var(--shadow-glow)] transition-transform group-hover:scale-110">
                      <PlayCircle className="h-10 w-10" />
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
