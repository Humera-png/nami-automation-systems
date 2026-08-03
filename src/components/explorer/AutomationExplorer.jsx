import { useMemo, useState } from 'react';
import workflowPatterns, { STATUS_BY_TYPE } from '../../data/workflowPatterns';
import SystemMark from '../workflow/SystemMark';
import WorkflowPath from '../workflow/WorkflowPath';
import WorkflowStatus from '../workflow/WorkflowStatus';
import useTimedSequence from '../../hooks/useTimedSequence';
import { openNamiAI } from '../nami-ai/namiAIEvents';
import Reveal from '../motion/Reveal';
import './AutomationExplorer.css';

export default function AutomationExplorer() {
  const [selectedId, setSelectedId] = useState(workflowPatterns[0].id);

  const selected = workflowPatterns.find((option) => option.id === selectedId) ?? workflowPatterns[0];
  const nodeCount = selected.steps.length;

  const durations = useMemo(() => [550, 850, ...Array(nodeCount).fill(600), 60000], [nodeCount]);
  const { index: phase } = useTimedSequence(durations, { loop: false, restartKey: selected.id });

  const revealedCount = phase >= 2 ? Math.min(phase - 1, nodeCount) : 0;
  const isAnalysing = phase === 1;
  const isGenerated = phase >= 2 + nodeCount;

  let statusLabel = ' ';
  if (phase === 0) statusLabel = `Process selected — ${selected.label}`;
  else if (isAnalysing) statusLabel = 'Analysing automation pattern';
  else if (isGenerated) statusLabel = 'Automation architecture generated';
  else if (revealedCount > 0) {
    const currentStep = selected.steps[revealedCount - 1];
    statusLabel = currentStep.type === 'decision' ? `${currentStep.label} ${currentStep.branch}` : STATUS_BY_TYPE[currentStep.type];
  }

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // Opens the existing NamiAI panel with this workflow already in
  // context — the same "Build This" pattern used from the Audit report.
  const handleBuild = () => {
    openNamiAI({
      prefill: `I want to discuss building this ${selected.label} system.`,
      autoSend: true
    });
  };

  return (
    <section id="explorer" className="explorer">
      <div className="container">
        <Reveal as="div" className="section-header section-header--center">
          <p className="eyebrow">Automation Systems</p>
          <h1>See how an automation system actually works.</h1>
          <p>
            Explore how triggers, business data, AI reasoning, decisions, approvals, and actions work
            together inside a NAMI automation system. Select what&apos;s slowing your team down to see it
            become a workflow.
          </p>
        </Reveal>

        <div className="explorer__options" role="group" aria-label="Automation focus areas">
          {workflowPatterns.map((option) => (
            <button
              key={option.id}
              type="button"
              className={`explorer__option ${option.id === selectedId ? 'is-active' : ''}`}
              onClick={() => handleSelect(option.id)}
              aria-pressed={option.id === selectedId}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="explorer__result">
          <div
            className="explorer__canvas"
            role="img"
            aria-label={`Generated automation workflow for ${selected.label}: ${selected.steps.map((step) => step.label).join(' then ')}`}
          >
            <ol className="explorer__nodes" aria-hidden="true">
              {selected.steps.map((step, i) => {
                const isRevealed = i < revealedCount;
                const isCurrent = i === revealedCount - 1 && !isGenerated;
                const state = !isRevealed ? 'pending' : isCurrent ? 'active' : 'complete';
                return (
                  <li className="explorer__node-item" key={`${selected.id}-${step.label}`}>
                    <div className={`explorer__node-wrap ${isRevealed ? 'is-revealed' : ''}`}>
                      <SystemMark kind={step.type} label={step.label} state={state} />
                      {step.type === 'decision' && state !== 'pending' && step.branch && (
                        <span className="explorer__branch">{step.branch}</span>
                      )}
                    </div>
                    {i < selected.steps.length - 1 && <WorkflowPath axis="x" active={i < revealedCount} />}
                  </li>
                );
              })}
            </ol>

            <WorkflowStatus label={statusLabel} active={phase >= 0} />
          </div>

          <div className="explorer__cta">
            <button
              type="button"
              className={`btn btn-primary ${isGenerated ? 'is-visible' : 'is-hidden'}`}
              onClick={handleBuild}
            >
              Build This Automation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
