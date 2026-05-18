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

/**
 * Marketing entry — currently STRIPPED to plain HTML pending a
 * full visual redesign. The form logic, copy, theme system, and
 * a11y panel are all wired and locked. The next design agent
 * picks up from `DESIGN_BRIEF.md` in this folder.
 *
 * Infra components left in place for the redesign to wire back:
 *   - components/LiquidField    (gooey color field)
 *   - components/KineticHeadline (clip-reveal headline)
 *   - components/BloomCta        (touch-first bloom CTA)
 *   - components/SectionZone     (per-section palette crossfade)
 *   - components/PaperGrain      (SVG noise overlay)
 *
 * These are not imported here — they exist as building blocks
 * the redesigning agent can use, ignore, or replace.
 */
export default function MarketingApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <LangProvider>
      <div className="mp-root">
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
