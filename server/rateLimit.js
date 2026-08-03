// Minimal in-memory sliding-window rate limiter. Single-process/in-memory
// is intentional — this launch doesn't have a shared store, and resetting
// on a server restart is an acceptable tradeoff for a low-volume audit
// form. Disabled outside production so local/dev testing is never blocked.

const WINDOW_MS = 60 * 60 * 1000;
const MAX_REQUESTS = 5;

const hits = new Map();

/** Returns true if `key` (e.g. `ip:1.2.3.4` or `email:x@y.com`) has
 * exceeded MAX_REQUESTS within the last hour. Always false outside
 * production. */
export function isRateLimited(key) {
  if (process.env.NODE_ENV !== 'production') return false;

  const now = Date.now();
  const timestamps = (hits.get(key) || []).filter((t) => now - t < WINDOW_MS);
  timestamps.push(now);
  hits.set(key, timestamps);

  return timestamps.length > MAX_REQUESTS;
}
