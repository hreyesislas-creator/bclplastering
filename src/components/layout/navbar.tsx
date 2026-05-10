"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { MobileMenu } from "./mobile-menu";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";
import { trackEstimateCta, trackPhone } from "@/lib/analytics/events";

const nav = [
  { href: "/services", label: "Services" },
  { href: "/projects", label: "Projects" },
  { href: "/gallery", label: "Gallery" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
      <Container>
        <div className="flex h-16 items-center justify-between gap-6">
          <Link href="/" className="flex items-center gap-2.5 group">
            <span className="grid h-9 w-9 place-items-center rounded-md bg-gold text-gold-foreground font-display text-lg font-bold transition-transform group-hover:scale-105">
              B
            </span>
            <span className="hidden sm:flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight text-foreground">
                BCL Plastering
              </span>
              <span className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                Building Remodel
              </span>
            </span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {nav.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative px-3.5 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {item.label}
                  {active ? (
                    <span className="absolute inset-x-3 -bottom-0.5 h-px bg-gold" />
                  ) : null}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <a
              href={site.phoneHref}
              onClick={() => trackPhone("navbar")}
              className="hidden md:inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              <Phone className="h-4 w-4" />
              {site.phone}
            </a>
            <Button asChild size="sm" className="hidden sm:inline-flex">
              <Link href="/contact" onClick={() => trackEstimateCta("navbar")}>
                Get a free quote
              </Link>
            </Button>
            <MobileMenu items={nav} />
          </div>
        </div>
      </Container>
    </header>
  );
}
