import { useState } from 'react';
import { submitContactForm } from '../../services/contactService';
import { openStrategyCall } from '../../services/calendly';
import Reveal from '../motion/Reveal';
import './ContactForm.css';

const SERVICES = ['Operations Automation', 'AI Workflow Systems', 'Custom Business Systems', 'Not sure yet'];
const BUDGETS = ['Under $10k', '$10k – $25k', '$25k – $50k', '$50k – $100k', '$100k+', 'Not sure yet'];
const TIMELINES = ['Immediately', 'Within 1 month', '1–3 months', '3–6 months', 'Just exploring'];

const INITIAL_FORM = {
  fullName: '',
  email: '',
  company: '',
  phone: '',
  website: '',
  industry: '',
  companySize: '',
  currentTools: '',
  service: '',
  budget: '',
  timeline: '',
  message: ''
};

const FRIENDLY_ERROR_MESSAGE =
  "We couldn't send your message right now. Nothing below has been lost — please try again in a moment.";

export default function ContactForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [status, setStatus] = useState('idle'); // idle | loading | success | error
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;

    setIsSubmitting(true);
    setStatus('loading');
    try {
      await submitContactForm(form);
      setStatus('success');
      setForm(INITIAL_FORM);
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.error('[ContactForm] submission failed:', err.code, err.message);
      }
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact-form" className="contact-form-section">
      <div className="container">
        <Reveal as="div" className="section-header">
          <p className="eyebrow">Start a Project</p>
          <h1>Tell us about your business.</h1>
          <p>
            Share what your team is doing manually today. We review every inquiry personally and reply
            within 1–2 business days.
          </p>
          <p className="contact-form__strategy-note">
            Prefer to talk it through live?{' '}
            <button type="button" className="contact-form__strategy-link" onClick={() => openStrategyCall('contact-page')}>
              Book a Strategy Call
            </button>{' '}
            instead.
          </p>
        </Reveal>

        <div className="contact-form__layout">
          {status === 'success' && (
            <div className="contact-form__banner contact-form__banner--success" role="status">
              <p className="contact-form__banner-title">Message received.</p>
              <p>We&apos;ll be in touch within 1–2 business days. You can send another inquiry below if needed.</p>
            </div>
          )}

          {status === 'error' && (
            <div className="contact-form__banner contact-form__banner--error" role="alert">
              <p className="contact-form__banner-title">{FRIENDLY_ERROR_MESSAGE}</p>
            </div>
          )}

          <form className="contact-form__form" onSubmit={handleSubmit} noValidate>
            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="fullName">Full Name</label>
                <input id="fullName" type="text" required value={form.fullName} onChange={handleChange('fullName')} />
              </div>
              <div className="contact-form__field">
                <label htmlFor="email">Work Email</label>
                <input id="email" type="email" required value={form.email} onChange={handleChange('email')} />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="company">Company</label>
                <input id="company" type="text" value={form.company} onChange={handleChange('company')} />
              </div>
              <div className="contact-form__field">
                <label htmlFor="phone">Phone</label>
                <input id="phone" type="tel" value={form.phone} onChange={handleChange('phone')} />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="website">Company Website</label>
                <input id="website" type="text" value={form.website} onChange={handleChange('website')} />
              </div>
              <div className="contact-form__field">
                <label htmlFor="industry">Industry</label>
                <input id="industry" type="text" value={form.industry} onChange={handleChange('industry')} />
              </div>
            </div>

            <div className="contact-form__row">
              <div className="contact-form__field">
                <label htmlFor="companySize">Company Size</label>
                <input id="companySize" type="text" value={form.companySize} onChange={handleChange('companySize')} />
              </div>
              <div className="contact-form__field">
                <label htmlFor="currentTools">Current Tools</label>
                <input id="currentTools" type="text" value={form.currentTools} onChange={handleChange('currentTools')} />
              </div>
            </div>

            <div className="contact-form__row contact-form__row--three">
              <div className="contact-form__field">
                <label htmlFor="service">Service of Interest</label>
                <select id="service" value={form.service} onChange={handleChange('service')}>
                  <option value="">Select a service</option>
                  {SERVICES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contact-form__field">
                <label htmlFor="budget">Budget</label>
                <select id="budget" value={form.budget} onChange={handleChange('budget')}>
                  <option value="">Select a range</option>
                  {BUDGETS.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
              <div className="contact-form__field">
                <label htmlFor="timeline">Timeline</label>
                <select id="timeline" value={form.timeline} onChange={handleChange('timeline')}>
                  <option value="">Select a timeline</option>
                  {TIMELINES.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="contact-form__field">
              <label htmlFor="message">What would you like to automate?</label>
              <textarea id="message" rows={5} required value={form.message} onChange={handleChange('message')} />
            </div>

            <button type="submit" className="btn btn-primary contact-form__submit" disabled={isSubmitting}>
              {isSubmitting ? 'Sending…' : 'Send Inquiry'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
