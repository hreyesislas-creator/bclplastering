import type { Review } from "@/types/db";

export const reviews: Review[] = [
  {
    id: "r_001",
    customer_name: "Maria G.",
    source: "google",
    rating: 5,
    review_text:
      "BCL re-stuccoed our entire home in Riverside. The Santa Barbara smooth finish is flawless — neighbors keep stopping by to ask who did the work. The crew was on-site at 7 AM every morning and cleaned up like they were never there.",
    created_at: "2026-04-21T00:00:00Z",
  },
  {
    id: "r_002",
    customer_name: "David & Susan R.",
    source: "yelp",
    rating: 5,
    review_text:
      "We interviewed five contractors before choosing BCL. They were the only crew who walked our 1928 home and understood lime plaster. The repairs disappeared into the original walls — we genuinely cannot find them.",
    created_at: "2026-03-12T00:00:00Z",
  },
  {
    id: "r_003",
    customer_name: "Jennifer P.",
    source: "thumbtack",
    rating: 5,
    review_text:
      "Full re-stucco on our Eastvale home — three elevations stripped, re-lathed, and finished in a Santa Barbara smooth. Permits, HOA paperwork, and color matching all handled in-house. Delivered on schedule and under our worst-case budget. Would hire them tomorrow.",
    created_at: "2026-02-02T00:00:00Z",
  },
  {
    id: "r_004",
    customer_name: "Carlos M.",
    source: "google",
    rating: 5,
    review_text:
      "Detached ADU in Perris. They handled the architect's stamp through final inspection and matched the existing stucco texture so well that you cannot tell where the original house ends and the ADU begins.",
    created_at: "2025-12-18T00:00:00Z",
  },
  {
    id: "r_005",
    customer_name: "Allison K.",
    source: "yelp",
    rating: 5,
    review_text:
      "Our stucco was hairline-cracking everywhere. BCL came out, identified the failed lath behind the finish, and re-did the elevation properly instead of patching. A year later, zero new cracks.",
    created_at: "2025-10-04T00:00:00Z",
  },
  {
    id: "r_006",
    customer_name: "Tom B.",
    source: "thumbtack",
    rating: 5,
    review_text:
      "Outdoor living room in Corona — stucco columns, exposed beams, and a fireplace finished in Santa Barbara smooth. They drew the design with us on-site and built exactly what we pictured.",
    created_at: "2025-08-19T00:00:00Z",
  },
];
