import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Native <select> styled to match the design system. Keeps the bundle
 * lean — we can swap to Radix Select later if we need richer behaviour.
 */
export const Select = React.forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "flex h-11 w-full appearance-none rounded-md border border-input bg-surface px-3.5 pr-10 text-sm text-foreground shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 24 24%22 fill=%22none%22 stroke=%22%23a8a190%22 stroke-width=%221.8%22 stroke-linecap=%22round%22 stroke-linejoin=%22round%22><polyline points=%226 9 12 15 18 9%22/></svg>')] bg-[length:18px] bg-[right_0.85rem_center] bg-no-repeat",
      className
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
