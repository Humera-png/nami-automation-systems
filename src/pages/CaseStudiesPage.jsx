import PageTransition from '../components/motion/PageTransition';
import CaseStudies from '../components/case-studies/CaseStudies';
import PageCTA from '../components/layout/PageCTA';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import usePageMeta from '../hooks/usePageMeta';

export default function CaseStudiesPage() {
  usePageMeta(
    'AI Automation Case Studies and System Blueprints',
    'See how NAMI approaches lead automation, approvals, document processing, inventory monitoring, AI operations, and custom business workflow systems.'
  );

  return (
    <PageTransition>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Case Studies' }]} />
      </div>
      <CaseStudies />
      <PageCTA heading="Let's engineer yours." />
    </PageTransition>
  );
}
