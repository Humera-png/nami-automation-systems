import { Link } from 'react-router-dom';
import WorkflowNode from '../workflow/WorkflowNode';
import { parseWorkflowText } from '../../utils/parseWorkflowText';
import { openNamiAI } from '../nami-ai/namiAIEvents';
import { openStrategyCall } from '../../services/calendly';
import './AuditReport.css';

const DETERMINISTIC_WORK = ['Triggers', 'Validation', 'Data movement', 'API actions', 'Status updates'];
const INTELLIGENCE_WORK = ['Classification', 'Context analysis', 'Prioritisation', 'Drafting', 'Unstructured data interpretation'];

function buildNamiContext(data) {
  const parts = [];
  if (data.architectureTitle) parts.push(`the "${data.architectureTitle}" automation`);
  if (data.auditId) parts.push(`audit ${data.auditId}`);
  if (typeof data.score === 'number') parts.push(`a score of ${data.score}/100`);
  if (data.opportunityLevel) parts.push(`marked as a ${data.opportunityLevel.toLowerCase()} opportunity`);
  return parts.length > 0 ? parts.join(', ') : 'my recent automation audit';
}

export default function AuditReport({ data, onStartOver }) {
  const steps = parseWorkflowText(data.workflowText);
  const hasScore = typeof data.score === 'number';
  const context = buildNamiContext(data);

  const handleBuildThis = () => {
    openNamiAI({
      prefill: `I'd like to move forward and build ${context}. Can you help me get started?`,
      autoSend: true
    });
  };

  const handleAskNami = () => {
    openNamiAI({
      prefill: `I have a question about ${context}.`,
      autoSend: false
    });
  };

  return (
    <div className="audit-report">
      <div className="audit-report__top">
        <span>NAMI Automation Audit</span>
        {data.auditId && <span>{data.auditId}</span>}
      </div>

      <div className="audit-report__score">
        {hasScore && (
          <>
            <p className="audit-report__score-eyebrow">Automation Opportunity Score</p>
            <p className="audit-report__score-value">
              {data.score}
              <span>/100</span>
            </p>
            <div className="audit-report__score-bar">
              <div className="audit-report__score-fill" style={{ width: `${Math.max(0, Math.min(100, data.score))}%` }} />
            </div>
          </>
        )}
        {data.opportunityLevel && <p className="audit-report__opportunity">{data.opportunityLevel}</p>}
      </div>

      {data.architectureTitle && <h1 className="audit-report__title">{data.architectureTitle}</h1>}
      {data.automationSummary && <p className="audit-report__summary">{data.automationSummary}</p>}

      {data.expectedBusinessImpact && (
        <div className="audit-report__impact">
          <p className="audit-report__label">Expected Business Impact</p>
          <p>{data.expectedBusinessImpact}</p>
        </div>
      )}

      {steps.length > 0 && (
        <div className="audit-report__workflow">
          <p className="audit-report__label">Automation Workflow</p>
          <ol className="audit-report__flow">
            {steps.map((step, i) => (
              <li className="audit-report__flow-step" key={`${step.label}-${i}`}>
                <span className="audit-report__flow-number">{i + 1}</span>
                <div className="audit-report__flow-body">
                  <p className="audit-report__flow-category">{step.category}</p>
                  <WorkflowNode label={step.label} type={step.type} state="complete" compact />
                  {step.description && <p className="audit-report__flow-desc">{step.description}</p>}
                </div>
                {i < steps.length - 1 && <span className="audit-report__flow-connector" aria-hidden="true" />}
              </li>
            ))}
          </ol>
        </div>
      )}

      {(data.aiRequired === true || data.humanApprovalRequired === true) && (
        <div className="audit-report__philosophy">
          <p className="audit-report__label">Where AI Fits</p>
          <h4>AI where judgement helps. Automation where rules are enough.</h4>

          {data.aiRequired === true && data.aiPurpose && (
            <p className="audit-report__philosophy-intro">{data.aiPurpose}</p>
          )}

          <div className="audit-report__split">
            <div className="audit-report__split-col">
              <p className="audit-report__split-label">Deterministic</p>
              <ul>
                {DETERMINISTIC_WORK.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div className="audit-report__split-col audit-report__split-col--ai">
              <p className="audit-report__split-label">Intelligence</p>
              <ul>
                {INTELLIGENCE_WORK.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>

          {data.humanApprovalRequired === true && (
            <div className="audit-report__human-control">
              <p className="audit-report__split-label">Human Control</p>
              <p>
                Approval, exceptions, and high-value decisions stay with a person — the architecture
                keeps humans at every judgement-sensitive step.
              </p>
            </div>
          )}
        </div>
      )}

      {Array.isArray(data.recommendedSystems) && data.recommendedSystems.length > 0 && (
        <div className="audit-report__systems">
          <p className="audit-report__label">Recommended Systems</p>
          <ul className="audit-report__system-tags">
            {data.recommendedSystems.map((system) => (
              <li key={system}>{system}</li>
            ))}
          </ul>
          <Link to="/solutions" className="audit-report__systems-link">
            See how NAMI builds systems like these →
          </Link>
        </div>
      )}

      {(data.auditId || data.architectureConfidence || data.status) && (
        <div className="audit-report__meta">
          {data.auditId && <span>Audit ID · {data.auditId}</span>}
          {data.architectureConfidence && <span>Confidence · {data.architectureConfidence}</span>}
          {data.status && <span>Status · {data.status}</span>}
        </div>
      )}

      <div className="audit-report__next-step">
        <p className="audit-report__label">Recommended Next Step</p>
        <p>
          Book a complimentary 30-minute Automation Strategy Call to review these findings, discuss
          implementation options, and receive a tailored roadmap.
        </p>
        <button type="button" className="btn btn-primary" onClick={() => openStrategyCall('audit-report')}>
          Book My Strategy Call
        </button>
      </div>

      <div className="audit-report__cta">
        <h2>Want NAMI to build this workflow?</h2>
        <p>
          We can turn this automation architecture into a production-ready system connected to your
          existing tools and business processes.
        </p>
        <div className="audit-report__cta-actions">
          <button type="button" className="btn btn-primary" onClick={handleBuildThis}>
            Build This Automation
          </button>
          <button type="button" className="btn btn-secondary" onClick={handleAskNami}>
            Ask NamiAI About This Audit
          </button>
        </div>
        <button type="button" className="btn btn-ghost audit-report__restart" onClick={onStartOver}>
          Run another audit
        </button>
      </div>
    </div>
  );
}
