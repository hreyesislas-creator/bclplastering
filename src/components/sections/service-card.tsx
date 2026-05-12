"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Check } from "lucide-react";
import { ServiceIcon } from "./service-icon";
import { cn } from "@/lib/utils";

interface ServiceCardItem {
  slug: string;
  iconKey: string;
  title: string;
  short: string;
  bullets: string[];
  startingFrom?: string | null;
}

interface ServiceCardProps {
  service: ServiceCardItem;
  className?: string;
  index?: number;
}

export function ServiceCard({ service, className, index = 0 }: ServiceCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.6,
        delay: index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={cn("h-full", className)}
    >
      <Link
        href={`/services/${service.slug}`}
        className="group relative block h-full overflow-hidden rounded-2xl surface-elevated hover-halo"
      >
        {/* Subtle gold sheen on hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
        />

        <div className="relative p-7 sm:p-8 flex h-full flex-col">
          <div className="flex items-start justify-between">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 ring-1 ring-gold/30 text-gold transition-all duration-500 group-hover:scale-105 group-hover:ring-gold/50">
              <ServiceIcon iconKey={service.iconKey} className="h-6 w-6" />
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full border border-border bg-background/40 text-muted-foreground transition-all group-hover:border-gold/40 group-hover:text-gold group-hover:-translate-y-0.5 group-hover:translate-x-0.5">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>

          <h3 className="font-display text-2xl font-semibold text-foreground mt-7 tracking-tight">
            {service.title}
          </h3>
          <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
            {service.short}
          </p>

          <ul className="mt-6 space-y-2 text-sm">
            {service.bullets.slice(0, 3).map((b) => (
              <li key={b} className="flex items-start gap-2 text-foreground/85">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" />
                {b}
              </li>
            ))}
          </ul>

          <div className="mt-auto pt-7 flex items-center justify-between border-t border-border/60">
            {service.startingFrom ? (
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                <span className="font-medium text-foreground">
                  {service.startingFrom}
                </span>
              </span>
            ) : (
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                By estimate
              </span>
            )}
            <span className="text-xs font-medium text-gold opacity-0 transition-opacity group-hover:opacity-100">
              Learn more →
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
