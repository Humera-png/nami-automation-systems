import { motion } from 'framer-motion';
import useReducedMotion from '../../hooks/useReducedMotion';

/**
 * Wraps a page's content in a short, restrained enter transition — used
 * per-route so navigating the new multi-page site doesn't feel like a
 * hard reload. Kept to ~450ms per the brief (no 2-second animations).
 */
export default function PageTransition({ children }) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) return <div className="page-shell">{children}</div>;

  return (
    <motion.div
      className="page-shell"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
