import Reveal from '../motion/Reveal';
import './About.css';

const CAPABILITIES = ['Workflow automation', 'AI systems', 'Full-stack engineering', 'API integrations', 'Business process thinking'];

const BEYOND_NOCODE = ['Custom interfaces', 'API logic', 'AI functionality', 'Backend systems', 'Business-specific rules'];

export default function About() {
  return (
    <section id="about" className="about">
      <div className="container about__grid">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">About</p>
          <h1>Work shouldn&apos;t need a person to move it between two screens.</h1>
          <p>
            NAMI exists because most operational friction isn&apos;t a tooling problem — it&apos;s a design
            problem. Off-the-shelf automation platforms can chain a few tools together, but they stop
            where real business logic begins. NAMI combines workflow automation, AI reasoning, and
            full-stack engineering into one discipline, so the system that gets built matches how the
            business actually runs — instead of asking the business to adapt to the automation.
          </p>

          <ul className="about__capabilities">
            {CAPABILITIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Reveal>

        <div className="about__panel">
          <h2>Beyond no-code tool connections</h2>
          <p>
            When a workflow requires more than off-the-shelf connections, we can engineer the system
            layers a no-code tool can&apos;t reach:
          </p>
          <ul className="about__beyond-list">
            {BEYOND_NOCODE.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>

          <div className="about__founder">
            <p className="about__founder-name">Humera Shaikh</p>
            <p className="about__founder-role">AI Automation &amp; Full-Stack Developer</p>
          </div>
        </div>
      </div>
    </section>
  );
}
