import { useState } from 'react';
import { runAutomationAudit } from '../../services/auditService';
import WorkflowStatus from '../workflow/WorkflowStatus';
import Reveal from '../motion/Reveal';
import AuditAnalysis from './AuditAnalysis';
import AuditReport from './AuditReport';
import './AutomationAudit.css';

const ANALYSIS_POINTS = [
  'Process trigger',
  'Human actions',
  'Data movement',
  'Decision points',
  'AI suitability',
  'Human approval requirements',
  'Automation opportunity'
];

const AUTOMATION_GOALS = [
  'Generate or manage leads',
  'Automate follow-ups',
  'Reduce manual data entry',
  'Automate reporting',
  'Connect business tools',
  'Automate client onboarding',
  'Process documents',
  'Other'
];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  company: '',
  website: '',
  businessType: '',
  teamSize: '',
  manualProcess: '',
  automationGoal: ''
};

const FRIENDLY_ERROR_MESSAGE =
  "We couldn't complete the automation analysis right now. Your process details are still valuable — please try again shortly.";

export default function AutomationAudit() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [report, setReport] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  // Shared by the initial form submit and the error screen's "Try Again" —
  // both send the same preserved payload. Guarded against double-fire so
  // repeated clicks (or a slow network plus an impatient click) can't fire
  // two audits at once.
  const submitAudit = async (payload) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('loading');
    try {
      const data = await runAutomationAudit(payload);
      setReport(data);
      setStatus('success');
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[AutomationAudit] audit failed:', err.code, err.message);
      }
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    submitAudit(form);
  };

  const handleRetry = () => {
    submitAudit(form);
  };

  const handleStartOver = () => {
    setForm(INITIAL_FORM);
    setReport(null);
    setStatus('idle');
  };

  if (status === 'loading') {
    return (
      <section id="contact" className="audit">
        <div className="container">
          <AuditAnalysis />
        </div>
      </section>
    );
  }

  if (status === 'success' && report) {
    return (
      <section id="contact" className="audit">
        <div className="container">
          <AuditReport data={report} onStartOver={handleStartOver} />
        </div>
      </section>
    );
  }

  if (status === 'error') {
    // The submitted form values are preserved in `form` state (never
    // cleared on failure), so retrying re-sends the same audit rather
    // than sending the visitor back to a blank form.
    return (
      <section id="contact" className="audit">
        <div className="container">
          <div className="audit__error" role="alert">
            <p className="eyebrow">Automation Audit</p>
            <h1>{FRIENDLY_ERROR_MESSAGE}</h1>
            <button type="button" className="btn btn-primary" onClick={handleRetry} disabled={isSubmitting}>
              Try Again
            </button>
          </div>
        </div>
      </section>
    );
  }

  const hasBusinessContext = Boolean(form.fullName.trim() && form.email.trim() && form.company.trim());
  let contextLabel = 'Waiting for workflow context';
  if (form.automationGoal) contextLabel = 'Automation objective defined';
  else if (form.manualProcess.trim()) contextLabel = 'Process context detected';
  else if (hasBusinessContext) contextLabel = 'Business context received';

  return (
    <section id="contact" className="audit">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">NAMI Process Intelligence</p>
          <h1>Show us the process. We&apos;ll map the system.</h1>
          <p>
            Describe one repetitive workflow and NAMI analyses its trigger, the human actions inside
            it, how data moves, where decisions get made, whether AI genuinely helps, and where a
            person still needs to stay in control — then identifies the automation opportunity.
          </p>
        </Reveal>

        <div className="audit__layout">
          <aside className="audit__context-panel">
            <p className="audit__context-eyebrow">What NAMI analyses</p>
            <ul className="audit__context-points">
              {ANALYSIS_POINTS.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>

            <div className="audit__status-panel" aria-live="polite">
              <WorkflowStatus label={contextLabel} system="NAMI Orchestration" active />
              <ul className="audit__status-checklist">
                <li className={hasBusinessContext ? 'is-done' : ''}>Business context</li>
                <li className={form.manualProcess.trim() ? 'is-done' : ''}>Process input</li>
                <li className={form.automationGoal ? 'is-done' : ''}>Automation goal</li>
              </ul>
            </div>
          </aside>

          <form className="audit__form" onSubmit={handleSubmit} noValidate>
            <div className="audit__row">
              <div className="audit__field">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" type="text" required value={form.fullName} onChange={handleChange('fullName')} />
              </div>
              <div className="audit__field">
                <label htmlFor="email">Work Email</label>
                <input id="email" type="email" required value={form.email} onChange={handleChange('email')} />
              </div>
            </div>

            <div className="audit__row">
              <div className="audit__field">
                <label htmlFor="company">Company</label>
                <input id="company" type="text" required value={form.company} onChange={handleChange('company')} />
              </div>
              <div className="audit__field">
                <label htmlFor="website">Website</label>
                <input id="website" type="text" value={form.website} onChange={handleChange('website')} />
              </div>
            </div>

            <div className="audit__row">
              <div className="audit__field">
                <label htmlFor="businessType">Business Type</label>
                <input id="businessType" type="text" value={form.businessType} onChange={handleChange('businessType')} />
              </div>
              <div className="audit__field">
                <label htmlFor="teamSize">Team Size</label>
                <input id="teamSize" type="text" value={form.teamSize} onChange={handleChange('teamSize')} />
              </div>
            </div>

            <div className="audit__field">
              <label htmlFor="manualProcess">What process takes too much of your team&apos;s time?</label>
              <textarea
                id="manualProcess"
                rows={4}
                required
                value={form.manualProcess}
                onChange={handleChange('manualProcess')}
              />
            </div>

            <div className="audit__field">
              <label htmlFor="automationGoal">Main automation goal</label>
              <select id="automationGoal" required value={form.automationGoal} onChange={handleChange('automationGoal')}>
                <option value="" disabled>
                  Select a goal
                </option>
                {AUTOMATION_GOALS.map((goal) => (
                  <option key={goal} value={goal}>
                    {goal}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="btn btn-primary audit__submit">
              Analyse My Workflow
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
