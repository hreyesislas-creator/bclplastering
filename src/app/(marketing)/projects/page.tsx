import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { ProjectCard } from "@/components/sections/project-card";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { getPublicProjects } from "@/lib/public-data";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Recent exterior stucco, restoration, and custom finish projects from BCL Plastering across the Inland Empire.",
  alternates: { canonical: "/projects" },
};

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const projects = await getPublicProjects();
  return (
    <>
      <section className="pt-20 sm:pt-28 pb-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Project log"
              title={
                <>
                  Real homes.{" "}
                  <span className="text-gold-gradient">Real finishes.</span>
                </>
              }
              description="A growing archive of work from across Riverside, Moreno Valley, Corona, Eastvale, Menifee, and Perris."
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.05}>
                <ProjectCard project={p} />
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
