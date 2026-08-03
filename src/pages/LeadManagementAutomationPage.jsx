import PageTransition from '../components/motion/PageTransition';
import ServicePage from '../components/service-page/ServicePage';
import leadManagementAutomation from '../data/servicePages/leadManagementAutomation';
import usePageMeta from '../hooks/usePageMeta';

export default function LeadManagementAutomationPage() {
  usePageMeta(
    'Lead Management Automation',
    'Automate lead capture, qualification, CRM updates, ownership assignment, and follow-up sequencing so no enquiry is missed.'
  );

  return (
    <PageTransition>
      <ServicePage data={leadManagementAutomation} />
    </PageTransition>
  );
}
