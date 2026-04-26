import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';

export default function ContactCTA() {
  const { t } = useLang();
  const { contact } = t;

  return (
    <section className="mp-final" id="contact" aria-labelledby="contact-headline">
      <h2 id="contact-headline">{contact.headline}</h2>
      <p>{contact.body}</p>
      <div className="mp-cta-row">
        <a
          className="mp-cta mp-cta--primary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span aria-hidden="true">💬</span> {contact.ctaWhatsapp}
        </a>
        <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
          <span aria-hidden="true">✉</span> {contact.ctaMail}
        </a>
      </div>
    </section>
  );
}
