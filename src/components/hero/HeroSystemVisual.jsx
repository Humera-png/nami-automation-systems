import useTimedSequence from '../../hooks/useTimedSequence';
import useReducedMotion from '../../hooks/useReducedMotion';
import './HeroSystemVisual.css';

// A restrained abstract system graph — NOT a workflow diagram with labels
// on every step. Branching architecture: input → capture → context → a
// real decision split → two paths (review/approval, continue/update) →
// converging on one action node. Shapes carry the meaning: circle
// (input), thin slab (data), soft-glow square (AI), diamond (decision),
// outlined frame (approval), solid block (action).
const NODES = [
  { id: 'input', x: 50, y: 8, kind: 'input', label: 'INPUT' },
  { id: 'capture', x: 50, y: 26, kind: 'data' },
  { id: 'context', x: 50, y: 44, kind: 'ai', label: 'CONTEXT' },
  { id: 'decision', x: 50, y: 62, kind: 'decision' },
  { id: 'review', x: 26, y: 82, kind: 'approval', label: 'REVIEW' },
  { id: 'continue', x: 74, y: 82, kind: 'data' },
  { id: 'approval', x: 26, y: 100, kind: 'approval', label: 'HUMAN CONTROL' },
  { id: 'update', x: 74, y: 100, kind: 'data' },
  { id: 'action', x: 50, y: 118, kind: 'action', label: 'EXECUTING' }
];

const NODE_INDEX = Object.fromEntries(NODES.map((n, i) => [n.id, i]));

const EDGES = [
  ['input', 'capture'],
  ['capture', 'context'],
  ['context', 'decision'],
  ['decision', 'review'],
  ['decision', 'continue'],
  ['review', 'approval'],
  ['continue', 'update'],
  ['approval', 'action'],
  ['update', 'action']
];

// Two named branches for the decision-state animation — alternates which
// path reads as "currently taken" without implying either is permanent.
const BRANCH_A = ['decision', 'review', 'approval', 'action'];
const BRANCH_B = ['decision', 'continue', 'update', 'action'];

const SEQUENCE_DURATIONS = NODES.map(() => 1500);

function edgePath([fromId, toId]) {
  const from = NODES[NODE_INDEX[fromId]];
  const to = NODES[NODE_INDEX[toId]];
  const midY = (from.y + to.y) / 2;
  return `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
}

export default function HeroSystemVisual() {
  const reducedMotion = useReducedMotion();
  const { index: activeIndex, cycle } = useTimedSequence(SEQUENCE_DURATIONS, { loop: true });
  const branch = cycle % 2 === 0 ? BRANCH_A : BRANCH_B;
  const branchEdgeSet = new Set(branch.slice(0, -1).map((id, i) => `${id}>${branch[i + 1]}`));

  const activePathCount = branch === BRANCH_A ? '01' : '02';

  return (
    <div className="hero-graph" role="img" aria-label="An abstract NAMI orchestration graph: input, capture, context analysis, a decision branching into a review or continue path, and one converging action.">
      <div className="hero-graph__grid" aria-hidden="true" />

      <svg className="hero-graph__svg" viewBox="0 0 100 126" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
        <defs>
          <filter id="hero-graph-glow" x="-60%" y="-60%" width="220%" height="220%">
            <feGaussianBlur stdDeviation="2.4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <g className="hero-graph__breathe">
          {EDGES.map(([fromId, toId], i) => {
            const isOnBranch = branchEdgeSet.has(`${fromId}>${toId}`);
            return <path key={i} d={edgePath([fromId, toId])} className={`hero-graph__edge ${isOnBranch ? 'is-active' : ''}`} />;
          })}

          {!reducedMotion &&
            branch.slice(0, -1).map((id, i) => {
              const d = `M ${NODES[NODE_INDEX[branch[i]]].x} ${NODES[NODE_INDEX[branch[i]]].y} L ${NODES[NODE_INDEX[branch[i + 1]]].x} ${NODES[NODE_INDEX[branch[i + 1]]].y}`;
              return (
                <circle key={id} r="0.9" className="hero-graph__pulse">
                  <animateMotion dur="2.6s" begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} />
                </circle>
              );
            })}

          {NODES.map((node, i) => {
            const isCurrent = i === activeIndex;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className={`hero-graph__node hero-graph__node--${node.kind} ${isCurrent ? 'is-current' : ''}`}
              >
                {node.kind === 'input' && <circle r="2.6" />}
                {node.kind === 'data' && <rect x="-6" y="-2" width="12" height="4" rx="1.6" />}
                {node.kind === 'ai' && <rect x="-3.2" y="-3.2" width="6.4" height="6.4" rx="1.2" filter={isCurrent ? 'url(#hero-graph-glow)' : undefined} />}
                {node.kind === 'decision' && <rect x="-2.6" y="-2.6" width="5.2" height="5.2" rx="0.8" transform="rotate(45)" />}
                {node.kind === 'approval' && <rect x="-3" y="-3" width="6" height="6" rx="1.2" className="hero-graph__node-outline" />}
                {node.kind === 'action' && <rect x="-3.6" y="-3.6" width="7.2" height="7.2" rx="1.4" />}
                {node.label && <text className="hero-graph__label" y="7.5" textAnchor="middle">{node.label}</text>}
              </g>
            );
          })}
        </g>
      </svg>

      <div className="hero-graph__panel">
        <span className="hero-graph__panel-label">System state</span>
        <span className="hero-graph__panel-value">{activePathCount} active path</span>
        <span className="hero-graph__panel-sub">Human review retained</span>
      </div>
    </div>
  );
}
