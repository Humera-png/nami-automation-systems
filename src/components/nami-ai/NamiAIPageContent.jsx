import NamiGlyph from './NamiGlyph';
import WorkflowStatus from '../workflow/WorkflowStatus';
import { openNamiAI } from './namiAIEvents';
import './NamiAIPageContent.css';

const CAPABILITIES = [
  {
    title: 'Automation discovery',
    description: 'Describe what your team does manually and NamiAI helps identify where automation genuinely applies.'
  },
  {
    title: 'Audit exploration',
    description: 'Ask follow-up questions about a completed Automation Audit — the score, the architecture, or why AI was or wasn’t recommended.'
  },
  {
    title: 'Workflow architecture questions',
    description: 'Ask how a specific process could be structured — trigger, data movement, decision points, human approval.'
  },
  {
    title: 'Business process discussion',
    description: 'Talk through how work currently moves through your business before deciding whether it’s worth automating.'
  }
];

export default function NamiAIPageContent() {
  return (
    <section className="nami-ai-page">
      <div className="container nami-ai-page__inner">
        <NamiGlyph active className="nami-ai-page__glyph" />
        <WorkflowStatus label="NAMI System Interface" active inverse />
        <h1>Ask NAMI about your operations.</h1>
        <p className="nami-ai-page__intro">
          NamiAI isn&apos;t a general chatbot. It&apos;s the same process-intelligence system behind the
          Automation Audit, available to talk through automation questions directly.
        </p>

        <ul className="nami-ai-page__capabilities">
          {CAPABILITIES.map((item) => (
            <li key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </li>
          ))}
        </ul>

        <button type="button" className="btn btn-primary" onClick={openNamiAI}>
          Ask NamiAI
        </button>
      </div>
    </section>
  );
}
