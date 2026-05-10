export const site = {
  name: "BCL Plastering & Building Remodel",
  shortName: "BCL Plastering",
  tagline: "Inland Empire stucco, plastering, and remodels — built to last.",
  description:
    "Premium stucco, plastering, and home remodeling across the Inland Empire. Hand-troweled finishes, licensed craftsmanship, and a project manager who picks up the phone.",
  url: "https://www.bclplastering.com",
  phone: "(951) 555-0123",
  phoneHref: "tel:+19515550123",
  email: "info@bclplastering.com",
  whatsapp: "https://wa.me/19515550123",
  address: "Riverside County, California",
  hours: "Mon – Sat · 7:00 AM – 6:00 PM",
  license: "CSLB Lic. #1098765",
  established: 2004,
  yearsExperience: "20+",
  reviewsCount: 220,
  homesFinished: 1200,
  responseWindow: "48 hours",
  serviceAreas: [
    "Riverside",
    "Moreno Valley",
    "Perris",
    "Corona",
    "Menifee",
    "Eastvale",
    "Jurupa Valley",
    "Norco",
    "Mira Loma",
  ],
  social: {
    instagram: "https://instagram.com/bclplastering",
    facebook: "https://facebook.com/bclplastering",
    yelp: "https://yelp.com/biz/bclplastering",
    google: "https://g.page/bclplastering",
  },
} as const;

export type Site = typeof site;
