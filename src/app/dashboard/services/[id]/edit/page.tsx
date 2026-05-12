import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { ServiceForm } from "@/components/forms/service-form";
import { getServiceById } from "@/lib/services";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditServicePage({ params }: PageProps) {
  if (!isSupabaseConfigured()) notFound();
  const { id } = await params;
  const service = await getServiceById(id);
  if (!service) notFound();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Edit service"
        description="Changes go live the moment you save."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/services">
                <ArrowLeft className="h-4 w-4" /> All services
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link
                href={`/services/${service.slug}`}
                target="_blank"
                rel="noreferrer"
              >
                View live <ExternalLink className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        }
      />

      <section className="rounded-2xl border border-border surface-elevated p-6 sm:p-8">
        <ServiceForm
          redirectTo="/dashboard/services"
          initial={{
            id: service.id,
            title: service.title,
            slug: service.slug,
            category: service.category ?? "",
            short_description: service.short_description ?? "",
            description: service.description ?? "",
            bullets: service.bullets ?? [],
            price_label: service.price_label ?? "",
            icon_key: service.icon_key ?? "sparkles",
            image_url: service.image_url ?? "",
            is_active: service.is_active,
            featured: service.featured,
            sort_order: service.sort_order ?? 0,
          }}
        />
      </section>
    </div>
  );
}
