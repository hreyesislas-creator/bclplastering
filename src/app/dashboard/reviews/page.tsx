import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { DashboardReviewCard } from "@/components/dashboard/dashboard-review-card";
import { AddReviewForm } from "@/components/dashboard/add-review-form";
import { createAdminSupabase } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import type { Review } from "@/types/db";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

async function fetchReviews(): Promise<{
  reviews: Review[];
  configured: boolean;
}> {
  if (!isSupabaseConfigured()) return { reviews: [], configured: false };
  try {
    const supabase = createAdminSupabase();
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return { reviews: (data ?? []) as Review[], configured: true };
  } catch (err) {
    logger.error("[/dashboard/reviews] fetch failed", err);
    return { reviews: [], configured: true };
  }
}

export default async function DashboardReviewsPage() {
  const { reviews, configured } = await fetchReviews();

  return (
    <div className="space-y-10">
      <DashboardHeader
        title="Reviews"
        description="Imported from Google, Yelp, Thumbtack, Facebook — or added directly. Updates show on the public site automatically."
      />

      <section className="rounded-2xl border border-border surface-elevated p-6 sm:p-8">
        <h2 className="font-display text-lg">Add a review</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Paste the customer&apos;s words exactly as they wrote them.
        </p>
        <div className="mt-6">
          <AddReviewForm />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="font-display text-xl">Live on the site</h2>
        {configured ? (
          reviews.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border bg-surface/40 p-10 text-center">
              <p className="text-sm text-muted-foreground">
                No reviews yet — add one above to get started.
              </p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {reviews.map((r) => (
                <DashboardReviewCard key={r.id} review={r} />
              ))}
            </div>
          )
        ) : (
          <div className="rounded-xl border border-dashed border-border bg-surface/40 p-8 text-center">
            <p className="text-sm text-muted-foreground">
              Connect Supabase to load reviews from the database.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
