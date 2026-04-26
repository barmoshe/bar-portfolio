import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';

const PROCESS_STALE_MS = 12000;

type Step = { num: string; title: string; body: string };

const STEPS: Step[] = [
  {
    num: '01',
    title: 'בריף',
    body: 'שיחת היכרות קצרה. מציפים את הצורך, מי המשתמש.ת, ואיך מודדים הצלחה. יוצאים עם תוכנית קונקרטית.',
  },
  {
    num: '02',
    title: 'בנייה',
    body: 'אני בונה בקצב צפוי, עם אבני דרך שבועיות. את.ה רואה התקדמות, נותן.ת פידבק, וכיוון משתנה כשצריך.',
  },
  {
    num: '03',
    title: 'מסירה',
    body: 'משגרים, מתעדים, ומשאירים אותך עם משהו שאת.ה יכול.ה לתחזק. ליווי שבועיים אחרי הלייב — כלול.',
  },
];

const ACCENTS = ['var(--green)', 'var(--blue)', 'var(--magenta)'] as const;

export default function Process() {
  const rootRef = useRef<HTMLElement | null>(null);
  const listRef = useRef<HTMLOListElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const list = listRef.current;
      if (!root || !list) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const items = Array.from(list.children) as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let cleanupBleed: (() => void) | null = null;
        if (headline) cleanupBleed = attachInkBleed(headline, 'letter');

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.55 },
            { trigger: dek, start: 'top 88%', staleAfterMs: PROCESS_STALE_MS },
          );
        }

        if (items.length) {
          createReveal(
            items,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
            { trigger: list, start: 'top 85%', staleAfterMs: PROCESS_STALE_MS },
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
    <article className="page process-page" id="process" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>03</b> // תהליך
      </div>
      <h2 className="headline">שלושה שלבים, בלי הפתעות.</h2>
      <p className="dek">
        בלי תהליכים מסובכים. שיחה ראשונה, בנייה שקופה, ומסירה עם ליווי קצר אחרי שעולים לאוויר.
      </p>

      <ol
        ref={listRef}
        className="process-grid"
        aria-label="שלבי העבודה"
        style={{
          marginTop: 36,
          padding: 0,
          listStyle: 'none',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: 22,
        }}
      >
        {STEPS.map((s, i) => {
          const accent = ACCENTS[i % ACCENTS.length];
          return (
            <li
              key={s.num}
              style={{
                position: 'relative',
                background: 'var(--card-bg)',
                border: '1.5px solid var(--card-border)',
                boxShadow: `6px 8px 0 ${accent}`,
                padding: 'clamp(20px, 2.4vw, 28px)',
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
              }}
            >
              <span
                aria-hidden="true"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.2em',
                  color: accent,
                  textTransform: 'uppercase',
                }}
              >
                שלב {s.num}
              </span>
              <h3
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
                {s.body}
              </p>
            </li>
          );
        })}
      </ol>
    </article>
  );
}
