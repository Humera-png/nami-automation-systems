import { Router } from 'express';
import { validateAuditPayload } from '../validate.js';
import { runAuditEngine } from '../auditEngine.js';
import { enhanceWithGemini } from '../gemini.js';
import { buildAuditNotificationEmail } from '../emails.js';
import { isRateLimited } from '../rateLimit.js';
import { resend, sendEmail, TO_EMAIL } from '../resendClient.js';

const router = Router();

// AUDIT_NOTIFICATION_EMAIL, when set, takes priority over the shared
// CONTACT_TO_EMAIL — lets the audit route to a different inbox than
// general contact inquiries if ever needed.
const AUDIT_TO_EMAIL = process.env.AUDIT_NOTIFICATION_EMAIL || TO_EMAIL;

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

router.post('/automation-audit', async (req, res) => {
  const validation = validateAuditPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ success: false, code: 'INVALID_SUBMISSION', message: validation.message });
  }

  const data = validation.data;
  const ip = getClientIp(req);

  if (isRateLimited(`ip:${ip}`) || isRateLimited(`email:${data.email.toLowerCase()}`)) {
    return res.status(429).json({
      success: false,
      code: 'RATE_LIMITED',
      message: "You've reached the audit limit for now. Please try again in a little while."
    });
  }

  // The deterministic engine is pure/synchronous and never depends on an
  // external service — a thrown error here means a genuine bug in the
  // engine itself, not a downstream outage.
  let engineResult;
  try {
    engineResult = runAuditEngine(data);
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[automation-audit] Deterministic engine failed unexpectedly:', err);
    return res.status(500).json({
      success: false,
      code: 'ENGINE_FAILED',
      message: "We couldn't complete the automation analysis right now. Please try again shortly."
    });
  }

  let finalResult = engineResult;
  let source = 'code-engine';
  if (process.env.GEMINI_API_KEY) {
    try {
      const enhancement = await enhanceWithGemini(engineResult, data);
      if (enhancement) {
        finalResult = { ...engineResult, ...enhancement };
        source = 'code-engine+gemini';
      }
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[automation-audit] Gemini enhancement threw unexpectedly, using deterministic result:', err);
    }
  }

  // Structured log as a temporary backup — no database dependency added
  // solely for this launch. A persistent store (e.g. Postgres/Supabase)
  // can subscribe to this same point later without touching the route
  // logic above it.
  // eslint-disable-next-line no-console
  console.log(
    '[automation-audit] audit generated',
    JSON.stringify({
      auditId: finalResult.auditId,
      email: data.email,
      company: data.company,
      score: finalResult.automationOpportunityScore,
      opportunityLevel: finalResult.opportunityLevel,
      source,
      scoredAt: finalResult.scoredAt
    })
  );

  if (resend) {
    try {
      const notification = buildAuditNotificationEmail(data, finalResult);
      await sendEmail({
        to: AUDIT_TO_EMAIL,
        replyTo: data.email,
        subject: notification.subject,
        html: notification.html
      });
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('[automation-audit] Failed to send notification email (visitor still gets their report):', err.message);
    }
  } else {
    // eslint-disable-next-line no-console
    console.error('[automation-audit] RESEND_API_KEY not configured — skipping notification email.');
  }

  // true whenever the report is the deterministic engine's output as-is
  // (Gemini unconfigured, or configured but it failed/timed out) — the
  // visitor still gets a complete, useful report either way.
  const generatedWithFallback = source === 'code-engine';

  return res.status(200).json({ success: true, source, generatedWithFallback, ...finalResult });
});

export default router;
