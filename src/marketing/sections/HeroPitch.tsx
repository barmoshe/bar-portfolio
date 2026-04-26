import MarketingHeroSlides from '../MarketingHeroSlides';
import { buildWhatsAppHref, mailtoHref } from '../contact';

const HERO_WHATSAPP =
  'היי בר! יש לי רעיון בראש ואני מחפש.ת מאיפה להתחיל. אשמח לתאם שיחה ראשונה.';

const STATS = [
  { num: '5+', label: 'שנים מפתח' },
  { num: '20+', label: 'פרויקטים שוגרו' },
  { num: '∞', label: 'קפה במהלך' },
];

export default function HeroPitch() {
  return (
    <section className="mp-section mp-hero" id="top" aria-labelledby="hero-headline">
      <div className="mp-hero__layout">
        <div className="mp-hero__copy">
          <span className="mp-hero__sticker" aria-hidden="true">
            🎯 פתוח לפרויקטים חדשים
          </span>
          <h1 className="mp-h1" id="hero-headline">
            רעיון בראש,<br />
            ואין מושג מאיפה <mark>מתחילים?</mark>
          </h1>
          <p className="mp-lead">
            אני בר. מלמד, מלווה, ובונה — אפליקציות, אתרים, ורעיונות יצירתיים מהסקיצה ועד הלייב.
            בלי הפתעות, ובלי באזוורדס.
          </p>

          <ul className="mp-hero__questions" aria-label="מתאים אם...">
            <li>רוצה ללמוד לבנות בלי לדעת איך מתחילים</li>
            <li>יש לך מוצר בראש ואת.ה צריך.ה מישהו שינווט אותו לאוויר</li>
            <li>צוות קטן שמחפש מנטור או בילדר חיצוני</li>
          </ul>

          <div className="mp-cta-row">
            <a
              className="mp-cta mp-cta--primary"
              href={buildWhatsAppHref(HERO_WHATSAPP)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span aria-hidden="true">💬</span> דברו איתי בוואטסאפ
            </a>
            <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
              <span aria-hidden="true">✉</span> שלחו מייל
            </a>
          </div>
        </div>

        <div className="mp-hero__visual">
          <MarketingHeroSlides />
        </div>
      </div>

      <dl className="mp-proof" aria-label="במספרים">
        {STATS.map((s) => (
          <div className="mp-proof__item" key={s.label}>
            <dt className="mp-proof__num">{s.num}</dt>
            <dd className="mp-proof__label">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
