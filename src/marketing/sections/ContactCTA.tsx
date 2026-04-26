import { mailtoHref, whatsappHref } from '../contact';

export default function ContactCTA() {
  return (
    <section className="mp-final" id="contact" aria-labelledby="contact-headline">
      <h2 id="contact-headline">בואו נבנה את זה ביחד.</h2>
      <p>
        שיחה ראשונה ללא התחייבות — מספרים לי על הרעיון, ואני אומר אם וזה משהו שאני יכול לעזור איתו.
      </p>
      <div className="mp-cta-row">
        <a
          className="mp-cta mp-cta--primary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span aria-hidden="true">💬</span> וואטסאפ
        </a>
        <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
          <span aria-hidden="true">✉</span> מייל
        </a>
      </div>
    </section>
  );
}
