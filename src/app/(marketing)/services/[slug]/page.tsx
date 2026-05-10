import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ServiceCard } from "@/components/sections/service-card";
import { ServiceIcon } from "@/components/sections/service-icon";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { serviceSchema } from "@/lib/seo/jsonld";
import { services, getService } from "@/data/services";
import { images } from "@/lib/images";
import { getSiteSettings } from "@/lib/settings";
import { env } from "@/lib/env";
import { site } from "@/lib/site";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) return {};
  return {
    title: s.title,
    description: s.short,
    alternates: { canonical: `/services/${s.slug}` },
    openGraph: {
      title: `${s.title} · ${site.shortName}`,
      description: s.short,
      url: `/services/${s.slug}`,
    },
  };
}

const expectations = [
  "Free on-site walk-through within 48 hours",
  "Itemized written estimate — no hidden line items",
  "Permits and inspections handled in-house",
  "Daily clean-up and one project manager throughout",
  "Final walk-through and warranty paperwork",
];

export default async function ServiceDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();

  const settings = await getSiteSettings();
  const related = services.filter((x) => x.slug !== s.slug).slice(0, 3);
  const hero = images.services[s.slug as keyof typeof images.services];
  const showHero = hero?.enabled;
  const ld = serviceSchema({ service: s, settings, baseUrl: env.siteUrl });

  return (
    <>
      <JsonLd data={ld} id={`ld-service-${s.slug}`} />
      <section className="relative pt-16 sm:pt-24 pb-10 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(50% 40% at 70% 0%, oklch(0.78 0.11 78 / 0.10), transparent 70%)",
          }}
        />
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 text-gold ring-1 ring-gold/30">
                  <ServiceIcon iconKey={s.iconKey} className="h-5 w-5" />
                </span>
                <Badge variant="gold">{s.startingFrom ?? "By estimate"}</Badge>
              </div>
              <h1 className="h-display mt-6 text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground">
                {s.title}
              </h1>
              <p className="mt-5 text-lg text-muted-foreground leading-relaxed max-w-2xl">
                {s.description}
              </p>

              <ul className="mt-9 grid gap-3 sm:grid-cols-2 max-w-xl">
                {s.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2 text-sm text-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                    {b}
                  </li>
                ))}
              </ul>

              <div className="mt-10 flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Request a quote for {s.title.toLowerCase()}{" "}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/projects">See projects</Link>
                </Button>
              </div>
            </Reveal>

            <Reveal className="lg:col-span-5" delay={0.1}>
              {showHero ? (
                <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-border surface-elevated">
                  <Image
                    src={hero.src}
                    alt={hero.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="rounded-2xl border border-border surface-elevated p-6 sm:p-8">
                  <h3 className="font-display text-xl">What to expect</h3>
                  <ol className="mt-5 space-y-4 text-sm">
                    {expectations.map((step, i) => (
                      <li key={step} className="flex gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-gold/15 text-xs font-semibold text-gold">
                          {i + 1}
                        </span>
                        <span className="text-foreground/90">{step}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-surface/30 border-y border-border/60">
        <Container>
          <h2 className="font-display text-2xl sm:text-3xl">Other services</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {related.map((r, i) => (
              <ServiceCard key={r.slug} service={r} index={i} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
