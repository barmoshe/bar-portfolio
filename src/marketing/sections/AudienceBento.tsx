import { useLang } from '../LangContext';
import { buildWhatsAppHref } from '../contact';

export default function AudienceBento() {
  const { t } = useLang();
  const { audience } = t;

  return (
    <section className="mp-section" id="audience" aria-labelledby="audience-headline">
      <span className="mp-eyebrow">{audience.eyebrow}</span>
      <h2 className="mp-h2" id="audience-headline">
        {audience.headlineLead}
        <mark>{audience.headlineMark}</mark>
      </h2>
      <p className="mp-lead">{audience.lead}</p>

      <div className="mp-audiences">
        {audience.items.map((a) => (
          <a
            key={a.slug}
            className="mp-audience"
            href={buildWhatsAppHref(a.whatsappMessage)}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={a.ariaLabel}
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
