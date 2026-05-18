import { useState } from 'react';
import '../marketing/marketing.css';
import { LangProvider } from './LangContext';
import LabHeader from './LabHeader';
import LabCover from './sections/LabCover';
import LabProjectTemplates from './sections/LabProjectTemplates';
import Process from './sections/Process';
import About from './sections/About';
import LabIntake from './sections/LabIntake';
import LabFAQ from './sections/LabFAQ';
import LabContactCTA from './sections/LabContactCTA';
import { useReveal } from '../marketing/hooks/useReveal';

/**
 * The Lab — a sister landing surface to /business/. Same kanban-BOARD
 * structure, amber-led sub-brand (see `.mp-lab` in marketing.css), and
 * a simpler one-screen intake. The lab is a soft launch from a
 * LinkedIn post: no-strings free first-build, with a subtle hint at
 * commercial follow-up. No cross-link to /business/ in v1.
 */
export default function LabApp() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  useReveal();

  return (
    <LangProvider>
      <div className="mp-root mp-board mp-lab">
        <LabHeader />
        <main id="main" tabIndex={-1}>
          <LabCover />
          <Process />
          <About />
          <LabProjectTemplates selected={selectedTemplate} onPick={setSelectedTemplate} />
          <LabIntake selectedTemplate={selectedTemplate} />
          <LabFAQ />
          <LabContactCTA />
        </main>
        <div className="ink-wipe" aria-hidden="true" />
      </div>
    </LangProvider>
  );
}
