export const NAMI_AI_OPEN_EVENT = 'nami-ai:open';

/**
 * Opens the existing NamiAI panel. Optionally pass `{ prefill, autoSend }`
 * to hand NamiAI some context — e.g. from the Automation Audit report —
 * without building a second chat surface. `prefill` fills the input;
 * `autoSend: true` sends it immediately instead of leaving it for the
 * visitor to edit first.
 */
export function openNamiAI(detail) {
  const payload = detail && typeof detail === 'object' && typeof detail.prefill === 'string' ? detail : undefined;
  window.dispatchEvent(new CustomEvent(NAMI_AI_OPEN_EVENT, { detail: payload }));
}
