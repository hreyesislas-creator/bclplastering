import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { LoginForm } from "./login-form";
import { Container } from "@/components/ui/container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

interface PageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const { next } = await searchParams;

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden py-16">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(60% 50% at 70% 0%, oklch(0.34 0.05 78 / 0.55), transparent 70%), radial-gradient(50% 60% at 0% 30%, oklch(0.78 0.11 78 / 0.10), transparent 70%)",
        }}
      />
      <div className="absolute inset-0 dot-grid opacity-40 -z-10" />

      <Container>
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            aria-label={`${site.name} home`}
            className="mx-auto flex w-fit items-center justify-center transition-opacity hover:opacity-90"
          >
            <Image
              src="/logo/bcl-logo.png"
              alt={site.name}
              width={400}
              height={400}
              priority
              sizes="96px"
              className="h-24 w-auto"
            />
          </Link>

          <p className="mt-3 text-center text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
            Admin · Sign in
          </p>

          <div className="mt-7 rounded-2xl border border-border surface-elevated p-7 sm:p-9">
            <h1 className="h-display text-3xl sm:text-4xl font-semibold text-foreground">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Welcome back. Use the credentials your admin set up in Supabase.
            </p>

            <div className="mt-7">
              <LoginForm next={next} />
            </div>

            <div className="mt-7 flex items-center gap-2 text-xs text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-gold" />
              Sessions are managed by Supabase Auth — encrypted in transit.
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-muted-foreground">
            Having trouble?{" "}
            <Link href="/contact" className="text-foreground hover:text-gold">
              Contact support
            </Link>
            .
          </p>
        </div>
      </Container>
    </main>
  );
}
