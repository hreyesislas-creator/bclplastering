import type { Project, Review } from "@/types/db";
import type { ServiceItem } from "@/data/services";
import type { SiteSettings } from "@/lib/settings";
import { site } from "@/lib/site";

const ORG_TYPE = "GeneralContractor";

export function localBusinessSchema(opts: {
  settings: SiteSettings;
  reviews: Review[];
  baseUrl: string;
}) {
  const { settings, reviews, baseUrl } = opts;
  const ratingValue =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "5.0";
  const reviewCount = Math.max(site.reviewsCount, reviews.length);
  const phoneE164 = settings.phone.replace(/\D/g, "");

  return {
    "@context": "https://schema.org",
    "@type": ORG_TYPE,
    "@id": `${baseUrl}#organization`,
    name: site.name,
    alternateName: site.shortName,
    description: site.description,
    url: baseUrl,
    telephone: phoneE164 ? `+${phoneE164.length === 10 ? "1" + phoneE164 : phoneE164}` : undefined,
    email: settings.email,
    image: `${baseUrl}/og.png`,
    logo: `${baseUrl}/og.png`,
    priceRange: "$$",
    foundingDate: String(site.established),
    address: {
      "@type": "PostalAddress",
      addressLocality: "Riverside",
      addressRegion: "CA",
      addressCountry: "US",
    },
    areaServed: settings.service_areas.map((name) => ({
      "@type": "City",
      name: `${name}, CA`,
    })),
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ],
        opens: "07:00",
        closes: "18:00",
      },
    ],
    aggregateRating:
      reviews.length > 0
        ? {
            "@type": "AggregateRating",
            ratingValue,
            reviewCount: String(reviewCount),
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    review: reviews.slice(0, 10).map((r) => ({
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: String(r.rating),
        bestRating: "5",
        worstRating: "1",
      },
      author: { "@type": "Person", name: r.customer_name },
      datePublished: r.created_at,
      reviewBody: r.review_text,
      publisher:
        r.source !== "direct"
          ? {
              "@type": "Organization",
              name:
                r.source === "google"
                  ? "Google"
                  : r.source === "yelp"
                    ? "Yelp"
                    : r.source === "thumbtack"
                      ? "Thumbtack"
                      : "Facebook",
            }
          : undefined,
    })),
    sameAs: Object.values(settings.social_links).filter(
      (v): v is string => typeof v === "string" && v.length > 0
    ),
  };
}

export function serviceSchema(opts: {
  service: ServiceItem;
  settings: SiteSettings;
  baseUrl: string;
}) {
  const { service, settings, baseUrl } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.description,
    serviceType: service.title,
    provider: {
      "@type": ORG_TYPE,
      name: site.name,
      url: baseUrl,
      "@id": `${baseUrl}#organization`,
    },
    areaServed: settings.service_areas.map((name) => ({
      "@type": "City",
      name: `${name}, CA`,
    })),
    url: `${baseUrl}/services/${service.slug}`,
    offers: service.startingFrom
      ? {
          "@type": "Offer",
          priceSpecification: {
            "@type": "PriceSpecification",
            price: service.startingFrom,
            priceCurrency: "USD",
          },
        }
      : undefined,
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function projectSchema(opts: {
  project: Project;
  baseUrl: string;
}) {
  const { project, baseUrl } = opts;
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: project.title,
    description: project.description,
    url: `${baseUrl}/projects/${project.slug}`,
    image: project.cover_image_url || undefined,
    locationCreated: {
      "@type": "Place",
      name: project.city,
    },
    creator: {
      "@type": ORG_TYPE,
      name: site.name,
      url: baseUrl,
      "@id": `${baseUrl}#organization`,
    },
  };
}
