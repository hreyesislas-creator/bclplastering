/**
 * Convert any common YouTube URL form into a canonical /embed URL.
 *
 *   https://www.youtube.com/watch?v=ABC123      → https://www.youtube.com/embed/ABC123
 *   https://youtu.be/ABC123                     → https://www.youtube.com/embed/ABC123
 *   https://www.youtube.com/shorts/ABC123       → https://www.youtube.com/embed/ABC123
 *   https://www.youtube.com/embed/ABC123        → https://www.youtube.com/embed/ABC123
 *
 * Returns `null` for empty or unrecognised input so callers can
 * fall back cleanly.
 */
export function normalizeYoutubeUrl(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  const id = extractYoutubeId(trimmed);
  if (!id) return null;

  return `https://www.youtube.com/embed/${id}`;
}

/** Extracts the 11-character video id from any common YouTube URL form. */
export function extractYoutubeId(raw: string): string | null {
  // Bare id (rare paste, but handle it)
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  let url: URL;
  try {
    url = new URL(raw);
  } catch {
    return null;
  }

  const host = url.hostname.replace(/^www\./, "").toLowerCase();

  if (host === "youtu.be") {
    return cleanId(url.pathname.replace(/^\//, ""));
  }

  if (host === "youtube.com" || host === "m.youtube.com") {
    if (url.pathname === "/watch") {
      return cleanId(url.searchParams.get("v"));
    }
    const m = url.pathname.match(/^\/(embed|shorts|live|v)\/([a-zA-Z0-9_-]{11})/);
    if (m) return m[2];
  }

  return null;
}

function cleanId(value: string | null): string | null {
  if (!value) return null;
  const id = value.split(/[?&/]/)[0];
  return /^[a-zA-Z0-9_-]{11}$/.test(id) ? id : null;
}

/**
 * Returns the YouTube thumbnail URL for an embed URL or video id.
 * Used in the gallery and dashboard preview cards.
 */
export function youtubeThumbnail(embedOrId: string | null | undefined): string | null {
  if (!embedOrId) return null;
  const id = extractYoutubeId(embedOrId) ?? embedOrId;
  if (!/^[a-zA-Z0-9_-]{11}$/.test(id)) return null;
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}
