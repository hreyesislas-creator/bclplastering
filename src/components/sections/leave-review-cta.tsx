import Link from "next/link";
import { Star, ArrowUpRight } from "lucide-react";
import type { SiteSettings } from "@/lib/settings";
import { Container } from "@/components/ui/container";
import { Reveal } from "./reveal";

interface LeaveReviewCtaProps {
  social: SiteSettings["social_links"];
}

const sources: Array<{
  key: keyof SiteSettings["social_links"];
  label: string;
  hint: string;
  className: string;
}> = [
  {
    key: "google",
    label: "Google",
    hint: "Most weight for local search",
    className:
      "border-brand-google/40 bg-brand-google/10 text-[oklch(0.86_0.16_82)] hover:bg-brand-google/15",
  },
  {
    key: "yelp",
    label: "Yelp",
    hint: "Helps homeowners shopping reviews",
    className:
      "border-brand-yelp/40 bg-brand-yelp/10 text-[oklch(0.78_0.18_25)] hover:bg-brand-yelp/15",
  },
  {
    key: "facebook",
    label: "Facebook",
    hint: "Reaches our community network",
    className:
      "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/15",
  },
];

export function LeaveReviewCta({ social }: LeaveReviewCtaProps) {
  const targets = sources.filter((s) => Boolean(social[s.key]));
  if (targets.length === 0) return null;

  return (
    <section className="py-16 sm:py-24">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-3xl border border-border surface-elevated px-6 sm:px-10 py-10 sm:py-14">
            <div
              aria-hidden
              className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold/10 blur-3xl"
            />
            <div className="relative grid gap-8 lg:grid-cols-12 lg:items-center">
              <div className="lg:col-span-7">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                  <Star className="h-3.5 w-3.5 fill-current" />
                  We work for word of mouth
                </span>
                <h2 className="h-display mt-4 text-3xl sm:text-4xl font-semibold text-foreground">
                  Worked with us?{" "}
                  <span className="text-gold-gradient">
                    Leave a review.
                  </span>
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-muted-foreground leading-relaxed">
                  Five-star reviews are how Inland Empire homeowners find us.
                  Two minutes from you keeps a family-owned crew busy — thank
                  you in advance.
                </p>
              </div>

              <div className="lg:col-span-5">
                <ul className="grid gap-2.5">
                  {targets.map((s) => (
                    <li key={s.key}>
                      <Link
                        href={social[s.key]!}
                        target="_blank"
                        rel="noreferrer"
                        className={`group flex items-center justify-between gap-3 rounded-xl border px-4 py-3.5 transition-colors ${s.className}`}
                      >
                        <div>
                          <div className="text-sm font-semibold">
                            Leave a review on {s.label}
                          </div>
                          <div className="text-[11px] opacity-80">{s.hint}</div>
                        </div>
                        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
