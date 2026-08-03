import { Link } from 'react-router-dom';
import SystemMark from '../workflow/SystemMark';
import WorkflowPath from '../workflow/WorkflowPath';
import Reveal from '../motion/Reveal';
import './CaseStudiesPreview.css';

const PROJECTS = [
  {
    id: 'purchase-request-automation',
    title: 'Purchase Request & Approval Automation',
    category: 'Operations Automation',
    problem: 'Purchase requests arrived through inconsistent channels and were routed manually, with no dependable approval history.',
    surface: 'light',
    flow: [
      { label: 'Request Intake', kind: 'trigger' },
      { label: 'Validation', kind: 'ai' },
      { label: 'Approval Rules', kind: 'approval' },
      { label: 'Operations Record', kind: 'storage' },
      { label: 'Notification', kind: 'action' }
    ]
  },
  {
    id: 'ai-operations-intelligence',
    title: 'AI Operations Intelligence System',
    category: 'AI Operations',
    problem: 'Operational information was fragmented across tools, forcing teams to collect updates and prepare summaries by hand.',
    surface: 'dark',
    flow: [
      { label: 'Business Data', kind: 'data' },
      { label: 'AI Analysis', kind: 'ai' },
      { label: 'Dependency Detection', kind: 'ai' },
      { label: 'Human Review', kind: 'process' },
      { label: 'Action', kind: 'action' }
    ]
  }
];

export default function CaseStudiesPreview() {
  return (
    <section className="case-preview">
      <div className="container">
        <Reveal as="div" className="case-preview__header">
          <p className="eyebrow eyebrow--number">08 / Case Studies</p>
          <h2>Systems built for real operational problems.</h2>
        </Reveal>

        <div className="case-preview__list">
          {PROJECTS.map((study) => (
            <article className={`case-preview__item case-preview__item--${study.surface}`} key={study.id}>
              <span className="case-preview__category">{study.category}</span>
              <h3>{study.title}</h3>
              <p>{study.problem}</p>

              <div className="case-preview__flow">
                {study.flow.map((step, i) => (
                  <span className="case-preview__flow-item" key={step.label}>
                    <SystemMark kind={step.kind} label={step.label} state="complete" compact />
                    {i < study.flow.length - 1 && <WorkflowPath axis="x" active compact inverse={study.surface === 'dark'} />}
                  </span>
                ))}
              </div>

              <Link to="/case-studies" className="case-preview__item-link">
                View case study →
              </Link>
            </article>
          ))}
        </div>

        <Link to="/case-studies" className="case-preview__link">
          View all case studies →
        </Link>
      </div>
    </section>
  );
}
