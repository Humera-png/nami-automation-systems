import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import WorkflowStatus from '../workflow/WorkflowStatus';
import Reveal from '../motion/Reveal';
import useTimedSequence from '../../hooks/useTimedSequence';
import './SystemArchitecturePreview.css';

const LAYERS = [
  { label: 'Website', type: 'trigger', status: 'Request received' },
  { label: 'AI Agent', type: 'ai', status: 'Intent understood' },
  { label: 'Business Logic', type: 'system', status: 'Rules applied' },
  { label: 'CRM', type: 'storage', status: 'Record updated' },
  { label: 'ERP', type: 'storage', status: 'Operations synced' },
  { label: 'Human Approval', type: 'human', status: 'Reviewed by your team' },
  { label: 'Notifications', type: 'action', status: 'Stakeholders notified' }
];

const DURATIONS = LAYERS.map(() => 1500);

export default function SystemArchitecturePreview() {
  const { index: phase } = useTimedSequence(DURATIONS, { loop: true });
  const statusLabel = phase >= 0 ? LAYERS[phase].status : ' ';

  return (
    <section className="architecture-preview">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow eyebrow--number">05 / System Architecture</p>
          <h2>One system, engineered end to end.</h2>
          <p>
            Every NAMI system follows the same disciplined shape: a trigger, AI reasoning where it
            genuinely helps, deterministic logic everywhere else, and a person still in control of what
            actually happens.
          </p>
        </Reveal>

        <div className="architecture-preview__layout">
          <ol className="architecture-preview__path">
            {LAYERS.map((layer, i) => {
              const isComplete = phase > i;
              const isCurrent = phase === i;
              const state = isComplete ? 'complete' : isCurrent ? 'active' : 'pending';
              return (
                <li className="architecture-preview__item" key={layer.label}>
                  <WorkflowNode label={layer.label} type={layer.type} state={state} inverse />
                  {i < LAYERS.length - 1 && <WorkflowPath axis="y" active={phase > i} inverse />}
                </li>
              );
            })}
          </ol>

          <WorkflowStatus label={statusLabel} system="NAMI Orchestration" active={phase >= 0} inverse />
        </div>
      </div>
    </section>
  );
}
