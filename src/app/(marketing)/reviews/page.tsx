import type { Metadata } from "next";
import { Star } from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { ReviewCard } from "@/components/sections/review-card";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { SourceBadge } from "@/components/sections/source-badge";
import { LeaveReviewCta } from "@/components/sections/leave-review-cta";
import { getPublicReviews } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/settings";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Reviews",
  description:
    "What Inland Empire homeowners say about BCL Plastering & Building Remodel.",
  alternates: { canonical: "/reviews" },
};

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const [reviews, settings] = await Promise.all([
    getPublicReviews(),
    getSiteSettings(),
  ]);
  const avg =
    reviews.reduce((acc, r) => acc + r.rating, 0) / Math.max(reviews.length, 1);
  const total = Math.max(site.reviewsCount, reviews.length);
  return (
    <>
      <section className="pt-20 sm:pt-28 pb-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Reviews"
              title={
                <>
                  <span className="text-gold-gradient">{total}+</span> five-star reviews.
                </>
              }
              description="Honest words from homeowners across LA's Inland Empire and the surrounding cities."
            />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-3 rounded-full border border-border bg-surface px-5 py-2.5">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="text-sm font-medium text-foreground">
                  {avg.toFixed(1)} average
                </span>
              </div>
              <SourceBadge source="google" size="md" />
              <SourceBadge source="yelp" size="md" />
              <SourceBadge source="thumbtack" size="md" />
              <SourceBadge source="facebook" size="md" />
            </div>
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {reviews.map((r, i) => (
              <Reveal key={r.id} delay={i * 0.04}>
                <ReviewCard review={r} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <LeaveReviewCta social={settings.social_links} />

      <CTASection />
    </>
  );
}
