import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import { services } from '../../data/services';
import { buildWhatsAppHref } from '../contact';

const SERVICES_STALE_MS = 12000;

const ACCENTS = ['var(--green)', 'var(--blue)', 'var(--magenta)'] as const;

const SERVICE_WHATSAPP: Record<string, string> = {
  tutoring:
    'שלום בר, אני מעוניין/ת בשיעורים פרטיים לפיתוח. אשמח לתאם שיעור היכרות.',
  guiding:
    'שלום בר, אני צריך/ה ליווי טכני / מנטורינג לפרויקט. אפשר לתאם שיחה?',
  building:
    'שלום בר, אני צריך/ה שיבנו לי משהו מקצה לקצה. אשמח לדבר על הסקופ.',
};

export default function Services() {
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
            { opacity: 1, y: 0, duration: 0.6 },
            { trigger: dek, start: 'top 85%', staleAfterMs: SERVICES_STALE_MS },
          );
        }

        if (cards.length) {
          createReveal(
            cards,
            { opacity: 0, y: 28, rotate: -1.2 },
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: 'power3.out',
            },
            { trigger: grid, start: 'top 80%', staleAfterMs: SERVICES_STALE_MS },
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
    <article className="page services-page" id="services" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>02</b> // שירותים
      </div>
      <h2 className="headline">שלושה שערים להתחיל איתם.</h2>
      <p className="dek">
        כל שירות עומד בפני עצמו — בחר.י מה שמתאים, או נשלב כמה לפי השלב שלך.
      </p>

      <div
        ref={gridRef}
        className="service-grid"
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 22,
          alignItems: 'stretch',
        }}
      >
        {services.map((s, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <section
              key={s.slug}
              className="service-card"
              aria-labelledby={`service-${s.slug}-title`}
              style={{
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
                  fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                  lineHeight: 1,
                }}
              >
                {s.emoji}
              </span>
              <p
                className="service-kicker"
                style={{
                  margin: 0,
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.18em',
                  color: accent,
                  textTransform: 'uppercase',
                }}
              >
                {s.kicker}
              </p>
              <h3
                id={`service-${s.slug}-title`}
                className="service-title"
                style={{
                  margin: 0,
                  fontFamily: 'var(--display)',
                  fontSize: 'clamp(1.4rem, 2.4vw, 1.8rem)',
                  lineHeight: 1.2,
                  color: 'var(--ink)',
                }}
              >
                {s.title}
              </h3>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--serif)',
                  fontSize: '1rem',
                  lineHeight: 1.55,
                  color: 'var(--ink-soft)',
                }}
              >
                {s.summary}
              </p>
              <ul
                style={{
                  margin: 0,
                  padding: 0,
                  listStyle: 'none',
                  display: 'grid',
                  gap: 8,
                  fontFamily: 'var(--serif)',
                  fontSize: '.95rem',
                  lineHeight: 1.5,
                  color: 'var(--ink)',
                }}
              >
                {s.bullets.map((b) => (
                  <li key={b} style={{ paddingInlineStart: 18, position: 'relative' }}>
                    <span
                      aria-hidden="true"
                      style={{
                        position: 'absolute',
                        insetInlineStart: 0,
                        top: '0.55em',
                        width: 8,
                        height: 8,
                        background: accent,
                        transform: 'rotate(45deg)',
                      }}
                    />
                    {b}
                  </li>
                ))}
              </ul>
              <a
                className="enter service-cta"
                href={buildWhatsAppHref(SERVICE_WHATSAPP[s.slug])}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`פתח שיחה ב-WhatsApp עם בר משה - ${s.title}`}
                style={{ marginTop: 'auto', alignSelf: 'flex-start', fontSize: '1.05rem', padding: '12px 22px' }}
              >
                להזמנה בוואטסאפ
              </a>
            </section>
          );
        })}
      </div>
    </article>
  );
}
