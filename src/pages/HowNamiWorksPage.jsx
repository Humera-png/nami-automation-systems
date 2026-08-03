import PageTransition from '../components/motion/PageTransition';
import HowItWorks from '../components/how-it-works/HowItWorks';
import ArchitecturePrinciples from '../components/principles/ArchitecturePrinciples';
import PageCTA from '../components/layout/PageCTA';
import Breadcrumbs from '../components/layout/Breadcrumbs';
import usePageMeta from '../hooks/usePageMeta';

export default function HowNamiWorksPage() {
  usePageMeta('How NAMI Works', 'Understand, identify, engineer, deploy — the process NAMI follows to turn manual operations into automation systems.');

  return (
    <PageTransition>
      <div className="container">
        <Breadcrumbs items={[{ label: 'How NAMI Works' }]} />
      </div>
      <HowItWorks />
      <ArchitecturePrinciples />
      <PageCTA />
    </PageTransition>
  );
}
