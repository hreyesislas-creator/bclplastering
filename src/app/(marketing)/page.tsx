import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/sections/hero-section";
import { TrustSection } from "@/components/sections/trust-section";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { ProjectCard } from "@/components/sections/project-card";
import { BeforeAfterShowcase } from "@/components/sections/before-after-showcase";
import { FeaturedVideoSection } from "@/components/sections/featured-video-section";
import { ReviewsSection } from "@/components/sections/reviews-section";
import { ServiceAreasSection } from "@/components/sections/service-areas-section";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { localBusinessSchema } from "@/lib/seo/jsonld";
import { services } from "@/data/services";
import { getPublicProjects, getPublicReviews } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/settings";
import { getSiteImages } from "@/lib/site-images";
import { env } from "@/lib/env";
import { site } from "@/lib/site";

export default async function HomePage() {
  const [projects, reviews, settings, siteImages] = await Promise.all([
    getPublicProjects(),
    getPublicReviews(),
    getSiteSettings(),
    getSiteImages(),
  ]);
  const ld = localBusinessSchema({
    settings,
    reviews,
    baseUrl: env.siteUrl,
  });
  const featured = projects.filter((p) => p.featured).slice(0, 3);
  const fallback = featured.length > 0 ? featured : projects.slice(0, 3);
  const featuredCoverKeys = [
    "home_featured_project_1",
    "home_featured_project_2",
    "home_featured_project_3",
  ];
  const featuredVideoEmbed =
    siteImages["homepage_feature_video"]?.youtube_embed_url ?? null;

  return (
    <>
      <JsonLd data={ld} id="ld-org" />
      <HeroSection siteImages={siteImages} />

      <TrustSection />

      <section className="relative py-20 sm:py-32 border-y border-border/60 bg-surface/20">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <SectionHeading
                eyebrow="What we do"
                title={
                  <>
                    A finishing trade —
                    <br className="hidden sm:block" />{" "}
                    <span className="text-gold-gradient">not a paint job.</span>
                  </>
                }
                description="From hand-troweled stucco to full home remodels, every project gets the same prep, the same crew, and the same standard of finish."
              />
              <Button asChild variant="outline" size="lg" className="self-start md:self-end">
                <Link href="/services">
                  All services <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <BeforeAfterShowcase siteImages={siteImages} />

      <section className="py-20 sm:py-32 border-y border-border/60 bg-surface/20">
        <Container>
          <Reveal>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-14">
              <SectionHeading
                eyebrow="Recent work"
                title={
                  <>
                    Real homes.{" "}
                    <span className="text-gold-gradient">Real finishes.</span>
                  </>
                }
                description="A growing archive of work from across Riverside, Moreno Valley, Corona, and the surrounding cities."
              />
              <Button asChild variant="outline" size="lg" className="self-start md:self-end">
                <Link href="/projects">
                  Browse all <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {fallback.map((p, i) => {
              const coverSlot = siteImages[featuredCoverKeys[i]];
              return (
                <Reveal key={p.id} delay={i * 0.08}>
                  <ProjectCard
                    project={p}
                    coverOverride={coverSlot?.image_url ?? null}
                    altOverride={coverSlot?.alt_text ?? null}
                  />
                </Reveal>
              );
            })}
          </div>
        </Container>
      </section>

      {featuredVideoEmbed ? (
        <FeaturedVideoSection embedUrl={featuredVideoEmbed} />
      ) : null}

      <ReviewsSection reviews={reviews} total={Math.max(site.reviewsCount, reviews.length)} />

      <ServiceAreasSection />

      <CTASection />
    </>
  );
}
