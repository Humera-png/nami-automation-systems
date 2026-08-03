import AutomationSignal from './AutomationSignal';
import './WorkflowPath.css';

/**
 * Connector between two WorkflowNodes. Carries the AutomationSignal when active.
 */
export default function WorkflowPath({ axis = 'x', active = false, compact = false, inverse = false }) {
  return (
    <div
      className={['wf-path', `wf-path--${axis}`, active ? 'is-active' : '', compact ? 'wf-path--compact' : '', inverse ? 'wf-path--inverse' : '']
        .join(' ')
        .trim()}
      aria-hidden="true"
    >
      <span className="wf-path__line" />
      <AutomationSignal axis={axis} active={active} inverse={inverse} />
    </div>
  );
}
