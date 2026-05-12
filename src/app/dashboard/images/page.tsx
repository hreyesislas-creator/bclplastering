import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { SiteImageGrid } from "@/components/dashboard/site-image-grid";
import { listSiteImages } from "@/lib/site-images";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const dynamic = "force-dynamic";

export default async function DashboardImagesPage() {
  const configured = isSupabaseConfigured();
  const all = await listSiteImages();
  const imageSlots = all.filter((s) => s.media_type === "image");

  const totalRequired = imageSlots.filter((s) => s.is_required).length;
  const filled = imageSlots.filter((s) => Boolean(s.image_url)).length;

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Website Images"
        description="Upload and manage every image that powers the public site. Changes go live the moment you save."
        actions={
          <div className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
            <span className="font-mono text-foreground">{filled}</span> uploaded ·{" "}
            <span className="font-mono">{totalRequired}</span> required
          </div>
        }
      />

      {!configured ? (
        <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Connect Supabase to manage website media from the dashboard.
          </p>
        </div>
      ) : (
        <SiteImageGrid
          slots={imageSlots}
          emptyLabel="Run the migration in supabase/migrations/0001_media_manager.sql to seed the image slots."
        />
      )}
    </div>
  );
}
