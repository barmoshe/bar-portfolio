import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';
import { INTAKE_ID } from '../scrollToIntake';

/**
 * STRIPPED — plain semantic HTML. The redesign should turn this
 * into the closing call-to-action. See DESIGN_BRIEF.md.
 *
 * Copy is locked: do not change `colophon.*` strings.
 */
export default function ContactCTA() {
  const { t } = useLang();
  const { colophon } = t;

  return (
    <section id="colophon" aria-labelledby="colophon-headline">
      <p>{colophon.number} · {colophon.kicker}</p>

      <h2 id="colophon-headline">{colophon.title}</h2>

      <p>{colophon.pullQuote}</p>

      <p>
        <a href={`#${INTAKE_ID}`}>{colophon.ctaPrimary} →</a>
      </p>
      <p>
        <a href={whatsappHref} target="_blank" rel="noreferrer noopener">
          {colophon.ctaWhatsapp}
        </a>
        {' · '}
        <a href={mailtoHref}>{colophon.ctaMail}</a>
      </p>

      <p>
        {colophon.credit}{' '}
        <a href="../">← {colophon.portfolioLink}</a>
      </p>
    </section>
  );
}
