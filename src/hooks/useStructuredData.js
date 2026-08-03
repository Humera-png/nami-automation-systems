import { useEffect } from 'react';

/** Injects a JSON-LD <script> into <head> for the current route and
 * removes it on unmount/route change. `schema` is a plain object (or
 * array of objects) — stringified once so the effect only re-runs when
 * the actual content changes, not on every render. */
export default function useStructuredData(schema) {
  const json = schema ? JSON.stringify(schema) : null;

  useEffect(() => {
    if (!json) return undefined;
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.textContent = json;
    document.head.appendChild(script);
    return () => {
      document.head.removeChild(script);
    };
  }, [json]);
}
