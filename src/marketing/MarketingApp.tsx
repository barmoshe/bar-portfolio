import { useState } from 'react';
import './marketing.css';
import { LangProvider } from './LangContext';
import MarketingHeader from './MarketingHeader';
import StickyCTA from './StickyCTA';
import Footer from './Footer';
import HeroPitch from './sections/HeroPitch';
import ProjectTemplates from './sections/ProjectTemplates';
import Intake from './sections/Intake';
import Services from './sections/Services';
import Process from './sections/Process';
import Proof from './sections/Proof';
import FAQ from './sections/FAQ';
import ContactCTA from './sections/ContactCTA';
import { useReveal } from './hooks/useReveal';

export default function MarketingApp() {
  useReveal();
  // Templates → Intake bridge. Only the template field is touched when
  // a card is picked; other form input the user typed is preserved.
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <LangProvider>
      <div className="mp-root">
        <MarketingHeader />
        <main id="main" tabIndex={-1}>
          <HeroPitch />
          <ProjectTemplates selected={selectedTemplate} onPick={setSelectedTemplate} />
          <Intake selectedTemplate={selectedTemplate} />
          <Process />
          <Services />
          <Proof />
          <FAQ />
          <ContactCTA />
        </main>
        <Footer />
        <StickyCTA />
        <div className="ink-wipe" aria-hidden="true" />
      </div>
    </LangProvider>
  );
}
