"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { site } from "@/lib/site";

interface MobileMenuProps {
  items: { href: string; label: string }[];
}

export function MobileMenu({ items }: MobileMenuProps) {
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="lg:hidden grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-surface-2 transition-colors"
      >
        <Menu className="h-5 w-5" />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex h-16 items-center justify-between px-5 border-b border-border/50">
              <span className="font-display text-base font-semibold">Menu</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-md text-foreground hover:bg-surface-2 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav className="flex flex-col gap-1 px-5 py-6">
              {items.map((item, i) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.04 * i, duration: 0.25 }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between border-b border-border/40 py-4 text-lg font-medium text-foreground"
                  >
                    {item.label}
                    <span className="text-muted-foreground">→</span>
                  </Link>
                </motion.div>
              ))}
            </nav>

            <div className="px-5 mt-4 flex flex-col gap-3">
              <Button asChild size="lg">
                <Link href="/contact" onClick={() => setOpen(false)}>
                  Get a free quote
                </Link>
              </Button>
              <a
                href={site.phoneHref}
                className="inline-flex items-center justify-center gap-2 h-12 rounded-md border border-border text-sm font-medium text-foreground"
              >
                <Phone className="h-4 w-4" />
                {site.phone}
              </a>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
