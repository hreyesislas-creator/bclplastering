import Image from "next/image";
import { cn } from "@/lib/utils";

type LogoBadgeSize = "sm" | "md" | "lg";

interface LogoBadgeProps {
  alt: string;
  /** Padded badge size. Pick the one that matches the surface. */
  size?: LogoBadgeSize;
  /** Optional explicit height utility for the inner <Image>. */
  imageClassName?: string;
  className?: string;
  priority?: boolean;
}

const padBySize: Record<LogoBadgeSize, string> = {
  sm: "px-2.5 py-1.5 rounded-xl",
  md: "px-4 py-3 rounded-2xl",
  lg: "px-5 py-4 rounded-2xl",
};

const defaultImageClassName: Record<LogoBadgeSize, string> = {
  sm: "h-9 sm:h-10 w-auto",
  md: "h-16 w-auto",
  lg: "h-20 w-auto",
};

/**
 * Premium glass-card frame around the BCL logo. Keeps the dark
 * portions of the mark readable on the site's warm dark theme:
 *  - subtle lifted background (rgba(30,22,16,.75))
 *  - hairline gold border (rgba(212,175,122,.18))
 *  - backdrop blur + inner highlight + soft gold outer glow
 *
 * The image itself is unchanged; only the wrapper provides contrast.
 */
export function LogoBadge({
  alt,
  size = "sm",
  imageClassName,
  className,
  priority,
}: LogoBadgeProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center justify-center backdrop-blur-md transition-colors",
        padBySize[size],
        className
      )}
      style={{
        backgroundColor: "rgba(30, 22, 16, 0.75)",
        border: "1px solid rgba(212, 175, 122, 0.18)",
        // soft inner highlight + subtle outer gold glow
        boxShadow:
          "inset 0 1px 0 rgba(255, 232, 196, 0.06), 0 1px 0 rgba(0, 0, 0, 0.35), 0 8px 24px -12px rgba(212, 175, 122, 0.18)",
      }}
    >
      {/* hairline top sheen */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"
      />
      <Image
        src="/logo/bcl-logo.png"
        alt={alt}
        width={400}
        height={400}
        priority={priority}
        sizes="120px"
        className={cn(
          "relative",
          imageClassName ?? defaultImageClassName[size]
        )}
      />
    </span>
  );
}
