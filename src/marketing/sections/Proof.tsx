import { testimonials } from '../../data/proof';

export default function Proof() {
  return (
    <section className="mp-section" id="proof" aria-labelledby="proof-headline">
      <span className="mp-eyebrow">מה אומרים</span>
      <h2 className="mp-h2" id="proof-headline">
        קולות <mark>שיצאו לאוויר.</mark>
      </h2>
      <p className="mp-lead">
        כמה שורות ממי שעבד איתי, התלמד איתי, או שיגר משהו ליצירה משותפת.
      </p>

      <div className="mp-proof-grid">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className={`mp-quote mp-quote--${t.accent}`}
          >
            <blockquote className="mp-quote__text">
              <span aria-hidden="true" className="mp-quote__mark">
                &ldquo;
              </span>
              {t.quote}
            </blockquote>
            <figcaption className="mp-quote__who">
              <span className="mp-quote__name">{t.name}</span>
              <span className="mp-quote__role">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
