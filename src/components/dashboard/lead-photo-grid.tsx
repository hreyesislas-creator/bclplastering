"use client";

import * as React from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface LeadPhotoGridProps {
  urls: string[];
  alt: string;
}

export function LeadPhotoGrid({ urls, alt }: LeadPhotoGridProps) {
  const [active, setActive] = React.useState<number | null>(null);

  React.useEffect(() => {
    if (active === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setActive(null);
      else if (e.key === "ArrowRight")
        setActive((i) => (i === null ? null : (i + 1) % urls.length));
      else if (e.key === "ArrowLeft")
        setActive((i) => (i === null ? null : (i - 1 + urls.length) % urls.length));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, urls.length]);

  if (urls.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center text-sm text-muted-foreground">
        No photos uploaded with this request.
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {urls.map((url, i) => (
          <button
            key={url}
            type="button"
            onClick={() => setActive(i)}
            className="group relative aspect-square overflow-hidden rounded-lg border border-border bg-surface-2"
            aria-label={`Open photo ${i + 1}`}
          >
            <Image
              src={url}
              alt={`${alt} — photo ${i + 1}`}
              fill
              sizes="(max-width: 640px) 50vw, 30vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="pointer-events-none absolute inset-0 ring-0 ring-gold/0 transition-all duration-300 group-hover:ring-2 group-hover:ring-gold/40" />
          </button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-md p-4 sm:p-8"
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              onClick={() => setActive(null)}
              aria-label="Close"
              className="absolute right-4 top-4 grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-2"
            >
              <X className="h-5 w-5" />
            </button>

            {urls.length > 1 ? (
              <>
                <NavButton
                  side="left"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((i) => (i === null ? null : (i - 1 + urls.length) % urls.length));
                  }}
                />
                <NavButton
                  side="right"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActive((i) => (i === null ? null : (i + 1) % urls.length));
                  }}
                />
              </>
            ) : null}

            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.25 }}
              className="relative h-full w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={urls[active]}
                alt={`${alt} — photo ${active + 1}`}
                fill
                sizes="100vw"
                className="object-contain"
              />
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted-foreground">
                {active + 1} / {urls.length}
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function NavButton({
  side,
  onClick,
}: {
  side: "left" | "right";
  onClick: (e: React.MouseEvent) => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={side === "left" ? "Previous" : "Next"}
      className={`absolute top-1/2 -translate-y-1/2 grid h-10 w-10 place-items-center rounded-full border border-border bg-surface text-foreground hover:bg-surface-2 ${
        side === "left" ? "left-4" : "right-4"
      }`}
    >
      {side === "left" ? (
        <ChevronLeft className="h-5 w-5" />
      ) : (
        <ChevronRight className="h-5 w-5" />
      )}
    </button>
  );
}
