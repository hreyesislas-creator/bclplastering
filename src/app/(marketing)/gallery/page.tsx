import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { CTASection } from "@/components/sections/cta-section";
import { GalleryGrid } from "@/components/sections/gallery-grid";
import { Reveal } from "@/components/sections/reveal";
import { getPublicProjects } from "@/lib/public-data";
import { getSiteImages } from "@/lib/site-images";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Selected photos from BCL Plastering & Building Remodel projects across the Inland Empire.",
  alternates: { canonical: "/gallery" },
};

export const dynamic = "force-dynamic";

export default async function GalleryPage() {
  const [projects, siteImages] = await Promise.all([
    getPublicProjects(),
    getSiteImages(),
  ]);
  return (
    <>
      <section className="pt-20 sm:pt-28 pb-10">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Gallery"
              title={
                <>
                  A wall of{" "}
                  <span className="text-gold-gradient">finished work.</span>
                </>
              }
              description="Stucco, plaster, and remodels finished by our crew across Riverside, Moreno Valley, Corona, and the surrounding cities. Filter by trade, click any project for the full story."
              align="center"
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <GalleryGrid projects={projects} siteImages={siteImages} />
        </Container>
      </section>

      <CTASection />
    </>
  );
}
