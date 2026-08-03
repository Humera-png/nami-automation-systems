import useReducedMotion from '../../hooks/useReducedMotion';
import './FinalCTAVisual.css';

// A quiet architectural backdrop for the final CTA — a wide, faint chain
// of system shapes (echoing the hero graph's vocabulary) with one slow
// travelling signal, so the section reads as "the system, still running"
// rather than empty dark space behind the heading.
const NODES = [
  { x: 8, y: 20, kind: 'input' },
  { x: 26, y: 8, kind: 'data' },
  { x: 44, y: 26, kind: 'ai' },
  { x: 62, y: 10, kind: 'decision' },
  { x: 80, y: 24, kind: 'data' },
  { x: 96, y: 12, kind: 'action' }
];

const PATH = NODES.map((n, i) => `${i === 0 ? 'M' : 'L'} ${n.x} ${n.y}`).join(' ');

export default function FinalCTAVisual() {
  const reducedMotion = useReducedMotion();

  return (
    <svg className="final-cta-visual" viewBox="0 0 104 34" preserveAspectRatio="none" aria-hidden="true">
      <path d={PATH} className="final-cta-visual__line" />
      {NODES.map((node) => (
        <g key={`${node.x}-${node.y}`} transform={`translate(${node.x}, ${node.y})`} className={`final-cta-visual__node final-cta-visual__node--${node.kind}`}>
          {node.kind === 'input' && <circle r="1.6" />}
          {node.kind === 'data' && <rect x="-2.6" y="-1" width="5.2" height="2" rx="0.8" />}
          {node.kind === 'ai' && <rect x="-1.6" y="-1.6" width="3.2" height="3.2" rx="0.6" />}
          {node.kind === 'decision' && <rect x="-1.3" y="-1.3" width="2.6" height="2.6" transform="rotate(45)" />}
          {node.kind === 'action' && <rect x="-1.8" y="-1.8" width="3.6" height="3.6" rx="0.7" />}
        </g>
      ))}
      {!reducedMotion && (
        <circle r="0.7" className="final-cta-visual__pulse">
          <animateMotion dur="7s" repeatCount="indefinite" path={PATH} />
        </circle>
      )}
    </svg>
  );
}
