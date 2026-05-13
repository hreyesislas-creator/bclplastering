export const site = {
  name: "BCL Plastering & Building Remodel",
  shortName: "BCL Plastering",
  tagline:
    "Inland Empire exterior stucco, plastering, and restoration — built to last.",
  description:
    "Premium exterior stucco, custom finishes, and full-elevation restoration across the Inland Empire. Hand-troweled finishes, licensed craftsmanship, and a project manager who picks up the phone.",
  url: "https://www.bclplastering.com",
  phone: "(951) 742-3719",
  phoneHref: "tel:+19517423719",
  email: "info@bclplastering.com",
  whatsapp: "https://wa.me/19517423719",
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
