import { services } from '../../data/services';

export default function Services() {
  const [hero, ...rest] = services;
  return (
    <section
      className="mp-section mp-section--bento"
      id="services"
      aria-labelledby="services-headline"
    >
      <span className="mp-eyebrow">השירותים</span>
      <h2 className="mp-h2" id="services-headline">
        שלושה <mark>שערים</mark> להתחיל איתם.
      </h2>
      <p className="mp-lead">
        כל שירות עומד בפני עצמו. בחר/י מה שמתאים, או נשלב כמה לפי השלב שלך.
      </p>

      <div className="mp-services-bento">
        <article
          className="mp-service mp-service--hero"
          aria-labelledby={`s-${hero.slug}`}
        >
          <span className="mp-service__emoji" aria-hidden="true">
            {hero.emoji}
          </span>
          <p className="mp-service__kicker">{hero.kicker}</p>
          <h3 className="mp-service__title" id={`s-${hero.slug}`}>
            {hero.title}
          </h3>
          <p className="mp-service__summary">{hero.summary}</p>
          <ul className="mp-service__bullets">
            {hero.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
          <a className="mp-service__cta" href="#contact">
            לפרטים ולתיאום
          </a>
        </article>

        <div className="mp-service-stack">
          {rest.map((s) => (
            <article
              className="mp-service mp-service--compact"
              key={s.slug}
              aria-labelledby={`s-${s.slug}`}
            >
              <span className="mp-service__emoji" aria-hidden="true">
                {s.emoji}
              </span>
              <p className="mp-service__kicker">{s.kicker}</p>
              <h3 className="mp-service__title" id={`s-${s.slug}`}>
                {s.title}
              </h3>
              <p className="mp-service__summary">{s.summary}</p>
              <ul className="mp-service__bullets">
                {s.bullets.slice(0, 3).map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
              <a className="mp-service__cta" href="#contact">
                לפרטים ולתיאום
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
