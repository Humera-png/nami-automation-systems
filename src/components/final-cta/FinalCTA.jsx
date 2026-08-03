import { openNamiAI } from '../nami-ai/namiAIEvents';
import { openStrategyCall } from '../../services/calendly';
import Reveal from '../motion/Reveal';
import WorkflowStatus from '../workflow/WorkflowStatus';
import FinalCTAVisual from './FinalCTAVisual';
import './FinalCTA.css';

export default function FinalCTA() {
  return (
    <section className="final-cta" data-navbar-theme="dark">
      <FinalCTAVisual />
      <div className="container">
        <Reveal as="div" className="final-cta__inner">
          <h2>What would your business stop doing manually?</h2>
          <p>Show us the repetitive process. We&apos;ll help map the automation system behind it.</p>
          <div className="final-cta__actions">
            <button type="button" className="btn btn-primary" onClick={() => openStrategyCall('final-cta')}>
              Book a Strategy Call
            </button>
            <button type="button" className="btn btn-secondary" onClick={openNamiAI}>
              Ask NamiAI
            </button>
          </div>
          <div className="final-cta__status">
            <WorkflowStatus label="System ready" system="NAMI Orchestration" inverse active />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
