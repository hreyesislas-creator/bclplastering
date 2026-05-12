import Link from "next/link";
import { Mail, Phone, MapPin, MessageCircle } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Separator } from "@/components/ui/separator";
import { LogoBadge } from "./logo-badge";
import { site } from "@/lib/site";
import { services } from "@/data/services";
import { getSiteSettings } from "@/lib/settings";

export async function Footer() {
  const settings = await getSiteSettings();
  return (
    <footer className="mt-24 border-t border-border/60 bg-surface/40">
      <Container>
        <div className="grid gap-10 py-16 md:grid-cols-4">
          <div className="md:col-span-1">
            <Link
              href="/"
              aria-label={`${site.name} home`}
              className="inline-flex transition-opacity hover:opacity-100"
            >
              <LogoBadge
                alt={site.name}
                size="md"
                imageClassName="h-16 w-auto"
              />
            </Link>
            <p className="mt-5 text-sm text-muted-foreground max-w-xs leading-relaxed">
              Family-owned California craftsmanship. Premium stucco, plaster,
              and full home remodels across the Inland Empire — with two
              decades of project photos to prove it.
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              {site.license} · Bonded · Insured
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Services
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-foreground transition-colors"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Service Areas
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              {settings.service_areas.slice(0, 7).map((c) => (
                <li key={c}>{c}, CA</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li>
                <a
                  href={`tel:${settings.phone.replace(/\D/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Phone className="h-4 w-4 text-gold" /> {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={settings.whatsapp}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-gold" /> WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email}`}
                  className="inline-flex items-center gap-2 hover:text-foreground transition-colors"
                >
                  <Mail className="h-4 w-4 text-gold" /> {settings.email}
                </a>
              </li>
              <li className="inline-flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> {site.address}
              </li>
              <li className="text-xs">{site.hours}</li>
            </ul>
          </div>
        </div>

        <Separator />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-6 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link href="/about" className="hover:text-foreground">About</Link>
            <Link href="/contact" className="hover:text-foreground">Contact</Link>
            <Link href="/login" className="hover:text-foreground">Admin</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
}
