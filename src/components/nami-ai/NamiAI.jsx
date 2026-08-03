import { useEffect, useRef, useState } from 'react';
import NamiMessage from './NamiMessage';
import NamiSuggestions from './NamiSuggestions';
import NamiGlyph from './NamiGlyph';
import WorkflowMessage from './WorkflowMessage';
import NamiLeadForm from './NamiLeadForm';
import ProcessingIndicator from '../workflow/ProcessingIndicator';
import { NAMI_AI_OPEN_EVENT } from './namiAIEvents';
import useSessionId from '../../hooks/useSessionId';
import { sendNamiAIMessage } from '../../services/namiAIService';
import { openStrategyCall } from '../../services/calendly';
import './NamiAI.css';

// Never a raw/technical error — a visitor should never feel NamiAI is
// broken. The real failure (timeout, network, rate limit) is logged to
// the console in dev only; this is what they see. Matches the graceful
// line the backend itself falls back to when Gemini fails server-side.
const FALLBACK_MESSAGE = "We're currently analysing your request. Please try again in a moment.";

const INTRO_MESSAGE =
  "Hi, I'm NamiAI. Tell me one process your team repeatedly handles manually. I'll help map where automation may make sense.";

export default function NamiAI() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('idle'); // idle | loading
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [calendlyShown, setCalendlyShown] = useState(false);
  const sessionId = useSessionId();
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleOpen = (event) => {
      setIsOpen(true);
      const detail = event?.detail;
      if (!detail?.prefill) return;
      if (detail.autoSend) {
        sendMessage(detail.prefill);
      } else {
        setInput(detail.prefill);
      }
    };
    window.addEventListener(NAMI_AI_OPEN_EVENT, handleOpen);
    return () => window.removeEventListener(NAMI_AI_OPEN_EVENT, handleOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, status]);

  const sendMessage = async (text) => {
    const trimmed = text.trim();
    if (!trimmed || status === 'loading') return;

    // Prior turns only — the new user message is sent separately as
    // `message`, not duplicated into `history`.
    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    setMessages((current) => [...current, { role: 'user', content: trimmed }]);
    setInput('');
    setStatus('loading');

    try {
      const { reply, suggestBooking, identifiedProcess } = await sendNamiAIMessage({ message: trimmed, sessionId, history });
      if (suggestBooking) setCalendlyShown(true);
      setMessages((current) => [...current, { role: 'assistant', content: reply, suggestBooking, identifiedProcess }]);
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[NamiAI] send failed:', err.code, err.message);
      }
      // Rendered as a normal assistant message, not an error bubble — the
      // visitor should never feel NamiAI is broken.
      setMessages((current) => [...current, { role: 'assistant', content: FALLBACK_MESSAGE }]);
    } finally {
      setStatus('idle');
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    sendMessage(input);
  };

  // Most recent identified process wins — used as context for the lead
  // email subject/body if the visitor submits their details.
  const latestIdentifiedProcess = [...messages].reverse().find((m) => m.identifiedProcess)?.identifiedProcess || null;

  const handleLeadSubmitted = (name) => {
    setLeadSubmitted(true);
    setMessages((current) => [
      ...current,
      {
        role: 'assistant',
        content: `Thank you, ${name}. Your workflow details have been sent to the NAMI team. We'll review the context and contact you using the email you provided.`,
        suggestBooking: true
      }
    ]);
  };

  return (
    <div className="nami-ai">
      {!isOpen && (
        <button type="button" className="nami-ai__launcher" onClick={() => setIsOpen(true)} aria-label="Ask NamiAI">
          <span className="nami-ai__launcher-glyph">
            <NamiGlyph active />
            <span className="nami-ai__launcher-status" aria-hidden="true" />
          </span>
          <span className="nami-ai__launcher-text">Ask NamiAI</span>
        </button>
      )}

      {isOpen && (
        <div className="nami-ai__panel" role="dialog" aria-label="NamiAI automation consultant" aria-modal="false">
          <header className="nami-ai__header">
            <div className="nami-ai__header-identity">
              <NamiGlyph active busy={status === 'loading'} />
              <div>
                <p className="nami-ai__header-title">NamiAI</p>
                <p className="nami-ai__header-status">NAMI System Interface · Online</p>
              </div>
            </div>
            <button type="button" className="nami-ai__close" onClick={() => setIsOpen(false)} aria-label="Close NamiAI">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          </header>

          <div className="nami-ai__body" ref={scrollRef}>
            <NamiMessage role="assistant" content={INTRO_MESSAGE} />

            {messages.map((message, index) => {
              const isLast = index === messages.length - 1;
              const showLeadForm = message.suggestBooking && isLast && !leadSubmitted;
              const showPlainCta = message.suggestBooking && !showLeadForm;

              return (
                <div key={index} className={`nami-message-group ${message.role === 'user' ? 'nami-message-group--user' : ''}`}>
                  <NamiMessage role={message.role} content={message.content} />
                  {message.workflow && <WorkflowMessage steps={message.workflow} />}
                  {showPlainCta && (
                    <button
                      type="button"
                      className="btn btn-primary nami-ai__booking-cta"
                      onClick={() => openStrategyCall('namiai-chat')}
                    >
                      Book Strategy Call
                    </button>
                  )}
                  {showLeadForm && (
                    <NamiLeadForm
                      conversation={messages.map((m) => ({ role: m.role, content: m.content }))}
                      identifiedProcess={message.identifiedProcess || latestIdentifiedProcess}
                      sessionId={sessionId}
                      calendlyShown={calendlyShown}
                      onSubmitted={handleLeadSubmitted}
                    />
                  )}
                </div>
              );
            })}

            {status === 'loading' && (
              <div className="nami-message nami-message--assistant" aria-live="polite">
                <span className="nami-message__avatar" aria-hidden="true" />
                <p className="nami-message__bubble nami-message__bubble--loading">
                  <ProcessingIndicator />
                </p>
              </div>
            )}

            {messages.length === 0 && status !== 'loading' && <NamiSuggestions onSelect={sendMessage} />}
          </div>

          <form className="nami-ai__input-row" onSubmit={handleSubmit}>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="What does your team do manually?"
              aria-label="Message NamiAI"
            />
            <button type="submit" className="nami-ai__send" disabled={status === 'loading' || !input.trim()}>
              Send
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
