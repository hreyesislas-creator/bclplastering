import Link from "next/link";
import { ArrowUpRight, Inbox } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LeadsList } from "@/components/dashboard/leads-list";
import { Button } from "@/components/ui/button";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Lead } from "@/types/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function fetchLeads(): Promise<{ leads: Lead[]; error?: string }> {
  if (!isSupabaseConfigured()) {
    return { leads: [], error: "Supabase is not configured." };
  }
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);
    if (error) throw error;
    return { leads: (data ?? []) as Lead[] };
  } catch (err) {
    logger.error("[/dashboard/leads] fetch failed", err);
    return { leads: [], error: "Could not reach the database." };
  }
}

export default async function LeadsPage() {
  const { leads, error } = await fetchLeads();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Leads"
        description="Quote requests submitted from the contact form, newest first."
        actions={
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <Inbox className="h-3.5 w-3.5 text-gold" />
              {leads.length} {leads.length === 1 ? "lead" : "leads"}
            </span>
          </div>
        }
      />

      {error ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-foreground">{error}</p>
          <p className="mt-2 text-xs text-muted-foreground">
            Set <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span>,{" "}
            <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>,
            and <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span> in
            your environment, then run the SQL in{" "}
            <span className="font-mono">supabase/schema.sql</span>.
          </p>
          <Button asChild size="sm" variant="outline" className="mt-5">
            <Link href="https://supabase.com/dashboard" target="_blank" rel="noreferrer">
              Open Supabase <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      ) : (
        <LeadsList leads={leads} />
      )}
    </div>
  );
}
