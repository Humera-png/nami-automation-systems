import NamiGlyph from './NamiGlyph';
import { openNamiAI } from './namiAIEvents';
import './NamiAIIntro.css';

export default function NamiAIIntro() {
  return (
    <section id="nami" className="nami-intro">
      <div className="container nami-intro__inner">
        <NamiGlyph active className="nami-intro__glyph" />
        <p className="eyebrow">NAMI System Interface</p>
        <h2>
          Not sure what to automate?
          <br />
          Ask NamiAI.
        </h2>
        <p className="nami-intro__paragraph">
          Ask about automation opportunities, explore your audit, or understand how a workflow could
          be architected.
        </p>
        <button type="button" className="btn btn-primary" onClick={openNamiAI}>
          Ask NamiAI
        </button>
      </div>
    </section>
  );
}
