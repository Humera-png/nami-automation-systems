import { Link } from 'react-router-dom';
import caseStudies from '../../data/caseStudies';
import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import DecisionNode from '../workflow/DecisionNode';
import useInView from '../../hooks/useInView';
import Reveal from '../motion/Reveal';
import './CaseStudies.css';

function CaseStudy({ study }) {
  const [ref, inView] = useInView({ threshold: 0.3 });

  return (
    <article className="case-study">
      <div className="case-study__badges">
        <span className="case-study__category">{study.category}</span>
        {study.blueprint && <span className="case-study__blueprint">System Blueprint</span>}
      </div>
      <h2>{study.title}</h2>

      <div className="case-study__section">
        <p className="case-study__label">Challenge</p>
        <p className="case-study__problem">{study.challenge}</p>
      </div>

      {study.manualBefore && (
        <div className="case-study__section">
          <p className="case-study__label">Manual Process Before</p>
          <ul className="case-study__list">
            {study.manualBefore.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="case-study__section">
        <p className="case-study__label">NAMI Solution</p>
        <p className="case-study__solution">{study.namiSolution}</p>
      </div>

      <div className="case-study__section">
        <p className="case-study__label">Architecture</p>
        <div
          ref={ref}
          className={`case-study__flow ${inView ? 'is-visible' : ''}`}
          role="img"
          aria-label={`Architecture: ${study.flow.map((step) => step.label).join(' then ')}`}
        >
          {study.flow.map((step, i) => (
            <span className="case-study__flow-item" key={step.label}>
              {step.type === 'decision' ? (
                <DecisionNode question={step.label} state="complete" branch={step.branch} compact />
              ) : (
                <WorkflowNode label={step.label} type={step.type} state="complete" compact />
              )}
              {i < study.flow.length - 1 && <WorkflowPath axis="x" active compact />}
            </span>
          ))}
        </div>
      </div>

      {study.automated && (
        <div className="case-study__section">
          <p className="case-study__label">What Became Automated</p>
          <ul className="case-study__list case-study__list--automated">
            {study.automated.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {study.humanControl && (
        <div className="case-study__section">
          <p className="case-study__label">Human Control</p>
          <p className="case-study__human-control">{study.humanControl}</p>
        </div>
      )}

      {study.outcome && (
        <div className="case-study__section">
          <p className="case-study__label">Business Outcomes</p>
          <ul className="case-study__outcome">
            {study.outcome.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      {study.components && (
        <div className="case-study__section">
          <p className="case-study__label">System Components</p>
          <ul className="case-study__components">
            {study.components.map((component) => (
              <li key={component}>{component}</li>
            ))}
          </ul>
        </div>
      )}

      {study.learnMore && (
        <Link to={study.learnMore.to} className="case-study__learn-more">
          {study.learnMore.label} →
        </Link>
      )}
    </article>
  );
}

export default function CaseStudies() {
  return (
    <section id="case-studies" className="case-studies">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">Case Studies</p>
          <h1>Automation systems built for real operational problems.</h1>
        </Reveal>

        <div className="case-studies__grid">
          {caseStudies.map((study) => (
            <CaseStudy study={study} key={study.id} />
          ))}
        </div>
      </div>
    </section>
  );
}
