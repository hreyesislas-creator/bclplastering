import type { Metadata } from "next";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "@/components/sections/section-heading";
import { CTASection } from "@/components/sections/cta-section";
import { Reveal } from "@/components/sections/reveal";
import { Award, Hammer, ShieldCheck, Users } from "lucide-react";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "BCL Plastering & Building Remodel — family-owned California craftsmanship serving the Inland Empire.",
  alternates: { canonical: "/about" },
};

const values = [
  {
    icon: Hammer,
    title: "Craft over speed",
    body: "We hire people who learned this trade from their families. Prep is never rushed — and that's why our finishes hold up.",
  },
  {
    icon: ShieldCheck,
    title: "Licensed and accountable",
    body: `${site.license}, bonded, and insured. One project manager from the first walk-through through final inspection.`,
  },
  {
    icon: Users,
    title: "Built for homeowners",
    body: "Daily clean-up, clear timelines, and we still pick up the phone — even after the job is done.",
  },
  {
    icon: Award,
    title: `${site.yearsExperience} years of work`,
    body: `${site.homesFinished.toLocaleString()}+ Inland Empire homes finished. Word-of-mouth keeps us booked.`,
  },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative pt-20 sm:pt-28 pb-16 overflow-hidden">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(60% 40% at 70% 0%, oklch(0.78 0.11 78 / 0.10), transparent 70%)",
          }}
        />
        <Container>
          <div className="grid gap-12 lg:grid-cols-12">
            <Reveal className="lg:col-span-7">
              <SectionHeading
                eyebrow="About BCL"
                title={
                  <>
                    Family-owned California{" "}
                    <span className="text-gold-gradient">craftsmanship.</span>
                  </>
                }
                description="BCL Plastering & Building Remodel was founded on a single rule: do the prep right. Two decades and 1,200+ Inland Empire homes later, the rule hasn't changed."
              />
              <p className="mt-6 max-w-2xl text-base text-muted-foreground leading-relaxed">
                We work primarily through referrals across Riverside County and
                its neighbors. Most of our crew has been with us for over a
                decade, and the trades we sub to are the same ones we&apos;ve
                trusted for years. Whether you&apos;ve got a Spanish revival in
                Riverside, a modern build in Eastvale, or an ADU in Perris,
                we&apos;ve probably worked on its cousin — and we treat your
                home like it&apos;s ours.
              </p>
            </Reveal>
            <Reveal className="lg:col-span-5" delay={0.1}>
              <div className="rounded-2xl border border-border surface-elevated p-6 sm:p-8">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  At a glance
                </div>
                <dl className="mt-5 space-y-4 text-sm">
                  <Row label="Founded" value={String(site.established)} />
                  <Row label="License" value={site.license} />
                  <Row label="Crew tenure" value="10+ years average" />
                  <Row label="Headquarters" value={site.address} />
                  <Row label="Specialties" value="Stucco · Plaster · Remodels" />
                  <Row
                    label="Service area"
                    value={`${site.serviceAreas.length}+ cities · IE`}
                  />
                </dl>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="py-20 sm:py-32 bg-surface/30 border-y border-border/60">
        <Container>
          <Reveal>
            <h2 className="font-display text-3xl sm:text-4xl">How we work</h2>
            <p className="mt-3 max-w-2xl text-muted-foreground">
              Four habits we&apos;ve held since the first job we ever bid.
            </p>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map(({ icon: Icon, title, body }, i) => (
              <Reveal key={title} delay={i * 0.06}>
                <div className="rounded-2xl border border-border surface-elevated p-7 hover-halo h-full">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 text-gold ring-1 ring-gold/30">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-semibold text-foreground">
                    {title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                    {body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <CTASection />
    </>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-border/60 pb-4 last:border-0 last:pb-0">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground text-right">{value}</dd>
    </div>
  );
}
