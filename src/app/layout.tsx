import type { Metadata, Viewport } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { site } from "@/lib/site";
import { env, logEnvSummary } from "@/lib/env";
import { GoogleAnalytics } from "@/components/analytics/google-analytics";
import { MetaPixel } from "@/components/analytics/meta-pixel";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0e0d0c",
  width: "device-width",
  initialScale: 1,
  colorScheme: "dark",
};

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: {
    default: `${site.name} — California stucco, plastering & remodels`,
    template: `%s · ${site.shortName}`,
  },
  description: site.description,
  applicationName: site.shortName,
  keywords: [
    "stucco contractor Riverside",
    "stucco repair Inland Empire",
    "Moreno Valley stucco",
    "Corona stucco contractor",
    "Eastvale remodel",
    "Menifee plastering",
    "Santa Barbara finish stucco",
    "Venetian plaster",
    "drywall repair Riverside",
    "exterior remodeling Inland Empire",
  ],
  authors: [{ name: site.name }],
  creator: site.name,
  publisher: site.shortName,
  category: "Construction",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: env.siteUrl,
    siteName: site.shortName,
    title: site.name,
    description: site.description,
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: `${site.shortName} — premium stucco & remodels in the Inland Empire`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: ["/og.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: { icon: "/favicon.ico" },
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  verification: {
    google: env.googleSiteVerification || undefined,
    other: env.bingSiteVerification
      ? { "msvalidate.01": env.bingSiteVerification }
      : undefined,
  },
  other: {
    "geo.region": "US-CA",
    "geo.placename": "Riverside, California",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  // Log integration summary once per server boot.
  logEnvSummary();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
        <GoogleAnalytics gaId={env.gaId} />
        <MetaPixel pixelId={env.metaPixelId} />
      </body>
    </html>
  );
}
