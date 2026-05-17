import { useState } from 'react';
import './marketing.css';
import { LangProvider } from './LangContext';
import MarketingHeader from './MarketingHeader';
import Cover from './sections/Cover';
import ProjectTemplates from './sections/ProjectTemplates';
import Intake from './sections/Intake';
import Process from './sections/Process';
import About from './sections/About';
import FAQ from './sections/FAQ';
import ContactCTA from './sections/ContactCTA';
import PaperGrain from './components/PaperGrain';

export default function MarketingApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <LangProvider>
      <div className="mp-root">
        <PaperGrain />
        <MarketingHeader />
        <main id="main" tabIndex={-1}>
          <Cover />
          <ProjectTemplates selected={selectedTemplate} onPick={setSelectedTemplate} />
          <Process />
          <About />
          <Intake selectedTemplate={selectedTemplate} />
          <FAQ />
          <ContactCTA />
        </main>
        <div className="ink-wipe" aria-hidden="true" />
      </div>
    </LangProvider>
  );
}
