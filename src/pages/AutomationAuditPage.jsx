import PageTransition from '../components/motion/PageTransition';
import AutomationAudit from '../components/contact/AutomationAudit';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import usePageMeta from '../hooks/usePageMeta';

export default function AutomationAuditPage() {
  usePageMeta(
    'Business Automation Audit — Find Manual Work to Automate',
    'Analyse your current workflow, identify repetitive tasks, uncover automation opportunities, and receive a practical business automation roadmap.'
  );

  return (
    <PageTransition>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Automation Audit' }]} />
      </div>
      <AutomationAudit />
    </PageTransition>
  );
}
