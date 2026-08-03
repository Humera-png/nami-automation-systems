import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ScrollToTop from './components/layout/ScrollToTop';
import NamiAI from './components/nami-ai/NamiAI';
import Home from './pages/Home';
import SolutionsPage from './pages/SolutionsPage';
import HowNamiWorksPage from './pages/HowNamiWorksPage';
import AutomationAuditPage from './pages/AutomationAuditPage';
import SystemsPage from './pages/SystemsPage';
import CaseStudiesPage from './pages/CaseStudiesPage';
import AboutPage from './pages/AboutPage';
import NamiAIPage from './pages/NamiAIPage';
import ContactPage from './pages/ContactPage';
import StrategyCallPage from './pages/StrategyCallPage';
import LeadManagementAutomationPage from './pages/LeadManagementAutomationPage';
import DocumentProcessingAutomationPage from './pages/DocumentProcessingAutomationPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <a href="#top" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="top">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/how-nami-works" element={<HowNamiWorksPage />} />
          <Route path="/automation-audit" element={<AutomationAuditPage />} />
          <Route path="/systems" element={<SystemsPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/nami-ai" element={<NamiAIPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/strategy-call" element={<StrategyCallPage />} />
          <Route path="/lead-management-automation" element={<LeadManagementAutomationPage />} />
          <Route path="/document-processing-automation" element={<DocumentProcessingAutomationPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      <Footer />
      <NamiAI />
    </>
  );
}
