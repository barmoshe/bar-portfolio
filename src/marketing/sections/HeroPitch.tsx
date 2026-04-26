import MarketingHeroSlides from '../MarketingHeroSlides';
import { useLang } from '../LangContext';
import { buildWhatsAppHref, mailtoHref } from '../contact';

export default function HeroPitch() {
  const { t } = useLang();
  const { hero } = t;

  return (
    <section className="mp-section mp-hero" id="top" aria-labelledby="hero-headline">
      <div className="mp-hero__layout">
        <div className="mp-hero__copy">
          <span className="mp-hero__sticker" aria-hidden="true">
            {hero.sticker}
          </span>
          <h1 className="mp-h1" id="hero-headline">
            {hero.headlineLead.split('\n').map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 ? <br /> : null}
              </span>
            ))}
            <mark>{hero.headlineMark}</mark>
          </h1>
          <p className="mp-lead">{hero.lead}</p>

          <figure className="mp-hero__pull">
            <blockquote>“{hero.pullQuote.quote}”</blockquote>
            <figcaption>— {hero.pullQuote.cite}</figcaption>
          </figure>

          <ul className="mp-hero__questions" aria-label={hero.questionsLabel}>
            {hero.questions.map((q) => (
              <li key={q}>{q}</li>
            ))}
          </ul>

          <div className="mp-cta-row">
            <a
              className="mp-cta mp-cta--primary"
              href={buildWhatsAppHref(hero.whatsappPrefill)}
              target="_blank"
              rel="noreferrer noopener"
            >
              <span aria-hidden="true">💬</span> {hero.ctaWhatsapp}
            </a>
            <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
              <span aria-hidden="true">✉</span> {hero.ctaMail}
            </a>
          </div>
        </div>

        <div className="mp-hero__visual">
          <MarketingHeroSlides />
        </div>
      </div>

      <dl className="mp-proof" aria-label={hero.statsLabel}>
        {hero.stats.map((s) => (
          <div className="mp-proof__item" key={s.label}>
            <dt className="mp-proof__num">{s.num}</dt>
            <dd className="mp-proof__label">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
