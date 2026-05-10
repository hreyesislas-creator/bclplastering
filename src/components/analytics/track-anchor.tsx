"use client";

import * as React from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics/events";

interface TrackAnchorProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Event name to fire on click. */
  event: AnalyticsEvent;
  /** Where the click happened — e.g. "hero", "footer". */
  source: string;
}

/**
 * Drop-in `<a>` replacement that fires an analytics event on click.
 * Lets server components (Footer, CTASection, contact page rows)
 * track interactions without becoming client components themselves.
 */
export function TrackAnchor({ event, source, onClick, ...rest }: TrackAnchorProps) {
  return (
    <a
      {...rest}
      onClick={(e) => {
        trackEvent(event, { source });
        onClick?.(e);
      }}
    />
  );
}
