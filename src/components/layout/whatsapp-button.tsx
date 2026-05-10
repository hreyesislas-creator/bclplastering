"use client";

import { motion } from "framer-motion";
import { site } from "@/lib/site";
import { trackWhatsApp } from "@/lib/analytics/events";

/**
 * Floating circular WhatsApp button. Hidden on mobile because the
 * FloatingContactBar already exposes a WhatsApp action there.
 */
export function WhatsAppButton() {
  return (
    <motion.a
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.6, type: "spring", stiffness: 280, damping: 18 }}
      href={site.whatsapp}
      target="_blank"
      rel="noreferrer"
      aria-label="Message us on WhatsApp"
      onClick={() => trackWhatsApp("floating")}
      className="hidden md:flex fixed bottom-6 right-6 z-30 h-14 w-14 items-center justify-center rounded-full bg-emerald-500 text-white shadow-elev hover:bg-emerald-400 transition-colors"
    >
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-6 w-6"
        aria-hidden="true"
      >
        <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.62-6.001C.122 5.281 5.403 0 11.892 0c3.149.001 6.105 1.226 8.331 3.452 2.225 2.227 3.451 5.184 3.45 8.328 0 6.488-5.281 11.769-11.769 11.769a11.78 11.78 0 0 1-5.633-1.43L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.86 9.86 0 0 0 1.715 5.557l-.999 3.648 3.773-.904zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01a1.099 1.099 0 0 0-.794.372c-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
      </svg>
    </motion.a>
  );
}
