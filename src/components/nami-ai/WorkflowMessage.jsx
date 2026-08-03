import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import './WorkflowMessage.css';

function normaliseStep(step, index, total) {
  if (typeof step === 'string') {
    const type = index === 0 ? 'trigger' : index === total - 1 ? 'action' : 'ai';
    return { label: step, type };
  }
  return { label: step.label, type: step.type || 'process' };
}

/**
 * Renders a workflow architecture surfaced by NamiAI separately from the
 * conversational text, so it reads as a generated system rather than prose.
 */
export default function WorkflowMessage({ steps }) {
  if (!steps || steps.length === 0) return null;
  const normalised = steps.map((step, i) => normaliseStep(step, i, steps.length));

  return (
    <div
      className="nami-workflow"
      role="img"
      aria-label={`Potential workflow: ${normalised.map((step) => step.label).join(' then ')}`}
    >
      <p className="nami-workflow__label">Potential workflow</p>
      <ol className="nami-workflow__chain" aria-hidden="true">
        {normalised.map((step, i) => (
          <li className="nami-workflow__item" key={`${step.label}-${i}`}>
            <WorkflowNode label={step.label} type={step.type} state="complete" compact />
            {i < normalised.length - 1 && <WorkflowPath axis="x" active compact />}
          </li>
        ))}
      </ol>
    </div>
  );
}
