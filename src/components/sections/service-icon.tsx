import {
  Building2,
  Wrench,
  Sun,
  Sofa,
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
  sofa: Sofa,
  "paint-roller": PaintRoller,
  sparkles: Sparkles,
  // Legacy static-seed keys
  "stucco-install": Building2,
  "stucco-repair": Wrench,
  exterior: Sun,
  interior: Sofa,
  drywall: PaintRoller,
  decorative: Sparkles,
};

export const SERVICE_ICON_OPTIONS = [
  { key: "building", label: "Building (Stucco install)" },
  { key: "wrench", label: "Wrench (Repair)" },
  { key: "sun", label: "Sun (Exterior)" },
  { key: "sofa", label: "Sofa (Interior)" },
  { key: "paint-roller", label: "Paint roller (Drywall)" },
  { key: "sparkles", label: "Sparkles (Decorative)" },
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
