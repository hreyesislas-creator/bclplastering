"use client";

import * as React from "react";
import { Loader2, AlertCircle, CheckCircle2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { createReview } from "@/app/dashboard/reviews/actions";
import { cn } from "@/lib/utils";

export function AddReviewForm() {
  const [rating, setRating] = React.useState(5);
  const [pending, setPending] = React.useState(false);
  const [feedback, setFeedback] = React.useState<
    { kind: "ok" } | { kind: "error"; message: string } | null
  >(null);
  const formRef = React.useRef<HTMLFormElement | null>(null);

  async function handleSubmit(formData: FormData) {
    setPending(true);
    setFeedback(null);
    try {
      formData.set("rating", String(rating));
      const res = await createReview(formData);
      if (!res.ok) {
        setFeedback({ kind: "error", message: res.error ?? "Could not save." });
        return;
      }
      setFeedback({ kind: "ok" });
      formRef.current?.reset();
      setRating(5);
    } finally {
      setPending(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="customer_name">Customer name</Label>
          <Input
            id="customer_name"
            name="customer_name"
            required
            placeholder="Maria G."
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="source">Source</Label>
          <Select id="source" name="source" defaultValue="google">
            <option value="google">Google</option>
            <option value="yelp">Yelp</option>
            <option value="thumbtack">Thumbtack</option>
            <option value="facebook">Facebook</option>
            <option value="direct">Direct</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Rating</Label>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => {
            const value = i + 1;
            const filled = value <= rating;
            return (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} star${value === 1 ? "" : "s"}`}
                className={cn(
                  "grid h-9 w-9 place-items-center rounded-md transition-colors",
                  filled ? "text-gold" : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Star
                  className={cn("h-5 w-5", filled && "fill-current")}
                />
              </button>
            );
          })}
          <span className="ml-3 text-sm text-muted-foreground">{rating} / 5</span>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="review_text">Review text</Label>
        <Textarea
          id="review_text"
          name="review_text"
          rows={4}
          required
          placeholder="What the customer said about working with you…"
        />
      </div>

      {feedback?.kind === "error" ? (
        <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3.5 py-2.5 text-sm text-destructive">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
          <p>{feedback.message}</p>
        </div>
      ) : null}
      {feedback?.kind === "ok" ? (
        <div className="flex items-start gap-2 rounded-lg border border-emerald-400/30 bg-emerald-500/10 px-3.5 py-2.5 text-sm text-emerald-300">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
          <p>Review added — live on the public site.</p>
        </div>
      ) : null}

      <Button type="submit" disabled={pending}>
        {pending ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Saving…
          </>
        ) : (
          "Add review"
        )}
      </Button>
    </form>
  );
}
