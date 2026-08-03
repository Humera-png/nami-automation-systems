// Server-side conversational layer for NamiAI. The visitor's browser only
// ever talks to this app's own /api/nami-ai endpoint (server/routes/
// nami-ai.js), which calls Gemini directly. Kept deliberately separate
// from server/gemini.js (the audit-enhancement module) rather than
// sharing a refactored client, so neither feature's tested behaviour is
// put at risk by changes made for the other.

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';
const REQUEST_TIMEOUT_MS = 12000;
const MAX_RETRIES = 1; // "retry once automatically" on a timeout, per spec

const SYSTEM_PROMPT = `You are NamiAI, the automation consultant for NAMI Automation Systems — a boutique AI automation engineering company. You are talking directly to a visitor on the website, not to a developer.

Your job in this conversation:
- Discover how the visitor's business actually operates: what they do manually, which tools they use, where time gets lost.
- Ask short, specific follow-up questions rather than answering everything at once — this is a discovery conversation, not a lecture.
- Identify repetitive, rule-based, or judgement-heavy work that could plausibly be automated.
- Recommend automation opportunities in plain business language.
- Never invent specific technical implementation details (exact APIs, exact pricing, exact timelines) — NAMI's team defines those during a real scoping conversation, not here.
- When the visitor has described a real, specific process with enough detail to suggest genuine automation potential, naturally suggest booking a free 30-minute Strategy Call to map it together — don't force this on every message, only when it's earned.
- Keep responses conversational, warm, and concise — a few sentences, not an essay.
- Never mention n8n, Gemini, webhooks, prompts, or any other internal technical implementation detail.

Respond with ONLY a strict JSON object: { "reply": string, "suggestBooking": boolean }. "reply" is what NamiAI says next, in plain conversational text (no markdown). "suggestBooking" is true only when the conversation has reached a point where recommending the Strategy Call is a natural, earned next step.`;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function toGeminiRole(role) {
  return role === 'assistant' ? 'model' : 'user';
}

function safeParseJson(text) {
  try {
    const trimmed = text.trim();
    const fenced = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
    return JSON.parse(fenced ? fenced[1] : trimmed);
  } catch {
    return null;
  }
}

async function callOnce(contents, apiKey) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    return await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${DEFAULT_MODEL}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        contents,
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: { temperature: 0.6, responseMimeType: 'application/json' }
      })
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * `history` is `[{ role: 'user'|'assistant', content }]` in chronological
 * order, not including `message`. Returns `{ reply, suggestBooking }` or
 * throws an Error with a `.code` — the route decides the user-facing
 * fallback copy; this module never invents visitor-facing text beyond
 * what Gemini itself returns.
 */
export async function chatWithGemini(message, history) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    const err = new Error('GEMINI_API_KEY is not configured.');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const contents = [
    ...history.map((turn) => ({ role: toGeminiRole(turn.role), parts: [{ text: turn.content }] })),
    { role: 'user', parts: [{ text: message }] }
  ];

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    let response;
    try {
      response = await callOnce(contents, apiKey);
    } catch (err) {
      if (err.name === 'AbortError') {
        if (attempt < MAX_RETRIES) continue;
        const timeoutErr = new Error('Gemini chat request timed out.');
        timeoutErr.code = 'TIMEOUT';
        throw timeoutErr;
      }
      if (attempt < MAX_RETRIES) {
        await sleep(500);
        continue;
      }
      const netErr = new Error('Network error contacting Gemini.');
      netErr.code = 'NETWORK_ERROR';
      throw netErr;
    }

    if (response.status === 429 || response.status === 503) {
      if (attempt < MAX_RETRIES) {
        await sleep(500);
        continue;
      }
      const rateErr = new Error(`Gemini returned ${response.status}.`);
      rateErr.code = 'RATE_LIMITED';
      throw rateErr;
    }

    if (!response.ok) {
      const badErr = new Error(`Gemini returned ${response.status}.`);
      badErr.code = 'BAD_RESPONSE';
      throw badErr;
    }

    let json;
    try {
      json = await response.json();
    } catch {
      const parseErr = new Error('Gemini returned an unreadable response.');
      parseErr.code = 'PARSE_ERROR';
      throw parseErr;
    }

    const text = json?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      const emptyErr = new Error('Gemini returned no usable content.');
      emptyErr.code = 'EMPTY_RESPONSE';
      throw emptyErr;
    }

    const parsed = safeParseJson(text);
    if (!parsed || typeof parsed.reply !== 'string' || !parsed.reply.trim()) {
      const invalidErr = new Error('Gemini returned an invalid chat payload.');
      invalidErr.code = 'INVALID_PAYLOAD';
      throw invalidErr;
    }

    return {
      reply: parsed.reply.trim().slice(0, 2000),
      suggestBooking: parsed.suggestBooking === true
    };
  }

  const err = new Error('Gemini chat request failed after retries.');
  err.code = 'RETRIES_EXHAUSTED';
  throw err;
}
