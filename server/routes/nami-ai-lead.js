import { Router } from 'express';
import { sendEmail, TO_EMAIL } from '../resendClient.js';
import { buildNamiAILeadEmail } from '../emails.js';
import { isRateLimited } from '../rateLimit.js';

const router = Router();

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 200;
const MAX_SHORT_FIELD_LENGTH = 300;
const MAX_MESSAGE_LENGTH = 4000;
const MAX_MESSAGES = 40;

// sessionId (or IP, if no session) -> last submitted email (lowercased).
// A repeated submission with the SAME email for the same session is
// treated as a duplicate click and deduped silently; a DIFFERENT email
// is treated as a genuine new submission and sent normally. In-memory by
// design — same tradeoff as rateLimit.js, acceptable for this volume.
const submittedSessions = new Map();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

function cleanField(value, maxLength) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, maxLength);
}

function sanitizeConversation(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .filter((m) => m && (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.trim().slice(0, MAX_MESSAGE_LENGTH) }));
}

router.post('/nami-ai-lead', async (req, res) => {
  const name = cleanField(req.body?.name, MAX_NAME_LENGTH);
  const email = cleanField(req.body?.email, MAX_SHORT_FIELD_LENGTH);
  const company = cleanField(req.body?.company, MAX_SHORT_FIELD_LENGTH);
  const phone = cleanField(req.body?.phone, 40);
  const identifiedProcess = cleanField(req.body?.identifiedProcess, 120);
  const pageUrl = cleanField(req.body?.pageUrl, 300);
  const sessionId = cleanField(req.body?.sessionId, 100);
  const consent = req.body?.consent === true;
  const calendlyShown = req.body?.calendlyShown === true;
  const conversation = sanitizeConversation(req.body?.conversation);

  if (!name) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'Name is required.' });
  }
  if (!email || !EMAIL_PATTERN.test(email)) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'A valid email is required.' });
  }
  if (!consent) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'Consent is required before we can send this.' });
  }
  if (conversation.length === 0) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: 'Conversation context is required.' });
  }

  const ip = getClientIp(req);
  if (isRateLimited(`nami-ai-lead-ip:${ip}`)) {
    return res.status(429).json({ success: false, code: 'RATE_LIMITED', message: 'Please try again shortly.' });
  }

  // Idempotency guard: the same session submitting the same email again
  // (e.g. a double-click, or re-rendering after a page refresh) is a
  // silent no-op success rather than a second email. A genuinely new
  // email for that session — the visitor corrected/changed their
  // details — goes through as a new submission.
  const dedupeKey = sessionId || ip;
  const normalizedEmail = email.toLowerCase();
  if (submittedSessions.get(dedupeKey) === normalizedEmail) {
    return res.status(200).json({ success: true, deduped: true });
  }

  try {
    const emailContent = buildNamiAILeadEmail({
      name,
      email,
      company,
      phone,
      identifiedProcess,
      pageUrl,
      sessionId,
      conversation,
      calendlyShown
    });
    const recipient = process.env.CONTACT_RECIPIENT_EMAIL || process.env.AUDIT_NOTIFICATION_EMAIL || TO_EMAIL;
    await sendEmail({ to: recipient, replyTo: email, subject: emailContent.subject, html: emailContent.html });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[nami-ai-lead] Failed to send lead notification:', err.message);
    return res.status(502).json({
      success: false,
      code: 'EMAIL_FAILED',
      message: "We couldn't send that just now. Please try again in a moment."
    });
  }

  submittedSessions.set(dedupeKey, normalizedEmail);

  return res.status(200).json({ success: true });
});

export default router;
