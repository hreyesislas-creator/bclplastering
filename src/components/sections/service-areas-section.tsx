import Link from "next/link";
import { MapPin, ArrowRight, Phone } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Reveal } from "./reveal";
import { SectionHeading } from "./section-heading";
import { site } from "@/lib/site";

export function ServiceAreasSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 dot-grid opacity-50"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(50% 40% at 50% 0%, oklch(0.78 0.11 78 / 0.10), transparent 70%)",
        }}
      />

      <Container>
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <SectionHeading
              eyebrow="Service areas"
              title={
                <>
                  Built for the{" "}
                  <span className="text-gold-gradient">Inland Empire.</span>
                </>
              }
              description="We work primarily across Riverside County and the surrounding cities — close enough to be on-site within an hour."
            />

            <div className="mt-8 space-y-4">
              <p className="text-sm text-muted-foreground leading-relaxed max-w-md">
                Don&apos;t see your city? Give us a call — we travel for the
                right project, and we&apos;re honest if we&apos;re not the right
                crew for it.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button asChild size="lg">
                  <Link href="/contact">
                    Check my city <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href={site.phoneHref}>
                    <Phone className="h-4 w-4" />
                    {site.phone}
                  </a>
                </Button>
              </div>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-7" delay={0.1}>
            <div className="relative rounded-3xl border border-border surface-elevated p-6 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gold/10 blur-3xl"
              />
              <div className="grid gap-3 sm:grid-cols-2">
                {site.serviceAreas.map((c, i) => (
                  <div
                    key={c}
                    className="group relative flex items-center justify-between gap-3 rounded-xl border border-border bg-surface px-5 py-4 transition-colors hover:border-gold/40 hover:bg-surface-2"
                  >
                    <div className="flex items-center gap-3">
                      <span className="grid h-8 w-8 place-items-center rounded-md bg-gold/10 text-gold">
                        <MapPin className="h-4 w-4" />
                      </span>
                      <div>
                        <div className="text-sm font-medium text-foreground">
                          {c}, CA
                        </div>
                        <div className="text-[11px] uppercase tracking-wider text-muted-foreground">
                          Active service area
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
