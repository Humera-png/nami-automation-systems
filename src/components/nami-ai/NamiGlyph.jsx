export default function NamiGlyph({ active = false, busy = false, className = '' }) {
  return (
    <svg
      className={`nami-glyph ${active ? 'is-active' : ''} ${busy ? 'is-busy' : ''} ${className}`.trim()}
      viewBox="0 0 32 32"
      width="20"
      height="20"
      aria-hidden="true"
    >
      <line x1="16" y1="16" x2="6" y2="9" className="nami-glyph__line" />
      <line x1="16" y1="16" x2="26" y2="9" className="nami-glyph__line" />
      <line x1="16" y1="16" x2="16" y2="26" className="nami-glyph__line" />
      <circle cx="6" cy="9" r="2.2" className="nami-glyph__node" />
      <circle cx="26" cy="9" r="2.2" className="nami-glyph__node" />
      <circle cx="16" cy="26" r="2.2" className="nami-glyph__node" />
      <circle cx="16" cy="16" r="3" className="nami-glyph__hub" />
    </svg>
  );
}
