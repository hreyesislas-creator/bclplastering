"use client";

import * as React from "react";
import Image from "next/image";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface BeforeAfterSliderProps {
  beforeSrc?: string;
  afterSrc?: string;
  alt?: string;
  className?: string;
  caption?: string;
}

export function BeforeAfterSlider({
  beforeSrc,
  afterSrc,
  alt = "Before and after",
  className,
  caption,
}: BeforeAfterSliderProps) {
  const [pos, setPos] = React.useState(50);
  const containerRef = React.useRef<HTMLDivElement | null>(null);

  const onMove = React.useCallback((clientX: number) => {
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPos(Math.max(0, Math.min(100, next)));
  }, []);

  return (
    <figure className={cn("space-y-3", className)}>
      <div
        ref={containerRef}
        className="relative aspect-[16/10] w-full overflow-hidden rounded-2xl bg-surface-2 select-none touch-none"
        onMouseDown={(e) => onMove(e.clientX)}
        onMouseMove={(e) => {
          if (e.buttons === 1) onMove(e.clientX);
        }}
        onTouchStart={(e) => onMove(e.touches[0].clientX)}
        onTouchMove={(e) => onMove(e.touches[0].clientX)}
      >
        {/* AFTER (full panel) */}
        <Panel
          src={afterSrc}
          alt={`${alt} — after`}
          tone="gold"
          label="AFTER"
          align="right"
        />

        {/* BEFORE clipped */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden"
          style={{ width: `${pos}%` }}
        >
          <Panel
            src={beforeSrc}
            alt={`${alt} — before`}
            tone="dark"
            label="BEFORE"
            align="left"
          />
        </div>

        <div
          className="absolute inset-y-0 w-[2px] bg-gold/90 shadow-[0_0_24px_rgba(0,0,0,0.4)] cursor-ew-resize"
          style={{ left: `${pos}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full bg-gold text-gold-foreground ring-4 ring-background/50 shadow-[var(--shadow-elev)]">
            <GripVertical className="h-5 w-5" />
          </div>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label="Before and after slider"
          className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        />

        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 hidden sm:block rounded-full border border-border/60 bg-background/70 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-muted-foreground backdrop-blur">
          Drag to compare
        </div>
      </div>
      {caption ? (
        <figcaption className="text-xs text-muted-foreground">{caption}</figcaption>
      ) : null}
    </figure>
  );
}

function Panel({
  src,
  alt,
  tone,
  label,
  align,
}: {
  src?: string;
  alt: string;
  tone: "dark" | "gold";
  label: string;
  align: "left" | "right";
}) {
  return (
    <div className="absolute inset-0">
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, 60vw"
          className="object-cover"
          draggable={false}
        />
      ) : (
        <>
          <div
            aria-hidden
            className="absolute inset-0"
            style={{
              backgroundImage:
                tone === "gold"
                  ? "linear-gradient(135deg, oklch(0.84 0.07 78), oklch(0.58 0.06 75) 60%, oklch(0.42 0.04 70))"
                  : "linear-gradient(135deg, oklch(0.32 0.012 60), oklch(0.20 0.006 60) 50%, oklch(0.14 0.006 60))",
            }}
          />
          <div
            aria-hidden
            className="absolute inset-0 mix-blend-overlay opacity-40"
            style={{
              backgroundImage:
                "radial-gradient(circle at 30% 30%, oklch(0.95 0.02 80 / 0.55), transparent 55%)",
            }}
          />
          <div aria-hidden className="absolute inset-0 stucco-texture" />
        </>
      )}
      <span
        className={cn(
          "absolute top-3 rounded bg-background/80 backdrop-blur px-2.5 py-1 text-[10px] font-bold tracking-[0.22em] text-foreground",
          align === "left" ? "left-3" : "right-3"
        )}
      >
        {label}
      </span>
    </div>
  );
}
