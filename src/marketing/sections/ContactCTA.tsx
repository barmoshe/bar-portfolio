import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';

export default function ContactCTA() {
  const { t } = useLang();
  const { contact } = t;

  const onPrimary = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('intake');
    if (!target) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    target.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    const firstField = target.querySelector<HTMLElement>('textarea, input');
    firstField?.focus({ preventScroll: true });
  };

  return (
    <section className="mp-final" id="contact" aria-labelledby="contact-headline">
      <h2 id="contact-headline">{contact.headline}</h2>
      <p>{contact.body}</p>
      <div className="mp-cta-row">
        <a
          className="mp-cta mp-cta--primary"
          href="#intake"
          onClick={onPrimary}
        >
          <span aria-hidden="true">→</span> {contact.ctaPrimary}
        </a>
        <a
          className="mp-cta mp-cta--secondary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span aria-hidden="true">💬</span> {contact.ctaWhatsapp}
        </a>
        <a className="mp-cta mp-cta--ghost" href={mailtoHref}>
          <span aria-hidden="true">✉</span> {contact.ctaMail}
        </a>
      </div>
    </section>
  );
}
