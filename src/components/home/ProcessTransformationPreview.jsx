import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import Reveal from '../motion/Reveal';
import useReducedMotion from '../../hooks/useReducedMotion';
import './ProcessTransformationPreview.css';

const FRAGMENTS = [
  { id: 'email', label: 'Email', x: -18, y: -34, rotate: -7 },
  { id: 'form', label: 'Form', x: 14, y: -20, rotate: 5 },
  { id: 'sheet', label: 'Spreadsheet', x: -26, y: 2, rotate: 4 },
  { id: 'crm', label: 'CRM', x: 10, y: 16, rotate: -5 },
  { id: 'review', label: 'Review', x: -12, y: 34, rotate: 6 },
  { id: 'approval', label: 'Approval', x: 20, y: 44, rotate: -4 }
];

const RESOLVED_STEPS = ['Capture', 'Validate', 'AI Context', 'Decide', 'Update'];

export default function ProcessTransformationPreview() {
  const reducedMotion = useReducedMotion();

  return (
    <section className="process-preview">
      <div className="container">
        <Reveal as="div" className="process-preview__header">
          <p className="eyebrow eyebrow--number">02 / Transformation</p>
          <h2>Fragmented process. One connected system.</h2>
        </Reveal>

        <div className="process-preview__scene">
          <div className="process-preview__fragments">
            <span className="process-preview__zone-label">Before</span>
            {FRAGMENTS.map((fragment, i) => (
              <motion.div
                key={fragment.id}
                className="process-preview__fragment"
                initial={reducedMotion ? false : { x: fragment.x, y: fragment.y, rotate: fragment.rotate, opacity: 0.7 }}
                whileInView={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay: i * 0.07 }}
              >
                {fragment.label}
              </motion.div>
            ))}
          </div>

          <div className="process-preview__bridge">
            <svg className="process-preview__bridge-svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              {FRAGMENTS.map((fragment, i) => {
                const startY = 50 + fragment.y * 0.9;
                return (
                  <motion.path
                    key={fragment.id}
                    d={`M 0 ${startY} C 40 ${startY}, 60 50, 100 50`}
                    className="process-preview__bridge-line"
                    initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 0.8 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 1.1, ease: 'easeOut', delay: 0.35 + i * 0.05 }}
                  />
                );
              })}
            </svg>
            <motion.span
              className="process-preview__bridge-mark"
              initial={reducedMotion ? false : { scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: 0.9 }}
            >
              NAMI
            </motion.span>
          </div>

          <motion.div
            className="process-preview__resolved"
            initial={reducedMotion ? false : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="process-preview__zone-label">After</span>
            <div className="process-preview__resolved-panel">
              {RESOLVED_STEPS.map((step, i) => (
                <div className="process-preview__resolved-row" key={step}>
                  <span className="process-preview__resolved-dot" style={{ '--delay': `${1 + i * 0.15}s` }} />
                  <span className="process-preview__resolved-label">{step}</span>
                </div>
              ))}
              <div className="process-preview__resolved-tag">One connected architecture</div>
            </div>
          </motion.div>
        </div>

        <Link to="/how-nami-works" className="process-preview__link">
          See how NAMI works →
        </Link>
      </div>
    </section>
  );
}
