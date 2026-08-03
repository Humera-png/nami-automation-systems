const LEAD_ENDPOINT = '/api/nami-ai-lead';
const REQUEST_TIMEOUT_MS = 15000;

/**
 * Submits a qualified NamiAI conversation + the visitor's contact details
 * to this app's own /api/nami-ai-lead endpoint, which sends the
 * notification server-side via Resend. Throws an Error with a `.code` on
 * failure — the lead form shows one friendly retry message regardless of
 * which code fires.
 */
export async function submitNamiAILead(payload) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      const error = new Error('The request timed out.');
      error.code = 'TIMEOUT';
      throw error;
    }
    const error = new Error('Network error submitting your details.');
    error.code = 'NETWORK_ERROR';
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    const error = new Error('Unexpected response.');
    error.code = 'PARSE_ERROR';
    throw error;
  }

  if (!response.ok || data?.success === false) {
    const error = new Error(data?.message || 'Could not submit your details.');
    error.code = data?.code || 'BAD_RESPONSE';
    throw error;
  }

  return data;
}
