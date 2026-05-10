"use client";

import * as React from "react";
import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

type SmartImageProps = Omit<ImageProps, "onLoad"> & {
  /** Skeleton tone — matches the project palette. */
  skeletonTone?: "dark" | "warm";
};

/**
 * `next/image` wrapper that:
 *  - shows a subtle skeleton until the bytes arrive
 *  - fades the image in once decoded
 *  - keeps `priority`, `sizes` and other props pass-through
 *
 * Pair with `fill` and a relatively-positioned parent for the
 * cleanest result.
 */
export function SmartImage({
  className,
  skeletonTone = "dark",
  ...props
}: SmartImageProps) {
  const [loaded, setLoaded] = React.useState(false);

  return (
    <>
      <span
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100"
        )}
        style={{
          background:
            skeletonTone === "warm"
              ? "linear-gradient(135deg, oklch(0.78 0.07 78), oklch(0.42 0.04 70))"
              : "linear-gradient(135deg, oklch(0.32 0.012 60), oklch(0.18 0.006 60))",
        }}
      />
      <Image
        {...props}
        quality={props.quality ?? 80}
        onLoad={() => setLoaded(true)}
        className={cn(
          "transition-opacity duration-500",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </>
  );
}
