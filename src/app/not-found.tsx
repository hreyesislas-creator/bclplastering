import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

export default function NotFound() {
  return (
    <Container>
      <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
        <span className="text-xs uppercase tracking-[0.22em] text-gold">
          Error 404
        </span>
        <h1 className="h-display mt-3 text-4xl sm:text-5xl font-semibold">
          Page not found.
        </h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for moved or never existed. Head back
          home or browse our projects.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">Browse projects</Link>
          </Button>
        </div>
      </div>
    </Container>
  );
}
