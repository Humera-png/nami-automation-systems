import { useEffect } from 'react';
import { CALENDLY_URL, preloadCalendlyAssets } from '../../services/calendly';
import { trackEvent } from '../../utils/analytics';
import Reveal from '../motion/Reveal';
import './StrategyCall.css';

const HIGHLIGHTS = ['No sales pressure', 'Tailored recommendations', 'Live workflow discussion', 'Free consultation'];

export default function StrategyCall() {
  useEffect(() => {
    preloadCalendlyAssets();
    trackEvent('strategy_call_page_view');
  }, []);

  const handleScrollToEmbed = () => {
    trackEvent('strategy_call_click', { source: 'strategy-call-hero' });
    document.getElementById('strategy-call-embed')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section className="strategy-call">
      <div className="container strategy-call__inner">
        <Reveal as="div" className="strategy-call__intro">
          <p className="eyebrow">Strategy Call</p>
          <h1>Let&apos;s Design Your Automation System</h1>
          <p className="strategy-call__subtitle">
            In one 30-minute strategy session we&apos;ll identify repetitive work, uncover automation
            opportunities, estimate potential ROI, and recommend the highest-impact systems for your
            business.
          </p>
          <ul className="strategy-call__highlights">
            {HIGHLIGHTS.map((item) => (
              <li key={item}>
                <span aria-hidden="true">✓</span> {item}
              </li>
            ))}
          </ul>
          <button type="button" className="btn btn-primary" onClick={handleScrollToEmbed}>
            Book My Strategy Call
          </button>
        </Reveal>

        <Reveal as="div" className="strategy-call__embed-card" delay={0.1} id="strategy-call-embed">
          <div className="calendly-inline-widget" data-url={CALENDLY_URL} style={{ minWidth: '320px', height: '700px' }} />
        </Reveal>
      </div>
    </section>
  );
}
