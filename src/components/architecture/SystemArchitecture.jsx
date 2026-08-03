import './SystemArchitecture.css';

const LAYERS = [
  {
    id: 'trigger',
    name: 'Trigger Layer',
    items: ['Forms', 'Email', 'Webhook', 'Schedule', 'CRM Event']
  },
  {
    id: 'intelligence',
    name: 'Intelligence Layer',
    items: ['AI Classification', 'AI Extraction', 'Decision Logic', 'Data Transformation']
  },
  {
    id: 'orchestration',
    name: 'Orchestration Layer',
    items: ['n8n', 'APIs', 'Custom Logic']
  },
  {
    id: 'business-systems',
    name: 'Business Systems',
    items: ['CRM', 'Gmail', 'Google Sheets', 'Slack', 'Database', 'Calendar']
  },
  {
    id: 'action',
    name: 'Action Layer',
    items: ['Send', 'Update', 'Create', 'Notify', 'Escalate']
  }
];

export default function SystemArchitecture() {
  return (
    <section id="architecture" className="architecture">
      <div className="container">
        <div className="section-header">
          <p className="eyebrow">Automation Systems</p>
          <h2>More than app connections.</h2>
          <p>
            Reliable automation requires clear triggers, predictable logic, controlled AI decisions,
            structured data, error handling, and visibility.
          </p>
        </div>

        <div className="architecture__stack">
          {LAYERS.map((layer, index) => (
            <div className="architecture__layer" key={layer.id}>
              <div className="architecture__layer-head">
                <span className="architecture__layer-index">{String(index + 1).padStart(2, '0')}</span>
                <h3>{layer.name}</h3>
              </div>
              <ul className="architecture__layer-items">
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {index < LAYERS.length - 1 && (
                <div className="architecture__flow-down" aria-hidden="true">
                  <span />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
