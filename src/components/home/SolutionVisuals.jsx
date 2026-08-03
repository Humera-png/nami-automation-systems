import useTimedSequence from '../../hooks/useTimedSequence';
import useReducedMotion from '../../hooks/useReducedMotion';
import './SolutionVisuals.css';

const GATES = [
  { id: 'request', label: 'Request', status: 'Event received' },
  { id: 'validation', label: 'Validation', status: 'Validation passed' },
  { id: 'approval', label: 'Approval', status: 'Approval required' },
  { id: 'update', label: 'Update', status: 'System updated' }
];

export function OperationsVisual() {
  const reducedMotion = useReducedMotion();
  const { index } = useTimedSequence(GATES.map(() => 1200), { loop: true });
  const activeIndex = Math.max(index, 0);

  return (
    <div className="ops-visual">
      <div className="ops-visual__gates">
        <div className="ops-visual__rail" />
        {!reducedMotion && (
          <div className="ops-visual__pulse-track">
            <span className="ops-visual__pulse" key={index} style={{ '--i': index }} />
          </div>
        )}
        {GATES.map((gate, i) => {
          const state = i < index ? 'complete' : i === index ? 'active' : 'pending';
          return (
            <div key={gate.id} className={`ops-visual__gate is-${state}`} style={{ '--gate-offset': i % 2 === 0 ? '0px' : '10px' }}>
              <span className="ops-visual__gate-dot" />
              <span className="ops-visual__gate-label">{gate.label}</span>
            </div>
          );
        })}
      </div>
      <ul className="ops-visual__events" aria-hidden="true">
        {GATES.map((gate, i) => (
          <li key={gate.id} className={`ops-visual__event ${i === activeIndex ? 'is-active' : ''}`}>
            <span className="ops-visual__event-dot" />
            {gate.status.toUpperCase()}
          </li>
        ))}
      </ul>
    </div>
  );
}

const RAW_FRAGMENTS = ['"Urgent request received…"', '"Invoice discrepancy…"', '"Follow-up pending…"'];
const ANALYSIS_ROWS = [
  { field: 'Intent', value: 'Request' },
  { field: 'Priority', value: 'High' },
  { field: 'Department', value: 'Operations' },
  { field: 'Confidence', value: '94%' }
];
const ACTION_ROWS = ['Route to Operations', 'Create Review Task', 'Draft Response'];

// Three phases: raw fragments only -> analysis surface resolves -> actions
// generate one at a time. Loops slowly so the card reads as an AI system
// actively processing, not a static illustration.
const AI_DURATIONS = [1100, 900, 700, 700, 700, 1600];

export function AIWorkflowVisual() {
  const { index } = useTimedSequence(AI_DURATIONS, { loop: true });
  const phase = Math.max(index, 0);
  const isAnalysing = phase >= 1;
  const revealedActions = phase >= 3 ? Math.min(phase - 2, ACTION_ROWS.length) : 0;

  return (
    <div className="ai-visual">
      <div className="ai-visual__col ai-visual__col--raw">
        <span className="ai-visual__col-label">Raw input</span>
        {RAW_FRAGMENTS.map((line, i) => (
          <p key={line} className={`ai-visual__fragment ${isAnalysing ? 'is-resolved' : ''}`} style={{ '--tilt': `${i % 2 === 0 ? -1.5 : 1.5}deg` }}>
            {line}
          </p>
        ))}
      </div>

      <div className={`ai-visual__col ai-visual__col--analysis ${isAnalysing ? 'is-active' : ''}`}>
        <span className="ai-visual__col-label">Context analysis</span>
        {ANALYSIS_ROWS.map((row, i) => (
          <div key={row.field} className={`ai-visual__row ${isAnalysing ? 'is-visible' : ''}`} style={{ transitionDelay: `${i * 90}ms` }}>
            <span className="ai-visual__field">{row.field}</span>
            <span className="ai-visual__value">{row.value}</span>
          </div>
        ))}
      </div>

      <div className="ai-visual__col ai-visual__col--action">
        <span className="ai-visual__col-label">Action generated</span>
        {ACTION_ROWS.map((action, i) => (
          <div key={action} className={`ai-visual__action ${i < revealedActions ? 'is-visible' : ''}`}>
            <span className="ai-visual__action-dot" />
            {action}
          </div>
        ))}
      </div>
    </div>
  );
}

const LAYERS = [
  { id: 'ui', label: 'Interface', details: ['Dashboard', 'Requests', 'Approvals'] },
  { id: 'api', label: 'API layer', details: ['POST /requests', 'GET /status'] },
  { id: 'logic', label: 'Business logic', details: ['Validate', 'Route', 'Authorise'] },
  { id: 'db', label: 'Database', details: ['Requests', 'Users', 'Events'] }
];

export function CustomSystemsVisual() {
  return (
    <div className="stack-visual">
      {LAYERS.map((layer, i) => (
        <div key={layer.id} className={`stack-visual__layer stack-visual__layer--${layer.id}`}>
          {i === 0 && (
            <div className="stack-visual__chrome">
              <span />
              <span />
              <span />
            </div>
          )}
          <span className="stack-visual__label">{layer.label}</span>
          <span className="stack-visual__details">{layer.details.join(' · ')}</span>
        </div>
      ))}
    </div>
  );
}
