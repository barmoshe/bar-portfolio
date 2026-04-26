import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import { audiences } from '../../data/audiences';
import { buildWhatsAppHref } from '../contact';

const STALE_MS = 12000;

const ACCENTS = [
  'var(--green)',
  'var(--blue)',
  'var(--magenta)',
  'var(--orange, var(--green))',
] as const;

export default function AudienceBento() {
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
        if (headline) cleanupBleed = attachInkBleed(headline, 'letter');

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
            { opacity: 0, y: 26, rotate: -1 },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.65,
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
    <article className="page audience-page" id="audience" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>01</b> // למי זה מתאים
      </div>
      <h2 className="headline">אם אחד מהמצבים האלה מוכר — בואו נדבר.</h2>
      <p className="dek">
        ארבעה כיוונים, כל אחד עם נקודת התחלה משלו. בחר.י את שלך וההודעה תיפתח עם ההקשר הנכון.
      </p>

      <div
        ref={gridRef}
        className="audience-grid"
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 22,
          alignItems: 'stretch',
        }}
      >
        {audiences.map((a, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <a
              key={a.slug}
              className="audience-card"
              href={buildWhatsAppHref(a.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={`פתח שיחה ב-WhatsApp עם בר משה - ${a.title}`}
              style={{
                position: 'relative',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                boxShadow: `6px 8px 0 ${accent}`,
                padding: 'clamp(20px, 2.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                textDecoration: 'none',
                color: 'inherit',
                minHeight: 220,
              }}
            >
              <span
                aria-hidden="true"
                style={{ fontSize: 'clamp(1.8rem, 3.2vw, 2.2rem)', lineHeight: 1 }}
              >
                {a.emoji}
              </span>
              <span
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.2em',
                  color: accent,
                  textTransform: 'uppercase',
                }}
              >
                {a.kicker}
              </span>
              <h3
                style={{
                  margin: 0,
                  fontFamily: 'var(--display)',
                  fontSize: 'clamp(1.25rem, 2.2vw, 1.6rem)',
                  lineHeight: 1.2,
                  color: 'var(--ink)',
                }}
              >
                {a.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--serif)',
                  fontSize: '.98rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-soft)',
                }}
              >
                {a.summary}
              </p>
              <span
                style={{
                  marginTop: 'auto',
                  fontFamily: 'var(--mono)',
                  fontSize: 12,
                  letterSpacing: '.16em',
                  textTransform: 'uppercase',
                  color: 'var(--ink)',
                  borderBottom: `2px solid ${accent}`,
                  alignSelf: 'flex-start',
                  paddingBottom: 2,
                }}
                aria-hidden="true"
              >
                {a.cta} ←
              </span>
            </a>
          );
        })}
      </div>
    </article>
  );
}
