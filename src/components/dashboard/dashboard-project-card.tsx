"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  Loader2,
  Star,
  Trash2,
  MapPin,
} from "lucide-react";
import type { Project } from "@/types/db";
import { services } from "@/data/services";
import { Badge } from "@/components/ui/badge";
import { deleteProject, toggleFeatured } from "@/app/dashboard/projects/actions";

interface DashboardProjectCardProps {
  project: Project;
}

export function DashboardProjectCard({ project }: DashboardProjectCardProps) {
  const service = services.find((s) => s.type === project.service_type);
  const [featured, setFeatured] = React.useState(project.featured);
  const [deleting, deleteTransition] = React.useTransition();
  const [featuring, featureTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const onDelete = () => {
    if (!confirm(`Delete "${project.title}"? This cannot be undone.`)) return;
    setError(null);
    deleteTransition(async () => {
      const res = await deleteProject(project.id);
      if (!res.ok) setError(res.error ?? "Could not delete.");
    });
  };

  const onToggleFeatured = () => {
    setError(null);
    const next = !featured;
    setFeatured(next);
    featureTransition(async () => {
      const res = await toggleFeatured(project.id, next);
      if (!res.ok) {
        setFeatured(!next);
        setError(res.error ?? "Could not update.");
      }
    });
  };

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden hover-halo">
      <div className="relative aspect-[4/3] bg-surface-2">
        {project.cover_image_url ? (
          <Image
            src={project.cover_image_url}
            alt={project.title}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
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
            <div aria-hidden className="absolute inset-0 stucco-texture" />
          </>
        )}
        {featured ? (
          <Badge variant="gold" className="absolute top-3 left-3">
            Featured
          </Badge>
        ) : null}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold line-clamp-1">
          {project.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {project.city}
          </span>
          <span>{service?.title ?? project.service_type}</span>
          <span>{new Date(project.created_at).toLocaleDateString()}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {project.description}
        </p>

        {error ? (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        ) : null}

        <div className="mt-auto pt-5 flex items-center justify-between gap-2 border-t border-border/60">
          <Link
            href={`/projects/${project.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold hover:underline"
          >
            View live <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleFeatured}
              disabled={featuring}
              aria-label={featured ? "Unfeature project" : "Feature project"}
              className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 hover:bg-surface-3 transition-colors"
            >
              {featuring ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Star
                  className={`h-3.5 w-3.5 ${featured ? "fill-gold text-gold" : "text-muted-foreground"}`}
                />
              )}
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              aria-label="Delete project"
              className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:text-destructive hover:bg-surface-3 transition-colors"
            >
              {deleting ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Trash2 className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
