import {
  Building2,
  Wrench,
  Sun,
  Sofa,
  PaintRoller,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/data/services";

const map: Record<ServiceIconKey, LucideIcon> = {
  "stucco-install": Building2,
  "stucco-repair": Wrench,
  exterior: Sun,
  interior: Sofa,
  drywall: PaintRoller,
  decorative: Sparkles,
};

export function ServiceIcon({
  iconKey,
  className,
}: {
  iconKey: ServiceIconKey;
  className?: string;
}) {
  const Icon = map[iconKey];
  return <Icon className={className} />;
}
