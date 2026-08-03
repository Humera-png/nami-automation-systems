import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';
import SystemMark from '../workflow/SystemMark';
import Reveal from '../motion/Reveal';
import './ArchitecturePrinciples.css';

const PRINCIPLES = [
  { number: '01', text: 'Understand the process first.', kind: 'data' },
  { number: '02', text: 'Automate deterministic work.', kind: 'action' },
  { number: '03', text: 'Use AI selectively.', kind: 'ai' },
  { number: '04', text: 'Keep humans at judgement points.', kind: 'approval' },
  { number: '05', text: 'Design for failure and exceptions.', kind: 'decision' },
  { number: '06', text: 'Measure operational impact.', kind: 'storage' }
];

export default function ArchitecturePrinciples() {
  const reducedMotion = useReducedMotion();

  return (
    <section id="principles" className="principles" data-navbar-theme="dark">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">System Orchestration</p>
          <h2>Real workflow. Real impact.</h2>
        </Reveal>

        <ol className="principles__list">
          {PRINCIPLES.map((principle) => (
            <motion.li
              key={principle.number}
              className="principles__item"
              initial={reducedMotion ? false : { opacity: 0.3 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: false, margin: '-40% 0px -40% 0px' }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <span className="principles__number">{principle.number}</span>
              <span className="principles__text">{principle.text}</span>
              <span className="principles__mark">
                <SystemMark kind={principle.kind} state="complete" compact />
              </span>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
