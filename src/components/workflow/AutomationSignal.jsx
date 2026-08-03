import './AutomationSignal.css';

/**
 * The single traveling data-pulse used everywhere the site shows something
 * moving through a workflow: hero, opportunity transform, explorer,
 * how-it-works, technology orbit, background topology.
 */
export default function AutomationSignal({ axis = 'x', active = false, inverse = false, className = '' }) {
  return (
    <span
      className={[
        'automation-signal',
        `automation-signal--${axis}`,
        active ? 'is-active' : '',
        inverse ? 'automation-signal--inverse' : '',
        className
      ]
        .join(' ')
        .trim()}
      aria-hidden="true"
    />
  );
}
