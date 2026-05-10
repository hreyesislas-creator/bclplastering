"use client";

import * as React from "react";
import { Loader2, Trash2, Star } from "lucide-react";
import type { Review } from "@/types/db";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "@/components/sections/source-badge";
import { deleteReview } from "@/app/dashboard/reviews/actions";

interface DashboardReviewCardProps {
  review: Review;
}

export function DashboardReviewCard({ review }: DashboardReviewCardProps) {
  const [deleting, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  const onDelete = () => {
    if (!confirm(`Delete review by ${review.customer_name}?`)) return;
    setError(null);
    startTransition(async () => {
      const res = await deleteReview(review.id);
      if (!res.ok) setError(res.error ?? "Could not delete.");
    });
  };

  return (
    <Card className="relative h-full p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-3.5 w-3.5 ${i < review.rating ? "fill-current" : "opacity-25"}`}
            />
          ))}
        </div>
        <SourceBadge source={review.source} />
      </div>
      <p className="mt-4 text-sm text-foreground/90 leading-relaxed line-clamp-5">
        &ldquo;{review.review_text}&rdquo;
      </p>
      <div className="mt-5 flex items-center justify-between gap-3 border-t border-border/60 pt-4">
        <div>
          <div className="text-sm font-medium text-foreground">
            {review.customer_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString()}
          </div>
        </div>
        <button
          type="button"
          onClick={onDelete}
          disabled={deleting}
          aria-label="Delete review"
          className="grid h-8 w-8 place-items-center rounded-md border border-border bg-surface-2 text-muted-foreground hover:text-destructive hover:bg-surface-3 transition-colors"
        >
          {deleting ? (
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
          ) : (
            <Trash2 className="h-3.5 w-3.5" />
          )}
        </button>
      </div>
      {error ? (
        <p className="mt-3 text-xs text-destructive">{error}</p>
      ) : null}
    </Card>
  );
}
