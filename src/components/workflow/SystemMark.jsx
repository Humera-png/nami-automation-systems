import './SystemMark.css';

/**
 * The NAMI system vocabulary — each stage kind gets its own FORM, not a
 * pill with a different colour. Pills are reserved for genuine
 * selection/status/category use; a workflow stage gets a shape that
 * means something: a trigger is a point, data is a slab, a decision is
 * a gate, approval is a frame, action is a solid block, storage is
 * stacked layers.
 */
export default function SystemMark({ kind = 'process', label, state = 'pending', compact = false }) {
  return (
    <div className={`system-mark system-mark--${kind} is-${state} ${compact ? 'system-mark--compact' : ''}`}>
      <span className="system-mark__form" aria-hidden="true">
        {kind === 'storage' && (
          <>
            <span className="system-mark__layer" />
            <span className="system-mark__layer" />
            <span className="system-mark__layer" />
          </>
        )}
        {kind === 'ai' && <span className="system-mark__depth" />}
      </span>
      {label && <span className="system-mark__label">{label}</span>}
    </div>
  );
}
