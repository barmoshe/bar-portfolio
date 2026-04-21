/**
 * Theme state + ink-wipe GSAP timeline.
 *
 * Three cooperating layers make theming work; this hook is layer 2 of 3.
 * Layer 1 is the inline pre-paint script in `index.html` (FOUC prevention).
 * Layer 3 is the `.ink-wipe` div in `App.tsx`, mutated imperatively here.
 *
 * Full walkthrough: `knowledge/03-theming.md`.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

/** `'auto'` follows OS; `'light'` and `'dark'` pin explicitly. */
export type ThemePref = 'auto' | 'light' | 'dark';

const KEY = 'bm:theme';
const GLYPH: Record<ThemePref, string> = { auto: '🌓', light: '☀', dark: '☾' };
const LABEL: Record<ThemePref, string> = {
  auto: 'Theme: auto (system)',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

function read(): ThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'light' || v === 'dark') return v;
  } catch {
    /* ignore */
  }
  return 'auto';
}

function write(pref: ThemePref): void {
  try {
    if (pref === 'auto') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    /* ignore */
  }
}

function apply(pref: ThemePref, systemDark: boolean): void {
  const dark = pref === 'dark' || (pref === 'auto' && systemDark);
  document.documentElement.classList.toggle('dark', dark);
  document.documentElement.dataset.themePref = pref;
}

// Drive the full-screen .ink-wipe overlay as a single GSAP timeline. The disk
// blooms from the toggle button, fully covers the page, then fades - the theme
// class flip is folded into the same timeline so it happens while the page is
// hidden under the wash. Reduced-motion short-circuits to an instant flip.
function runInkWipe(originX: number, originY: number, flipTheme: () => void): void {
  const wipe = document.querySelector<HTMLElement>('.ink-wipe');
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  if (!wipe || mq.matches) {
    flipTheme();
    return;
  }

  const x = `${originX}px`;
  const y = `${originY}px`;
  const tl = gsap.timeline();
  tl.set(wipe, {
    display: 'block',
    opacity: 1,
    clipPath: `circle(0% at ${x} ${y})`,
  })
    .to(wipe, {
      clipPath: `circle(150% at ${x} ${y})`,
      duration: 0.55,
      ease: 'power3.inOut',
    })
    .call(flipTheme, [], '>-0.05')
    .to(wipe, { opacity: 0, duration: 0.3 }, '>')
    .set(wipe, { display: 'none', clearProps: 'clipPath,opacity' });
}

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => read());
  const firstRunRef = useRef(true);

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    // Skip the initial apply - the pre-paint script in index.html already set
    // the class before React mounted. Applying again would be a no-op but also
    // risks fighting the wipe's own onStart flip.
    if (firstRunRef.current) {
      firstRunRef.current = false;
      document.documentElement.dataset.themePref = pref;
    } else {
      apply(pref, mq.matches);
    }
    if (pref !== 'auto') return;
    const onChange = () => apply('auto', mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const cycle = useCallback((origin?: { x: number; y: number }) => {
    setPref((cur) => {
      const next: ThemePref = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
      write(next);
      if (origin) {
        const systemDark = matchMedia('(prefers-color-scheme: dark)').matches;
        runInkWipe(origin.x, origin.y, () => apply(next, systemDark));
      }
      return next;
    });
  }, []);

  return { pref, cycle, glyph: GLYPH[pref], label: LABEL[pref] };
}
