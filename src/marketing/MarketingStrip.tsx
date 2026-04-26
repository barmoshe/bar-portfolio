import { useRef, useState } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';
import AccessibilityPanel from '../components/AccessibilityPanel';
import type { ThemePref } from '../hooks/useTheme';

type Props = {
  themeGlyph: string;
  themeLabel: string;
  themePref: ThemePref;
  onThemeCycle: (origin?: { x: number; y: number }) => void;
  onThemeSet: (next: ThemePref) => void;
};

function focusSectionFromHash(href: string) {
  const id = href.startsWith('#') ? href.slice(1) : '';
  if (!id) return;
  const target = document.getElementById(id);
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
}

export default function MarketingStrip({
  themeGlyph,
  themeLabel,
  themePref,
  onThemeCycle,
  onThemeSet,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const a11yBtnRef = useRef<HTMLButtonElement | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);

  const closeA11y = () => {
    setA11yOpen(false);
    requestAnimationFrame(() => a11yBtnRef.current?.focus());
  };

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.from(el, {
          y: -48,
          opacity: 0,
          duration: 0.5,
          ease: 'power3.out',
          clearProps: 'transform,opacity',
        });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const onAnchor = (e: React.MouseEvent<HTMLAnchorElement>) => {
    focusSectionFromHash(e.currentTarget.getAttribute('href') ?? '');
  };

  return (
    <>
      <a className="skip-link" href="#main">
        דלג לתוכן
      </a>
      <nav className="strip" aria-label="ניווט ראשי" ref={ref}>
        <a className="key" href={import.meta.env.BASE_URL} lang="he">← חזרה לפורטפוליו</a>
        <a href="#about" onClick={onAnchor}>אודות</a>
        <a href="#services" onClick={onAnchor}>שירותים</a>
        <a href="#process" onClick={onAnchor}>תהליך</a>
        <a href="#contact" onClick={onAnchor}>יצירת קשר</a>
        <span className="grow" />
        <button
          className="toggle theme-btn"
          id="themeBtn"
          type="button"
          title={themeLabel}
          aria-label={themeLabel}
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            onThemeCycle({ x: r.left + r.width / 2, y: r.top + r.height / 2 });
          }}
        >
          {themeGlyph}
        </button>
        <button
          ref={a11yBtnRef}
          className="toggle"
          id="a11yBtn"
          type="button"
          title="הגדרות נגישות"
          aria-label="פתיחת הגדרות נגישות"
          aria-haspopup="dialog"
          aria-expanded={a11yOpen}
          onClick={() => setA11yOpen(true)}
        >
          ⚙
        </button>
      </nav>
      {a11yOpen ? (
        <AccessibilityPanel
          themePref={themePref}
          onThemeChange={onThemeSet}
          onClose={closeA11y}
        />
      ) : null}
    </>
  );
}
