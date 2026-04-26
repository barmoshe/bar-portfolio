import { testimonials } from '../../data/proof';

export default function Proof() {
  return (
    <section className="mp-section" id="proof" aria-labelledby="proof-headline">
      <span className="mp-eyebrow">עדויות</span>
      <h2 className="mp-h2" id="proof-headline">
        קולות שיצאו <mark>לאוויר.</mark>
      </h2>
      <p className="mp-lead">
        שורות ממי שלמד.ה איתי, בנה.ה איתי, או שיגרנו ביחד משהו לאוויר.
      </p>

      <div className="mp-testimonials">
        {testimonials.map((t) => (
          <figure
            key={t.id}
            className={`mp-testimonial mp-testimonial--${t.accent}`}
          >
            <span className="mp-testimonial__mark" aria-hidden="true">&ldquo;</span>
            <blockquote className="mp-testimonial__quote">{t.quote}</blockquote>
            <figcaption className="mp-testimonial__cite">
              <span className="mp-testimonial__name">{t.name}</span>
              <span className="mp-testimonial__role">{t.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
