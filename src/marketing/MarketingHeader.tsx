import { useRef, useState } from 'react';
import AccessibilityPanel from '../components/AccessibilityPanel';
import type { ThemePref } from '../hooks/useTheme';
import { useMarketingTheme } from './useMarketingTheme';

/**
 * Marketing top bar. Uses the marketing-only theme hook so the toggle
 * does not affect the portfolio's saved theme. Toggle is hidden below
 * 820px (see .mp-bar__btn--theme rule in marketing.css) — mobile stays
 * locked to light by default.
 */
export default function MarketingHeader() {
  const { pref, cycle, set, glyph, label } = useMarketingTheme();
  const a11yBtnRef = useRef<HTMLButtonElement | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);

  const closeA11y = () => {
    setA11yOpen(false);
    requestAnimationFrame(() => a11yBtnRef.current?.focus());
  };

  const handleAccessibilityThemeChange = (next: ThemePref) => {
    if (next === 'auto') {
      set('light');
      return;
    }
    set(next);
  };

  return (
    <>
      <a className="skip-link" href="#main">
        דלג לתוכן
      </a>
      <header className="mp-bar">
        <a className="mp-bar__brand" href="#top">
          בר משה <span>// סטודיו פרטי</span>
        </a>
        <span className="mp-bar__grow" />
        <a className="mp-bar__back" href={import.meta.env.BASE_URL}>
          ← פורטפוליו
        </a>
        <button
          className="mp-bar__btn mp-bar__btn--theme"
          type="button"
          title={label}
          aria-label={label}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            cycle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
        >
          {glyph}
        </button>
        <button
          ref={a11yBtnRef}
          className="mp-bar__btn"
          type="button"
          title="הגדרות נגישות"
          aria-label="פתיחת הגדרות נגישות"
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
          onThemeChange={handleAccessibilityThemeChange}
          onClose={closeA11y}
        />
      ) : null}
    </>
  );
}
