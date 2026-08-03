import { Link } from 'react-router-dom';
import capabilities from '../../data/capabilities';
import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import Reveal from '../motion/Reveal';
import useInView from '../../hooks/useInView';
import useStructuredData from '../../hooks/useStructuredData';
import './Solutions.css';

function StepChain({ steps, variant }) {
  return (
    <ol className={`capability__chain capability__chain--${variant}`}>
      {steps.map((step, i) => (
        <li key={step}>
          <span>{step}</span>
          {i < steps.length - 1 && <span className="capability__chain-arrow" aria-hidden="true">→</span>}
        </li>
      ))}
    </ol>
  );
}

function CapabilityGroup({ group }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <article className={`capability capability--${group.size}`}>
      <h2>{group.name}</h2>

      {group.problem && (
        <div className="capability__field">
          <p className="capability__field-label">Operational Problem</p>
          <p>{group.problem}</p>
        </div>
      )}

      {group.manualWork && (
        <div className="capability__field">
          <p className="capability__field-label">Manual Work Today</p>
          <p>{group.manualWork}</p>
        </div>
      )}

      {group.system && (
        <div className="capability__field">
          <p className="capability__field-label">NAMI System</p>
          <p>{group.system}</p>
        </div>
      )}

      {group.flow && (
        <div
          ref={ref}
          className={`capability__flow ${inView ? 'is-visible' : ''}`}
          role="img"
          aria-label={`${group.name}: ${group.flow.map((step) => step.label).join(', then ')}`}
        >
          {group.flow.map((step, i) => (
            <span className="capability__flow-item" key={step.label}>
              <WorkflowNode label={step.label} type={step.type} state="complete" compact />
              {i < group.flow.length - 1 && <WorkflowPath axis="x" active compact />}
            </span>
          ))}
        </div>
      )}

      {group.connections && (
        <ul className="capability__connections">
          {group.connections.map((name) => (
            <li key={name}>{name}</li>
          ))}
        </ul>
      )}

      {group.outcomes && (
        <div className="capability__field">
          <p className="capability__field-label">Business Outcome</p>
          <ul className="capability__outcomes">
            {group.outcomes.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {group.before && group.after && (
        <div className="capability__compare">
          <div>
            <p className="capability__field-label">Before NAMI</p>
            <StepChain steps={group.before} variant="before" />
          </div>
          <div>
            <p className="capability__field-label">With NAMI</p>
            <StepChain steps={group.after} variant="after" />
          </div>
        </div>
      )}

      {group.learnMore && (
        <Link to={group.learnMore.to} className="capability__learn-more">
          {group.learnMore.label} →
        </Link>
      )}
    </article>
  );
}

export default function Solutions() {
  useStructuredData({
    '@context': 'https://schema.org',
    '@graph': capabilities.map((group) => ({
      '@type': 'Service',
      name: group.name,
      description: group.problem,
      provider: { '@type': 'Organization', name: 'NAMI Automation Systems' }
    }))
  });

  return (
    <section id="solutions" className="solutions">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">System Capabilities</p>
          <h1>What NAMI builds around your operations.</h1>
        </Reveal>

        <div className="solutions__grid">
          {capabilities.map((group) => (
            <CapabilityGroup group={group} key={group.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
