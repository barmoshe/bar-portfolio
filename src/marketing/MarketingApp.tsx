import { useEffect, useState } from 'react';
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
import { ScrollTrigger } from '../lib/gsap';

/**
 * Marketing entry — "לוח / BOARD" direction. Every visible block is
 * a sticker-card with a status pill. Sections are kanban columns.
 *
 * Mobile-first: layout decisions in marketing.css favor portrait phones
 * first, then translate up. iOS Safari ScrollTrigger quirks dodged by
 * setting `ignoreMobileResize: true` once at boot and avoiding `pin`
 * + `normalizeScroll`.
 *
 * Locked: theme system (`useTheme.ts` + `.ink-wipe`), pre-paint script
 * in `business/index.html`, copy in `i18n.ts` (existing strings),
 * Intake form logic.
 */
export default function MarketingApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  // Boot-time ScrollTrigger tuning — avoid iOS Safari's address-bar
  // resize re-triggering refresh and clobbering pin positions.
  useEffect(() => {
    ScrollTrigger.config({ ignoreMobileResize: true });
  }, []);

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
