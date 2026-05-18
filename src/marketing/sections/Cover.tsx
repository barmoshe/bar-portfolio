import { useEffect, useRef, useState } from 'react';
import { useLang } from '../LangContext';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * Hero - one focal ticket card that IS the value proposition. The
 * BOARD metaphor in literal form: "your project, already in DOING."
 * Big promise H1 above, single sticker ticket below with a real
 * checklist + a primary CTA inside the card. Secondary actions
 * below. Designed for 390×844 first.
 */
export default function Cover() {
  const { t, lang } = useLang();
  const rootRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const [pulseAlive, setPulseAlive] = useState(false);

  // Pause the DOING pulse when the hero leaves the viewport.
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

  // Entrance is a pure-CSS fade-up via the .mp-hero__rise class +
  // CSS animation-delay per element. Avoids React-StrictMode +
  // useGSAP + axe-core dev-mode interactions that were starving the
  // RAF loop and leaving elements stuck at partial opacity.

  const isHe = lang === 'he';

  // Hero copy lives here, not i18n.ts - the BOARD hero rewrites the
  // pitch as a literal ticket. The rest of the page's copy stays
  // sourced from i18n.ts.
  const copy = isHe
    ? {
        eyebrow: 'גליון 01 · בונה קודם, מדבר אחר־כך',
        titleA: 'בונה לך',
        titleB: 'גרסה ראשונה',
        titleC: 'לפני שמדברים.',
        lead:
          'שלח לי בכמה שורות מה אתה רוצה. תוך שבוע יש לך גרסה ראשונה עובדת. עבד? יאללה ממשיכים. לא? כל אחד לדרכו, בלי שאלות.',
        ticketNum: '#BAR-001',
        ticketStatus: t.board.status.doing,
        ticketTitle: 'הפרויקט הבא שלך',
        ticketSub: 'מוכן להפוך למוצר',
        checks: [
          'תיאור - מה אתה רוצה לבנות, ב־3 שורות',
          'בנייה - גרסה ראשונה עובדת, מוצר אמיתי שרץ',
          'החלטה - רק אם זה עובד לך, ממשיכים',
        ],
        ctaPrimary: '✦ פתח את הכרטיס שלך',
        ctaSecondary: 'או תראה מה אני בונה',
        scrollHint: 'גלילה',
      }
    : {
        eyebrow: 'Issue 01 · Build before brief',
        titleA: 'I build you',
        titleB: 'a first version',
        titleC: 'before we talk.',
        lead:
          'Send me a few lines of what you want. A week later you have a first working version. Worked? Let’s keep going. Didn’t? We part ways, no questions.',
        ticketNum: '#BAR-001',
        ticketStatus: t.board.status.doing,
        ticketTitle: 'Your next project',
        ticketSub: 'Ready to become a product',
        checks: [
          'Describe - what you want built, in 3 lines',
          'Build - a first working version, a real product that runs',
          'Decide - keep going only if it works for you',
        ],
        ctaPrimary: '✦ Open your ticket',
        ctaSecondary: 'Or see what I’ve built',
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
