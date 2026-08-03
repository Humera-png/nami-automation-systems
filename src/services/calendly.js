import { trackEvent } from '../utils/analytics';

// Public and non-secret — safe as a VITE_-prefixed var. Falls back to the
// current booking link if VITE_CALENDLY_URL isn't set, so this works with
// zero configuration and picks up a new link automatically if ever set.
export const CALENDLY_URL = import.meta.env.VITE_CALENDLY_URL || 'https://calendly.com/humerashaikhh605/30min';

const WIDGET_SCRIPT_SRC = 'https://assets.calendly.com/assets/external/widget.js';
const WIDGET_STYLESHEET_HREF = 'https://assets.calendly.com/assets/external/widget.css';

let scriptLoadPromise = null;

/** Loads Calendly's official widget assets exactly once, however many
 * times this is called from however many components. */
function loadCalendlyAssets() {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.Calendly) return Promise.resolve();
  if (scriptLoadPromise) return scriptLoadPromise;

  if (!document.querySelector(`link[href="${WIDGET_STYLESHEET_HREF}"]`)) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = WIDGET_STYLESHEET_HREF;
    document.head.appendChild(link);
  }

  scriptLoadPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${WIDGET_SCRIPT_SRC}"]`);
    if (existing) {
      if (window.Calendly) {
        resolve();
      } else {
        existing.addEventListener('load', () => resolve());
        existing.addEventListener('error', () => reject(new Error('Failed to load Calendly widget script.')));
      }
      return;
    }
    const script = document.createElement('script');
    script.src = WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Calendly widget script.'));
    document.body.appendChild(script);
  });

  return scriptLoadPromise;
}

/** Call ahead of time (e.g. on the Strategy Call page mount) so the
 * inline embed's assets are ready without waiting on click. */
export function preloadCalendlyAssets() {
  loadCalendlyAssets().catch(() => {});
}

/**
 * Opens Calendly's official popup scheduler from anywhere on the site.
 * `source` identifies which CTA triggered this for analytics only (e.g.
 * 'navbar', 'footer', 'audit-report') — it's never sent to Calendly.
 * Falls back to opening the booking page in a new tab if the widget
 * script fails to load, so the visitor is never stuck with a dead button.
 */
export async function openStrategyCall(source) {
  trackEvent('strategy_call_click', { source });
  try {
    await loadCalendlyAssets();
    if (window.Calendly?.initPopupWidget) {
      window.Calendly.initPopupWidget({ url: CALENDLY_URL });
      return;
    }
  } catch {
    // fall through to the direct-link fallback below
  }
  window.open(CALENDLY_URL, '_blank', 'noopener,noreferrer');
}
