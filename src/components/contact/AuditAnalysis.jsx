import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import ProcessingIndicator from '../workflow/ProcessingIndicator';
import useTimedSequence from '../../hooks/useTimedSequence';
import './AuditAnalysis.css';

const STAGES = [
  { label: 'Reading your business process', node: 'Read', type: 'trigger' },
  { label: 'Identifying repetitive work', node: 'Identify', type: 'ai' },
  { label: 'Mapping data and decisions', node: 'Map', type: 'ai' },
  { label: 'Designing an automation architecture', node: 'Design', type: 'system' },
  { label: 'Calculating opportunity score', node: 'Score', type: 'action' }
];

// Cycles through the stages once over ~7s, then rests on the final stage
// (with a live processing indicator) for however long the real request
// actually takes. These are progress messages, not real backend events.
const DURATIONS = [1500, 1500, 1500, 1500, 600000];

export default function AuditAnalysis() {
  const { index: phase } = useTimedSequence(DURATIONS, { loop: false });
  const activeIndex = Math.max(phase, 0);

  return (
    <div className="audit-analysis" role="status" aria-live="polite">
      <p className="eyebrow">NAMI is analysing your process</p>
      <h1>Building your automation architecture.</h1>

      <ol className="audit-analysis__map" aria-hidden="true">
        {STAGES.map((stage, i) => {
          const isComplete = i < activeIndex;
          const isCurrent = i === activeIndex;
          const state = isComplete ? 'complete' : isCurrent ? 'processing' : 'pending';
          return (
            <li className="audit-analysis__map-item" key={stage.node}>
              <WorkflowNode label={stage.node} type={stage.type} state={state} compact />
              {i < STAGES.length - 1 && <WorkflowPath axis="x" active={i < activeIndex} compact />}
            </li>
          );
        })}
      </ol>

      <ol className="audit-analysis__stages">
        {STAGES.map((stage, i) => {
          const isComplete = i < activeIndex;
          const isCurrent = i === activeIndex;
          return (
            <li
              key={stage.label}
              className={`audit-analysis__stage ${isComplete ? 'is-complete' : ''} ${isCurrent ? 'is-current' : ''}`}
            >
              <span className="audit-analysis__stage-number">{String(i + 1).padStart(2, '0')}</span>
              <span className="audit-analysis__stage-label">{stage.label}</span>
              {isCurrent && <ProcessingIndicator />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
