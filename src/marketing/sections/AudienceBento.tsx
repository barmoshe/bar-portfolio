import { audiences, type Audience } from '../../data/audiences';
import { buildWhatsAppHref } from '../contact';

const SPAN_CLASS: Record<Audience['span'], string> = {
  wide: 'mp-bento__cell mp-bento__cell--wide',
  tall: 'mp-bento__cell mp-bento__cell--tall',
  half: 'mp-bento__cell mp-bento__cell--half',
};

export default function AudienceBento() {
  return (
    <section
      className="mp-section mp-section--bento"
      id="audience"
      aria-labelledby="audience-headline"
    >
      <span className="mp-eyebrow">למי זה מתאים</span>
      <h2 className="mp-h2" id="audience-headline">
        אם <mark>אחד מהמצבים</mark> האלה מוכר לך — בואו נדבר.
      </h2>
      <p className="mp-lead">
        ארבעה כיוונים, כל אחד עם נקודת התחלה משלו. בחר/י את שלך וההודעה תיפתח עם ההקשר הנכון.
      </p>

      <div className="mp-bento">
        {audiences.map((a) => (
          <a
            key={a.slug}
            className={`${SPAN_CLASS[a.span]} mp-bento__card mp-bento__card--${a.slug}`}
            href={buildWhatsAppHref(a.whatsappMessage)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`פתח שיחה ב-WhatsApp עם בר משה - ${a.title}`}
          >
            <span className="mp-bento__emoji" aria-hidden="true">
              {a.emoji}
            </span>
            <span className="mp-bento__kicker">{a.kicker}</span>
            <h3 className="mp-bento__title">{a.title}</h3>
            <p className="mp-bento__summary">{a.summary}</p>
            <span className="mp-bento__cta" aria-hidden="true">
              {a.cta} ←
            </span>
          </a>
        ))}
      </div>
    </section>
  );
}
