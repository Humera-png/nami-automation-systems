import { useState } from 'react';
import { submitNamiAILead } from '../../services/namiAILeadService';
import { openStrategyCall } from '../../services/calendly';

const GENERIC_ERROR = "We couldn't send that just now — please try again in a moment.";

/**
 * Inline lead-capture form shown under a NamiAI message once the
 * conversation has earned a strategy-call suggestion. Never navigates the
 * visitor away — submission happens in place, and Calendly (if chosen)
 * opens as a popup over the same page.
 */
export default function NamiLeadForm({ conversation, identifiedProcess, sessionId, calendlyShown, onSubmitted }) {
  const [fields, setFields] = useState({ name: '', email: '', company: '', phone: '' });
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | submitting | error
  const [validationMessage, setValidationMessage] = useState('');

  const handleChange = (field) => (event) => {
    setFields((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (status === 'submitting') return;

    if (!fields.name.trim() || !fields.email.trim()) {
      setValidationMessage('Name and email are required.');
      return;
    }
    if (!consent) {
      setValidationMessage('Please confirm consent before sending.');
      return;
    }

    setValidationMessage('');
    setStatus('submitting');

    try {
      await submitNamiAILead({
        name: fields.name.trim(),
        email: fields.email.trim(),
        company: fields.company.trim(),
        phone: fields.phone.trim(),
        conversation,
        identifiedProcess,
        pageUrl: typeof window !== 'undefined' ? window.location.href : '',
        sessionId,
        consent: true,
        calendlyShown
      });
      onSubmitted(fields.name.trim());
    } catch (err) {
      setStatus('error');
      setValidationMessage(err.message && err.code !== 'BAD_RESPONSE' ? GENERIC_ERROR : err.message || GENERIC_ERROR);
    }
  };

  return (
    <form className="nami-lead-form" onSubmit={handleSubmit} noValidate>
      <p className="nami-lead-form__intro">
        This looks like a strong automation opportunity. I can send the context to a NAMI systems architect so you
        don&apos;t have to explain everything again. What name and email should we use?
      </p>

      <div className="nami-lead-form__row">
        <label className="nami-lead-form__field">
          Name
          <input type="text" value={fields.name} onChange={handleChange('name')} autoComplete="name" required />
        </label>
        <label className="nami-lead-form__field">
          Work email
          <input type="email" value={fields.email} onChange={handleChange('email')} autoComplete="email" required />
        </label>
      </div>

      <div className="nami-lead-form__row">
        <label className="nami-lead-form__field">
          Company <span>optional</span>
          <input type="text" value={fields.company} onChange={handleChange('company')} autoComplete="organization" />
        </label>
        <label className="nami-lead-form__field">
          Phone <span>optional</span>
          <input type="tel" value={fields.phone} onChange={handleChange('phone')} autoComplete="tel" />
        </label>
      </div>

      <label className="nami-lead-form__consent">
        <input type="checkbox" checked={consent} onChange={(event) => setConsent(event.target.checked)} />
        By submitting, you agree that NAMI may contact you regarding this workflow.
      </label>

      {validationMessage && (
        <p className="nami-lead-form__message" role="alert">
          {validationMessage}
        </p>
      )}

      <div className="nami-lead-form__actions">
        <button type="submit" className="btn btn-primary" disabled={status === 'submitting'}>
          {status === 'submitting' ? 'Sending…' : 'Send My Workflow to NAMI'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => openStrategyCall('namiai-lead-form')}>
          Book a Strategy Call
        </button>
      </div>
    </form>
  );
}
