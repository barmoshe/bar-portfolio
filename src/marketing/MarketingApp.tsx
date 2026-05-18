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
import LiquidField from './components/LiquidField';
import SectionZone, { type ZonePalette } from './components/SectionZone';

// Per-section blob palettes for the liquid drift field. Each
// recipe shuffles which of the 4 Reef Sunset pop colors land in
// each blob slot so scrolling between sections crossfades the
// mass into a visibly different recipe. The values are CSS
// variable references so they auto-flip between light + dark.
const POP_1 = 'var(--rs-pop-1)';
const POP_2 = 'var(--rs-pop-2)';
const POP_3 = 'var(--rs-pop-3)';
const POP_4 = 'var(--rs-pop-4)';

const ZONES: Record<string, ZonePalette> = {
  cover:    { blob1: POP_1, blob2: POP_2, blob3: POP_3, blob4: POP_4 },
  contents: { blob1: POP_2, blob2: POP_3, blob3: POP_1, blob4: POP_4 },
  method:   { blob1: POP_3, blob2: POP_1, blob3: POP_4, blob4: POP_2 },
  about:    { blob1: POP_4, blob2: POP_1, blob3: POP_2, blob4: POP_3 },
  brief:    { blob1: POP_2, blob2: POP_3, blob3: POP_4, blob4: POP_1 },
  qa:       { blob1: POP_1, blob2: POP_4, blob3: POP_3, blob4: POP_2 },
  colophon: { blob1: POP_3, blob2: POP_2, blob3: POP_1, blob4: POP_4 },
};

export default function MarketingApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');

  return (
    <LangProvider>
      <div className="mp-root">
        <LiquidField />
        <PaperGrain />
        <MarketingHeader />
        <main id="main" tabIndex={-1}>
          <SectionZone name="cover" palette={ZONES.cover}>
            <Cover />
          </SectionZone>
          <SectionZone name="contents" palette={ZONES.contents}>
            <ProjectTemplates selected={selectedTemplate} onPick={setSelectedTemplate} />
          </SectionZone>
          <SectionZone name="method" palette={ZONES.method}>
            <Process />
          </SectionZone>
          <SectionZone name="about" palette={ZONES.about}>
            <About />
          </SectionZone>
          <SectionZone name="brief" palette={ZONES.brief}>
            <Intake selectedTemplate={selectedTemplate} />
          </SectionZone>
          <SectionZone name="qa" palette={ZONES.qa}>
            <FAQ />
          </SectionZone>
          <SectionZone name="colophon" palette={ZONES.colophon}>
            <ContactCTA />
          </SectionZone>
        </main>
        <div className="ink-wipe" aria-hidden="true" />
      </div>
    </LangProvider>
  );
}
