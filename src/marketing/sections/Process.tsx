import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';

const PROCESS_STALE_MS = 12000;

type Step = {
  num: string;
  title: string;
  body: string;
};

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

export default function Process() {
  const rootRef = useRef<HTMLElement | null>(null);
  const stripRef = useRef<HTMLOListElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const strip = stripRef.current;
      if (!root || !strip) return;
      const dek = root.querySelector<HTMLElement>('.dek');
      const cards = Array.from(strip.children) as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            { trigger: dek, start: 'top 85%', staleAfterMs: PROCESS_STALE_MS },
          );
        }

        if (cards.length) {
          createReveal(
            cards,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power3.out' },
            { trigger: strip, start: 'top 85%', staleAfterMs: PROCESS_STALE_MS },
          );
        }
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page process-page" id="process" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>02</b> // תהליך
      </div>
      <h2 className="headline">שלושה שלבים, בלי הפתעות.</h2>
      <p className="dek">
        בלי תהליכים מסובכים. שיחה ראשונה, בנייה שקופה, ומסירה עם ליווי קצר אחרי שעולים לאוויר.
      </p>

      <ol
        ref={stripRef}
        className="process-strip"
        style={{
          listStyle: 'none',
          padding: 0,
          margin: '36px 0 0',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 22,
          counterReset: 'process',
        }}
      >
        {STEPS.map((step) => (
          <li
            key={step.num}
            style={{
              position: 'relative',
              background: 'var(--card-bg)',
              border: '1.5px solid var(--card-border)',
              boxShadow: '5px 6px 0 var(--ink)',
              padding: 'clamp(20px, 2.4vw, 28px)',
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            <span
              aria-hidden="true"
              style={{
                fontFamily: 'var(--display)',
                fontWeight: 900,
                fontSize: 'clamp(2.2rem, 4vw, 3rem)',
                lineHeight: 0.9,
                color: 'var(--green)',
              }}
            >
              {step.num}
            </span>
            <h3
              style={{
                margin: 0,
                fontFamily: 'var(--display)',
                fontSize: 'clamp(1.4rem, 2.2vw, 1.7rem)',
                color: 'var(--ink)',
              }}
            >
              {step.title}
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
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </article>
  );
}
