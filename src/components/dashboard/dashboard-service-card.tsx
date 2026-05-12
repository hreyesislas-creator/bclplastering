"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowUpRight,
  CheckCircle2,
  EyeOff,
  Loader2,
  Pencil,
  Star,
  Trash2,
} from "lucide-react";
import type { ServiceRow } from "@/types/db";
import { Badge } from "@/components/ui/badge";
import { ServiceIcon } from "@/components/sections/service-icon";
import {
  deleteService,
  toggleServiceActive,
  toggleServiceFeatured,
} from "@/app/dashboard/services/actions";

interface DashboardServiceCardProps {
  service: ServiceRow;
}

export function DashboardServiceCard({ service }: DashboardServiceCardProps) {
  const [active, setActive] = React.useState(service.is_active);
  const [featured, setFeatured] = React.useState(service.featured);
  const [deleting, deleteTx] = React.useTransition();
  const [activeTx, startActive] = React.useTransition();
  const [featureTx, startFeature] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function onDelete() {
    if (
      !confirm(
        `Delete "${service.title}"? This removes it from /services and the homepage. This cannot be undone.`
      )
    )
      return;
    setError(null);
    deleteTx(async () => {
      const res = await deleteService(service.id);
      if (!res.ok) setError(res.error ?? "Could not delete.");
    });
  }

  function onToggleActive() {
    setError(null);
    const next = !active;
    setActive(next);
    startActive(async () => {
      const res = await toggleServiceActive(service.id, next);
      if (!res.ok) {
        setActive(!next);
        setError(res.error ?? "Could not update.");
      }
    });
  }

  function onToggleFeatured() {
    setError(null);
    const next = !featured;
    setFeatured(next);
    startFeature(async () => {
      const res = await toggleServiceFeatured(service.id, next);
      if (!res.ok) {
        setFeatured(!next);
        setError(res.error ?? "Could not update.");
      }
    });
  }

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-surface overflow-hidden hover-halo">
      <div className="relative aspect-[16/9] bg-surface-2">
        {service.image_url ? (
          <Image
            src={service.image_url}
            alt={service.title}
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
                background:
                  "linear-gradient(140deg, oklch(0.30 0.012 60) 0%, oklch(0.18 0.006 60) 60%, oklch(0.14 0.006 60) 100%)",
              }}
            />
            <div className="absolute inset-0 grid place-items-center">
              <span className="grid h-14 w-14 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 ring-1 ring-gold/30 text-gold">
                <ServiceIcon
                  iconKey={service.icon_key ?? "sparkles"}
                  className="h-6 w-6"
                />
              </span>
            </div>
          </>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {featured ? <Badge variant="gold">Featured</Badge> : null}
          {!active ? (
            <Badge variant="outline" className="bg-background/70 backdrop-blur">
              Inactive
            </Badge>
          ) : null}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-lg font-semibold line-clamp-1">
          {service.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
          {service.category ? <span>{service.category}</span> : null}
          {service.price_label ? <span>{service.price_label}</span> : null}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px]">
            {service.slug}
          </code>
        </div>
        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {service.short_description ?? service.description ?? ""}
        </p>

        <p className="mt-3 text-[11px] uppercase tracking-wider text-muted-foreground">
          Appears on /services
          {featured ? " · homepage" : ""}
          {!active ? " (inactive)" : ""}
        </p>

        {error ? (
          <p className="mt-3 text-xs text-destructive">{error}</p>
        ) : null}

        <div className="mt-auto pt-5 flex items-center justify-between gap-2 border-t border-border/60">
          <div className="flex items-center gap-3">
            <Link
              href={`/dashboard/services/${service.id}/edit`}
              className="inline-flex items-center gap-1 text-xs font-medium text-foreground hover:text-gold"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Link>
            <Link
              href={`/services/${service.slug}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-gold"
            >
              View live <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleActive}
              disabled={activeTx}
              aria-label={active ? "Deactivate" : "Activate"}
              title={active ? "Set inactive" : "Set active"}
              className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 hover:bg-surface-3 transition-colors"
            >
              {activeTx ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : active ? (
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
              ) : (
                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
              )}
            </button>
            <button
              type="button"
              onClick={onToggleFeatured}
              disabled={featureTx}
              aria-label={featured ? "Unfeature" : "Feature"}
              className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 hover:bg-surface-3 transition-colors"
            >
              {featureTx ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Star
                  className={`h-3.5 w-3.5 ${
                    featured ? "fill-gold text-gold" : "text-muted-foreground"
                  }`}
                />
              )}
            </button>
            <button
              type="button"
              onClick={onDelete}
              disabled={deleting}
              aria-label="Delete service"
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
