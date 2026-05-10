import type { Review } from "@/types/db";
import { cn } from "@/lib/utils";

interface SourceBadgeProps {
  source: Review["source"];
  className?: string;
  size?: "sm" | "md";
}

const labels: Record<Review["source"], string> = {
  google: "Google",
  yelp: "Yelp",
  thumbtack: "Thumbtack",
  facebook: "Facebook",
  direct: "Direct",
};

const styles: Record<Review["source"], string> = {
  google:
    "bg-brand-google/15 text-[oklch(0.86_0.16_82)] ring-1 ring-brand-google/30",
  yelp:
    "bg-brand-yelp/15 text-[oklch(0.78_0.18_25)] ring-1 ring-brand-yelp/40",
  thumbtack:
    "bg-brand-thumbtack/15 text-[oklch(0.80_0.13_220)] ring-1 ring-brand-thumbtack/40",
  facebook:
    "bg-sky-500/15 text-sky-300 ring-1 ring-sky-500/30",
  direct:
    "bg-surface-2 text-muted-foreground ring-1 ring-border",
};

const marks: Record<Review["source"], React.ReactNode> = {
  google: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden>
      <path
        fill="currentColor"
        d="M21.6 12.227c0-.815-.074-1.6-.213-2.354H12v4.453h5.385a4.6 4.6 0 0 1-2 3.018v2.5h3.234c1.893-1.74 2.981-4.305 2.981-7.617z"
      />
      <path
        fill="currentColor"
        d="M12 22c2.7 0 4.965-.892 6.62-2.418l-3.234-2.5c-.896.6-2.043.957-3.386.957-2.604 0-4.808-1.757-5.595-4.123H3.063v2.59A9.997 9.997 0 0 0 12 22z"
        opacity=".75"
      />
      <path
        fill="currentColor"
        d="M6.405 13.916A6.01 6.01 0 0 1 6.087 12c0-.665.114-1.31.318-1.916V7.494H3.063A9.997 9.997 0 0 0 2 12c0 1.614.387 3.14 1.063 4.506l3.342-2.59z"
        opacity=".5"
      />
      <path
        fill="currentColor"
        d="M12 5.96c1.468 0 2.786.504 3.823 1.495l2.866-2.867C16.96 2.99 14.696 2 12 2A9.997 9.997 0 0 0 3.063 7.494l3.342 2.59C7.192 7.717 9.396 5.96 12 5.96z"
        opacity=".4"
      />
    </svg>
  ),
  yelp: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M14.7 13.6c-.4-.7-.2-1.6.5-2l4.9-2.6c.7-.4 1.6-.1 2 .6.4 1.4.5 2.9.3 4.4-.1.8-.8 1.4-1.6 1.4l-4.5-.4c-.7 0-1.3-.5-1.6-1.4zM13.4 9.4c0-.8.6-1.5 1.4-1.6l5-1c.8-.2 1.6.3 1.8 1.1.3 1.4.3 2.8-.1 4.1-.2.7-.9 1.1-1.6.9l-5-1.6c-.8-.2-1.5-1-1.5-1.9zM10.7 12.3l1.4-7.6c.1-.6.7-1.1 1.4-1 1.5.2 2.9.7 4.2 1.4.6.3.8 1 .5 1.6l-3.6 6.7c-.4.7-1.3 1-2 .5-.9-.5-1.7-1.1-2-1.6zM12.1 15.3c.7-.4 1.6-.2 2 .5l2.6 4.9c.4.7.1 1.6-.6 2-1.4.4-2.9.5-4.4.3-.8-.1-1.4-.8-1.4-1.6l.4-4.5c.1-.7.6-1.3 1.4-1.6zM5 11l5.6-1.5c.7-.2 1.4.2 1.6.9.2.7-.2 1.4-.9 1.6L5.7 13.5c-.7.2-1.4-.2-1.6-.9-.1-.6.2-1.4.9-1.6z" />
    </svg>
  ),
  thumbtack: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M11.5 2C7.4 2 4 5.4 4 9.5 4 13 6.4 15.9 9.7 16.7v3.8c0 .6.4 1 1 1h1.6c.6 0 1-.4 1-1v-3.8c3.3-.8 5.7-3.7 5.7-7.2C19 5.4 15.6 2 11.5 2zm0 11c-1.9 0-3.5-1.6-3.5-3.5S9.6 6 11.5 6 15 7.6 15 9.5 13.4 13 11.5 13z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor" aria-hidden>
      <path d="M22 12c0-5.5-4.5-10-10-10S2 6.5 2 12c0 5 3.7 9.1 8.4 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.4 2.9h-2.3v7C18.3 21.1 22 17 22 12z" />
    </svg>
  ),
  direct: null,
};

export function SourceBadge({ source, className, size = "sm" }: SourceBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full font-medium",
        size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs",
        styles[source],
        className
      )}
    >
      {marks[source]}
      {labels[source]}
    </span>
  );
}
