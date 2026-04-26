import { mailtoHref, whatsappHref } from './contact';

export default function StickyCTA() {
  return (
    <div className="mp-sticky" role="region" aria-label="קישורי יצירת קשר מהירים">
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
  );
}
