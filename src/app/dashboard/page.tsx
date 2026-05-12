import Link from "next/link";
import {
  Inbox,
  Building2,
  Star,
  ArrowRight,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LeadsList } from "@/components/dashboard/leads-list";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { logger } from "@/lib/logger";
import type { Lead, LeadStatus } from "@/types/db";
import { reviews } from "@/data/reviews";
import { projects } from "@/data/projects";
import { listSiteImages } from "@/lib/site-images";

export const dynamic = "force-dynamic";

interface Overview {
  configured: boolean;
  total: number;
  newCount: number;
  recent: Lead[];
  byStatus: Record<LeadStatus, number>;
}

const emptyByStatus: Record<LeadStatus, number> = {
  new: 0,
  contacted: 0,
  estimate_sent: 0,
  won: 0,
  lost: 0,
};

async function loadOverview(): Promise<Overview> {
  if (!isSupabaseConfigured()) {
    return {
      configured: false,
      total: 0,
      newCount: 0,
      recent: [],
      byStatus: emptyByStatus,
    };
  }
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    if (error) throw error;
    const leads = (data ?? []) as Lead[];
    const byStatus = leads.reduce(
      (acc, l) => ({ ...acc, [l.status]: acc[l.status] + 1 }),
      { ...emptyByStatus }
    );
    return {
      configured: true,
      total: leads.length,
      newCount: byStatus.new,
      recent: leads.slice(0, 5),
      byStatus,
    };
  } catch (err) {
    logger.error("[/dashboard] overview failed", err);
    return {
      configured: false,
      total: 0,
      newCount: 0,
      recent: [],
      byStatus: emptyByStatus,
    };
  }
}

export default async function DashboardPage() {
  const [overview, siteMedia] = await Promise.all([
    loadOverview(),
    listSiteImages(),
  ]);
  const filledMedia = siteMedia.filter(
    (s) =>
      (s.media_type === "image" && s.image_url) ||
      (s.media_type === "youtube" && s.youtube_embed_url)
  ).length;

  const stats = [
    {
      label: "New leads",
      value: overview.newCount,
      icon: Inbox,
      href: "/dashboard/leads",
    },
    {
      label: "Published projects",
      value: projects.length,
      icon: Building2,
      href: "/dashboard/projects",
    },
    {
      label: "Site media",
      value: `${filledMedia}/${siteMedia.length}`,
      icon: ImageIcon,
      href: "/dashboard/images",
    },
    {
      label: "Reviews",
      value: reviews.length,
      icon: Star,
      href: "/dashboard/reviews",
    },
  ];

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Overview"
        description="Snapshot of recent leads, projects, and reviews."
        actions={
          <Button asChild size="sm" variant="outline">
            <Link href="/">
              View site <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </Button>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, href }) => (
          <Link
            key={label}
            href={href}
            className="group rounded-xl border border-border bg-surface p-5 transition-colors hover:border-gold/40"
          >
            <div className="flex items-center justify-between">
              <span className="grid h-9 w-9 place-items-center rounded-md bg-gold/10 text-gold">
                <Icon className="h-4 w-4" />
              </span>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-gold" />
            </div>
            <div className="mt-4 text-xs uppercase tracking-wider text-muted-foreground">
              {label}
            </div>
            <div className="font-display text-3xl font-semibold mt-1">{value}</div>
          </Link>
        ))}
      </section>

      {/* Status pipeline */}
      {overview.configured ? (
        <section className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-lg">Pipeline</h2>
            <span className="text-xs text-muted-foreground">
              {overview.total} {overview.total === 1 ? "lead" : "leads"} loaded
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-5 gap-3 text-sm">
            <PipelineCell label="New" value={overview.byStatus.new} variant="new" />
            <PipelineCell label="Contacted" value={overview.byStatus.contacted} variant="default" />
            <PipelineCell
              label="Estimate sent"
              value={overview.byStatus.estimate_sent}
              variant="outline"
            />
            <PipelineCell label="Won" value={overview.byStatus.won} variant="success" />
            <PipelineCell label="Lost" value={overview.byStatus.lost} variant="destructive" />
          </div>
        </section>
      ) : null}

      {/* Recent leads */}
      {overview.configured ? (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl">Recent leads</h2>
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/leads">
                View all <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
          <LeadsList leads={overview.recent} />
        </section>
      ) : (
        <section className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <h2 className="font-display text-xl">Connect Supabase to go live</h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
            Set <span className="font-mono">NEXT_PUBLIC_SUPABASE_URL</span>,{" "}
            <span className="font-mono">NEXT_PUBLIC_SUPABASE_ANON_KEY</span>,
            and <span className="font-mono">SUPABASE_SERVICE_ROLE_KEY</span>,
            then run the SQL in{" "}
            <span className="font-mono">supabase/schema.sql</span>.
          </p>
        </section>
      )}
    </div>
  );
}

function PipelineCell({
  label,
  value,
  variant,
}: {
  label: string;
  value: number;
  variant: "new" | "default" | "outline" | "success" | "destructive";
}) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-3">
      <Badge variant={variant}>{label}</Badge>
      <div className="font-display mt-2 text-2xl font-semibold">{value}</div>
    </div>
  );
}
