import { useEffect, useState } from 'react';
import integrations from '../../data/integrations';
import useReducedMotion from '../../hooks/useReducedMotion';
import useInView from '../../hooks/useInView';
import './Technology.css';

const ROUTES = [
  ['Webhooks', 'OpenAI', 'HubSpot', 'Gmail'],
  ['Google Sheets', 'Claude', 'Slack'],
  ['Gmail', 'REST APIs']
];

const ROUTE_INTERVAL = 3400;

export default function Technology() {
  const reducedMotion = useReducedMotion();
  const [wrapRef, inView] = useInView({ threshold: 0.25 });
  const [routeIndex, setRouteIndex] = useState(0);
  const running = inView && !reducedMotion;

  useEffect(() => {
    if (!running) return undefined;
    const id = setInterval(() => {
      setRouteIndex((current) => (current + 1) % ROUTES.length);
    }, ROUTE_INTERVAL);
    return () => clearInterval(id);
  }, [running]);

  const activeRoute = ROUTES[routeIndex];
  const activeNames = new Set(activeRoute);
  const routeLabel = `${activeRoute[0]} → NAMI Orchestration → ${activeRoute.slice(1).join(' → ')}`;
  const total = integrations.length;

  return (
    <section id="technology" className="technology">
      <div className="container">
        <div className="section-header section-header--center">
          <p className="eyebrow">Technology</p>
          <h2>We connect the systems your business already uses.</h2>
          <p>
            Tools are nodes in the system. Automations are engineered using these technologies and
            platforms — listed here as tools we build with, not as official partnerships.
          </p>
        </div>

        <div ref={wrapRef} className="technology__orbit" role="img" aria-label={`Active system route: ${routeLabel}`}>
          <div className="technology__hub">
            <span className="technology__hub-dot" aria-hidden="true" />
            NAMI Orchestration
          </div>

          {integrations.map((tech, i) => {
            const angle = (360 / total) * i;
            const isActive = activeNames.has(tech.name);
            return (
              <div
                className="technology__anchor"
                key={tech.name}
                style={{ transform: `rotate(${angle}deg) translateY(calc(-1 * var(--orbit-radius))) rotate(${-angle}deg)` }}
                aria-hidden="true"
              >
                <span className={`technology__node ${isActive ? 'is-active' : ''}`}>{tech.name}</span>
              </div>
            );
          })}

          <svg className="technology__lines" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {integrations.map((tech, i) => {
              const angle = ((360 / total) * i - 90) * (Math.PI / 180);
              const x = 50 + 38 * Math.cos(angle);
              const y = 50 + 38 * Math.sin(angle);
              const isActive = activeNames.has(tech.name);
              return (
                <line
                  key={tech.name}
                  x1="50"
                  y1="50"
                  x2={x}
                  y2={y}
                  className={`technology__line ${isActive ? 'is-active' : ''}`}
                />
              );
            })}
          </svg>
        </div>

        <p className="technology__route-label">
          <span className="technology__route-pulse" aria-hidden="true" />
          Active system route — {routeLabel}
        </p>

        <ul className="technology__list">
          {integrations.map((tech) => (
            <li key={tech.name} className={activeNames.has(tech.name) ? 'is-active' : ''}>
              {tech.name}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
