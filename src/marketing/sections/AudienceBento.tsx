import { audiences } from '../../data/audiences';
import { buildWhatsAppHref } from '../contact';

export default function AudienceBento() {
  return (
    <section
      className="mp-section"
      id="audience"
      aria-labelledby="audience-headline"
    >
      <span className="mp-eyebrow">למי זה מתאים</span>
      <h2 className="mp-h2" id="audience-headline">
        אם אחד מאלה מוכר — <mark>בואו נדבר.</mark>
      </h2>
      <p className="mp-lead">
        ארבעה כיוונים, כל אחד עם נקודת התחלה משלו. בחר.י את שלך וההודעה תיפתח עם ההקשר הנכון.
      </p>

      <div className="mp-audiences">
        {audiences.map((a) => (
          <a
            key={a.slug}
            className="mp-audience"
            href={buildWhatsAppHref(a.whatsappMessage)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={`פתח שיחה ב-WhatsApp עם בר משה - ${a.title}`}
          >
            <span className="mp-audience__emoji" aria-hidden="true">{a.emoji}</span>
            <p className="mp-audience__kicker">{a.kicker}</p>
            <h3 className="mp-audience__title">{a.title}</h3>
            <p className="mp-audience__summary">{a.summary}</p>
            <span className="mp-audience__cta" aria-hidden="true">{a.cta}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
