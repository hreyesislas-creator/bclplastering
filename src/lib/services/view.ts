/**
 * Shared display shape used by every service-facing UI component
 * (homepage Services section, /services, /services/[slug]).
 *
 * Lives in a client-importable file (no `server-only`) because the
 * card and detail components are client components.
 */
export interface ServiceView {
  id: string;
  slug: string;
  iconKey: string;
  title: string;
  category: string | null;
  short: string;
  description: string;
  bullets: string[];
  startingFrom: string | null;
  imageUrl: string | null;
  featured: boolean;
  sortOrder: number;
}
