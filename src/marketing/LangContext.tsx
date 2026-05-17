import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { type Dict, type Lang, DEFAULT_LANG, DIR, getDict } from './i18n';

/**
 * Stateful language provider for the marketing (business) route.
 *
 * Cooperates with the inline pre-paint script in `business/index.html`
 * (layer 1 of 2): that script resolves `bm:lang` from localStorage,
 * rolls a weighted-random 70/30 HE/EN default on first visit, sets
 * `<html lang>` / `<html dir>`, and exposes the resolved value on
 * `window.__bmLang` so React mounts with no FOUC and no hydration
 * mismatch.
 *
 * This provider (layer 2) keeps state, persists changes back to
 * localStorage, and re-applies `<html lang>` / `<html dir>` plus
 * `<title>` / `<meta name=description>` whenever the user toggles.
 */

const STORAGE_KEY = 'bm:lang';

declare global {
  interface Window {
    __bmLang?: Lang;
  }
}

type LangContextValue = {
  t: Dict;
  lang: Lang;
  setLang: (next: Lang) => void;
};

const Ctx = createContext<LangContextValue | null>(null);

function readInitial(): Lang {
  if (typeof window === 'undefined') return DEFAULT_LANG;
  const seeded = window.__bmLang;
  if (seeded === 'en' || seeded === 'he') return seeded;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'en' || stored === 'he') return stored;
  } catch {
    /* ignore */
  }
  return Math.random() < 0.7 ? 'he' : 'en';
}

function persist(lang: Lang): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, lang);
  } catch {
    /* ignore */
  }
}

function applyToDocument(lang: Lang, dict: Dict): void {
  const html = document.documentElement;
  html.lang = lang;
  html.dir = DIR[lang];
  document.title = dict.meta.title;
  const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
  if (meta) meta.content = dict.meta.description;
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => readInitial());
  const dict = getDict(lang);

  useEffect(() => {
    applyToDocument(lang, dict);
  }, [lang, dict]);

  const setLang = useCallback((next: Lang) => {
    setLangState((prev) => (prev === next ? prev : next));
    persist(next);
  }, []);

  return (
    <Ctx.Provider value={{ t: dict, lang, setLang }}>{children}</Ctx.Provider>
  );
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
