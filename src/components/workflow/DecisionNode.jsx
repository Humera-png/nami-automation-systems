import WorkflowNode from './WorkflowNode';
import './DecisionNode.css';

/**
 * A qualification / branching moment in a workflow — e.g. "Qualified?" — that
 * reveals its taken branch (YES / NO) once the decision has resolved.
 */
export default function DecisionNode({ question, state = 'pending', branch, compact = false, inverse = false }) {
  return (
    <div className={`wf-decision is-${state}`}>
      <WorkflowNode label={question} type="decision" state={state} compact={compact} inverse={inverse} />
      {branch && (state === 'complete' || state === 'active') && (
        <span className={`wf-decision__branch ${inverse ? 'wf-decision__branch--inverse' : ''}`}>{branch}</span>
      )}
    </div>
  );
}
