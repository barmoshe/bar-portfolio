import { useLang } from '../LangContext';
import { mailtoHref, whatsappHref } from '../contact';
import Prompt from '../components/Prompt';
import Caret from '../components/Caret';
import { scrollToIntake } from '../scrollToIntake';

export default function ContactCTA() {
  const { t } = useLang();
  const { colophon, build } = t;

  const onPrimary = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToIntake();
  };

  return (
    <section
      className="mp-colophon mp-buildlog"
      id="colophon"
      aria-labelledby="colophon-headline"
    >
      <div className="mp-colophon__inner">
        <p className="mp-colophon__kicker" aria-hidden="true">
          [ {colophon.number} ] · {colophon.kicker}
        </p>

        <p className="mp-colophon__prompt" aria-hidden="true">
          <Prompt>{build.deployCmd}</Prompt>
          <Caret className="mp-colophon__caret" />
        </p>

        <h2 className="mp-colophon__h" id="colophon-headline">
          {colophon.title}
        </h2>

        <p className="mp-colophon__comment" aria-hidden="true">
          {build.deployComment}
        </p>

        <p className="mp-colophon__pull">{colophon.pullQuote}</p>

        <div className="mp-colophon__actions">
          <a
            className="mp-colophon__primary"
            href="#brief"
            onClick={onPrimary}
          >
            <span aria-hidden="true">[</span>
            <span>{colophon.ctaPrimary}</span>
            <span aria-hidden="true">→]</span>
          </a>
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
