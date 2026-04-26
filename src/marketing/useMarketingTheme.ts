/**
 * Marketing-only theme state. Independent of the portfolio's useTheme:
 * uses its own localStorage key (`bm:marketing-theme`) so the marketing
 * page is light by default regardless of what the user picked on the
 * portfolio. Two states only — light and dark. No "auto" mode; ignoring
 * the system pref is the whole point.
 */
import { useCallback, useEffect, useRef, useState } from 'react';
import { gsap } from '../lib/gsap';

export type MarketingThemePref = 'light' | 'dark';

const KEY = 'bm:marketing-theme';
const GLYPH: Record<MarketingThemePref, string> = { light: '☀', dark: '☾' };
const LABEL: Record<MarketingThemePref, string> = {
  light: 'מצב יום (פעיל)',
  dark: 'מצב לילה (פעיל)',
};

function read(): MarketingThemePref {
  try {
    const v = localStorage.getItem(KEY);
    if (v === 'dark') return 'dark';
  } catch {
    /* ignore */
  }
  return 'light';
}

function write(pref: MarketingThemePref): void {
  try {
    if (pref === 'light') localStorage.removeItem(KEY);
    else localStorage.setItem(KEY, pref);
  } catch {
    /* ignore */
  }
}

function apply(pref: MarketingThemePref): void {
  const html = document.documentElement;
  html.classList.toggle('dark', pref === 'dark');
  html.dataset.themePref = pref;
  html.dataset.marketingTheme = pref;
}

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
  tl.set(wipe, { display: 'block', opacity: 1, clipPath: `circle(0% at ${x} ${y})` })
    .to(wipe, {
      clipPath: `circle(150% at ${x} ${y})`,
      duration: 0.55,
      ease: 'power3.inOut',
    })
    .call(flipTheme, [], '>-0.05')
    .to(wipe, { opacity: 0, duration: 0.3 }, '>')
    .set(wipe, { display: 'none', clearProps: 'clipPath,opacity' });
}

export function useMarketingTheme() {
  const [pref, setPref] = useState<MarketingThemePref>(() => read());
  const firstRunRef = useRef(true);

  useEffect(() => {
    if (firstRunRef.current) {
      firstRunRef.current = false;
      apply(pref);
      return;
    }
    apply(pref);
  }, [pref]);

  const cycle = useCallback((origin?: { x: number; y: number }) => {
    setPref((cur) => {
      const next: MarketingThemePref = cur === 'light' ? 'dark' : 'light';
      write(next);
      if (origin) {
        runInkWipe(origin.x, origin.y, () => apply(next));
      }
      return next;
    });
  }, []);

  const set = useCallback((next: MarketingThemePref) => {
    setPref((cur) => {
      if (cur === next) return cur;
      write(next);
      apply(next);
      return next;
    });
  }, []);

  return { pref, cycle, set, glyph: GLYPH[pref], label: LABEL[pref] };
}
