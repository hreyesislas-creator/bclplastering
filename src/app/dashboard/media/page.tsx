import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SiteImageGrid } from "@/components/dashboard/site-image-grid";
import { listSiteImages } from "@/lib/site-images";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardMediaPage() {
  const configured = isSupabaseConfigured();
  const all = await listSiteImages();
  const videoSlots = all.filter((s) => s.media_type === "youtube");

  const linked = videoSlots.filter((s) => Boolean(s.youtube_embed_url)).length;

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Media Library"
        description="Paste YouTube links to power the hero background video, the homepage feature, and the gallery video tiles."
        actions={
          <div className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{linked}</span> linked ·{" "}
            <span className="font-mono">{videoSlots.length}</span> slots
          </div>
        }
      />

      {!configured ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Supabase to manage video media from the dashboard.
          </p>
        </div>
      ) : (
        <SiteImageGrid
          slots={videoSlots}
          emptyLabel="Run the migration in supabase/migrations/0001_media_manager.sql to seed the video slots."
        />
      )}
    </div>
  );
}
