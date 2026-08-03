import { useState } from 'react';
import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import WorkflowNode from '../workflow/WorkflowNode';
import WorkflowPath from '../workflow/WorkflowPath';
import Breadcrumbs from '../layout/Breadcrumbs';
import PageCTA from '../layout/PageCTA';
import useStructuredData from '../../hooks/useStructuredData';
import './ServicePage.css';

/**
 * Shared template for the dedicated /*-automation service pages. Takes a
 * single `data` object so each page is just content — the same depth and
 * structure (problem/manual work/system/integrations/human approval/
 * industries/process/outcomes/FAQ/next step) every time, per the SEO
 * brief's ten required questions.
 */
export default function ServicePage({ data }) {
  const [openFaq, setOpenFaq] = useState(0);

  useStructuredData({
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        name: data.h1,
        description: data.intro,
        provider: { '@type': 'Organization', name: 'NAMI Automation Systems' }
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faqs.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer }
        }))
      }
    ]
  });

  return (
    <>
      <section className="service-page">
        <div className="container">
          <Breadcrumbs items={[{ label: data.breadcrumbLabel }]} />
          <Reveal as="div" className="section-header">
            <p className="eyebrow">{data.eyebrow}</p>
            <h1>{data.h1}</h1>
            <p>{data.intro}</p>
          </Reveal>

          <div className="service-page__grid">
            <Reveal as="div" className="service-page__col">
              <h2>Business problems this solves</h2>
              <ul className="service-page__list">
                {data.problems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
            <Reveal as="div" className="service-page__col" delay={0.05}>
              <h2>Manual tasks it reduces</h2>
              <ul className="service-page__list">
                {data.manualTasks.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal as="div" className="service-page__section">
            <h2>How the system works</h2>
            <div className="service-page__flow" role="img" aria-label={data.flow.map((step) => step.label).join(' then ')}>
              {data.flow.map((step, i) => (
                <span className="service-page__flow-item" key={step.label}>
                  <WorkflowNode label={step.label} type={step.type} state="complete" compact />
                  {i < data.flow.length - 1 && <WorkflowPath axis="x" active compact />}
                </span>
              ))}
            </div>
          </Reveal>

          <div className="service-page__grid">
            <Reveal as="div" className="service-page__col">
              <h2>Where human approval remains</h2>
              <p className="service-page__prose">{data.humanApproval}</p>
            </Reveal>
            <Reveal as="div" className="service-page__col" delay={0.05}>
              <h2>Tools it can integrate with</h2>
              <ul className="service-page__chips">
                {data.integrations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Reveal>
          </div>

          <Reveal as="div" className="service-page__section">
            <h2>Industries that benefit</h2>
            <ul className="service-page__chips">
              {data.industries.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" className="service-page__section">
            <h2>Implementation process</h2>
            <p className="service-page__prose">
              {data.process} <Link to="/how-nami-works">See the complete delivery process →</Link>
            </p>
          </Reveal>

          <Reveal as="div" className="service-page__section">
            <h2>Realistic outcomes</h2>
            <ul className="service-page__list">
              {data.outcomes.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </Reveal>

          <Reveal as="div" className="service-page__section">
            <h2>Questions we hear</h2>
            <ul className="service-page__faq">
              {data.faqs.map((item, i) => {
                const isOpen = openFaq === i;
                return (
                  <li key={item.question}>
                    <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : i)}>
                      {item.question}
                      <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
                    </button>
                    {isOpen && <p>{item.answer}</p>}
                  </li>
                );
              })}
            </ul>
          </Reveal>

          {data.relatedCaseStudy && (
            <Reveal as="p" className="service-page__related">
              See this in practice:{' '}
              <Link to="/case-studies">
                {data.relatedCaseStudy} →
              </Link>
            </Reveal>
          )}
        </div>
      </section>

      <PageCTA heading={data.ctaHeading} />
    </>
  );
}
