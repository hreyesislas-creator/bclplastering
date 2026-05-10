"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Phone, MessageCircle, CalendarCheck } from "lucide-react";
import { site } from "@/lib/site";
import {
  trackEstimateCta,
  trackPhone,
  trackWhatsApp,
} from "@/lib/analytics/events";

/**
 * Sticky 3-action mobile CTA. Always visible on small screens. Uses a
 * frosted glass background that rests above any page content.
 */
export function FloatingContactBar() {
  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.4, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="md:hidden fixed inset-x-0 bottom-0 z-40"
    >
      {/* top hairline */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="glass border-t border-border/60 px-3 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        <div className="grid grid-cols-3 gap-2">
          <Action
            href={site.phoneHref}
            label="Call"
            sublabel="Now"
            icon={<Phone className="h-5 w-5" />}
            tone="neutral"
            onClick={() => trackPhone("mobile_bar")}
          />
          <Action
            href={site.whatsapp}
            label="WhatsApp"
            sublabel="Message"
            icon={<MessageCircle className="h-5 w-5" />}
            tone="emerald"
            external
            onClick={() => trackWhatsApp("mobile_bar")}
          />
          <Action
            href="/contact"
            label="Free"
            sublabel="Estimate"
            icon={<CalendarCheck className="h-5 w-5" />}
            tone="gold"
            onClick={() => trackEstimateCta("mobile_bar")}
          />
        </div>
      </div>
    </motion.div>
  );
}

function Action({
  href,
  label,
  sublabel,
  icon,
  tone,
  external,
  onClick,
}: {
  href: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
  tone: "gold" | "emerald" | "neutral";
  external?: boolean;
  onClick?: () => void;
}) {
  const styles = {
    gold:
      "bg-gold text-gold-foreground shadow-[var(--shadow-glow)] active:scale-[0.97]",
    emerald:
      "bg-emerald-500 text-emerald-50 active:scale-[0.97]",
    neutral:
      "bg-surface-2 text-foreground border border-border active:scale-[0.97]",
  }[tone];

  const content = (
    <span
      className={`flex h-14 items-center justify-center gap-2.5 rounded-xl px-3 text-sm font-medium transition-transform ${styles}`}
    >
      {icon}
      <span className="flex flex-col items-start leading-tight">
        <span className="text-[10px] uppercase tracking-[0.16em] opacity-80">
          {sublabel}
        </span>
        <span className="text-sm font-semibold">{label}</span>
      </span>
    </span>
  );

  if (external) {
    return (
      <a href={href} target="_blank" rel="noreferrer" className="block" onClick={onClick}>
        {content}
      </a>
    );
  }
  if (href.startsWith("tel:") || href.startsWith("mailto:")) {
    return (
      <a href={href} className="block" onClick={onClick}>
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className="block" onClick={onClick}>
      {content}
    </Link>
  );
}
