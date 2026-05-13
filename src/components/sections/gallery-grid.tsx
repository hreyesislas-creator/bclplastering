"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, MapPin, PlayCircle } from "lucide-react";
import type { Project, SiteImage, SiteImageMap, ServiceType } from "@/types/db";
import { services } from "@/data/services";
import { images } from "@/lib/images";
import { SmartImage } from "@/components/ui/smart-image";
import { youtubeThumbnail } from "@/lib/site-images/youtube";
import { cn } from "@/lib/utils";

interface GalleryGridProps {
  projects: Project[];
  siteImages?: SiteImageMap;
}

type Filter = "all" | ServiceType;

const filters: { id: Filter; label: string }[] = [
  { id: "all", label: "All work" },
  { id: "stucco", label: "Stucco" },
  { id: "plastering", label: "Finish work" },
  { id: "exterior-paint", label: "Exterior remodels" },
];

/* Variable aspect ratios drive the masonry rhythm. */
const aspectClasses = [
  "aspect-[4/5]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[5/4]",
  "aspect-[4/3]",
  "aspect-[3/4]",
  "aspect-[1/1]",
  "aspect-[5/6]",
];

export function GalleryGrid({ projects, siteImages }: GalleryGridProps) {
  const [active, setActive] = React.useState<Filter>("all");

  const filtered = React.useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((p) => p.service_type === active),
    [active, projects]
  );

  const galleryVideos = React.useMemo<SiteImage[]>(() => {
    const map = siteImages ?? {};
    return [map["gallery_video_1"], map["gallery_video_2"]].filter(
      (v): v is SiteImage => Boolean(v?.youtube_embed_url)
    );
  }, [siteImages]);

  // Only surface videos when the "all" filter is active — they're not
  // tied to a service category.
  const showVideos = active === "all" && galleryVideos.length > 0;

  return (
    <div>
      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-1.5 rounded-full border border-border bg-surface/60 p-1.5 backdrop-blur w-fit mx-auto">
        {filters.map((f) => {
          const isActive = active === f.id;
          return (
            <button
              key={f.id}
              type="button"
              onClick={() => setActive(f.id)}
              className={cn(
                "relative px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-colors",
                isActive
                  ? "text-gold-foreground"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {isActive && (
                <motion.span
                  layoutId="gallery-pill"
                  transition={{ type: "spring", stiffness: 320, damping: 30 }}
                  className="absolute inset-0 rounded-full bg-gold"
                />
              )}
              <span className="relative z-10">{f.label}</span>
            </button>
          );
        })}
      </div>

      {/* Masonry — CSS columns */}
      <div className="mt-10 columns-1 sm:columns-2 lg:columns-3 gap-4 sm:gap-5 [column-fill:_balance]">
        <AnimatePresence mode="popLayout">
          {showVideos
            ? galleryVideos.map((video, i) => (
                <VideoTile
                  key={video.id}
                  video={video}
                  aspect={aspectClasses[i % aspectClasses.length]}
                />
              ))
            : null}
          {filtered.map((project, i) => (
            <Tile
              key={project.id}
              project={project}
              aspect={aspectClasses[i % aspectClasses.length]}
            />
          ))}
        </AnimatePresence>
      </div>

      {filtered.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-border bg-surface/40 p-12 text-center">
          <p className="text-sm text-muted-foreground">
            No projects in this category yet — check back soon, or{" "}
            <Link href="/contact" className="text-gold hover:underline">
              start one with us
            </Link>
            .
          </p>
        </div>
      ) : null}
    </div>
  );
}

function VideoTile({ video, aspect }: { video: SiteImage; aspect: string }) {
  const [playing, setPlaying] = React.useState(false);
  const thumb = youtubeThumbnail(video.youtube_embed_url);
  const label = video.alt_text || video.label;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 sm:mb-5 break-inside-avoid"
    >
      <div
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border bg-surface-2 hover-halo",
          aspect
        )}
      >
        {playing && video.youtube_embed_url ? (
          <iframe
            title={label}
            src={`${video.youtube_embed_url}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="absolute inset-0 h-full w-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play ${label}`}
            className="absolute inset-0 cursor-pointer"
          >
            {thumb ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={thumb}
                alt={label}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(135deg, oklch(0.32 0.012 60), oklch(0.20 0.006 60) 60%, oklch(0.14 0.006 60))",
                }}
              />
            )}
            <div className="absolute inset-0 grid place-items-center bg-background/30 transition-colors group-hover:bg-background/20">
              <span className="grid h-14 w-14 place-items-center rounded-full bg-gold text-gold-foreground shadow-soft transition-transform group-hover:scale-110">
                <PlayCircle className="h-7 w-7" />
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-background to-transparent">
              <span className="text-[11px] uppercase tracking-[0.18em] text-gold/90">
                Video
              </span>
              <h3 className="mt-1.5 font-display text-lg font-semibold text-foreground line-clamp-2">
                {video.label}
              </h3>
            </div>
          </button>
        )}
      </div>
    </motion.div>
  );
}

function Tile({ project, aspect }: { project: Project; aspect: string }) {
  const manifest = images.projects[project.slug];
  const coverUrl =
    project.cover_image_url ||
    (manifest?.enabled ? manifest.src : "");
  const coverAlt = manifest?.alt ?? project.title;
  const showImage = Boolean(coverUrl);
  const service = services.find((s) => s.type === project.service_type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="mb-4 sm:mb-5 break-inside-avoid"
    >
      <Link
        href={`/projects/${project.slug}`}
        className={cn(
          "group relative block overflow-hidden rounded-2xl border border-border bg-surface-2 hover-halo",
          aspect
        )}
      >
        {showImage ? (
          <SmartImage
            src={coverUrl}
            alt={coverAlt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
              className="absolute inset-0 mix-blend-overlay opacity-40"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, oklch(0.86 0.04 75 / 0.5), transparent 60%), radial-gradient(circle at 80% 80%, oklch(0.78 0.11 78 / 0.45), transparent 65%)",
              }}
            />
            <div className="absolute inset-0 stucco-texture" />
          </>
        )}

        {/* Cinematic overlay on hover */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent opacity-70 transition-opacity duration-500 group-hover:opacity-95"
        />

        <div className="absolute inset-0 flex flex-col justify-end p-5 translate-y-2 opacity-90 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-[11px] uppercase tracking-[0.18em] text-gold/90">
            {project.category || service?.title || project.service_type}
          </span>
          <h3 className="mt-1.5 font-display text-lg sm:text-xl font-semibold text-foreground line-clamp-2">
            {project.title}
          </h3>
          <div className="mt-2 flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              {project.city}
            </span>
            <span className="grid h-8 w-8 place-items-center rounded-full bg-background/70 text-foreground backdrop-blur transition-all group-hover:bg-gold group-hover:text-gold-foreground">
              <ArrowUpRight className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
