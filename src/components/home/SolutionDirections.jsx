import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { OperationsVisual, AIWorkflowVisual, CustomSystemsVisual } from './SolutionVisuals';
import Reveal from '../motion/Reveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import './SolutionDirections.css';

const MotionLink = motion(Link);

const DIRECTIONS = [
  {
    id: 'operations',
    name: 'Operations Automation',
    description:
      'Every request, approval, and handoff your team pushes through by hand — replaced with a system that runs the process and updates the record itself.',
    Visual: OperationsVisual
  },
  {
    id: 'ai-workflows',
    name: 'AI Workflow Systems',
    description:
      'NAMI reads incoming requests, understands intent, drafts the response or action, and routes it to the right person — stepping back wherever real judgement is required.',
    Visual: AIWorkflowVisual
  },
  {
    id: 'custom-systems',
    name: 'Custom Business Systems',
    description:
      'When off-the-shelf tools can’t keep up with how the business actually runs, NAMI builds the interface, logic, and data layer the operation needs.',
    Visual: CustomSystemsVisual
  }
];

function SolutionCard({ item, delay, reducedMotion }) {
  return (
    <MotionLink
      to="/solutions"
      className={`solution-directions__item solution-directions__item--${item.id}`}
      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="solution-directions__visual">
        <item.Visual />
      </div>
      <div className="solution-directions__content">
        <h3 className="solution-directions__title">{item.name}</h3>
        <p className="solution-directions__description">{item.description}</p>
      </div>
      <span className="solution-directions__arrow">→</span>
    </MotionLink>
  );
}

export default function SolutionDirections() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="solution-directions">
      <div className="container">
        <Reveal as="div" className="solution-directions__header">
          <p className="eyebrow eyebrow--number">03 / Solutions</p>
          <h2>Three ways NAMI builds around your operations.</h2>
          <ul className="solution-directions__trust">
            <li>Enterprise-ready</li>
            <li>Integrates with your existing stack</li>
            <li>Scalable architecture</li>
          </ul>
        </Reveal>

        <div className="solution-directions__grid">
          {DIRECTIONS.map((item, i) => (
            <SolutionCard item={item} delay={i * 0.1} reducedMotion={reducedMotion} key={item.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
