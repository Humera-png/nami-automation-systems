import Reveal from '../motion/Reveal';
import './Industries.css';

const INDUSTRIES = [
  'Healthcare',
  'Manufacturing',
  'Logistics',
  'Professional Services',
  'SaaS',
  'Agencies',
  'Finance',
  'Real Estate'
];

export default function Industries() {
  return (
    <section className="industries">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow eyebrow--number">04 / Industries</p>
          <h2>Built around how your industry actually operates.</h2>
          <p>
            Every industry has its own tools, compliance needs, and operational rhythm. NAMI designs
            systems around the way your business already works — not a generic template.
          </p>
        </Reveal>

        <ul className="industries__grid">
          {INDUSTRIES.map((name, i) => (
            <Reveal as="li" className="industries__item" delay={i * 0.04} key={name}>
              {name}
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  );
}
