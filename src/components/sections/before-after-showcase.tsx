"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin } from "lucide-react";
import { BeforeAfterSlider } from "./before-after-slider";
import { Container } from "@/components/ui/container";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { images } from "@/lib/images";
import { cn } from "@/lib/utils";

interface ShowcaseItem {
  id: keyof typeof images.beforeAfter;
  tab: string;
  title: string;
  city: string;
  caption: string;
  /** Short value statement — the homeowner outcome. */
  value: string;
  service: string;
}

const items: ShowcaseItem[] = [
  {
    id: "riverside-stucco-restoration",
    tab: "Riverside",
    title: "Stucco restoration",
    city: "Riverside, CA",
    caption:
      "Failed stucco pulled back, re-lathed, and hand-troweled in Santa Barbara smooth — color-matched in two tones to highlight the original arches.",
    value:
      "Restored 1960s character that adds resale value — and won't crack again.",
    service: "Stucco Repair",
  },
  {
    id: "moreno-valley-exterior-remodel",
    tab: "Moreno Valley",
    title: "Whole-home exterior remodel",
    city: "Moreno Valley, CA",
    caption:
      "Two-coat Loxon system over re-stuccoed elevations, custom columns, recessed trim — permitted, inspected, and finished in 18 working days.",
    value:
      "A whole-envelope refresh delivered faster than competitors quoted.",
    service: "Exterior Remodeling",
  },
  {
    id: "corona-smooth-finish-stucco",
    tab: "Corona",
    title: "Smooth finish stucco — new build",
    city: "Corona, CA",
    caption:
      "Three-coat traditional stucco with integral pigment and a hand-floated smooth finish — crack-resistant, weep-screened, inspected first try.",
    value:
      "Built right means no recoats in five years — the kind of finish that lasts.",
    service: "Stucco Installation",
  },
];

const ease = [0.22, 1, 0.36, 1] as const;

export function BeforeAfterShowcase() {
  const [active, setActive] = React.useState(items[0].id);
  const current = items.find((i) => i.id === active) ?? items[0];
  const pair = images.beforeAfter[current.id];
  const before = pair.before.enabled ? pair.before.src : undefined;
  const after = pair.after.enabled ? pair.after.src : undefined;

  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 40% at 50% 0%, oklch(0.78 0.11 78 / 0.10), transparent 70%)",
        }}
      />
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent"
      />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Visual proof"
            title={
              <>
                Drag to see the
                <br className="hidden sm:block" />{" "}
                <span className="text-gold-gradient">transformation.</span>
              </>
            }
            description="No staged photos — every project below is a real Inland Empire home, finished by our crew."
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-10 flex justify-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-1.5 rounded-full border border-border bg-surface/60 p-1.5 backdrop-blur">
            {items.map((item) => {
              const isActive = item.id === active;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActive(item.id)}
                  className={cn(
                    "relative px-4 sm:px-5 py-2 text-sm font-medium rounded-full transition-colors",
                    isActive
                      ? "text-gold-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="ba-tab-pill"
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 30,
                      }}
                      className="absolute inset-0 rounded-full bg-gold"
                    />
                  )}
                  <span className="relative z-10">{item.tab}</span>
                </button>
              );
            })}
          </div>
        </Reveal>

        <Reveal delay={0.2} className="mt-12">
          <div className="mx-auto max-w-5xl">
            <div className="relative overflow-hidden rounded-3xl border border-border surface-elevated p-2 sm:p-3">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.45, ease }}
                >
                  <BeforeAfterSlider
                    beforeSrc={before}
                    afterSrc={after}
                    alt={`${current.title} — ${current.city}`}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={`${current.id}-caption`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.4, ease }}
                className="mt-6 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <div className="max-w-xl">
                  <h3 className="font-display text-xl text-foreground">
                    {current.title}
                  </h3>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                    {current.caption}
                  </p>
                  <p className="mt-3 text-xs italic text-gold/85 leading-relaxed">
                    {current.value}
                  </p>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground shrink-0">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-4 w-4 text-gold" />
                    {current.city}
                  </span>
                  <span className="h-3 w-px bg-border" />
                  <span>{current.service}</span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
