import * as React from "react";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "max-w-3xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow ? (
        <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-gold">
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-gold/80" />
          {eyebrow}
          <span className="h-px w-8 bg-gradient-to-l from-transparent to-gold/80" />
        </span>
      ) : null}
      <h2 className="h-display mt-4 text-balance text-3xl sm:text-4xl md:text-5xl lg:text-[3.4rem] font-semibold text-foreground">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      ) : null}
    </div>
  );
}
