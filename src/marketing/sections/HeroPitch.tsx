import { useRef } from 'react';
import {
  gsap,
  useGSAP,
  SplitText,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import MarketingHeroSlides from '../MarketingHeroSlides';
import { buildWhatsAppHref, mailtoHref } from '../contact';

const HERO_STALE_MS = 15000;

const HERO_WHATSAPP =
  'שלום בר, ראיתי את הסטודיו ואני מעוניין/ת לשמוע על השירותים שלך.';

export default function HeroPitch() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const cta = root.querySelector<HTMLElement>('.hero-cta-row');
      const questions = Array.from(
        root.querySelectorAll<HTMLElement>('.hero-questions li'),
      );

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (headline) {
          split = new SplitText(headline, { type: 'chars,words' });
          createReveal(
            split.chars,
            { opacity: 0, yPercent: 80, rotate: -6 },
            {
              opacity: 1,
              yPercent: 0,
              rotate: 0,
              duration: 0.7,
              stagger: 0.03,
              ease: 'back.out(1.8)',
            },
            { trigger: headline, start: 'top 85%', staleAfterMs: HERO_STALE_MS },
          );
          cleanupBleed = attachInkBleed(headline, 'letter');
        }

        if (questions.length) {
          createReveal(
            questions,
            { opacity: 0, x: 24 },
            { opacity: 1, x: 0, duration: 0.55, stagger: 0.12 },
            { trigger: questions[0]!, start: 'top 90%', staleAfterMs: HERO_STALE_MS },
          );
        }

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.15 },
            { trigger: dek, start: 'top 90%', staleAfterMs: HERO_STALE_MS },
          );
        }

        if (cta) {
          createReveal(
            cta,
            { opacity: 0, y: 18 },
            { opacity: 1, y: 0, duration: 0.55 },
            { trigger: cta, start: 'top 95%', staleAfterMs: HERO_STALE_MS },
          );
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page hero-pitch" id="about" ref={rootRef} tabIndex={-1}>
      <div className="folio">
        <b>00</b> // אודות
      </div>

      <div className="hero-pitch__layout">
        <div className="hero-pitch__copy">
          <p
            className="byline"
            style={{ fontFamily: 'var(--mono)', color: 'var(--ink-soft)' }}
          >
            // בר משה — מפתח עצמאי
          </p>
          <h1 className="headline">
            רעיון בראש,<br />
            ואין מושג מאיפה{' '}
            <em style={{ color: 'var(--green)', fontStyle: 'italic' }}>מתחילים?</em>
          </h1>
          <ul
            className="hero-questions"
            style={{
              listStyle: 'none',
              padding: 0,
              margin: '28px 0 0',
              display: 'grid',
              gap: 10,
              fontFamily: 'var(--serif)',
              fontSize: 'clamp(1.05rem, 1.8vw, 1.3rem)',
              color: 'var(--ink-soft)',
              maxWidth: '52ch',
            }}
          >
            <li>· רוצה ללמוד לבנות בלי לדעת איך מתחילים?</li>
            <li>· יש לך מוצר בראש ואת.ה צריך.ה מישהו שינווט אותו לאוויר?</li>
            <li>· צוות קטן שמחפש מנטור או בילדר חיצוני?</li>
          </ul>
          <p className="dek" style={{ marginTop: 22 }}>
            זה בדיוק מה שאני עושה — מלמד, מלווה, ובונה. אפליקציות, אתרים, ורעיונות
            יצירתיים — מהסקיצה ועד הלייב.
          </p>
          <div className="hero-cta-row">
            <a
              className="enter"
              href={buildWhatsAppHref(HERO_WHATSAPP)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="פתח שיחה ב-WhatsApp עם בר משה"
            >
              דברו איתי בוואטסאפ
            </a>
            <a className="enter enter--ghost" href={mailtoHref}>
              שלחו מייל
            </a>
          </div>
        </div>

        <aside className="hero-pitch__slides" aria-hidden="false">
          <MarketingHeroSlides />
        </aside>
      </div>
    </article>
  );
}
