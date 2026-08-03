const NAMI_AI_ENDPOINT = '/api/nami-ai';
const REQUEST_TIMEOUT_MS = 20000;

/**
 * Sends the visitor's message plus recent conversation history to this
 * app's own /api/nami-ai endpoint. `history` is the prior turns as
 * `[{ role: 'user'|'assistant', content }]`, not including `message`.
 * Throws an Error with a `.code` on failure — the caller (NamiAI.jsx)
 * shows one graceful fallback message regardless of which code fires.
 */
export async function sendNamiAIMessage({ message, sessionId, history }) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(NAMI_AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, sessionId, history }),
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      const error = new Error('NamiAI request timed out.');
      error.code = 'TIMEOUT';
      throw error;
    }
    const error = new Error('Network error contacting NamiAI.');
    error.code = 'NETWORK_ERROR';
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error('NamiAI returned an unreadable response.');
    error.code = 'PARSE_ERROR';
    throw error;
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(data?.message || 'NamiAI could not respond.');
    error.code = data?.code || 'BAD_RESPONSE';
    throw error;
  }

  return {
    reply: data.message,
    suggestBooking: Boolean(data.showStrategyCall),
    identifiedProcess: typeof data.identifiedProcess === 'string' ? data.identifiedProcess : null
  };
}
