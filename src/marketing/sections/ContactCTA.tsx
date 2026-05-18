import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * The DONE slam. One big magenta card with a rotated "בוצע ✓" stamp
 * sitting behind the CTAs.
 */
export default function ContactCTA() {
  const { t } = useLang();
  const { colophon, board } = t;
  const stampText = board.status.done; // "בוצע" / "DONE"

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

      <div className="mp-final__ctas">
        <a
          className="mp-cta mp-cta--primary"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          ✦ {colophon.ctaWhatsapp}
        </a>
        <a className="mp-cta mp-cta--secondary" href={mailtoHref}>
          {colophon.ctaMail}
        </a>
      </div>

      <p className="mp-final__credit">
        {colophon.credit} ·{' '}
        <a href={`#${INTAKE_ID}`}>
          {colophon.ctaPrimary} <span className="mp-arrow" aria-hidden="true">→</span>
        </a>{' '}
        ·{' '}
        <a href="../">
          <span className="mp-arrow" aria-hidden="true">←</span> {colophon.portfolioLink}
        </a>
      </p>
    </section>
  );
}
