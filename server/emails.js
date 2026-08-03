import { escapeHtml } from './validate.js';

const BRAND_INK = '#1d211f';
const BRAND_INK_SOFT = '#4e5652';
const BRAND_SIGNAL = '#625cff';
const BRAND_BORDER = '#e3e1d9';
const BRAND_BG = '#f2f0ea';

function shellOpen(preheader) {
  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:${BRAND_BG};font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;color:${BRAND_INK};">
    <span style="display:none;font-size:1px;color:${BRAND_BG};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${escapeHtml(
      preheader
    )}</span>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND_BG};padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND_BORDER};">`;
}

function shellClose() {
  return `
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function brandHeader(title) {
  return `
            <tr>
              <td style="padding:28px 32px;border-bottom:1px solid ${BRAND_BORDER};">
                <div style="font-size:13px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_SIGNAL};">NAMI</div>
                <div style="font-size:20px;font-weight:700;color:${BRAND_INK};margin-top:6px;">${escapeHtml(title)}</div>
              </td>
            </tr>`;
}

function row(label, value) {
  if (!value) return '';
  return `
                  <tr>
                    <td style="padding:6px 0;font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.04em;color:${BRAND_INK_SOFT};width:38%;vertical-align:top;">${escapeHtml(
                      label
                    )}</td>
                    <td style="padding:6px 0;font-size:14px;color:${BRAND_INK};vertical-align:top;">${escapeHtml(value)}</td>
                  </tr>`;
}

function sectionTable(heading, rows) {
  const rendered = rows.filter(Boolean).join('');
  if (!rendered) return '';
  return `
            <tr>
              <td style="padding:20px 32px 4px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_INK_SOFT};margin-bottom:8px;">${escapeHtml(
                  heading
                )}</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rendered}</table>
              </td>
            </tr>`;
}

/**
 * The internal notification — laid out like a CRM lead record (Contact
 * Information / Business Details / Project Requirements / Message /
 * Submitted At) rather than one plain paragraph, so inquiries are easy to
 * scan at a glance.
 */
export function buildNotificationEmail(data, meta) {
  const subject = data.company ? `New NAMI Website Inquiry — ${data.company}` : 'New NAMI Website Inquiry';

  const html = `${shellOpen(`New inquiry from ${data.fullName}`)}${brandHeader('New Automation Inquiry')}
            ${sectionTable('Contact Information', [
              row('Name', data.fullName),
              row('Email', data.email),
              row('Phone', data.phone),
              row('Company', data.company)
            ])}
            ${sectionTable('Business Details', [
              row('Website', data.website),
              row('Industry', data.industry),
              row('Company Size', data.companySize),
              row('Current Tools', data.currentTools)
            ])}
            ${sectionTable('Project Requirements', [
              row('Service of Interest', data.service),
              row('Budget', data.budget),
              row('Timeline', data.timeline)
            ])}
            <tr>
              <td style="padding:20px 32px 4px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_INK_SOFT};margin-bottom:8px;">Message</div>
                <div style="font-size:14px;line-height:1.6;color:${BRAND_INK};white-space:pre-wrap;background:${BRAND_BG};border-radius:10px;padding:14px 16px;">${escapeHtml(
                  data.message
                )}</div>
              </td>
            </tr>
            ${sectionTable('Submission Metadata', [
              row('Submitted At', meta.submittedAt),
              row('Source Page', data.sourcePage),
              row('IP Address', meta.ip),
              row('User Agent', meta.userAgent)
            ])}
            <tr>
              <td style="padding:24px 32px 28px;">
                <div style="font-size:12px;color:${BRAND_INK_SOFT};">Reply directly to this email to respond to ${escapeHtml(
    data.fullName
  )}.</div>
              </td>
            </tr>${shellClose()}`;

  return { subject, html };
}

/**
 * Internal notification for a completed Automation Audit — sent after
 * the deterministic engine (and optional Gemini enhancement) produces a
 * report, so a copy of every lead + result reaches the inbox even though
 * the visitor never has to wait on this send.
 */
export function buildAuditNotificationEmail(data, result) {
  const subject = `New NAMI Automation Audit — ${data.company || data.fullName}`;
  const submittedAt = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });

  const html = `${shellOpen(`New automation audit from ${data.fullName}`)}${brandHeader('New Automation Audit')}
            ${sectionTable('Contact Information', [
              row('Name', data.fullName),
              row('Email', data.email),
              row('Company', data.company),
              row('Website', data.website)
            ])}
            ${sectionTable('Business Details', [
              row('Business Type', data.businessType),
              row('Team Size', data.teamSize),
              row('Automation Goal', data.automationGoal)
            ])}
            <tr>
              <td style="padding:20px 32px 4px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_INK_SOFT};margin-bottom:8px;">Manual Process Described</div>
                <div style="font-size:14px;line-height:1.6;color:${BRAND_INK};white-space:pre-wrap;background:${BRAND_BG};border-radius:10px;padding:14px 16px;">${escapeHtml(
    data.manualProcess
  )}</div>
              </td>
            </tr>
            ${sectionTable('Audit Result', [
              row('Audit ID', result.auditId),
              row('Score', `${result.automationOpportunityScore}/100`),
              row('Opportunity Level', result.opportunityLevel),
              row('Architecture Title', result.architectureTitle),
              row('Recommended Systems', Array.isArray(result.recommendedSystems) ? result.recommendedSystems.join(', ') : '')
            ])}
            <tr>
              <td style="padding:20px 32px 4px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_INK_SOFT};margin-bottom:8px;">Automation Summary</div>
                <div style="font-size:14px;line-height:1.6;color:${BRAND_INK};white-space:pre-wrap;background:${BRAND_BG};border-radius:10px;padding:14px 16px;">${escapeHtml(
    result.automationSummary
  )}</div>
              </td>
            </tr>
            ${sectionTable('Submission Metadata', [row('Submitted At', submittedAt), row('Source Page', data.source)])}${shellClose()}`;

  return { subject, html };
}

/** A short, premium confirmation sent back to the person who submitted the form. */
export function buildAutoReplyEmail(data) {
  const firstName = data.fullName.split(' ')[0] || data.fullName;
  const html = `${shellOpen("We've received your inquiry")}${brandHeader("We've received your inquiry")}
            <tr>
              <td style="padding:24px 32px 8px;font-size:15px;line-height:1.7;color:${BRAND_INK};">
                Hi ${escapeHtml(firstName)},
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 8px;font-size:15px;line-height:1.7;color:${BRAND_INK};">
                Thank you for reaching out to NAMI. Your inquiry has been received and we review every
                automation opportunity personally.
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:15px;line-height:1.7;color:${BRAND_INK};">
                Someone from our team will respond within 1–2 business days with next steps.
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 28px;font-size:13px;line-height:1.6;color:${BRAND_INK_SOFT};border-top:1px solid ${BRAND_BORDER};padding-top:20px;">
                NAMI Automation Systems<br />AI-engineered operational systems.
              </td>
            </tr>${shellClose()}`;

  return { subject: "We've received your inquiry — NAMI Automation Systems", html };
}

function conversationTable(conversation) {
  if (!Array.isArray(conversation) || conversation.length === 0) return '';
  const rows = conversation
    .map((turn) => {
      const speaker = turn.role === 'user' ? 'Visitor' : 'NamiAI';
      const bg = turn.role === 'user' ? '#ffffff' : BRAND_BG;
      return `
                  <tr>
                    <td style="padding:10px 12px;background:${bg};border-bottom:1px solid ${BRAND_BORDER};">
                      <div style="font-size:10px;font-weight:700;text-transform:uppercase;letter-spacing:0.06em;color:${BRAND_INK_SOFT};margin-bottom:4px;">${escapeHtml(
                        speaker
                      )}</div>
                      <div style="font-size:13px;line-height:1.55;color:${BRAND_INK};white-space:pre-wrap;">${escapeHtml(turn.content)}</div>
                    </td>
                  </tr>`;
    })
    .join('');

  return `
            <tr>
              <td style="padding:20px 32px 4px;">
                <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:${BRAND_INK_SOFT};margin-bottom:8px;">Conversation Transcript</div>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid ${BRAND_BORDER};border-radius:8px;overflow:hidden;">${rows}</table>
              </td>
            </tr>`;
}

/**
 * Notification for a qualified NamiAI conversation where the visitor
 * supplied real contact details and consented to being contacted. Only
 * ever sent after a successful, consented, deduplicated submission (see
 * server/routes/nami-ai-lead.js) — never on every chat message.
 */
export function buildNamiAILeadEmail(data) {
  const subject = `Qualified NamiAI Lead — ${data.identifiedProcess || 'Automation Opportunity'}`;
  const submittedAt = new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' });

  const html = `${shellOpen(`Qualified NamiAI lead from ${data.name}`)}${brandHeader('Qualified NamiAI Lead')}
            ${sectionTable('Visitor', [
              row('Name', data.name),
              row('Email', data.email),
              row('Company', data.company),
              row('Phone', data.phone)
            ])}
            ${sectionTable('Context', [
              row('Identified Process', data.identifiedProcess),
              row('Page URL', data.pageUrl),
              row('Session ID', data.sessionId),
              row('Calendly Shown', data.calendlyShown ? 'Yes' : 'No'),
              row('Submitted At', submittedAt)
            ])}
            ${conversationTable(data.conversation)}
            <tr>
              <td style="padding:24px 32px 28px;">
                <a href="mailto:${encodeURIComponent(data.email)}" style="display:inline-block;background:${BRAND_INK};color:#ffffff;text-decoration:none;font-size:13px;font-weight:600;padding:10px 18px;border-radius:999px;">Reply to ${escapeHtml(
    data.name
  )}</a>
              </td>
            </tr>${shellClose()}`;

  return { subject, html };
}
