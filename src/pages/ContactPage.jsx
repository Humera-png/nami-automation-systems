import PageTransition from '../components/motion/PageTransition';
import ContactForm from '../components/contact/ContactForm';
import usePageMeta from '../hooks/usePageMeta';

export default function ContactPage() {
  usePageMeta('Start a Project', 'Tell NAMI about a repetitive process to start scoping an automation system for your business.');

  return (
    <PageTransition>
      <ContactForm />
    </PageTransition>
  );
}
