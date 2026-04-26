import { useLang } from '../LangContext';

export default function FAQ() {
  const { t } = useLang();
  const { faq } = t;

  return (
    <section className="mp-section" id="faq" aria-labelledby="faq-headline">
      <span className="mp-eyebrow">{faq.eyebrow}</span>
      <h2 className="mp-h2" id="faq-headline">
        {faq.headlineLead}
        <mark>{faq.headlineMark}</mark>
      </h2>

      <div className="mp-faq">
        {faq.items.map((it, i) => (
          <details key={it.q} {...(i === 0 ? { open: true } : {})}>
            <summary>{it.q}</summary>
            <p className="mp-faq__a">{it.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
