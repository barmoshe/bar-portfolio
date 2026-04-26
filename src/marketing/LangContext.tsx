import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { DEFAULT_LANG, dictionaries, type Dict, type Lang } from './i18n';

const STORAGE_KEY = 'bm:marketing-lang';

const readStoredLang = (): Lang => {
  if (typeof localStorage === 'undefined') return DEFAULT_LANG;
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw === 'en' || raw === 'he' ? raw : DEFAULT_LANG;
};

type LangContextValue = {
  lang: Lang;
  setLang: (next: Lang) => void;
  toggle: () => void;
  t: Dict;
};

const Ctx = createContext<LangContextValue | null>(null);

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(readStoredLang);

  useEffect(() => {
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'he' ? 'rtl' : 'ltr';
    document.title = dictionaries[lang].meta.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = dictionaries[lang].meta.description;
  }, [lang]);

  const setLang = useCallback((next: Lang) => {
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* ignore quota / privacy errors */
    }
    setLangState(next);
  }, []);

  const toggle = useCallback(() => {
    setLang(lang === 'he' ? 'en' : 'he');
  }, [lang, setLang]);

  const value = useMemo<LangContextValue>(
    () => ({ lang, setLang, toggle, t: dictionaries[lang] }),
    [lang, setLang, toggle],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
