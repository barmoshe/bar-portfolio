import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import { testimonials, type Testimonial } from '../../data/proof';

const STALE_MS = 12000;

const ACCENT_FOR: Record<Testimonial['accent'], string> = {
  primary: 'var(--green)',
  accent2: 'var(--magenta)',
  accent3: 'var(--blue)',
};

export default function Proof() {
  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = gridRef.current;
      if (!root || !grid) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const cards = Array.from(grid.children) as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let cleanupBleed: (() => void) | null = null;
        if (headline) cleanupBleed = attachInkBleed(headline, 'background');

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.55 },
            { trigger: dek, start: 'top 88%', staleAfterMs: STALE_MS },
          );
        }

        if (cards.length) {
          createReveal(
            cards,
            { opacity: 0, y: 24, rotate: -1 },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.6,
              stagger: 0.1,
              ease: 'power3.out',
            },
            { trigger: grid, start: 'top 82%', staleAfterMs: STALE_MS },
          );
        }

        return () => {
          cleanupBleed?.();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page proof-page" id="proof" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>04</b> // עדויות
      </div>
      <h2 className="headline">קולות שיצאו לאוויר.</h2>
      <p className="dek">
        כמה שורות ממי שעבד איתי, התלמד איתי, או שיגר משהו ליצירה משותפת.
      </p>

      <div
        ref={gridRef}
        className="proof-grid"
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 22,
        }}
      >
        {testimonials.map((t) => {
          const accent = ACCENT_FOR[t.accent];
          return (
            <figure
              key={t.id}
              style={{
                margin: 0,
                position: 'relative',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                boxShadow: `6px 8px 0 ${accent}`,
                padding: 'clamp(20px, 2.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--display)',
                  fontSize: '3rem',
                  lineHeight: 0.8,
                  color: accent,
                }}
              >
                &ldquo;
              </span>
              <blockquote
                style={{
                  margin: 0,
                  fontFamily: 'var(--serif)',
                  fontStyle: 'italic',
                  fontSize: 'clamp(1rem, 1.6vw, 1.15rem)',
                  lineHeight: 1.55,
                  color: 'var(--ink)',
                }}
              >
                {t.quote}
              </blockquote>
              <figcaption
                style={{
                  marginTop: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  letterSpacing: '.1em',
                  color: 'var(--ink-soft)',
                }}
              >
                <span style={{ color: 'var(--ink)', fontWeight: 700 }}>{t.name}</span>
                <span>{t.role}</span>
              </figcaption>
            </figure>
          );
        })}
      </div>
    </article>
  );
}
