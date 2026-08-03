import { Link } from 'react-router-dom';
import { ManualHandoffVisual, DecisionLoopVisual, FollowUpQueueVisual } from './GapVisuals';
import Reveal from '../motion/Reveal';
import './ProblemValue.css';

const ZONES = [
  {
    id: 'handoffs',
    title: 'Manual handoffs',
    description: 'Information copied between systems that should already talk to each other.',
    size: 'large'
  },
  {
    id: 'decisions',
    title: 'Repetitive decisions',
    description: 'The same check performed again and again, by hand, every time.',
    size: 'small'
  },
  {
    id: 'followups',
    title: 'Follow-up operations',
    description: 'Teams manually preparing and tracking routine communication.',
    size: 'small'
  }
];

export default function ProblemValue() {
  return (
    <section className="problem-value">
      <div className="container">
        <Reveal as="div" className="problem-value__header">
          <p className="eyebrow eyebrow--number">01 / The Gap</p>
          <h2>Your team is doing work your systems should handle.</h2>
        </Reveal>

        <div className="problem-value__field">
          <div className="problem-value__row-top">
            <Reveal as="div" className="problem-value__zone problem-value__zone--large" delay={0}>
              <div className="problem-value__visual problem-value__visual--large">
                <ManualHandoffVisual />
              </div>
              <div className="problem-value__copy">
                <h3>{ZONES[0].title}</h3>
                <p>{ZONES[0].description}</p>
              </div>
            </Reveal>

            <Reveal as="div" className="problem-value__zone problem-value__zone--small" delay={0.1}>
              <div className="problem-value__visual">
                <DecisionLoopVisual />
              </div>
              <div className="problem-value__copy">
                <h3>{ZONES[1].title}</h3>
                <p>{ZONES[1].description}</p>
              </div>
            </Reveal>
          </div>

          <Reveal as="div" className="problem-value__zone problem-value__zone--wide" delay={0.2}>
            <div className="problem-value__visual problem-value__visual--queue">
              <FollowUpQueueVisual />
            </div>
            <div className="problem-value__copy">
              <p className="problem-value__eyebrow">Manual, every time</p>
              <h3>{ZONES[2].title}</h3>
              <p>{ZONES[2].description}</p>
              <p className="problem-value__note">
                No reminders fire on their own — someone has to notice, decide, and act on every single one.
              </p>
            </div>
          </Reveal>
        </div>

        <Link to="/solutions" className="problem-value__link">
          Explore Solutions →
        </Link>
      </div>
    </section>
  );
}
