import { useEffect, useState } from 'react';
import Grain from './components/Grain';
import Crease from './components/Crease';
import Boot from './components/Boot';
import Strip from './components/Strip';
import TabBar from './components/TabBar';
import Lightbox from './components/Lightbox';
import InkDefs from './components/InkDefs';
import Dossier from './components/sections/Dossier';
import Story from './components/sections/Story';
import Experience from './components/sections/Experience';
import Repos from './components/sections/Repos';
import Music from './components/sections/Music';
import Notes from './components/sections/Notes';
import Letter from './components/sections/Letter';
import { projects } from './data/portfolio';
import { useTheme } from './hooks/useTheme';
import { useLightbox } from './hooks/useLightbox';
import { useFolioScrub } from './hooks/useFolioScrub';

const SKIP_KEY = 'bm:skip';

function readSkip(): boolean {
  try {
    return localStorage.getItem(SKIP_KEY) === '1';
  } catch {
    return false;
  }
}

function writeSkip(): void {
  try {
    localStorage.setItem(SKIP_KEY, '1');
  } catch {
    /* ignore */
  }
}

export default function App() {
  const [showBoot, setShowBoot] = useState(() => !readSkip());
  const [skipRemembered, setSkipRemembered] = useState(() => readSkip());
  const { cycle, glyph, label } = useTheme();
  const { openIdx, sourceRect, open, close } = useLightbox();
  useFolioScrub();

  const openFromCard = (idx: number) => {
    const card = document.querySelector<HTMLElement>(`.clip article[data-idx="${idx}"]`);
    if (card) {
      const r = card.getBoundingClientRect();
      open(idx, { left: r.left, top: r.top, width: r.width, height: r.height });
    } else {
      open(idx);
    }
  };

  // Keyboard shortcut: open lightbox on Enter/Space when a project card is focused.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Enter' && e.key !== ' ') return;
      const t = (document.activeElement as HTMLElement | null)?.closest('.clip article');
      if (t instanceof HTMLElement && t.dataset['idx']) {
        e.preventDefault();
        openFromCard(Number(t.dataset['idx']));
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onSkip = () => {
    writeSkip();
    setSkipRemembered(true);
  };

  const openProject = openIdx !== null ? projects[openIdx] ?? null : null;

  return (
    <>
      <InkDefs />
      <Grain />
      <Crease />
      {showBoot ? <Boot onGone={() => setShowBoot(false)} /> : null}
      <Strip
        themeGlyph={glyph}
        themeLabel={label}
        onThemeCycle={cycle}
        onSkip={onSkip}
        skipRemembered={skipRemembered}
      />
      <main>
        <Dossier />
        <Story />
        <Experience />
        <Repos onOpen={openFromCard} />
        <Music />
        <Notes />
        <Letter />
      </main>
      <TabBar />
      <Lightbox
        project={openProject}
        idx={openIdx}
        sourceRect={sourceRect}
        onClose={close}
      />
      <div className="ink-wipe" aria-hidden="true" />
    </>
  );
}
