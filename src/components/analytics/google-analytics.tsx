import Script from "next/script";

interface GoogleAnalyticsProps {
  gaId: string;
}

/**
 * Loads gtag.js and initialises GA4. Renders nothing when gaId is
 * empty so analytics stay opt-in via env.
 */
export function GoogleAnalytics({ gaId }: GoogleAnalyticsProps) {
  if (!gaId) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          window.gtag = gtag;
          gtag('js', new Date());
          gtag('config', '${gaId}', { send_page_view: true });
        `}
      </Script>
    </>
  );
}
