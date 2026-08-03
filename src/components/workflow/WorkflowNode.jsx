import ProcessingIndicator from './ProcessingIndicator';
import './WorkflowNode.css';

/**
 * A single node in a workflow: a trigger, an AI step, a system, an action.
 * state: 'pending' (not yet reached) | 'active' (current) | 'processing' | 'complete'
 */
export default function WorkflowNode({ label, type = 'process', state = 'pending', compact = false, inverse = false }) {
  return (
    <div
      className={[
        'wf-node',
        `wf-node--${type}`,
        `is-${state}`,
        compact ? 'wf-node--compact' : '',
        inverse ? 'wf-node--inverse' : ''
      ]
        .join(' ')
        .trim()}
    >
      <span className="wf-node__dot" />
      <span className="wf-node__label">{label}</span>
      {state === 'processing' && <ProcessingIndicator inverse={inverse} />}
    </div>
  );
}
