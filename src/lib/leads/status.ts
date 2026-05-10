import type { LeadStatus } from "@/types/db";

export const LEAD_STATUS_LABEL: Record<LeadStatus, string> = {
  new: "New",
  contacted: "Contacted",
  estimate_sent: "Estimate sent",
  won: "Won",
  lost: "Lost",
};

export const LEAD_STATUS_VARIANT: Record<
  LeadStatus,
  "new" | "default" | "outline" | "success" | "destructive"
> = {
  new: "new",
  contacted: "default",
  estimate_sent: "outline",
  won: "success",
  lost: "destructive",
};

export const LEAD_STATUS_ORDER: LeadStatus[] = [
  "new",
  "contacted",
  "estimate_sent",
  "won",
  "lost",
];
