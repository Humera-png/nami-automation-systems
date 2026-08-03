import { Resend } from 'resend';

// Resend's shared address — works for any account with zero setup, so
// this is always a safe address to send from or fall back to.
const RESEND_SHARED_SENDER = 'NAMI Automation Systems <onboarding@resend.dev>';

const resendApiKey = process.env.RESEND_API_KEY;
export const resend = resendApiKey ? new Resend(resendApiKey) : null;

const configuredFrom = process.env.CONTACT_FROM_EMAIL || null;

export const TO_EMAIL = process.env.CONTACT_TO_EMAIL || process.env.AUDIT_NOTIFICATION_EMAIL || 'humerashaikh889@gmail.com';

/**
 * Sends an email via Resend using the configured sender if one is set,
 * and automatically retries once with Resend's always-available shared
 * sender if that first attempt fails for any reason (most commonly: the
 * configured domain isn't verified yet). This means setting
 * CONTACT_FROM_EMAIL to a real domain later "just works" the moment that
 * domain is verified — no code changes, and no silent breakage in the
 * meantime while it isn't.
 *
 * Throws on failure only if BOTH the configured sender (when set) and
 * the shared fallback sender fail — callers can treat any throw as a
 * genuine, unrecoverable send failure.
 */
export async function sendEmail({ to, replyTo, subject, html }) {
  if (!resend) {
    const err = new Error('RESEND_API_KEY is not configured.');
    err.code = 'NOT_CONFIGURED';
    throw err;
  }

  const primaryFrom = configuredFrom || RESEND_SHARED_SENDER;

  try {
    const result = await resend.emails.send({ from: primaryFrom, to, replyTo, subject, html });
    if (result?.error) throw new Error(result.error.message || 'Resend rejected the email.');
    return result;
  } catch (err) {
    if (primaryFrom === RESEND_SHARED_SENDER) {
      throw err;
    }
    // eslint-disable-next-line no-console
    console.error(
      `[resendClient] Send failed with configured sender (${primaryFrom}) — likely an unverified domain. Retrying with Resend's shared sender:`,
      err.message
    );
    const retryResult = await resend.emails.send({ from: RESEND_SHARED_SENDER, to, replyTo, subject, html });
    if (retryResult?.error) throw new Error(retryResult.error.message || 'Resend rejected the email (fallback sender).');
    return retryResult;
  }
}
