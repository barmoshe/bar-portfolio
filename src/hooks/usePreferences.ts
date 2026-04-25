/**
 * Phase 2 accessibility preferences (contrast, text size, readable typography).
 *
 * Each preference also has a corresponding line in `index.html`'s pre-paint
 * script so the page paints in the user's chosen state on the first frame
 * (FOUC-free). This hook is the React-side mirror: it reads the same keys,
 * exposes setters, and re-applies the same data attributes / CSS variables
 * after mount.
 *
 * Theme stays in `useTheme` (separate cooperative system + GSAP ink-wipe).
 */
import { useCallback, useState } from 'react';

const KEY_CONTRAST = 'bm:contrast';
const KEY_TEXT_SCALE = 'bm:text-scale';
const KEY_READABLE = 'bm:readable';

export type ContrastPref = 'auto' | 'more' | 'less';
export const TEXT_SCALES = [1, 1.1, 1.25, 1.5] as const;
export type TextScale = (typeof TEXT_SCALES)[number];

function safeGet(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function safeSet(key: string, value: string | null): void {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    /* ignore */
  }
}

function readContrast(): ContrastPref {
  const v = safeGet(KEY_CONTRAST);
  return v === 'more' || v === 'less' ? v : 'auto';
}

function readTextScale(): TextScale {
  const raw = safeGet(KEY_TEXT_SCALE);
  if (raw === null) return 1;
  const v = parseFloat(raw);
  return (TEXT_SCALES as readonly number[]).includes(v) ? (v as TextScale) : 1;
}

function readReadable(): boolean {
  return safeGet(KEY_READABLE) === '1';
}

function applyContrast(v: ContrastPref): void {
  const html = document.documentElement;
  if (v === 'auto') delete html.dataset['contrast'];
  else html.dataset['contrast'] = v;
}

function applyTextScale(v: TextScale): void {
  const html = document.documentElement;
  if (v === 1) html.style.removeProperty('--text-scale');
  else html.style.setProperty('--text-scale', String(v));
}

function applyReadable(v: boolean): void {
  const html = document.documentElement;
  if (v) html.dataset['readable'] = 'true';
  else delete html.dataset['readable'];
}

export function usePreferences() {
  const [contrast, setContrastState] = useState<ContrastPref>(readContrast);
  const [textScale, setTextScaleState] = useState<TextScale>(readTextScale);
  const [readable, setReadableState] = useState<boolean>(readReadable);

  const setContrast = useCallback((v: ContrastPref) => {
    setContrastState(v);
    safeSet(KEY_CONTRAST, v === 'auto' ? null : v);
    applyContrast(v);
  }, []);

  const setTextScale = useCallback((v: TextScale) => {
    setTextScaleState(v);
    safeSet(KEY_TEXT_SCALE, v === 1 ? null : String(v));
    applyTextScale(v);
  }, []);

  const setReadable = useCallback((v: boolean) => {
    setReadableState(v);
    safeSet(KEY_READABLE, v ? '1' : null);
    applyReadable(v);
  }, []);

  return { contrast, setContrast, textScale, setTextScale, readable, setReadable };
}
