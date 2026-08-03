import { Link } from 'react-router-dom';
import Reveal from '../motion/Reveal';
import './DeliveryProcess.css';

const STEPS = [
  {
    number: '01',
    title: 'Discovery',
    whatWeDo:
      'We map how the process currently works, including the tools involved, repeated tasks, bottlenecks, approvals, and points where information is copied manually.',
    outcome: 'A clear view of where time is being lost and which parts of the process should be automated first.'
  },
  {
    number: '02',
    title: 'System Design',
    whatWeDo:
      'We design the complete operating logic: what triggers the workflow, which data moves between systems, where AI adds value, what decisions remain rule-based, and where human approval is required.',
    outcome: 'A practical automation blueprint designed around the business rather than around a particular software tool.'
  },
  {
    number: '03',
    title: 'Automation Build',
    whatWeDo:
      'We engineer the workflows, integrations, business rules, AI components, databases, notifications, and operational interfaces that make up the complete system.',
    outcome:
      'A connected system that performs repetitive work consistently instead of relying on employees to copy, check, update, and chase information manually.'
  },
  {
    number: '04',
    title: 'Testing',
    whatWeDo:
      'We test real operating scenarios, incomplete data, duplicate requests, exceptions, failures, permissions, and human approval paths before launch.',
    outcome: 'A reliable system that is prepared for actual business conditions, not only ideal test cases.'
  },
  {
    number: '05',
    title: 'Deployment',
    whatWeDo: 'We connect the system to the live business environment, configure access, deploy the integrations, and monitor the first operating cycles.',
    outcome: 'A controlled transition from manual work to an operational automation system without disrupting the existing business.'
  },
  {
    number: '06',
    title: 'Monitoring',
    whatWeDo:
      'We monitor workflow performance, failed actions, usage patterns, processing times, and the points where staff still need to intervene.',
    outcome: 'Visibility into how the system performs and where further operational improvements are available.'
  },
  {
    number: '07',
    title: 'Optimisation',
    whatWeDo: 'We refine rules, prompts, integrations, exception handling, and capacity as the business, process, and transaction volume evolve.',
    outcome: 'An automation system that improves over time instead of becoming outdated after delivery.'
  }
];

export default function DeliveryProcess() {
  return (
    <section className="delivery-process">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow eyebrow--number">06 / Delivery Process</p>
          <h2>How a NAMI project actually runs.</h2>
          <p>
            We do not automate isolated tasks. We study the complete process, remove unnecessary manual steps,
            connect the systems involved, and build an operating workflow that keeps people in control of important
            decisions.
          </p>
        </Reveal>

        <ol className="delivery-process__list">
          {STEPS.map((step, i) => (
            <Reveal as="li" className="delivery-process__step" delay={i * 0.05} key={step.number}>
              <span className="delivery-process__number">{step.number}</span>
              <h3>{step.title}</h3>
              <p className="delivery-process__label">What we do</p>
              <p>{step.whatWeDo}</p>
              <p className="delivery-process__label">What this gives the client</p>
              <p>{step.outcome}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal as="p" className="delivery-process__result" delay={0.1}>
          The result is less manual data entry, fewer missed follow-ups, faster approvals, clearer operational
          visibility, and more time for your team to focus on work that requires judgement.
        </Reveal>

        <Reveal as="div" delay={0.15}>
          <Link to="/how-nami-works" className="delivery-process__link">
            See the complete delivery process →
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
