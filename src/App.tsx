import { lazy, Suspense, useEffect, useState } from 'react';
import Grain from './components/Grain';
import Crease from './components/Crease';
import Boot from './components/Boot';
import Strip from './components/Strip';
import TabBar from './components/TabBar';
import Lightbox from './components/Lightbox';
import InkDefs from './components/InkDefs';
import Intro from './components/sections/Intro';
import Background from './components/sections/Background';
import Repos from './components/sections/Repos';
// Split the mixtape into its own chunk so the initial load doesn't pay
// for an audio engine that only the mixtape uses.
const Mixtape = lazy(() => import('./components/sections/Mixtape'));
import Letter from './components/sections/Letter';
import { projects } from './data/portfolio';
import { useTheme } from './hooks/useTheme';
import { useLightbox } from './hooks/useLightbox';
import { useFolioScrub } from './hooks/useFolioScrub';

const SKIP_KEY = 'bm:skip';
const BOOT_COMPLETE_EVENT = 'bar:boot-complete';

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
  const { pref: themePref, cycle, set: setThemePref, glyph, label } = useTheme();
  const { openIdx, sourceRect, open, close } = useLightbox();
  useFolioScrub();

  const openFromCard = (idx: number) => {
    const card = document.querySelector<HTMLElement>(`.clip [data-idx="${idx}"]`);
    if (card) {
      const r = card.getBoundingClientRect();
      open(idx, { left: r.left, top: r.top, width: r.width, height: r.height });
    } else {
      open(idx);
    }
  };

  useEffect(() => {
    if (showBoot) return;
    (window as unknown as { __barBooted?: boolean }).__barBooted = true;
    window.dispatchEvent(new Event(BOOT_COMPLETE_EVENT));
  }, [showBoot]);

  const onSkip = () => {
    writeSkip();
    setSkipRemembered(true);
  };

  const openProject = openIdx !== null ? projects[openIdx] ?? null : null;
  const modalOpen = openIdx !== null;

  return (
    <>
      <InkDefs />
      <Grain />
      <Crease />
      {showBoot ? <Boot onGone={() => setShowBoot(false)} /> : null}
      <div inert={modalOpen}>
        <Strip
          themeGlyph={glyph}
          themeLabel={label}
          themePref={themePref}
          onThemeCycle={cycle}
          onThemeSet={setThemePref}
          onSkip={onSkip}
          skipRemembered={skipRemembered}
        />
        <main id="main" tabIndex={-1}>
          <Intro />
          <Background />
          <Suspense fallback={<section id="mixtape" aria-hidden="true" style={{ minHeight: 600 }} />}>
            <Mixtape />
          </Suspense>
          <Repos onOpen={openFromCard} />
          <Letter />
        </main>
        <TabBar />
      </div>
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
