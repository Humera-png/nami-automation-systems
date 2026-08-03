import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';
import { openStrategyCall } from '../../services/calendly';
import HeroSystemVisual from './HeroSystemVisual';
import './Hero.css';

export default function Hero() {
  const reducedMotion = useReducedMotion();
  const initial = reducedMotion ? false : { opacity: 0, y: 18 };
  const animate = { opacity: 1, y: 0 };

  return (
    <section className="heroScene">
      <div className="container heroScene__inner">
        <div className="heroEditorial">
          <motion.p className="eyebrow" initial={initial} animate={animate} transition={{ duration: 0.6 }}>
            AI Automation Systems
          </motion.p>
          <h1 className="heroEditorial__headline">
            <motion.span
              className="heroEditorial__headline-line"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={animate}
              transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            >
              Your workflow.
            </motion.span>
            <motion.span
              className="heroEditorial__headline-line"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={animate}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              Architected into
            </motion.span>
            <motion.span
              className="heroEditorial__headline-line"
              initial={reducedMotion ? false : { opacity: 0, y: 14 }}
              animate={animate}
              transition={{ duration: 0.6, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            >
              a system.
            </motion.span>
          </h1>
          <motion.p
            className="heroEditorial__paragraph"
            initial={initial}
            animate={animate}
            transition={{ duration: 0.7, delay: 0.18 }}
          >
            NAMI analyses how work moves through your business, identifies repetitive operations and
            decision points, then builds connected automation systems around the process.
          </motion.p>
          <motion.div
            className="heroEditorial__actions"
            initial={initial}
            animate={animate}
            transition={{ duration: 0.7, delay: 0.26 }}
          >
            <button type="button" className="btn btn-primary" onClick={() => openStrategyCall('hero')}>
              Book a Strategy Call
            </button>
            <Link to="/solutions" className="btn btn-secondary">
              Explore Solutions
            </Link>
          </motion.div>
          <Link to="/how-nami-works" className="heroEditorial__link">
            See how NAMI works →
          </Link>

          <motion.ul
            className="heroEditorial__trust"
            initial={initial}
            animate={animate}
            transition={{ duration: 0.7, delay: 0.34 }}
          >
            <li>Built around your existing tools</li>
            <li>Human oversight retained</li>
            <li>Engineered, not templated</li>
          </motion.ul>
        </div>

        <div className="heroSpatialStage">
          <HeroSystemVisual />
        </div>
      </div>
    </section>
  );
}
