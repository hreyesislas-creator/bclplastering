import {
  Building2,
  Wrench,
  Sun,
  PaintRoller,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

/**
 * Maps an icon key (DB-driven, free text) to a Lucide icon. Accepts
 * both the new dashboard keys (`building`, `wrench`, …) and the
 * legacy static-seed keys (`stucco-install`, …) so either source
 * renders correctly.
 */
const map: Record<string, LucideIcon> = {
  // Dashboard / DB keys
  building: Building2,
  wrench: Wrench,
  sun: Sun,
  "paint-roller": PaintRoller,
  sparkles: Sparkles,
  // Legacy static-seed keys
  "stucco-install": Building2,
  "stucco-repair": Wrench,
  exterior: Sun,
  restoration: Wrench,
  patch: PaintRoller,
  finishes: Sparkles,
};

export const SERVICE_ICON_OPTIONS = [
  { key: "building", label: "Building (Stucco install)" },
  { key: "wrench", label: "Wrench (Repair / Restoration)" },
  { key: "sun", label: "Sun (Exterior)" },
  { key: "paint-roller", label: "Paint roller (Patch & texture)" },
  { key: "sparkles", label: "Sparkles (Custom finishes)" },
] as const;

export function ServiceIcon({
  iconKey,
  className,
}: {
  iconKey: string;
  className?: string;
}) {
  const Icon = map[iconKey] ?? Sparkles;
  return <Icon className={className} />;
}
