import Hero from '../components/hero/Hero';
import ProblemValue from '../components/home/ProblemValue';
import ProcessTransformationPreview from '../components/home/ProcessTransformationPreview';
import SolutionDirections from '../components/home/SolutionDirections';
import Industries from '../components/home/Industries';
import SystemArchitecturePreview from '../components/home/SystemArchitecturePreview';
import DeliveryProcess from '../components/home/DeliveryProcess';
import AuditPreview from '../components/home/AuditPreview';
import CaseStudiesPreview from '../components/home/CaseStudiesPreview';
import Integrations from '../components/home/Integrations';
import FAQ from '../components/home/FAQ';
import FinalCTA from '../components/final-cta/FinalCTA';
import usePageMeta from '../hooks/usePageMeta';

export default function Home() {
  usePageMeta(
    'AI Automation Systems for Business Operations',
    'NAMI designs AI agents, workflow automations, and custom business systems that reduce manual work, connect software, improve visibility, and scale business operations.'
  );

  return (
    <>
      <Hero />
      <ProblemValue />
      <ProcessTransformationPreview />
      <SolutionDirections />
      <Industries />
      <SystemArchitecturePreview />
      <DeliveryProcess />
      <AuditPreview />
      <CaseStudiesPreview />
      <Integrations />
      <FAQ />
      <FinalCTA />
    </>
  );
}
