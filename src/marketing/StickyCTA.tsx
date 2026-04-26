import { useLang } from './LangContext';
import { mailtoHref, whatsappHref } from './contact';

export default function StickyCTA() {
  const { t } = useLang();
  const { sticky } = t;

  return (
    <div className="mp-sticky" role="region" aria-label={sticky.region}>
      <a
        className="mp-cta mp-cta--primary"
        href={whatsappHref}
        target="_blank"
        rel="noreferrer noopener"
      >
        <span aria-hidden="true">💬</span> {sticky.whatsapp}
      </a>
      <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
        <span aria-hidden="true">✉</span> {sticky.mail}
      </a>
    </div>
  );
}
