import { useMemo, useState } from 'react';
import opportunities from './opportunityData';
import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import WorkflowStatus from '../workflow/WorkflowStatus';
import Reveal from '../motion/Reveal';
import { STATUS_BY_TYPE } from '../../data/workflowPatterns';
import useTimedSequence from '../../hooks/useTimedSequence';
import './AutomationOpportunity.css';

const MANUAL_STATUS_CYCLE = ['Manual handoff', 'Waiting', 'Copying', 'Switching tool'];

export default function AutomationOpportunity() {
  const [activeId, setActiveId] = useState(opportunities[0].id);
  const active = opportunities.find((item) => item.id === activeId) ?? opportunities[0];

  const manualCount = active.manual.length;
  const automatedCount = active.automated.length;
  const detectedPhase = manualCount;
  const automatedBase = manualCount + 1;

  const durations = useMemo(
    () => [...Array(manualCount).fill(700), 900, ...Array(automatedCount).fill(450), 60000],
    [manualCount, automatedCount]
  );
  const { index: phase } = useTimedSequence(durations, { loop: false, restartKey: active.id });

  const isDetected = phase >= detectedPhase;
  const isTransforming = phase > detectedPhase;
  const revealedManual = phase < 0 ? 0 : phase < detectedPhase ? phase + 1 : manualCount;
  const revealedAutomated = isTransforming ? Math.min(phase - automatedBase + 1, automatedCount) : 0;

  let statusLabel = ' ';
  if (phase >= 0 && phase < detectedPhase) {
    statusLabel = MANUAL_STATUS_CYCLE[phase % MANUAL_STATUS_CYCLE.length];
  } else if (phase === detectedPhase) {
    statusLabel = 'Automation opportunity detected';
  } else if (isTransforming && revealedAutomated > 0) {
    const currentStep = active.automated[revealedAutomated - 1];
    statusLabel = STATUS_BY_TYPE[currentStep.type] ?? 'Processing';
  }

  return (
    <section id="opportunity" className="opportunity">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">Process Transformation</p>
          <h2>From scattered manual steps to one connected system.</h2>
          <p>
            Pick a process below. NAMI plays out the manual path exactly as it runs today, then
            compresses it into the automated architecture that replaces it — the same transformation
            chaos into structure that every NAMI engagement starts with.
          </p>
        </Reveal>

        <div className="opportunity__options" role="group" aria-label="Manual processes">
          {opportunities.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`opportunity__option ${item.id === activeId ? 'is-active' : ''}`}
              onMouseEnter={() => setActiveId(item.id)}
              onFocus={() => setActiveId(item.id)}
              onClick={() => setActiveId(item.id)}
              aria-pressed={item.id === activeId}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="opportunity__canvas" aria-live="polite">
          {isDetected && (
            <span className={`opportunity__detected ${isTransforming ? 'is-settled' : ''}`}>
              Automation Opportunity Detected
            </span>
          )}

          {!isTransforming ? (
            <>
              <p className="opportunity__canvas-label">Manual Process</p>
              <ol className="opportunity__manual" aria-hidden="true">
                {active.manual.map((step, i) => {
                  const isRevealed = i < revealedManual;
                  const isCurrent = i === revealedManual - 1;
                  return (
                    <li className="opportunity__manual-item" key={step}>
                      <div
                        className={`opportunity__manual-node ${isRevealed ? 'is-revealed' : ''} ${isCurrent ? 'is-current' : ''}`}
                      >
                        {step}
                      </div>
                      {i < active.manual.length - 1 && (
                        <WorkflowPath axis="y" active={i < revealedManual - 1} compact inverse />
                      )}
                    </li>
                  );
                })}
              </ol>
            </>
          ) : (
            <>
              <p className="opportunity__canvas-label opportunity__canvas-label--architecture">NAMI Architecture</p>
              <ol className="opportunity__automated" aria-hidden="true">
                {active.automated.map((step, i) => {
                  const isRevealed = i < revealedAutomated;
                  const isCurrent = i === revealedAutomated - 1;
                  const state = !isRevealed ? 'pending' : isCurrent ? 'active' : 'complete';
                  return (
                    <li className="opportunity__automated-item" key={step.label}>
                      <div className={`opportunity__node-wrap ${isRevealed ? 'is-revealed' : ''}`}>
                        <WorkflowNode label={step.label} type={step.type} state={state} inverse />
                      </div>
                      {i < active.automated.length - 1 && <WorkflowPath axis="x" active={i < revealedAutomated - 1} inverse />}
                    </li>
                  );
                })}
              </ol>
            </>
          )}

          <WorkflowStatus label={statusLabel} active={phase >= 0} inverse />
        </div>
      </div>
    </section>
  );
}
