import { useRef, useState } from 'react';
import AccessibilityPanel from '../components/AccessibilityPanel';
import { useTheme } from '../hooks/useTheme';
import { useLang } from './LangContext';
import LangToggle from './components/LangToggle';
import { scrollToIntake } from './scrollToIntake';

export default function MarketingHeader() {
  const { pref, set } = useTheme();
  const { t } = useLang();
  const { masthead } = t;
  const a11yBtnRef = useRef<HTMLButtonElement | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);

  const closeA11y = () => {
    setA11yOpen(false);
    requestAnimationFrame(() => a11yBtnRef.current?.focus());
  };

  const onBrief = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToIntake();
  };

  return (
    <>
      <a className="skip-link" href="#main">
        {masthead.skip}
      </a>
      <header className="mp-bar">
        <a className="mp-bar__brand" href="#top">
          <span className="mp-bar__name">{masthead.brandName}</span>
          <span className="mp-bar__tag">{masthead.brandTagline}</span>
        </a>

        <nav className="mp-bar__nav" aria-label="navigation">
          <a className="mp-bar__link" href="#brief" onClick={onBrief}>
            {masthead.briefLink}
          </a>
          <a className="mp-bar__link mp-bar__link--quiet" href={import.meta.env.BASE_URL}>
            {masthead.portfolioLink}
          </a>
        </nav>

        <LangToggle />

        <button
          ref={a11yBtnRef}
          className="mp-bar__btn"
          type="button"
          title={masthead.a11yTitle}
          aria-label={masthead.a11yLabel}
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
