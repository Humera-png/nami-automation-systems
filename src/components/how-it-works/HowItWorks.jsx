import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import WorkflowStatus from '../workflow/WorkflowStatus';
import Reveal from '../motion/Reveal';
import useTimedSequence from '../../hooks/useTimedSequence';
import './HowItWorks.css';

const STAGES = [
  {
    number: '01',
    node: 'Understand',
    type: 'trigger',
    title: 'Understand',
    description: 'We map how the process actually works today — the tools involved, the manual steps, and where time gets lost.',
    status: 'Process mapped'
  },
  {
    number: '02',
    node: 'Design',
    type: 'ai',
    title: 'Design',
    description:
      'We design the automation architecture: what stays deterministic, where AI genuinely helps, and where a person needs to stay in control.',
    status: 'Architecture designed'
  },
  {
    number: '03',
    node: 'Build',
    type: 'system',
    title: 'Build',
    description: 'We build the system — the workflows, the logic, and the data movement between every tool involved.',
    status: 'System built'
  },
  {
    number: '04',
    node: 'Integrate',
    type: 'system',
    title: 'Integrate',
    description: 'We connect it to the software you already use, so nothing about how your team works has to change.',
    status: 'Tools connected'
  },
  {
    number: '05',
    node: 'Test',
    type: 'decision',
    title: 'Test',
    description: 'We run real scenarios through the system, including edge cases and failure paths, before it touches live work.',
    status: 'Scenarios verified'
  },
  {
    number: '06',
    node: 'Launch',
    type: 'action',
    title: 'Launch',
    description: 'We deploy the system into your operations and monitor it closely through the first live cycles.',
    status: 'System live'
  },
  {
    number: '07',
    node: 'Support',
    type: 'human',
    title: 'Support',
    description: 'We stay on to refine the system as your process evolves, not disappear after handoff.',
    status: 'Support active'
  }
];

const DURATIONS = STAGES.map(() => 1700);

export default function HowItWorks() {
  const { index: phase } = useTimedSequence(DURATIONS, { loop: true });
  const statusLabel = phase >= 0 ? STAGES[phase].status : ' ';

  return (
    <section id="how-it-works" className="how-it-works">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">How NAMI Works</p>
          <h1>We don&apos;t automate blindly.</h1>
        </Reveal>

        <ol className="how-it-works__path" role="img" aria-label="System lifecycle: discover, architect, engineer, optimise.">
          {STAGES.map((stage, i) => {
            const isComplete = phase > i;
            const isCurrent = phase === i;
            const state = isComplete ? 'complete' : isCurrent ? 'active' : 'pending';
            return (
              <li className="how-it-works__path-item" key={stage.node}>
                <WorkflowNode label={stage.node} type={stage.type} state={state} compact />
                {i < STAGES.length - 1 && <WorkflowPath axis="x" active={phase > i} />}
              </li>
            );
          })}
        </ol>

        <WorkflowStatus label={statusLabel} system="NAMI Orchestration" active={phase >= 0} />

        <ol className="how-it-works__stages">
          {STAGES.map((stage, index) => {
            const isCurrent = phase === index;
            return (
              <li className={`how-it-works__stage ${isCurrent ? 'is-current' : ''}`} key={stage.number}>
                <span className="how-it-works__number">{stage.number}</span>
                <h2>{stage.title}</h2>
                <p>{stage.description}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
