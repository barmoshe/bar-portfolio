import { useLang } from '../LangContext';

export default function Proof() {
  const { t } = useLang();
  const { proof } = t;

  return (
    <section className="mp-section" id="proof" aria-labelledby="proof-headline">
      <span className="mp-eyebrow">{proof.eyebrow}</span>
      <h2 className="mp-h2" id="proof-headline">
        {proof.headlineLead}
        <mark>{proof.headlineMark}</mark>
      </h2>
      <p className="mp-lead">{proof.lead}</p>

      <div className="mp-testimonials">
        {proof.items.map((tm) => (
          <figure
            key={tm.id}
            className={`mp-testimonial mp-testimonial--${tm.accent}`}
          >
            <span className="mp-testimonial__mark" aria-hidden="true">&ldquo;</span>
            <blockquote className="mp-testimonial__quote">{tm.quote}</blockquote>
            <figcaption className="mp-testimonial__cite">
              <span className="mp-testimonial__name">{tm.name}</span>
              <span className="mp-testimonial__role">{tm.role}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}
