import type { Metadata } from "next";
import {
  Mail,
  MapPin,
  Phone,
  Clock,
  MessageCircle,
  ShieldCheck,
  Star,
  CalendarCheck,
  Camera,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/sections/section-heading";
import { ContactForm } from "@/components/forms/contact-form";
import { Reveal } from "@/components/sections/reveal";
import { FaqSection } from "@/components/sections/faq-section";
import { TrackAnchor } from "@/components/analytics/track-anchor";
import { JsonLd } from "@/components/seo/json-ld";
import { faqSchema } from "@/lib/seo/jsonld";
import { faqs } from "@/data/faqs";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact & Free Estimate",
  description:
    "Request a free on-site estimate from BCL Plastering. Send photos, a phone number, and we'll handle the rest.",
  alternates: { canonical: "/contact" },
};

const trustPills = [
  { icon: Star, label: `5.0 · ${site.reviewsCount}+ reviews` },
  { icon: ShieldCheck, label: site.license },
  { icon: CalendarCheck, label: `Free estimate in ${site.responseWindow}` },
];

const contactRows = [
  {
    icon: Phone,
    label: "Phone",
    value: site.phone,
    href: site.phoneHref,
    sub: "Mon – Sat · 7 AM – 6 PM",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "Send photos directly",
    href: site.whatsapp,
    external: true,
    sub: "Fastest response — usually within an hour",
  },
  {
    icon: Mail,
    label: "Email",
    value: site.email,
    href: `mailto:${site.email}`,
  },
  {
    icon: MapPin,
    label: "Service area",
    value: site.address,
    sub: site.serviceAreas.slice(0, 4).join(" · ") + " · and surrounding cities",
  },
  { icon: Clock, label: "Hours", value: site.hours },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={faqSchema(faqs)} id="ld-faq" />
      <section className="relative pt-20 sm:pt-28 pb-20 sm:pb-28 overflow-hidden">
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
            {/* Left column: copy + contact rows + WhatsApp */}
            <Reveal className="lg:col-span-5">
              <SectionHeading
                eyebrow="Free estimate"
                title={
                  <>
                    Tell us about{" "}
                    <span className="text-gold-gradient">the project.</span>
                  </>
                }
                description={`Send photos, a phone number, and a few words — a project manager will be in touch within ${site.responseWindow} to schedule your free on-site estimate.`}
              />

              <div className="mt-7 flex flex-wrap gap-2">
                {trustPills.map(({ icon: Icon, label }) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground/85"
                  >
                    <Icon className="h-3.5 w-3.5 text-gold" />
                    {label}
                  </span>
                ))}
              </div>

              <ul className="mt-10 space-y-5">
                {contactRows.map(({ icon: Icon, label, value, href, sub, external }) => {
                  const inner = (
                    <span className="text-foreground hover:text-gold transition-colors">
                      {value}
                    </span>
                  );
                  return (
                    <li key={label} className="flex items-start gap-4">
                      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-gold/25 to-gold/5 text-gold ring-1 ring-gold/30">
                        <Icon className="h-4 w-4" />
                      </span>
                      <div className="min-w-0">
                        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                          {label}
                        </div>
                        {href ? (
                          external ? (
                            <TrackAnchor
                              event={
                                href.startsWith("https://wa.me")
                                  ? "whatsapp_click"
                                  : "contact_cta"
                              }
                              source="contact_rows"
                              href={href}
                              target="_blank"
                              rel="noreferrer"
                              className="block"
                            >
                              {inner}
                            </TrackAnchor>
                          ) : (
                            <TrackAnchor
                              event={
                                href.startsWith("tel:")
                                  ? "phone_click"
                                  : "contact_cta"
                              }
                              source="contact_rows"
                              href={href}
                              className="block"
                            >
                              {inner}
                            </TrackAnchor>
                          )
                        ) : (
                          <div className="text-foreground">{value}</div>
                        )}
                        {sub ? (
                          <div className="mt-0.5 text-xs text-muted-foreground">
                            {sub}
                          </div>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>

              {/* WhatsApp panel */}
              <div className="mt-10 rounded-2xl border border-emerald-400/20 bg-emerald-500/5 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-emerald-500/15 text-emerald-300">
                    <MessageCircle className="h-5 w-5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-foreground">
                      Faster: send us photos on WhatsApp
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      Snap and send — no form to fill out. We&apos;ll reply with
                      a ballpark and a time to come measure.
                    </p>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="mt-4 border-emerald-400/40 text-emerald-300 hover:bg-emerald-500/10 hover:text-emerald-200"
                    >
                      <TrackAnchor
                        event="whatsapp_click"
                        source="contact_panel"
                        href={site.whatsapp}
                        target="_blank"
                        rel="noreferrer"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Open WhatsApp
                      </TrackAnchor>
                    </Button>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right column: form */}
            <Reveal className="lg:col-span-7" delay={0.1}>
              <div className="rounded-3xl border border-border surface-elevated p-6 sm:p-10">
                <div className="mb-8 flex items-start gap-3 rounded-xl border border-border bg-background/40 px-4 py-3">
                  <Camera className="mt-0.5 h-4 w-4 text-gold shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Tip — adding 3–5 project photos lets us prepare a written
                    quote before we arrive. We can usually estimate 70% of the
                    work just from your photos.
                  </p>
                </div>
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      <FaqSection items={faqs} />
    </>
  );
}
