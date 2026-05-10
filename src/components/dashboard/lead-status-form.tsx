"use client";

import * as React from "react";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";
import type { LeadStatus } from "@/types/db";
import { Select } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { LEAD_STATUS_LABEL, LEAD_STATUS_ORDER } from "@/lib/leads/status";
import { updateLeadStatus } from "@/app/dashboard/leads/actions";

interface LeadStatusFormProps {
  leadId: string;
  currentStatus: LeadStatus;
}

export function LeadStatusForm({ leadId, currentStatus }: LeadStatusFormProps) {
  const [status, setStatus] = React.useState<LeadStatus>(currentStatus);
  const [pending, startTransition] = React.useTransition();
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);

  React.useEffect(() => {
    if (!feedback) return;
    const t = setTimeout(() => setFeedback(null), 3000);
    return () => clearTimeout(t);
  }, [feedback]);

  function onChange(next: LeadStatus) {
    if (next === status) return;
    const previous = status;
    setStatus(next);

    const fd = new FormData();
    fd.append("id", leadId);
    fd.append("status", next);

    startTransition(async () => {
      const result = await updateLeadStatus(fd);
      if (result.ok) {
        setFeedback({ kind: "ok" });
      } else {
        setStatus(previous);
        setFeedback({
          kind: "error",
          message: result.error ?? "Could not update status.",
        });
      }
    });
  }

  return (
    <div className="space-y-2">
      <Label htmlFor="lead-status">Status</Label>
      <div className="relative">
        <Select
          id="lead-status"
          value={status}
          disabled={pending}
          onChange={(e) => onChange(e.target.value as LeadStatus)}
        >
          {LEAD_STATUS_ORDER.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABEL[s]}
            </option>
          ))}
        </Select>
        {pending ? (
          <Loader2 className="absolute right-9 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {feedback?.kind === "ok" ? (
        <p className="inline-flex items-center gap-1.5 text-xs text-emerald-300">
          <CheckCircle2 className="h-3.5 w-3.5" />
          Status saved
        </p>
      ) : null}
      {feedback?.kind === "error" ? (
        <p className="inline-flex items-center gap-1.5 text-xs text-destructive">
          <AlertCircle className="h-3.5 w-3.5" />
          {feedback.message}
        </p>
      ) : null}
    </div>
  );
}
