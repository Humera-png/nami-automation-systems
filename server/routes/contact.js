import { Router } from 'express';
import { validateContactPayload } from '../validate.js';
import { buildNotificationEmail, buildAutoReplyEmail } from '../emails.js';
import { resend, sendEmail, TO_EMAIL } from '../resendClient.js';

const router = Router();

function getClientIp(req) {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string' && forwarded.length > 0) {
    return forwarded.split(',')[0].trim();
  }
  return req.socket?.remoteAddress || '';
}

router.post('/contact', async (req, res) => {
  if (!resend) {
    // Never leak "why" beyond the server console — the visitor just needs
    // to know the request didn't go through.
    // eslint-disable-next-line no-console
    console.error('[contact] RESEND_API_KEY is not configured on the server.');
    return res.status(503).json({
      success: false,
      code: 'NOT_CONFIGURED',
      message: 'The contact system is not available right now. Please try again shortly.'
    });
  }

  const validation = validateContactPayload(req.body);
  if (!validation.ok) {
    return res.status(400).json({ success: false, code: 'VALIDATION_ERROR', message: validation.message });
  }

  const data = validation.data;
  const meta = {
    submittedAt: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
    ip: getClientIp(req),
    userAgent: req.headers['user-agent'] || ''
  };

  const notification = buildNotificationEmail(data, meta);

  try {
    await sendEmail({
      to: TO_EMAIL,
      replyTo: data.email,
      subject: notification.subject,
      html: notification.html
    });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[contact] Failed to send notification email:', err.message);
    return res.status(502).json({
      success: false,
      code: 'EMAIL_FAILED',
      message: "We couldn't send your message right now. Please try again shortly."
    });
  }

  // The lead has already reached us at this point — a failed auto-reply
  // shouldn't surface as a failed submission to the visitor.
  try {
    const autoReply = buildAutoReplyEmail(data);
    await sendEmail({ to: data.email, subject: autoReply.subject, html: autoReply.html });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[contact] Failed to send auto-reply email:', err.message);
  }

  return res.status(200).json({ success: true });
});

export default router;
