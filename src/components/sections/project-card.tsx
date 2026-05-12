"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { MapPin, ArrowUpRight, PlayCircle } from "lucide-react";
import type { Project } from "@/types/db";
import { Badge } from "@/components/ui/badge";
import { SmartImage } from "@/components/ui/smart-image";
import { cn } from "@/lib/utils";
import { services } from "@/data/services";
import { images } from "@/lib/images";

interface ProjectCardProps {
  project: Project;
  className?: string;
  /** Optional override from the dashboard media manager. */
  coverOverride?: string | null;
  /** Optional alt text from the dashboard. */
  altOverride?: string | null;
}

export function ProjectCard({
  project,
  className,
  coverOverride,
  altOverride,
}: ProjectCardProps) {
  const service = services.find((s) => s.type === project.service_type);
  const manifest = images.projects[project.slug];
  const coverUrl =
    coverOverride ||
    project.cover_image_url ||
    (manifest?.enabled ? manifest.src : "");
  const coverAlt = altOverride || manifest?.alt || project.title;
  const showImage = Boolean(coverUrl);
  const description = project.short_description || project.description;
  const hasVideo = Boolean(project.youtube_embed_url);

  return (
    <Link
      href={`/projects/${project.slug}`}
      className={cn("group block", className)}
    >
      <motion.div
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="overflow-hidden rounded-2xl border border-border bg-surface hover-halo"
      >
        <div className="relative aspect-[4/3] bg-surface-2 overflow-hidden">
          {showImage ? (
            <SmartImage
              src={coverUrl}
              alt={coverAlt}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          ) : (
            <>
              <div
                aria-hidden
                className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.32 0.012 60), oklch(0.20 0.006 60) 60%, oklch(0.14 0.006 60))",
                }}
              />
              <div
                aria-hidden
                className="absolute inset-0 opacity-40 mix-blend-overlay transition-opacity duration-500 group-hover:opacity-60"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 30% 30%, oklch(0.86 0.04 75 / 0.5), transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.78 0.11 78 / 0.45), transparent 65%)",
                }}
              />
              <div aria-hidden className="absolute inset-0 stucco-texture" />
            </>
          )}

          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-background/85 to-transparent"
          />

          {project.featured ? (
            <Badge variant="gold" className="absolute top-4 left-4">
              Featured
            </Badge>
          ) : null}
          {hasVideo ? (
            <span
              aria-hidden
              className="absolute top-4 right-4 grid h-9 w-9 place-items-center rounded-full bg-background/80 text-gold backdrop-blur"
            >
              <PlayCircle className="h-5 w-5" />
            </span>
          ) : null}

          <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-3">
            <div>
              <Badge variant="outline" className="bg-background/70 backdrop-blur">
                {project.category || service?.title || project.service_type}
              </Badge>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-background/80 text-foreground backdrop-blur transition-all group-hover:bg-gold group-hover:text-gold-foreground">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold text-foreground line-clamp-1 group-hover:text-gold transition-colors">
            {project.title}
          </h3>
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-gold" />
            {project.city}
          </p>
          <p className="mt-3 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
