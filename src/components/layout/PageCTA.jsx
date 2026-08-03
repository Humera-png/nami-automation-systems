import { Link } from 'react-router-dom';
import { openStrategyCall } from '../../services/calendly';
import Reveal from '../motion/Reveal';
import './PageCTA.css';

/**
 * The consistent "Ready to automate your operations?" closer used at the
 * bottom of every inner page (Solutions, How NAMI Works, Systems, Case
 * Studies, About) — same two actions everywhere (Audit / Strategy Call),
 * with only the heading varying per page for context.
 */
export default function PageCTA({ heading = 'Ready to automate your operations?' }) {
  return (
    <section className="page-cta" data-navbar-theme="dark">
      <div className="container">
        <Reveal as="div" className="page-cta__inner">
          <h2>{heading}</h2>
          <div className="page-cta__actions">
            <Link to="/automation-audit" className="btn btn-primary">
              Request an Automation Audit
            </Link>
            <button type="button" className="btn btn-secondary" onClick={() => openStrategyCall('page-cta')}>
              Book a Strategy Call
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
