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
import { useReveal } from './hooks/useReveal';

/**
 * Marketing entry — "לוח / BOARD" direction. Every visible block is
 * a sticker-card with a status pill. Sections are kanban columns.
 *
 * Mobile-first: layout decisions in marketing.css favor portrait phones
 * first, then translate up.
 *
 * The only scroll-related animation on this page is the section reveal
 * wired up by `useReveal` — sections fade + translate up once on entry.
 *
 * Locked: theme system (`useTheme.ts` + `.ink-wipe`), pre-paint script
 * in `business/index.html`, copy in `i18n.ts` (existing strings),
 * Intake form logic.
 */
export default function MarketingApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  useReveal();

  return (
    <LangProvider>
      <div className="mp-root mp-board">
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
        {/* Used by the global theme ink-wipe transition. Do not remove. */}
        <div className="ink-wipe" aria-hidden="true" />
      </div>
    </LangProvider>
  );
}
