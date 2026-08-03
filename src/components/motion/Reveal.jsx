import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * The site's single editorial scroll-reveal primitive: fades and lifts
 * content into place once as it enters the viewport. Falls back to a
 * plain static element when the visitor prefers reduced motion, so this
 * is safe to wrap around anything without a second reduced-motion check.
 */
export default function Reveal({ children, as = 'div', delay = 0, y = 22, once = true, className = '', ...rest }) {
  const reducedMotion = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reducedMotion) {
    const StaticTag = as;
    return (
      <StaticTag className={className} {...rest}>
        {children}
      </StaticTag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
