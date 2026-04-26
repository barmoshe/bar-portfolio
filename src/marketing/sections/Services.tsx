import { services } from '../../data/services';

export default function Services() {
  return (
    <section className="mp-section" id="services" aria-labelledby="services-headline">
      <span className="mp-eyebrow">השירותים</span>
      <h2 className="mp-h2" id="services-headline">
        שלושה <mark>שערים</mark> להתחיל איתם.
      </h2>
      <p className="mp-lead">
        כל שירות עומד בפני עצמו — בחר.י מה שמתאים, או נשלב כמה לפי השלב שלך.
      </p>

      <div className="mp-services">
        {services.map((s) => (
          <article className="mp-service" key={s.slug} aria-labelledby={`s-${s.slug}`}>
            <span className="mp-service__emoji" aria-hidden="true">{s.emoji}</span>
            <p className="mp-service__kicker">{s.kicker}</p>
            <h3 className="mp-service__title" id={`s-${s.slug}`}>{s.title}</h3>
            <p className="mp-service__summary">{s.summary}</p>
            <ul className="mp-service__bullets">
              {s.bullets.map((b) => <li key={b}>{b}</li>)}
            </ul>
            <a className="mp-service__cta" href="#contact">לפרטים ולתיאום</a>
          </article>
        ))}
      </div>
    </section>
  );
}
