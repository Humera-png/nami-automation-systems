import PageTransition from '../components/motion/PageTransition';
import NamiAIPageContent from '../components/nami-ai/NamiAIPageContent';
import usePageMeta from '../hooks/usePageMeta';

export default function NamiAIPage() {
  usePageMeta('NamiAI', 'Ask NamiAI about automation opportunities, explore a completed audit, or talk through how a workflow could be architected.');

  return (
    <PageTransition>
      <NamiAIPageContent />
    </PageTransition>
  );
}
