import { useCallback, useEffect, useState } from 'react';

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

export function useTheme() {
  const [pref, setPref] = useState<ThemePref>(() => read());

  useEffect(() => {
    const mq = matchMedia('(prefers-color-scheme: dark)');
    apply(pref, mq.matches);
    if (pref !== 'auto') return;
    const onChange = () => apply('auto', mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const cycle = useCallback(() => {
    setPref((cur) => {
      const next: ThemePref = cur === 'auto' ? 'light' : cur === 'light' ? 'dark' : 'auto';
      write(next);
      return next;
    });
  }, []);

  return { pref, cycle, glyph: GLYPH[pref], label: LABEL[pref] };
}
