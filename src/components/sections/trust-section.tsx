import {
  Award,
  ShieldCheck,
  Clock,
  Hammer,
  CalendarCheck,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { SectionHeading } from "./section-heading";
import { Reveal } from "./reveal";
import { site } from "@/lib/site";

interface TrustItem {
  icon: LucideIcon;
  value: string;
  label: string;
  caption: string;
}

const items: TrustItem[] = [
  {
    icon: Award,
    value: site.yearsExperience,
    label: "Years on the trowel",
    caption: "Family-owned since 2004 with crew tenure to match.",
  },
  {
    icon: Hammer,
    value: `${site.homesFinished.toLocaleString()}+`,
    label: "Homes finished",
    caption: "Stucco, plaster, and full remodels across the Inland Empire.",
  },
  {
    icon: ShieldCheck,
    value: "5.0 ★",
    label: `${site.reviewsCount}+ reviews`,
    caption: "Verified on Google, Yelp, and Thumbtack.",
  },
  {
    icon: CalendarCheck,
    value: "Free",
    label: "On-site estimate",
    caption: `Written quote within ${site.responseWindow}, no obligation.`,
  },
  {
    icon: Clock,
    value: site.responseWindow,
    label: "Response window",
    caption: "We pick up the phone — and arrive when we say we will.",
  },
  {
    icon: MapPin,
    value: `${site.serviceAreas.length}+`,
    label: "Cities served",
    caption: "Riverside, Moreno Valley, Corona, and the surrounding cities.",
  },
];

export function TrustSection() {
  return (
    <section className="relative py-20 sm:py-32 overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(70% 50% at 50% 0%, oklch(0.78 0.11 78 / 0.06), transparent 70%)",
        }}
      />

      <Container>
        <Reveal>
          <SectionHeading
            eyebrow="Why homeowners choose BCL"
            title={
              <>
                Built on{" "}
                <span className="text-gold-gradient">craftsmanship</span> and a
                phone that actually rings.
              </>
            }
            description="Two decades of finishes that hold up. Crews that arrive on time. A project manager you talk to from the first walk-through to the final inspection."
            align="center"
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <Reveal key={item.label} delay={i * 0.05}>
                <div className="group relative h-full rounded-2xl border border-border surface-elevated p-7 hover-halo">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                  />
                  <div className="relative flex items-start justify-between gap-4">
                    <div className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-gold/30 to-gold/5 text-gold ring-1 ring-gold/30">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="text-right">
                      <div className="font-display text-3xl sm:text-4xl font-semibold text-gold-gradient leading-none">
                        {item.value}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6">
                    <div className="text-sm font-medium uppercase tracking-[0.18em] text-foreground/90">
                      {item.label}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {item.caption}
                    </p>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
