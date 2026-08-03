import './WorkflowStatus.css';

/**
 * The small monospace system-status line used under live workflow visuals:
 * a pulse, the current operational label, and optional system / execution meta.
 */
export default function WorkflowStatus({ label, system, meta, inverse = false, active = true }) {
  return (
    <div className={`wf-status ${inverse ? 'wf-status--inverse' : ''}`}>
      <div className="wf-status__row">
        <span className={`wf-status__pulse ${active ? 'is-active' : ''}`} aria-hidden="true" />
        <span className="wf-status__label">{label || ' '}</span>
      </div>
      {(system || meta) && (
        <div className="wf-status__meta">
          {system && <span>{system}</span>}
          {meta && <span>{meta}</span>}
        </div>
      )}
    </div>
  );
}
