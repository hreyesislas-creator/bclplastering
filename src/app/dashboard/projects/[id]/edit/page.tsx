import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { Button } from "@/components/ui/button";
import { ProjectUploadForm } from "@/components/forms/project-upload-form";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { logger } from "@/lib/logger";
import type { Project } from "@/types/db";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: PageProps) {
  const { id } = await params;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  let project: Project | null = null;
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", id)
      .maybeSingle();
    if (error) throw error;
    project = (data as Project | null) ?? null;
  } catch (err) {
    logger.error("[/dashboard/projects/edit] fetch failed", err);
  }

  if (!project) notFound();

  return (
    <div className="space-y-8">
      <DashboardHeader
        title="Edit project"
        description="Changes go live the moment you save."
        actions={
          <div className="flex items-center gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/dashboard/projects">
                <ArrowLeft className="h-4 w-4" /> All projects
              </Link>
            </Button>
            <Button asChild size="sm" variant="outline">
              <Link
                href={`/projects/${project.slug}`}
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
        <ProjectUploadForm
          redirectTo="/dashboard/projects"
          initial={{
            id: project.id,
            title: project.title,
            slug: project.slug,
            city: project.city,
            service_type: project.service_type,
            category: project.category ?? "",
            description: project.description,
            short_description: project.short_description ?? "",
            featured: project.featured,
            sort_order: project.sort_order ?? 0,
            youtube_url: project.youtube_url ?? "",
            cover_image_url: project.cover_image_url ?? "",
            before_images: project.before_images ?? [],
            after_images: project.after_images ?? [],
          }}
        />
      </section>
    </div>
  );
}
