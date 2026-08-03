import './ProcessingIndicator.css';

export default function ProcessingIndicator({ label, inverse = false }) {
  return (
    <span className={`processing-indicator ${inverse ? 'processing-indicator--inverse' : ''}`}>
      <span className="processing-indicator__dots" aria-hidden="true">
        <span className="processing-indicator__dot" />
        <span className="processing-indicator__dot" />
        <span className="processing-indicator__dot" />
      </span>
      {label && <span className="processing-indicator__label">{label}</span>}
    </span>
  );
}
