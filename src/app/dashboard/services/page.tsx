import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardServiceCard } from "@/components/dashboard/dashboard-service-card";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/forms/service-form";
import { listAllServices } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardServicesPage() {
  const configured = isSupabaseConfigured();
  const services = configured ? await listAllServices() : [];
  const active = services.filter((s) => s.is_active).length;

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Services"
        description="Edit the cards that appear on the homepage and the /services pages."
        actions={
          <div className="flex items-center gap-3">
            <div className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
              <span className="font-mono text-foreground">{active}</span> active ·{" "}
              <span className="font-mono">{services.length}</span> total
            </div>
            <Button asChild size="sm">
              <Link href="#new">
                <Plus className="h-4 w-4" /> New service
              </Link>
            </Button>
          </div>
        }
      />

      {!configured ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Supabase to manage services from the dashboard.
          </p>
        </div>
      ) : (
        <section>
          {services.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No services yet — run{" "}
                <span className="font-mono">
                  supabase/migrations/0003_editable_services.sql
                </span>{" "}
                to seed the defaults, or add one below.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((s) => (
                <DashboardServiceCard key={s.id} service={s} />
              ))}
            </div>
          )}
        </section>
      )}

      {configured ? (
        <section
          id="new"
          className="rounded-2xl border border-border surface-elevated p-6 sm:p-8"
        >
          <h2 className="font-display text-xl">Add a new service</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Adds a card to /services and (when Featured) the homepage What we do
            section.
          </p>
          <div className="mt-6">
            <ServiceForm />
          </div>
        </section>
      ) : null}
    </div>
  );
}
