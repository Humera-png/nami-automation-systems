import PageTransition from '../components/motion/PageTransition';
import Solutions from '../components/solutions/Solutions';
import PageCTA from '../components/layout/PageCTA';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import usePageMeta from '../hooks/usePageMeta';

export default function SolutionsPage() {
  usePageMeta(
    'AI Automation Services and Workflow Systems',
    'Explore AI workflow engineering, lead automation, internal process automation, document workflows, system integrations, and custom business systems from NAMI.'
  );

  return (
    <PageTransition>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Solutions' }]} />
      </div>
      <Solutions />
      <PageCTA heading="Let's design your automation system." />
    </PageTransition>
  );
}
