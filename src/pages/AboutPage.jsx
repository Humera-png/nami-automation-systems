import PageTransition from '../components/motion/PageTransition';
import About from '../components/about/About';
import PageCTA from '../components/layout/PageCTA';
import usePageMeta from '../hooks/usePageMeta';

export default function AboutPage() {
  usePageMeta('About', 'NAMI is led by Humera Shaikh, combining workflow automation, AI systems, full-stack engineering, and business process thinking.');

  return (
    <PageTransition>
      <About />
      <PageCTA />
    </PageTransition>
  );
}
