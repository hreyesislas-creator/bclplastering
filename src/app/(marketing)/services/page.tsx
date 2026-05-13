import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { ServiceCard } from "@/components/sections/service-card";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { getPublicServices } from "@/lib/services";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Exterior stucco installation, repair, and restoration — plus custom stucco finishes and full-envelope exterior remodels across the Inland Empire.",
  alternates: { canonical: "/services" },
};

export default async function ServicesPage() {
  const services = await getPublicServices();
  return (
    <>
      <section className="pt-20 sm:pt-28 pb-12">
        <Container>
          <Reveal>
            <SectionHeading
              eyebrow="Services"
              title={
                <>
                  Premium exterior services,{" "}
                  <span className="text-gold-gradient">end-to-end.</span>
                </>
              }
              description="One crew. One project manager. From the initial walk-through and written estimate, through permits and inspections, to the final color-coat and weather seal."
            />
          </Reveal>
        </Container>
      </section>

      <section className="pb-20 sm:pb-28">
        <Container>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s, i) => (
              <ServiceCard key={s.slug} service={s} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
