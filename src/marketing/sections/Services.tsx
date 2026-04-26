import { services } from '../../data/services';
import { buildWhatsAppHref } from '../contact';

const SERVICE_MESSAGES: Record<string, string> = {
  tutoring: 'שלום בר, אני מעוניין/ת בשיעורים פרטיים בתכנות. אשמח לתאם שיחת היכרות.',
  guiding: 'שלום בר, אני מחפש/ת ליווי וייעוץ טכני לפרויקט/צוות. אפשר לתאם שיחה?',
  building: 'שלום בר, יש לי פרויקט שאני רוצה לבנות מקצה לקצה. אשמח לתאם שיחה.',
};

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
            <a
              className="mp-service__cta"
              href={buildWhatsAppHref(SERVICE_MESSAGES[s.slug])}
              target="_blank"
              rel="noreferrer noopener"
            >
              לפרטים ולתיאום
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
