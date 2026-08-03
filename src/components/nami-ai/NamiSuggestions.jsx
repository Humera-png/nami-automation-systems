const SUGGESTED_PROMPTS = ['Lead follow-ups', 'Copying data between tools', 'Client onboarding', 'Manual reporting', 'Email management'];

export default function NamiSuggestions({ onSelect }) {
  return (
    <div className="nami-suggestions">
      <p className="nami-suggestions__label">What does your team handle manually?</p>
      <div className="nami-suggestions__list">
        {SUGGESTED_PROMPTS.map((prompt) => (
          <button type="button" key={prompt} className="nami-suggestions__item" onClick={() => onSelect(prompt)}>
            <span className="nami-suggestions__item-dot" aria-hidden="true" />
            {prompt}
          </button>
        ))}
      </div>
    </div>
  );
}
