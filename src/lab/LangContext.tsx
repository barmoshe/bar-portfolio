import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import {
  type Dict,
  type Lang,
  DEFAULT_LANG,
  DIR,
  HE_RANDOM_WEIGHT,
  getDict,
} from './i18n';

/**
 * Lang provider for the Lab page. Shares the `bm:lang` storage key with
 * the marketing page so a user's language preference persists across
 * both surfaces. Cooperates with the inline pre-paint script in
 * `lab/index.html` (HE) and `lab/en/index.html` (EN-locked).
 */

const STORAGE_KEY = 'bm:lang';

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
  return Math.random() < HE_RANDOM_WEIGHT ? 'he' : 'en';
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
  const [lang, setLang] = useState<Lang>(readInitial);
  const dict = getDict(lang);

  useEffect(() => {
    applyToDocument(lang, dict);
  }, [lang, dict]);

  const setLangAndPersist = useCallback((next: Lang) => {
    setLang(next);
    persist(next);
  }, []);

  const value = useMemo<LangContextValue>(
    () => ({ t: dict, lang, setLang: setLangAndPersist }),
    [dict, lang, setLangAndPersist],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
