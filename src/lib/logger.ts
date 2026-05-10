/**
 * Production-safe logger.
 *
 *   logger.debug(...) — silent in production, useful for "not configured" notes
 *   logger.info(...)  — kept everywhere, for important transitions
 *   logger.warn(...)  — kept everywhere
 *   logger.error(...) — kept everywhere, for real failures
 *
 * Always include a `[scope]` prefix as the first arg so log lines
 * are greppable in production logs.
 */

const isProd = process.env.NODE_ENV === "production";

function emit(method: "log" | "info" | "warn" | "error", args: unknown[]) {
  if (typeof console === "undefined") return;
  // eslint-disable-next-line no-console
  console[method](...args);
}

export const logger = {
  debug(...args: unknown[]) {
    if (isProd) return;
    emit("log", args);
  },
  info(...args: unknown[]) {
    emit("info", args);
  },
  warn(...args: unknown[]) {
    emit("warn", args);
  },
  error(...args: unknown[]) {
    emit("error", args);
  },
} as const;
