import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../../marketing/contact';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * The Lab DONE-stamp finale. Same structure as the marketing
 * ContactCTA, with a soft "if it works we talk" hint instead of a
 * commercial push.
 */
export default function LabContactCTA() {
  const { t } = useLang();
  const { colophon, board } = t;
  const stampText = board.status.done;

  return (
    <section
      id="colophon"
      className="mp-final"
      aria-labelledby="colophon-headline"
    >
      <span className="mp-final__stamp" aria-hidden="true">
        {stampText} ✓
      </span>

      <p className="mp-final__kicker">
        {board.columns.ship}
      </p>

      <h2 id="colophon-headline" className="mp-final__title">
        {colophon.title}
      </h2>

      <p className="mp-final__pull">{colophon.pullQuote}</p>

      <p className="mp-final__pull" style={{ fontSize: '0.92em', opacity: 0.78 }}>
        {colophon.softFollowUp}
      </p>

      <div className="mp-final__ctas">
        <a
          className="mp-cta mp-cta--primary"
          href={`#${INTAKE_ID}`}
        >
          ✦ {colophon.ctaPrimary}
        </a>
        <a
          className="mp-cta mp-cta--secondary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          {colophon.ctaWhatsapp}
        </a>
        <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
          {colophon.ctaMail}
        </a>
      </div>

      <p className="mp-final__credit">
        {colophon.credit} ·{' '}
        <a href="/bar-portfolio/">
          <span className="mp-arrow" aria-hidden="true">←</span> {colophon.portfolioLink}
        </a>
      </p>
    </section>
  );
}
