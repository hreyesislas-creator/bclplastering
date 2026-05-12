import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { getPublicServices } from "@/lib/services";
import { site } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const services = await getPublicServices();
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? site.url;
  const now = new Date();

  const staticRoutes = [
    "",
    "/services",
    "/projects",
    "/gallery",
    "/reviews",
    "/about",
    "/contact",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })),
    ...services.map((s) => ({
      url: `${base}/services/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...projects.map((p) => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(p.created_at),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
