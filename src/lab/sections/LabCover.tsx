import { useEffect, useRef, useState } from 'react';
import { useLang } from '../LangContext';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * Lab hero — one focal ticket card. Status pill = DOING (the lab is in
 * motion). Mirrors the marketing Cover structure so the kanban metaphor
 * is preserved, but the copy is lab-native (no "first version before we
 * talk" — instead: "bring an idea, I build, no strings").
 */
export default function LabCover() {
  const { t, lang } = useLang();
  const rootRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const [pulseAlive, setPulseAlive] = useState(false);

  useEffect(() => {
    const el = pillRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setPulseAlive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const isHe = lang === 'he';

  const copy = isHe
    ? {
        eyebrow: 'המעבדה · בונים, אחר־כך מדברים',
        titleA: 'תביא רעיון.',
        titleB: 'אני בונה.',
        titleC: 'אפס מחויבות.',
        lead:
          'שלח לי בריף קצר, בעברית רגילה. תוך כמה ימים יש לך גרסה ראשונה חיה באוויר. רוצים להמשיך? נדבר אז. לא? יצאת עם מוצר.',
        ticketNum: '#LAB-01',
        ticketStatus: t.board.status.doing,
        ticketTitle: 'הרעיון שלך',
        ticketSub: 'מוכן להפוך לגרסה ראשונה',
        checks: [
          'חינם. בלי חוזה, בלי הצעת מחיר',
          'גרסה ראשונה חיה תוך כמה ימים',
          'אם נמשיך, נדבר אז. אם לא, יצאת עם מוצר',
        ],
        ctaPrimary: '✦ שלח את הרעיון',
        ctaSecondary: 'או תראה מה אפשר לבנות',
        scrollHint: 'גלילה',
      }
    : {
        eyebrow: 'The Lab · Build first, ask later',
        titleA: 'Bring an idea.',
        titleB: 'I build.',
        titleC: 'Zero commitment.',
        lead:
          'Send me a short brief, in plain words. A few days later you have a live first version. Want to keep going? We talk then. Don’t? You walked away with a product.',
        ticketNum: '#LAB-01',
        ticketStatus: t.board.status.doing,
        ticketTitle: 'Your idea',
        ticketSub: 'Ready to become a first version',
        checks: [
          'Free. No contract, no quote',
          'A live first version within a few days',
          'If we continue, we talk then. If not, you walked away with a product',
        ],
        ctaPrimary: '✦ Send the idea',
        ctaSecondary: 'Or see what we can build',
        scrollHint: 'scroll',
      };

  return (
    <section
      id="top"
      className="mp-hero"
      aria-labelledby="cover-headline"
      ref={rootRef}
    >
      <p className="mp-hero__eyebrow">
        {copy.eyebrow}
      </p>

      <h1
        id="cover-headline"
        className="mp-hero__title"
      >
        {copy.titleA}{' '}
        <span className="mp-hero__title-accent">{copy.titleB}</span>{' '}
        {copy.titleC}
      </h1>

      <p className="mp-hero__lead">
        {copy.lead}
      </p>

      <article
        className="mp-card mp-hero__ticket"
        aria-label={`${copy.ticketNum} ${copy.ticketTitle}`}
      >
        <header className="mp-hero__ticket-head">
          <span className="mp-hero__ticket-num">{copy.ticketNum}</span>
          <span
            className="mp-status mp-status--doing mp-status--inline"
            ref={pillRef}
            data-alive={pulseAlive ? 'true' : 'false'}
          >
            ● {copy.ticketStatus}
          </span>
        </header>

        <div className="mp-hero__ticket-body">
          <h2 className="mp-hero__ticket-title">{copy.ticketTitle}</h2>
          <p className="mp-hero__ticket-sub">{copy.ticketSub}</p>
        </div>

        <ul className="mp-hero__checks">
          {copy.checks.map((c, i) => (
            <li
              key={i}
              className="mp-hero__check"
            >
              <span className="mp-hero__check-box" aria-hidden="true">✓</span>
              <span className="mp-hero__check-text">{c}</span>
            </li>
          ))}
        </ul>

        <a
          className="mp-cta mp-cta--primary mp-cta--block mp-hero__ticket-cta"
          href={`#${INTAKE_ID}`}
        >
          {copy.ctaPrimary} <span className="mp-arrow" aria-hidden="true">→</span>
        </a>
      </article>

      <div className="mp-hero__secondary">
        <a
          className="mp-hero__secondary-link"
          href="#contents"
        >
          {copy.ctaSecondary} ↓
        </a>
      </div>

      <a
        className="mp-hero__scroll-cue"
        href="#contents"
        aria-label={copy.scrollHint}
      >
        {copy.scrollHint}
      </a>
    </section>
  );
}
