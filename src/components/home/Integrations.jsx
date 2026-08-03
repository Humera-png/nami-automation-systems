import Reveal from '../motion/Reveal';
import './Integrations.css';

// Names only — no third-party logos. NAMI builds integrations with these
// platforms via their APIs/webhooks; this isn't a claim of official
// partnership or certification with any of them.
const INTEGRATIONS = [
  'OpenAI',
  'Claude',
  'n8n',
  'Make',
  'HubSpot',
  'Salesforce',
  'Slack',
  'Google Workspace',
  'Microsoft 365',
  'Notion',
  'Airtable',
  'Shopify',
  'QuickBooks',
  'Stripe'
];

export default function Integrations() {
  return (
    <section className="integrations">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow eyebrow--number">09 / Integrations</p>
          <h2>We engineer around the tools you already use.</h2>
          <p>
            NAMI doesn&apos;t ask you to replace your stack. Systems are built to read from, write to, and
            trigger the platforms your team already relies on every day.
          </p>
        </Reveal>

        <ul className="integrations__grid">
          {INTEGRATIONS.map((name) => (
            <li key={name} className="integrations__chip">
              {name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
