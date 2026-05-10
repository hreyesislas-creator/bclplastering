"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import type { FaqItem } from "@/lib/seo/jsonld";
import { Container } from "@/components/ui/container";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { cn } from "@/lib/utils";

interface FaqSectionProps {
  items: FaqItem[];
  eyebrow?: string;
  title?: React.ReactNode;
  description?: string;
}

export function FaqSection({
  items,
  eyebrow = "Common questions",
  title = (
    <>
      Answered{" "}
      <span className="text-gold-gradient">before you ask.</span>
    </>
  ),
  description = "If you have a question we haven't covered, send it through the form or WhatsApp — we'll get back the same day.",
}: FaqSectionProps) {
  const [open, setOpen] = React.useState<number | null>(0);

  return (
    <section className="relative py-20 sm:py-32">
      <Container>
        <Reveal>
          <SectionHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
            align="center"
          />
        </Reveal>

        <Reveal delay={0.1} className="mt-12">
          <div className="mx-auto max-w-3xl divide-y divide-border rounded-2xl border border-border surface-elevated overflow-hidden">
            {items.map((item, i) => {
              const isOpen = open === i;
              return (
                <div key={item.question}>
                  <button
                    type="button"
                    onClick={() => setOpen(isOpen ? null : i)}
                    className="flex w-full items-start justify-between gap-4 px-6 py-5 sm:px-7 sm:py-6 text-left transition-colors hover:bg-surface-2/40"
                    aria-expanded={isOpen}
                  >
                    <span
                      className={cn(
                        "font-medium text-base sm:text-lg",
                        isOpen ? "text-foreground" : "text-foreground/85"
                      )}
                    >
                      {item.question}
                    </span>
                    <span
                      className={cn(
                        "shrink-0 grid h-7 w-7 place-items-center rounded-full border transition-colors",
                        isOpen
                          ? "border-gold/40 bg-gold/15 text-gold"
                          : "border-border bg-surface-2 text-muted-foreground"
                      )}
                    >
                      {isOpen ? (
                        <Minus className="h-3.5 w-3.5" />
                      ) : (
                        <Plus className="h-3.5 w-3.5" />
                      )}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {isOpen ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="px-6 sm:px-7 pb-6 text-sm sm:text-[15px] leading-relaxed text-muted-foreground">
                          {item.answer}
                        </p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
