/**
 * Lightweight, vendor-agnostic event tracking. Pushes to window.dataLayer
 * (the standard GA4/Google Tag Manager convention) when one exists;
 * otherwise this is a silent no-op in production and a console log in
 * dev. No analytics vendor is assumed or fabricated here — wiring in
 * GA4/GTM/Plausible later needs no changes to call sites, just adding
 * that vendor's script to index.html so window.dataLayer exists.
 */
export function trackEvent(name, params = {}) {
  if (typeof window !== 'undefined' && Array.isArray(window.dataLayer)) {
    window.dataLayer.push({ event: name, ...params });
  }
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[analytics]', name, params);
  }
}
