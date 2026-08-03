import PageTransition from '../components/motion/PageTransition';
import AutomationExplorer from '../components/explorer/AutomationExplorer';
import PageCTA from '../components/layout/PageCTA';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import usePageMeta from '../hooks/usePageMeta';

export default function SystemsPage() {
  usePageMeta('Systems', 'Explore how triggers, data, AI reasoning, decisions, and approvals connect inside a NAMI automation architecture.');

  return (
    <PageTransition>
      <div className="container">
        <Breadcrumbs items={[{ label: 'Systems' }]} />
      </div>
      <AutomationExplorer />
      <PageCTA heading="Ready to build this workflow?" />
    </PageTransition>
  );
}
