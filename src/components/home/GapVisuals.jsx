import { motion } from 'framer-motion';
import useTimedSequence from '../../hooks/useTimedSequence';
import useReducedMotion from '../../hooks/useReducedMotion';
import './GapVisuals.css';

const SYSTEMS = [
  { id: 'crm', label: 'CRM' },
  { id: 'sheet', label: 'Spreadsheet' },
  { id: 'email', label: 'Email' },
  { id: 'slack', label: 'Slack' },
  { id: 'erp', label: 'ERP' }
];

const CHAIN_DURATIONS = SYSTEMS.map(() => 1500);



export function ManualHandoffVisual() {
  const reducedMotion = useReducedMotion();
  const { index } = useTimedSequence(CHAIN_DURATIONS, { loop: true });
  const activeIndex = Math.max(index, 0);
  const recordX = (activeIndex / (SYSTEMS.length - 1)) * 100;

  return (
    <div className="handoff-chain">
      <div className="handoff-chain__grid" aria-hidden="true" />

      <div className="handoff-chain__row">
        <div className="handoff-chain__rail" />

        {!reducedMotion && (
          <motion.div
            className="handoff-chain__record"
            animate={{ left: `${recordX}%` }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="handoff-chain__record-dot" />
            <span className="handoff-chain__record-label">Copying record…</span>
          </motion.div>
        )}

        {SYSTEMS.map((system, i) => {
          const state = i < activeIndex ? 'synced' : i === activeIndex ? 'active' : 'pending';
          return (
            <div key={system.id} className={`handoff-node is-${state}`}>
              <span className="handoff-node__dot" />
              <span className="handoff-node__label">{system.label}</span>
              <span className="handoff-node__status">
                {state === 'synced' && 'Copied'}
                {state === 'active' && 'Copying'}
                {state === 'pending' && 'Waiting'}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LOOP_STEPS = ['CHECK', 'REVIEW', 'DECIDE'];

export function DecisionLoopVisual() {
  const { index } = useTimedSequence(
    LOOP_STEPS.map(() => 900),
    { loop: true }
  );

  return (
    <svg className="gap-loop" viewBox="0 0 100 88" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <text x="50" y="8" textAnchor="middle" className="gap-loop__eyebrow">
        DECISION LOOP
      </text>

      <path d="M 30 20 L 72 20 M 76 24 L 76 58 M 72 62 L 30 62 M 26 58 L 26 24" className="gap-loop__ring" />
      <path d="M 22 28 L 26 24 L 30 28" className="gap-loop__arrow" />

      {LOOP_STEPS.map((step, i) => {
        const positions = [
          { x: 30, y: 20 },
          { x: 76, y: 41 },
          { x: 30, y: 62 }
        ];
        const isCurrent = i === index % LOOP_STEPS.length;
        return (
          <g key={step} transform={`translate(${positions[i].x}, ${positions[i].y})`} className={`gap-loop__node ${isCurrent ? 'is-current' : ''}`}>
            <circle r="5.2" />
            <text y="10.5" textAnchor="middle" className="gap-loop__label">
              {step}
            </text>
          </g>
        );
      })}
      <text x="50" y="82" textAnchor="middle" className="gap-loop__cycle">
        REPEATS EVERY TIME
      </text>
    </svg>
  );
}


const QUEUE_ITEMS = [
  { time: '09:30', label: 'Follow-up waiting', weight: 'neutral' },
  { time: '11:00', label: 'Reminder due', weight: 'neutral' },
  { time: '14:20', label: 'Status check', weight: 'warm' },
  { time: '16:00', label: 'Email preparation', weight: 'strong' }
];

export function FollowUpQueueVisual() {
  return (
    <div className="gap-queue">
      <ul className="gap-queue__list">
        {QUEUE_ITEMS.map((item) => (
          <li key={item.time} className={`gap-queue__row gap-queue__row--${item.weight}`}>
            <span className="gap-queue__time">{item.time}</span>
            <span className="gap-queue__task">{item.label}</span>
          </li>
        ))}
      </ul>
      <div className="gap-queue__tag">
        <span className="gap-queue__tag-label">Manual queue</span>
        <span className="gap-queue__tag-value">04 waiting</span>
      </div>
    </div>
  );
}
