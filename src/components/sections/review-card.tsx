import { Star, Quote } from "lucide-react";
import type { Review } from "@/types/db";
import { Card } from "@/components/ui/card";
import { SourceBadge } from "./source-badge";
import { cn } from "@/lib/utils";

interface ReviewCardProps {
  review: Review;
  className?: string;
  featured?: boolean;
}

export function ReviewCard({ review, className, featured }: ReviewCardProps) {
  return (
    <Card
      className={cn(
        "relative h-full p-7 hover-halo",
        featured && "ring-1 ring-gold/30",
        className
      )}
    >
      <Quote className="absolute right-5 top-5 h-9 w-9 text-gold/15" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-gold">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={cn(
                "h-4 w-4",
                i < review.rating ? "fill-current" : "opacity-25"
              )}
            />
          ))}
        </div>
        <SourceBadge source={review.source} />
      </div>
      <p
        className={cn(
          "mt-5 text-foreground/90 leading-relaxed",
          featured ? "text-lg" : "text-sm"
        )}
      >
        &ldquo;{review.review_text}&rdquo;
      </p>
      <div className="mt-7 flex items-center gap-3 border-t border-border/60 pt-5">
        <div className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-sand to-gold-soft text-sand-foreground font-medium text-sm">
          {review.customer_name
            .split(" ")
            .map((s) => s[0])
            .slice(0, 2)
            .join("")}
        </div>
        <div>
          <div className="text-sm font-medium text-foreground">
            {review.customer_name}
          </div>
          <div className="text-xs text-muted-foreground">
            {new Date(review.created_at).toLocaleDateString(undefined, {
              year: "numeric",
              month: "long",
            })}
          </div>
        </div>
      </div>
    </Card>
  );
}
