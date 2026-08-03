import PageTransition from '../components/motion/PageTransition';
import ServicePage from '../components/service-page/ServicePage';
import documentProcessingAutomation from '../data/servicePages/documentProcessingAutomation';
import usePageMeta from '../hooks/usePageMeta';

export default function DocumentProcessingAutomationPage() {
  usePageMeta(
    'Document Processing Automation',
    'Automate invoice, contract, and form processing — data extraction, validation, record matching, and exception routing for human review.'
  );

  return (
    <PageTransition>
      <ServicePage data={documentProcessingAutomation} />
    </PageTransition>
  );
}
