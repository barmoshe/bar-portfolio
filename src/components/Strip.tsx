import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = {
  themeGlyph: string;
  themeLabel: string;
  onThemeCycle: (origin?: { x: number; y: number }) => void;
  onSkip: () => void;
  skipRemembered: boolean;
};

export default function Strip({
  themeGlyph,
  themeLabel,
  onThemeCycle,
  onSkip,
  skipRemembered,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

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

  return (
    <nav className="strip" aria-label="Primary" ref={ref}>
      <span className="mark">bm@v1.3.7</span>
      <a className="key" href="#intro">About</a>
      <a className="key" href="#story">Story</a>
      <a href="#experience">Work</a>
      <a href="#repos">Open Source</a>
      <a href="#music">Music</a>
      <a href="#notes">Notes</a>
      <a href="#letter">Contact</a>
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
        className="toggle"
        id="skipBtn"
        title="Remember: skip cover"
        onClick={onSkip}
        disabled={skipRemembered}
      >
        {skipRemembered ? 'remembered ✓' : 'Remember me'}
      </button>
    </nav>
  );
}
