import MarketingHeroSlides from '../MarketingHeroSlides';
import { buildWhatsAppHref, mailtoHref } from '../contact';

const HERO_WHATSAPP =
  'שלום בר, ראיתי את הסטודיו ואני מעוניין/ת לשמוע על השירותים שלך.';

const STATS = [
  { num: '5+', label: 'שנים מפתח' },
  { num: '20+', label: 'פרויקטים שוגרו' },
  { num: '∞', label: 'קפה במהלך' },
];

export default function HeroPitch() {
  return (
    <section
      className="mp-section mp-section--hero mp-hero"
      id="top"
      aria-labelledby="hero-headline"
    >
      <div className="mp-hero__grid">
        <div className="mp-hero__copy">
          <span className="mp-hero__sticker" aria-hidden="true">
            🎯 פתוח לפרויקטים חדשים
          </span>
          <h1 className="mp-h1 mp-hero__title" id="hero-headline">
            בונה. מלמד.<br />
            <mark>מוציא רעיונות לאוויר.</mark>
          </h1>
          <p className="mp-lead">
            אני בר. סטודיו פיתוח עצמאי לאנשים פרטיים, יזמים וחברות. שיעורים אחד על אחד,
            ליווי טכני, ובנייה מקצה לקצה. בלי באזוורדס, בלי הפתעות.
          </p>

          <div className="mp-cta-row">
            <a
              className="mp-cta mp-cta--whatsapp"
              href={buildWhatsAppHref(HERO_WHATSAPP)}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="פתח שיחה ב-WhatsApp עם בר משה"
            >
              <span className="mp-cta__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" width="20" height="20" focusable="false">
                  <path
                    fill="currentColor"
                    d="M20.5 3.5A11 11 0 0 0 3.6 17.6L2 22l4.5-1.5a11 11 0 0 0 13.9-13A10.9 10.9 0 0 0 20.5 3.5Zm-8.5 17a9 9 0 0 1-4.6-1.3l-.3-.2-2.7.9.9-2.6-.2-.3a9 9 0 1 1 6.9 3.5Zm5-6.7c-.3-.1-1.6-.8-1.8-.9-.2-.1-.4-.1-.6.1-.2.3-.7.9-.9 1.1-.2.2-.3.2-.6.1a7.3 7.3 0 0 1-3.7-3.2c-.3-.5.3-.5.8-1.5.1-.2 0-.4 0-.5L9 6.6c-.2-.4-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3c-.2.3-.9.9-.9 2.2 0 1.3.9 2.6 1 2.8.1.2 1.8 2.8 4.4 3.9 2.6 1 2.6.7 3.1.7s1.6-.6 1.8-1.3c.2-.7.2-1.2.2-1.3-.1-.1-.3-.2-.6-.3Z"
                  />
                </svg>
              </span>
              דברו איתי בוואטסאפ
            </a>
            <a className="mp-cta mp-cta--ghost" href={mailtoHref}>
              <span aria-hidden="true">✉</span> שלחו מייל
            </a>
          </div>

          <dl className="mp-proof" aria-label="במספרים">
            {STATS.map((s) => (
              <div className="mp-proof__item" key={s.label}>
                <dt className="mp-proof__num">{s.num}</dt>
                <dd className="mp-proof__label">{s.label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="mp-hero__slides" aria-hidden="false">
          <MarketingHeroSlides />
        </div>
      </div>
    </section>
  );
}
