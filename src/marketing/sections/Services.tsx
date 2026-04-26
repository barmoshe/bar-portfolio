import { useLang } from '../LangContext';
import { buildWhatsAppHref } from '../contact';

export default function Services() {
  const { t } = useLang();
  const { services } = t;

  return (
    <section className="mp-section" id="services" aria-labelledby="services-headline">
      <span className="mp-eyebrow">{services.eyebrow}</span>
      <h2 className="mp-h2" id="services-headline">
        {services.headlineLead}
        <mark>{services.headlineMark}</mark>
      </h2>
      <p className="mp-lead">{services.lead}</p>

      <div className="mp-services">
        {services.items.map((s) => (
          <article className="mp-service" key={s.slug} aria-labelledby={`s-${s.slug}`}>
            <span className="mp-service__emoji" aria-hidden="true">{s.emoji}</span>
            <p className="mp-service__kicker">{s.kicker}</p>
            <h3 className="mp-service__title" id={`s-${s.slug}`}>{s.title}</h3>
            <p className="mp-service__summary">{s.summary}</p>
            <ul className="mp-service__bullets">
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a
              className="mp-service__cta"
              href={buildWhatsAppHref(s.whatsappMessage)}
              target="_blank"
              rel="noreferrer noopener"
            >
              {services.ctaLabel}
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
