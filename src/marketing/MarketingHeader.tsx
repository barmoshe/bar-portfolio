import { useRef, useState } from 'react';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { useTheme } from '../hooks/useTheme';
import { useLang } from './LangContext';

export default function MarketingHeader() {
  const { pref, set } = useTheme();
  const { lang, toggle, t } = useLang();
  const a11yBtnRef = useRef<HTMLButtonElement | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);

  const closeA11y = () => {
    setA11yOpen(false);
    requestAnimationFrame(() => a11yBtnRef.current?.focus());
  };

  const langTitle = lang === 'he' ? t.header.langTitleEn : t.header.langTitleHe;
  const langGlyph = lang === 'he' ? t.header.langGlyphHe : t.header.langGlyphEn;

  return (
    <>
      <a className="skip-link" href="#main">
        {t.header.skip}
      </a>
      <header className="mp-bar">
        <a className="mp-bar__brand" href="#top">
          {t.header.brandName} <span>{t.header.brandTagline}</span>
        </a>
        <span className="mp-bar__grow" />
        <a className="mp-bar__back" href={import.meta.env.BASE_URL}>
          {t.header.back}
        </a>
        <button
          className="mp-bar__btn mp-bar__btn--lang"
          type="button"
          title={langTitle}
          aria-label={langTitle}
          onClick={toggle}
        >
          {langGlyph}
        </button>
        <button
          ref={a11yBtnRef}
          className="mp-bar__btn"
          type="button"
          title={t.header.a11yTitle}
          aria-label={t.header.a11yLabel}
          aria-haspopup="dialog"
          aria-expanded={a11yOpen}
          onClick={() => setA11yOpen(true)}
        >
          ⚙
        </button>
      </header>
      {a11yOpen ? (
        <AccessibilityPanel
          themePref={pref}
          onThemeChange={set}
          onClose={closeA11y}
        />
      ) : null}
    </>
  );
}
