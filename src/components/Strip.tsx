import { useRef, useState } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';
import AccessibilityPanel from './AccessibilityPanel';
import type { ThemePref } from '../hooks/useTheme';

type Props = {
  themeGlyph: string;
  themeLabel: string;
  themePref: ThemePref;
  onThemeCycle: (origin?: { x: number; y: number }) => void;
  onThemeSet: (next: ThemePref) => void;
  onSkip: () => void;
  skipRemembered: boolean;
};

// Move keyboard focus to the section a hash link points at, so that the next
// Tab continues from inside the section instead of from the nav. Targets must
// have tabIndex={-1} (each <article class="page"> does, set in App.tsx and
// section components). Scrolling is left to the browser's default anchor
// handling; we only nudge focus.
function focusSectionFromHash(href: string) {
  const id = href.startsWith('#') ? href.slice(1) : '';
  if (!id) return;
  const target = document.getElementById(id);
  if (target instanceof HTMLElement) {
    target.focus({ preventScroll: true });
  }
}

export default function Strip({
  themeGlyph,
  themeLabel,
  themePref,
  onThemeCycle,
  onThemeSet,
  onSkip,
  skipRemembered,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);
  const a11yBtnRef = useRef<HTMLButtonElement | null>(null);
  const [a11yOpen, setA11yOpen] = useState(false);

  const closeA11y = () => {
    setA11yOpen(false);
    // Return focus to the gear button, per the dialog return-focus pattern.
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
        Skip to content
      </a>
      <nav className="strip" aria-label="Primary" ref={ref}>
        <a className="key" href="#intro" onClick={onAnchor}>About</a>
        <a href="#background" onClick={onAnchor}>Background</a>
        <a href="#mixtape" onClick={onAnchor}>Mixtape</a>
        <a href="#repos" onClick={onAnchor}>Open Source</a>
        <a href={`${import.meta.env.BASE_URL}business/`} lang="he" dir="rtl">שירותים</a>
        <a href="#letter" onClick={onAnchor}>Contact</a>
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
          title="Accessibility settings"
          aria-label="Open accessibility settings"
          aria-haspopup="dialog"
          aria-expanded={a11yOpen}
          onClick={() => setA11yOpen(true)}
        >
          ⚙
        </button>
        <button
          className="toggle"
          id="skipBtn"
          type="button"
          title="Remember: skip cover"
          onClick={onSkip}
          disabled={skipRemembered}
        >
          {skipRemembered ? 'remembered ✓' : 'Remember me'}
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
