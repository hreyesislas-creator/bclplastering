"use client";

import * as React from "react";
import type { SiteImage } from "@/types/db";
import { SiteImageCard } from "./site-image-card";

interface SiteImageGridProps {
  slots: SiteImage[];
  emptyLabel?: string;
}

/**
 * Groups slots by page → section so the dashboard renders a
 * skim-able outline rather than a flat wall of cards.
 */
export function SiteImageGrid({ slots, emptyLabel }: SiteImageGridProps) {
  const grouped = React.useMemo(() => groupSlots(slots), [slots]);

  if (slots.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
        <p className="text-sm text-muted-foreground">
          {emptyLabel ?? "No media slots yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {grouped.map(({ page, sections }) => (
        <section key={page} className="space-y-6">
          <div className="flex items-end justify-between border-b border-border pb-3">
            <h2 className="font-display text-xl font-semibold">{page}</h2>
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              {sections.reduce((n, s) => n + s.slots.length, 0)} slot
              {sections.reduce((n, s) => n + s.slots.length, 0) === 1 ? "" : "s"}
            </span>
          </div>
          {sections.map(({ section, slots }) => (
            <div key={section} className="space-y-4">
              <h3 className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
                {section}
              </h3>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {slots.map((slot) => (
                  <SiteImageCard key={slot.id} slot={slot} />
                ))}
              </div>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function groupSlots(slots: SiteImage[]) {
  const byPage = new Map<string, Map<string, SiteImage[]>>();
  for (const slot of slots) {
    const page = slot.page ?? "Other";
    const section = slot.section ?? "General";
    const sectionMap = byPage.get(page) ?? new Map<string, SiteImage[]>();
    const list = sectionMap.get(section) ?? [];
    list.push(slot);
    sectionMap.set(section, list);
    byPage.set(page, sectionMap);
  }
  return Array.from(byPage.entries()).map(([page, sectionMap]) => ({
    page,
    sections: Array.from(sectionMap.entries()).map(([section, slots]) => ({
      section,
      slots,
    })),
  }));
}
