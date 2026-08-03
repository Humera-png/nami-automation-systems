import { Router } from 'express';
import { chatWithGemini } from '../geminiChat.js';
import { getDeterministicFallback } from '../namiAIFallback.js';
import { isRateLimited } from '../rateLimit.js';

const router = Router();

const MAX_MESSAGE_LENGTH = 4000;
const MAX_HISTORY_TURNS = 12;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

function sanitizeHistory(rawHistory) {
  if (!Array.isArray(rawHistory)) return [];
  return rawHistory
    .filter((turn) => turn && (turn.role === 'user' || turn.role === 'assistant') && typeof turn.content === 'string' && turn.content.trim())
    .slice(-MAX_HISTORY_TURNS)
    .map((turn) => ({ role: turn.role, content: turn.content.trim().slice(0, MAX_MESSAGE_LENGTH) }));
}

router.post('/nami-ai', async (req, res) => {
  const message = typeof req.body?.message === 'string' ? req.body.message.trim() : '';
  if (!message) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'A message is required.' });
  }
  if (message.length > MAX_MESSAGE_LENGTH) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'That message is too long.' });
  }

  const ip = getClientIp(req);
  const sessionId = typeof req.body?.sessionId === 'string' ? req.body.sessionId.slice(0, 100) : '';

  if (isRateLimited(`nami-ai-ip:${ip}`) || (sessionId && isRateLimited(`nami-ai-session:${sessionId}`))) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMITED',
      message: 'NamiAI has reached its limit for now. Please try again shortly.'
    });
  }

  const history = sanitizeHistory(req.body?.history);

  // Never a technical "not configured" state, and never Gemini failing
  // means a dead-end — the deterministic engine gives a genuinely useful,
  // process-aware reply either way, it just doesn't pretend to be Gemini.
  if (!process.env.GEMINI_API_KEY) {
    const fallback = getDeterministicFallback(message, history);
    return res.status(200).json({
      success: true,
      message: fallback.reply,
      showStrategyCall: fallback.showStrategyCall,
      identifiedProcess: fallback.identifiedProcess
    });
  }

  try {
    const { reply, suggestBooking } = await chatWithGemini(message, history);
    return res.status(200).json({ success: true, message: reply, showStrategyCall: suggestBooking, identifiedProcess: null });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[nami-ai] Gemini call failed, using deterministic fallback:', err.code, err.message);
    const fallback = getDeterministicFallback(message, history);
    return res.status(200).json({
      success: true,
      message: fallback.reply,
      showStrategyCall: fallback.showStrategyCall,
      identifiedProcess: fallback.identifiedProcess
    });
  }
});

export default router;
