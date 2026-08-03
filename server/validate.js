const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_FIELD_LENGTH = 5000;

/** Escapes HTML-significant characters so user input can never inject
 * markup/scripts into the emails we build from it. */
export function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      default:
        return '&#39;';
    }
  });
}

/** Trims and hard-caps a string field so a malicious or malformed payload
 * can't send megabytes of text through the mail API. */
function cleanField(value) {
  if (typeof value !== 'string') return '';
  return value.trim().slice(0, MAX_FIELD_LENGTH);
}

const OPTIONAL_FIELDS = [
  'company',
  'phone',
  'website',
  'industry',
  'companySize',
  'currentTools',
  'service',
  'budget',
  'timeline',
  'sourcePage'
];

/**
 * Validates and sanitizes a raw contact-form request body. Returns
 * `{ ok: true, data }` with every field trimmed/length-capped, or
 * `{ ok: false, message }` describing the first validation failure —
 * never throws, so the route handler can always respond cleanly.
 */
export function validateContactPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'Missing request body.' };
  }

  const fullName = cleanField(body.fullName);
  const email = cleanField(body.email);
  const message = cleanField(body.message);

  if (!fullName) return { ok: false, message: 'Full name is required.' };
  if (!email) return { ok: false, message: 'Email is required.' };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, message: 'Enter a valid email address.' };
  if (!message) return { ok: false, message: 'A message is required.' };

  const data = { fullName, email, message };
  for (const field of OPTIONAL_FIELDS) {
    data[field] = cleanField(body[field]);
  }

  return { ok: true, data };
}

const AUDIT_OPTIONAL_FIELDS = ['website', 'businessType', 'teamSize'];

/**
 * Validates and sanitizes an Automation Audit submission. Required fields
 * mirror the frontend form's `required` attributes (AutomationAudit.jsx):
 * fullName, email, company, manualProcess, automationGoal. Returns
 * `{ ok: true, data }` or `{ ok: false, message }` — never throws.
 */
export function validateAuditPayload(body) {
  if (!body || typeof body !== 'object') {
    return { ok: false, message: 'Missing request body.' };
  }

  const fullName = cleanField(body.fullName);
  const email = cleanField(body.email);
  const company = cleanField(body.company);
  const manualProcess = cleanField(body.manualProcess);
  const automationGoal = cleanField(body.automationGoal);

  if (!fullName) return { ok: false, message: 'Full name is required.' };
  if (!email) return { ok: false, message: 'Email is required.' };
  if (!EMAIL_PATTERN.test(email)) return { ok: false, message: 'Enter a valid email address.' };
  if (!company) return { ok: false, message: 'Company is required.' };
  if (!manualProcess) return { ok: false, message: 'Describe the process you want to automate.' };
  if (!automationGoal) return { ok: false, message: 'Select an automation goal.' };

  const data = { fullName, email, company, manualProcess, automationGoal };
  for (const field of AUDIT_OPTIONAL_FIELDS) {
    data[field] = cleanField(body[field]);
  }
  data.source = cleanField(body.source) || 'nami-website';

  return { ok: true, data };
}
