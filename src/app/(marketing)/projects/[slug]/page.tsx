import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BeforeAfterSlider } from "@/components/sections/before-after-slider";
import { CTASection } from "@/components/sections/cta-section";
import { ProjectCard } from "@/components/sections/project-card";
import { services } from "@/data/services";
import { images } from "@/lib/images";
import { getPublicProjects } from "@/lib/public-data";
import { JsonLd } from "@/components/seo/json-ld";
import { projectSchema } from "@/lib/seo/jsonld";
import { env } from "@/lib/env";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { slug } = await params;
  const projects = await getPublicProjects();
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: {
      title: p.title,
      description: p.description,
      url: `/projects/${p.slug}`,
      images: p.cover_image_url ? [p.cover_image_url] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const projects = await getPublicProjects();
  const project = projects.find((p) => p.slug === slug);
  if (!project) notFound();

  const service = services.find((s) => s.type === project.service_type);
  const others = projects.filter((p) => p.slug !== project.slug).slice(0, 3);

  // Cover: prefer the DB-backed URL, fall back to the manifest entry.
  const manifestCover = images.projects[project.slug];
  const coverUrl =
    project.cover_image_url ||
    (manifestCover?.enabled ? manifestCover.src : "");

  // Before/after: pull from DB arrays, fall back to manifest pairs.
  const before = project.before_images[0];
  const after = project.after_images[0];
  const baPair =
    images.beforeAfter[project.slug as keyof typeof images.beforeAfter];
  const fallbackBefore = baPair?.before.enabled
    ? baPair.before.src
    : undefined;
  const fallbackAfter = baPair?.after.enabled ? baPair.after.src : undefined;
  const showBA = Boolean(before || after || fallbackBefore || fallbackAfter);
  const ld = projectSchema({ project, baseUrl: env.siteUrl });

  return (
    <>
      <JsonLd data={ld} id={`ld-project-${project.slug}`} />
      <section className="pt-12 pb-10">
        <Container>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            All projects
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            {service ? <Badge variant="gold">{service.title}</Badge> : null}
            <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              {project.city}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(project.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
              })}
            </span>
          </div>

          <h1 className="h-display mt-5 text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground max-w-3xl">
            {project.title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            {project.description}
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="relative aspect-[16/9] overflow-hidden rounded-3xl border border-border surface-elevated">
            {coverUrl ? (
              <Image
                src={coverUrl}
                alt={project.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 80vw"
                className="object-cover"
              />
            ) : (
              <>
                <div
                  aria-hidden
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "linear-gradient(135deg, oklch(0.32 0.012 60), oklch(0.20 0.006 60) 60%, oklch(0.14 0.006 60))",
                  }}
                />
                <div
                  aria-hidden
                  className="absolute inset-0 mix-blend-overlay opacity-50"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 30% 30%, oklch(0.86 0.04 75 / 0.5), transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.78 0.11 78 / 0.45), transparent 65%)",
                  }}
                />
                <div className="absolute inset-0 stucco-texture" />
              </>
            )}
          </div>
        </Container>
      </section>

      {showBA ? (
        <section className="pb-20">
          <Container>
            <div className="mx-auto max-w-5xl">
              <h2 className="font-display text-2xl sm:text-3xl mb-6">
                Before &amp; after
              </h2>
              <BeforeAfterSlider
                beforeSrc={before ?? fallbackBefore}
                afterSrc={after ?? fallbackAfter}
                alt={project.title}
              />
            </div>
          </Container>
        </section>
      ) : null}

      <section className="py-20 sm:py-28 bg-surface/30 border-y border-border/60">
        <Container>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl">More projects</h2>
            <Button asChild variant="outline">
              <Link href="/projects">View all</Link>
            </Button>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {others.map((p) => (
              <ProjectCard key={p.id} project={p} />
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}
