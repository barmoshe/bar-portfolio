import { createContext, useContext, useEffect, type ReactNode } from 'react';
import { type Dict, t } from './i18n';

// The marketing page is HE-only since the build-first pivot. This is a
// thin pass-through that preserves the `useLang()` shape so existing
// components don't have to change. If a second language ever comes back,
// reintroduce state + dictionary map here.

type LangContextValue = {
  t: Dict;
};

const Ctx = createContext<LangContextValue | null>(null);

const VALUE: LangContextValue = { t };

export function LangProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    const html = document.documentElement;
    html.lang = 'he';
    html.dir = 'rtl';
    document.title = t.meta.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = t.meta.description;
  }, []);

  return <Ctx.Provider value={VALUE}>{children}</Ctx.Provider>;
}

export function useLang(): LangContextValue {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useLang must be used inside <LangProvider>');
  return ctx;
}
