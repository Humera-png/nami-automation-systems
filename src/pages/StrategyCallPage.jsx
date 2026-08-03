import PageTransition from '../components/motion/PageTransition';
import StrategyCall from '../components/strategy-call/StrategyCall';
import usePageMeta from '../hooks/usePageMeta';

export default function StrategyCallPage() {
  usePageMeta('Book a Strategy Call', 'Book a free 30-minute Automation Strategy Call with NAMI to map your workflow, uncover automation opportunities, and estimate ROI.');

  return (
    <PageTransition>
      <StrategyCall />
    </PageTransition>
  );
}
