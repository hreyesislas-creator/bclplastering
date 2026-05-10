import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Calendar,
  Image as ImageIcon,
  ExternalLink,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { LeadPhotoGrid } from "@/components/dashboard/lead-photo-grid";
import { LeadStatusForm } from "@/components/dashboard/lead-status-form";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { LEAD_STATUS_LABEL, LEAD_STATUS_VARIANT } from "@/lib/leads/status";
import { services } from "@/data/services";
import type { Lead } from "@/types/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

async function fetchLead(id: string): Promise<Lead | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = createAdminSupabase();
  const { data, error } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) {
    logger.error("[/dashboard/leads/[id]] fetch failed", error);
    return null;
  }
  return (data as Lead | null) ?? null;
}

function whatsappLink(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits ? `https://wa.me/${digits.length === 10 ? "1" + digits : digits}` : "";
}

export default async function LeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const lead = await fetchLead(id);
  if (!lead) notFound();

  const service = services.find((s) => s.type === lead.service_type);
  const wa = whatsappLink(lead.phone);

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/leads"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        All leads
      </Link>

      <DashboardHeader
        title={lead.full_name}
        description={`${service?.title ?? lead.service_type}${lead.city ? " · " + lead.city : ""}`}
        actions={
          <Badge variant={LEAD_STATUS_VARIANT[lead.status]}>
            {LEAD_STATUS_LABEL[lead.status]}
          </Badge>
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Main column */}
        <div className="lg:col-span-8 space-y-6">
          {/* Quick actions */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Quick actions
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <Button asChild size="lg" className="h-12">
                <a href={`tel:${lead.phone}`}>
                  <Phone className="h-4 w-4" />
                  Call {lead.phone}
                </a>
              </Button>
              {wa ? (
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="h-12 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                >
                  <a href={wa} target="_blank" rel="noreferrer">
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                </Button>
              ) : null}
              {lead.email ? (
                <Button asChild size="lg" variant="outline" className="h-12">
                  <a href={`mailto:${lead.email}`}>
                    <Mail className="h-4 w-4" />
                    Email
                  </a>
                </Button>
              ) : null}
            </div>
          </section>

          {/* Message */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl">Project notes</h2>
              <span className="text-xs text-muted-foreground">
                Submitted{" "}
                {new Date(lead.created_at).toLocaleString(undefined, {
                  dateStyle: "medium",
                  timeStyle: "short",
                })}
              </span>
            </div>
            {lead.message ? (
              <p className="mt-4 whitespace-pre-wrap text-sm text-foreground/90 leading-relaxed">
                {lead.message}
              </p>
            ) : (
              <p className="mt-4 text-sm text-muted-foreground italic">
                Customer didn&apos;t leave additional notes.
              </p>
            )}
          </section>

          {/* Photos */}
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-xl inline-flex items-center gap-2">
                <ImageIcon className="h-5 w-5 text-gold" />
                Project photos
              </h2>
              <span className="text-xs text-muted-foreground">
                {lead.project_photo_urls.length}{" "}
                {lead.project_photo_urls.length === 1 ? "photo" : "photos"}
              </span>
            </div>
            <div className="mt-4">
              <LeadPhotoGrid
                urls={lead.project_photo_urls}
                alt={`${lead.full_name} — ${service?.title ?? "project"}`}
              />
            </div>
          </section>
        </div>

        {/* Side column */}
        <aside className="lg:col-span-4 space-y-6">
          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg">Status</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Updates save automatically.
            </p>
            <div className="mt-4">
              <LeadStatusForm leadId={lead.id} currentStatus={lead.status} />
            </div>
          </section>

          <section className="rounded-2xl border border-border bg-surface p-5 sm:p-6">
            <h2 className="font-display text-lg">Customer</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Row label="Name" value={lead.full_name} />
              <Row
                label="Phone"
                value={
                  <a href={`tel:${lead.phone}`} className="hover:text-gold">
                    {lead.phone}
                  </a>
                }
              />
              {lead.email ? (
                <Row
                  label="Email"
                  value={
                    <a href={`mailto:${lead.email}`} className="hover:text-gold">
                      {lead.email}
                    </a>
                  }
                />
              ) : null}
              <Row
                label="City"
                value={
                  lead.city ? (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-gold" />
                      {lead.city}
                    </span>
                  ) : (
                    "—"
                  )
                }
              />
              <Row
                label="Service"
                value={service?.title ?? lead.service_type}
              />
              <Row
                label="Received"
                value={
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-gold" />
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                }
              />
            </dl>
          </section>

          {lead.project_photo_urls.length > 0 ? (
            <a
              href={lead.project_photo_urls[0]}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              View raw photo URL <ExternalLink className="h-3 w-3" />
            </a>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right font-medium text-foreground">{value}</dd>
    </div>
  );
}
