import Link from "next/link";
import { Plus } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardProjectCard } from "@/components/dashboard/dashboard-project-card";
import { Button } from "@/components/ui/button";
import { ProjectUploadForm } from "@/components/forms/project-upload-form";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Project } from "@/types/db";

export const dynamic = "force-dynamic";

async function fetchProjects(): Promise<{
  projects: Project[];
  configured: boolean;
}> {
  if (!isSupabaseConfigured())
    return { projects: [], configured: false };
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { projects: (data ?? []) as Project[], configured: true };
  } catch (err) {
    console.error("[/dashboard/projects] fetch failed", err);
    return { projects: [], configured: true };
  }
}

export default async function DashboardProjectsPage() {
  const { projects, configured } = await fetchProjects();

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Projects"
        description="Showcase work — uploads here appear on the public site."
        actions={
          <Button asChild size="sm">
            <Link href="#new">
              <Plus className="h-4 w-4" /> New project
            </Link>
          </Button>
        }
      />

      {configured ? (
        <section>
          {projects.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No projects yet — add your first one below.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => (
                <DashboardProjectCard key={p.id} project={p} />
              ))}
            </div>
          )}
        </section>
      ) : (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Supabase to load projects from the database.
          </p>
        </div>
      )}

      <section
        id="new"
        className="rounded-2xl border border-border surface-elevated p-6 sm:p-8"
      >
        <h2 className="font-display text-xl">Add a new project</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Cover image plus before/after sets are stored in the
          <span className="font-mono"> project-gallery</span> bucket.
        </p>
        <div className="mt-6">
          <ProjectUploadForm />
        </div>
      </section>
    </div>
  );
}
