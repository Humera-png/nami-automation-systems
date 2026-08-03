import Reveal from '../motion/Reveal';
import './OperationalGap.css';

const STEPS = ['Website Enquiry', 'Manual Review', 'Copy to Spreadsheet', 'Write Email', 'Update Status'];

function CurveConnector() {
  return (
    <svg className="operational-gap__connector" viewBox="0 0 48 40" preserveAspectRatio="none" aria-hidden="true">
      <path d="M2 8 Q 24 40 46 30" />
    </svg>
  );
}

export default function OperationalGap() {
  return (
    <section id="operational-gap" className="operational-gap">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">The Operational Gap</p>
          <h2>Your team is doing work your systems should handle.</h2>
          <p>
            Copying information between tools. Manually reviewing repetitive submissions. Sending the
            same follow-ups. Updating spreadsheets. Checking statuses. Moving data between departments.
            Making the same operational decision over and over. None of this is the work a business
            actually exists to do.
          </p>
        </Reveal>

        <Reveal as="div" delay={0.15}>
          <ol className="operational-gap__chain" aria-label={`A fragmented manual process: ${STEPS.join(', then ')}.`}>
            {STEPS.map((step, i) => (
              <li className="operational-gap__item" key={step}>
                <span className="operational-gap__node">{step}</span>
                {i < STEPS.length - 1 && <CurveConnector />}
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
