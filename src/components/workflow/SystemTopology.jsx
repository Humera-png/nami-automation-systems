import useReducedMotion from '../../hooks/useReducedMotion';
import './SystemTopology.css';

// A faint, fixed coordinate map suggesting the site itself sits inside an
// orchestration environment. Extremely low opacity by design — this should
// only be noticeable on close inspection, never compete with content.
const POINTS = [
  [8, 15], [22, 8], [38, 20], [55, 10], [70, 22], [88, 14],
  [12, 45], [30, 52], [48, 42], [65, 50], [82, 44],
  [18, 78], [36, 85], [58, 80], [76, 88], [92, 76]
];

const LINES = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [0, 6], [2, 7], [4, 9], [5, 10],
  [6, 7], [7, 8], [8, 9], [9, 10],
  [6, 11], [8, 12], [10, 14],
  [11, 12], [12, 13], [13, 14], [14, 15]
];

const SIGNAL_PATHS = [
  [1, 2, 3],
  [7, 8, 9],
  [12, 13, 14]
];

export default function SystemTopology() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="system-topology" aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="xMidYMid slice">
        {LINES.map(([a, b], i) => (
          <line
            key={i}
            x1={POINTS[a][0]}
            y1={POINTS[a][1]}
            x2={POINTS[b][0]}
            y2={POINTS[b][1]}
            className="system-topology__line"
          />
        ))}

        {POINTS.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r="0.5" className="system-topology__point" />
        ))}

        {!reducedMotion &&
          SIGNAL_PATHS.map((path, i) => {
            const d = path.map((idx, j) => `${j === 0 ? 'M' : 'L'}${POINTS[idx][0]},${POINTS[idx][1]}`).join(' ');
            return (
              <circle key={`signal-${i}`} r="0.6" className="system-topology__signal">
                <animateMotion dur={`${8 + i * 1.6}s`} repeatCount="indefinite" begin={`${i * 2.1}s`} path={d} />
              </circle>
            );
          })}
      </svg>
    </div>
  );
}
