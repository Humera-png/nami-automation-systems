const AUDIT_ENDPOINT = '/api/automation-audit';
const REQUEST_TIMEOUT_MS = 30000;

function devLog(...args) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.log('[NAMI/auditService]', ...args);
  }
}

function devError(...args) {
  if (import.meta.env.DEV) {
    // eslint-disable-next-line no-console
    console.error('[NAMI/auditService]', ...args);
  }
}

function makeError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

// The report UI (AuditReport.jsx) only ever reads these fields, all
// defensively — arrays are guarded with Array.isArray, strings/booleans
// with truthiness checks. Normalizing to this shape means one missing
// optional field from the backend never breaks rendering.
function normalizeAuditData(raw) {
  return {
    auditId: typeof raw.auditId === 'string' ? raw.auditId : undefined,
    score: typeof raw.score === 'number' && Number.isFinite(raw.score) ? Math.max(0, Math.min(100, raw.score)) : undefined,
    opportunityLevel: typeof raw.opportunityLevel === 'string' ? raw.opportunityLevel : undefined,
    architectureTitle: typeof raw.architectureTitle === 'string' ? raw.architectureTitle : undefined,
    automationSummary: typeof raw.automationSummary === 'string' ? raw.automationSummary : undefined,
    expectedBusinessImpact: typeof raw.expectedBusinessImpact === 'string' ? raw.expectedBusinessImpact : undefined,
    workflowText: typeof raw.workflowText === 'string' ? raw.workflowText : undefined,
    aiRequired: typeof raw.aiRequired === 'boolean' ? raw.aiRequired : undefined,
    aiPurpose: typeof raw.aiPurpose === 'string' ? raw.aiPurpose : undefined,
    humanApprovalRequired: typeof raw.humanApprovalRequired === 'boolean' ? raw.humanApprovalRequired : undefined,
    recommendedSystems: Array.isArray(raw.recommendedSystems) ? raw.recommendedSystems.filter((s) => typeof s === 'string') : undefined,
    architectureConfidence: typeof raw.architectureConfidence === 'string' ? raw.architectureConfidence : undefined,
    status: typeof raw.status === 'string' ? raw.status : undefined
  };
}

// A parsed object is only useful if it carries at least one field that
// actually renders something on the report — otherwise show the calm
// error state instead of an empty-looking "successful" report.
function hasMeaningfulContent(data) {
  return Boolean(
    data.architectureTitle || data.automationSummary || data.workflowText || typeof data.score === 'number'
  );
}

/**
 * Submits the Automation Audit form to this app's own /api/automation-audit
 * endpoint (server/routes/automation-audit.js), which runs a deterministic,
 * code-based audit engine — optionally enhanced with Gemini — entirely
 * inside this codebase. Returns the parsed, normalized report. Throws an
 * Error with a `.code` on failure — callers should show one friendly
 * message and may inspect `.code` for their own dev logging:
 *
 *   TIMEOUT                  request exceeded REQUEST_TIMEOUT_MS
 *   AUDIT_API_UNREACHABLE    fetch failed (network error)
 *   AUDIT_RESPONSE_PARSE_FAILED  body isn't valid JSON
 *   INVALID_SUBMISSION       server-side validation rejected the payload
 *   RATE_LIMITED             too many audits from this IP/email recently
 *   ENGINE_FAILED            the deterministic engine itself errored
 *   AUDIT_API_ERROR          any other non-2xx response
 *   INVALID_AUDIT_PAYLOAD    parsed fine, but has none of the fields the
 *                            report UI needs to render anything
 */
export async function runAutomationAudit(formValues) {
  const payload = {
    fullName: formValues.fullName ?? '',
    email: formValues.email ?? '',
    company: formValues.company ?? '',
    website: formValues.website ?? '',
    businessType: formValues.businessType ?? '',
    teamSize: formValues.teamSize ?? '',
    manualProcess: formValues.manualProcess ?? '',
    automationGoal: formValues.automationGoal ?? '',
    source: 'nami-website'
  };

  devLog('Submitting audit payload to', AUDIT_ENDPOINT, payload);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(AUDIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      devError('Request timed out after', REQUEST_TIMEOUT_MS, 'ms.');
      throw makeError('TIMEOUT', 'The automation audit timed out.');
    }
    devError('Network error contacting the automation audit service.', err);
    throw makeError('AUDIT_API_UNREACHABLE', 'Network error contacting the automation audit service.');
  } finally {
    clearTimeout(timeoutId);
  }

  devLog('Audit endpoint responded', response.status);

  let parsed;
  try {
    parsed = await response.json();
  } catch (err) {
    devError('Failed to parse audit response as JSON.', err);
    throw makeError('AUDIT_RESPONSE_PARSE_FAILED', 'The automation audit service returned an unexpected response.');
  }

  if (!response.ok || parsed?.success === false) {
    devError('Audit endpoint reported failure.', response.status, parsed);
    throw makeError(parsed?.code || 'AUDIT_API_ERROR', parsed?.message || 'The automation audit could not be completed.');
  }

  const data = normalizeAuditData(parsed?.data ?? parsed ?? {});
  devLog('Normalized audit data:', data);

  if (!hasMeaningfulContent(data)) {
    devError('Parsed audit response has none of the fields the report UI needs.', parsed);
    throw makeError('INVALID_AUDIT_PAYLOAD', 'The automation audit response was incomplete.');
  }

  return data;
}
