import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';
import KineticHeadline from '../components/KineticHeadline';
import BloomCta from '../components/BloomCta';
import { INTAKE_ID } from '../scrollToIntake';

export default function ContactCTA() {
  const { t } = useLang();
  const { colophon } = t;

  return (
    <section
      className="mp-colophon"
      id="colophon"
      aria-labelledby="colophon-headline"
    >
      <div className="mp-colophon__inner">
        <p className="mp-colophon__kicker" aria-hidden="true">
          {colophon.number} · {colophon.kicker}
        </p>

        <KineticHeadline
          as="h2"
          id="colophon-headline"
          className="mp-colophon__h"
          lines={[colophon.title]}
        />

        <p className="mp-colophon__pull">{colophon.pullQuote}</p>

        <div className="mp-colophon__actions">
          <BloomCta
            href={`#${INTAKE_ID}`}
            scrollTargetId={INTAKE_ID}
          >
            {colophon.ctaPrimary}
          </BloomCta>
          <div className="mp-colophon__alt">
            <a href={whatsappHref} target="_blank" rel="noreferrer noopener">
              {colophon.ctaWhatsapp}
            </a>
            <span aria-hidden="true">·</span>
            <a href={mailtoHref}>{colophon.ctaMail}</a>
          </div>
        </div>

        <p className="mp-colophon__credit">
          {colophon.credit}{' '}
          <a href="../" className="mp-colophon__back">
            ← {colophon.portfolioLink}
          </a>
        </p>
      </div>
    </section>
  );
}
