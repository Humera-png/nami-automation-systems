import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import './AuditPreview.css';

const ANALYSIS_RESULTS = [
  'Trigger identified',
  '3 repetitive actions',
  '1 decision point',
  'AI suitability: high',
  'Human approval retained'
];

// A static visual preview only — the real, working Audit form (analysis
// state, report) lives entirely on /automation-audit. Nothing here
// submits anywhere.
export default function AuditPreview() {
  return (
    <section className="audit-preview" data-navbar-theme="dark">
      <div className="container audit-preview__inner">
        <Reveal as="div" className="audit-preview__copy">
          <p className="eyebrow eyebrow--number">07 / Audit</p>
          <h2>Show us the process. We&apos;ll map the system.</h2>
          <p className="audit-preview__paragraph">
            Describe one repetitive workflow. NAMI identifies the trigger, the repetitive actions
            inside it, where decisions get made, and whether it&apos;s worth automating.
          </p>
          <Link to="/automation-audit" className="btn btn-primary">
            Run Your Automation Audit
          </Link>
        </Reveal>

        <Reveal as="div" delay={0.12} className="audit-preview__surface">
          <p className="audit-preview__surface-label">Process Input</p>
          <p className="audit-preview__surface-quote">
            &ldquo;Every website enquiry is reviewed manually, copied into Google Sheets, and followed
            up by email.&rdquo;
          </p>
          <div className="audit-preview__divider" />
          <p className="audit-preview__surface-label">NAMI Analysis</p>
          <ul className="audit-preview__results">
            {ANALYSIS_RESULTS.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
