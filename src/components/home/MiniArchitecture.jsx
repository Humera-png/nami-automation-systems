import useTimedSequence from '../../hooks/useTimedSequence';
import useReducedMotion from '../../hooks/useReducedMotion';
import './MiniArchitecture.css';

// Small architecture diagrams for the Solutions cards — sized to fill the
// card's space intentionally, using the same restrained shape language as
// the hero graph (circle/slab/glow-square/diamond/outline/solid).

const PATTERNS = {
  branch: {
    viewBox: '0 0 100 116',
    nodes: [
      { id: 'request', x: 50, y: 10, kind: 'input' },
      { id: 'validation', x: 50, y: 32, kind: 'data' },
      { id: 'decision', x: 50, y: 54, kind: 'decision' },
      { id: 'approve', x: 28, y: 78, kind: 'approval' },
      { id: 'continue', x: 72, y: 78, kind: 'data' },
      { id: 'update', x: 50, y: 102, kind: 'action' }
    ],
    edges: [
      ['request', 'validation'],
      ['validation', 'decision'],
      ['decision', 'approve'],
      ['decision', 'continue'],
      ['approve', 'update'],
      ['continue', 'update']
    ]
  },
  chain: {
    viewBox: '0 0 100 108',
    nodes: [
      { id: 'input', x: 50, y: 10, kind: 'input' },
      { id: 'context', x: 50, y: 38, kind: 'data' },
      { id: 'reasoning', x: 50, y: 66, kind: 'ai' },
      { id: 'output', x: 50, y: 96, kind: 'action' }
    ],
    edges: [
      ['input', 'context'],
      ['context', 'reasoning'],
      ['reasoning', 'output']
    ]
  },
  stack: {
    viewBox: '0 0 100 100',
    nodes: [
      { id: 'interface', x: 50, y: 12, kind: 'layer', width: 64 },
      { id: 'api', x: 50, y: 38, kind: 'layer', width: 50 },
      { id: 'logic', x: 50, y: 64, kind: 'layer', width: 56 },
      { id: 'database', x: 50, y: 90, kind: 'layer', width: 44 }
    ],
    edges: [
      ['interface', 'api'],
      ['api', 'logic'],
      ['logic', 'database']
    ]
  }
};

function nodeById(nodes, id) {
  return nodes.find((n) => n.id === id);
}

export default function MiniArchitecture({ pattern }) {
  const reducedMotion = useReducedMotion();
  const config = PATTERNS[pattern];
  const durations = config.nodes.map(() => 1100);
  const { index: activeIndex } = useTimedSequence(durations, { loop: true });

  return (
    <svg className="mini-arch" viewBox={config.viewBox} preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <defs>
        <filter id={`mini-arch-glow-${pattern}`} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {config.edges.map(([fromId, toId], i) => {
        const from = nodeById(config.nodes, fromId);
        const to = nodeById(config.nodes, toId);
        const isVertical = pattern === 'stack';
        const d = isVertical
          ? `M ${from.x} ${from.y + 4} L ${to.x} ${to.y - 4}`
          : `M ${from.x} ${from.y} C ${from.x} ${(from.y + to.y) / 2}, ${to.x} ${(from.y + to.y) / 2}, ${to.x} ${to.y}`;
        return <path key={i} d={d} className="mini-arch__edge" />;
      })}

      {!reducedMotion &&
        pattern === 'stack' &&
        config.edges.map(([fromId], i) => {
          const from = nodeById(config.nodes, fromId);
          const d = `M ${from.x - from.width / 2 + 4} ${from.y} L ${from.x + from.width / 2 - 4} ${from.y}`;
          return (
            <circle key={fromId} r="0.9" className="mini-arch__pulse">
              <animateMotion dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={d} />
            </circle>
          );
        })}

      {config.nodes.map((node, i) => {
        const isCurrent = i === activeIndex;
        return (
          <g key={node.id} transform={`translate(${node.x}, ${node.y})`} className={`mini-arch__node mini-arch__node--${node.kind} ${isCurrent ? 'is-current' : ''}`}>
            {node.kind === 'input' && <circle r="2.6" />}
            {node.kind === 'data' && <rect x="-6" y="-2" width="12" height="4" rx="1.6" />}
            {node.kind === 'ai' && (
              <rect x="-3.4" y="-3.4" width="6.8" height="6.8" rx="1.2" filter={isCurrent ? `url(#mini-arch-glow-${pattern})` : undefined} />
            )}
            {node.kind === 'decision' && <rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx="0.8" transform="rotate(45)" />}
            {node.kind === 'approval' && <rect x="-3" y="-3" width="6" height="6" rx="1.2" className="mini-arch__node-outline" />}
            {node.kind === 'action' && <rect x="-3.6" y="-3.6" width="7.2" height="7.2" rx="1.4" />}
            {node.kind === 'layer' && <rect x={-node.width / 2} y="-3.4" width={node.width} height="6.8" rx="1.6" />}
          </g>
        );
      })}
    </svg>
  );
}
