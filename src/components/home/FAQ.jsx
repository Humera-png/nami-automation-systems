import { useState } from 'react';
import Reveal from '../motion/Reveal';
import useStructuredData from '../../hooks/useStructuredData';
import './FAQ.css';

const QUESTIONS = [
  {
    question: 'How long does a project take?',
    answer:
      'It depends on the complexity of the process and how many systems are involved. Most projects move from discovery to a live system within a few weeks, not months.'
  },
  {
    question: 'Which tools do you support?',
    answer:
      'NAMI builds around the tools you already use — CRMs, spreadsheets, email, Slack, ERPs, and custom APIs — rather than asking you to switch software.'
  },
  {
    question: 'Do you replace employees?',
    answer:
      'No. NAMI removes the repetitive, mechanical parts of a process so your team can spend time on judgement calls and relationships — not replace the people making them.'
  },
  {
    question: 'Can you integrate existing software?',
    answer:
      'Yes. Most NAMI systems are built specifically to connect to software you already have in place, rather than requiring you to replace it.'
  },
  {
    question: 'Do you build custom AI agents?',
    answer:
      'Yes. Where a workflow needs genuine reasoning — understanding intent, drafting responses, classifying requests — NAMI builds an AI agent for that specific task, with a person retaining oversight.'
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  useStructuredData({
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: QUESTIONS.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer }
    }))
  });

  return (
    <section className="faq">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow eyebrow--number">10 / FAQ</p>
          <h2>Questions we hear before a project starts.</h2>
        </Reveal>

        <ul className="faq__list">
          {QUESTIONS.map((item, i) => {
            const isOpen = openIndex === i;
            return (
              <li className="faq__item" key={item.question}>
                <button
                  type="button"
                  className="faq__question"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${i}`}
                  onClick={() => setOpenIndex(isOpen ? -1 : i)}
                >
                  {item.question}
                  <span className="faq__icon" aria-hidden="true">
                    {isOpen ? '−' : '+'}
                  </span>
                </button>
                {isOpen && (
                  <p className="faq__answer" id={`faq-answer-${i}`}>
                    {item.answer}
                  </p>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
