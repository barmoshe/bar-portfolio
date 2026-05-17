import { useLang } from '../LangContext';
import { whatsappHref, mailtoHref } from '../contact';

/**
 * Editorial running-foot at the bottom of every section. Behaves like
 * a magazine's running footer: section number on one side, the issue
 * tag in the middle, contacts on the other side. Hairline rule above.
 * Small, low-contrast, doesn't shout. Keeps the reader's contact
 * affordances always one glance away without resorting to a sticky
 * CTA bar (which would undermine the editorial frame).
 */
type Props = {
  sectionNumber: string;
};

export default function RunningFoot({ sectionNumber }: Props) {
  const { t } = useLang();
  const { runningFoot } = t;

  const onTop = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <aside className="mp-foot" aria-label="navigation">
      <span className="mp-foot__section">{sectionNumber}</span>
      <span className="mp-foot__issue" aria-hidden="true">
        בר משה · {runningFoot.issueLabel}
      </span>
      <span className="mp-foot__contacts">
        <a
          className="mp-foot__link"
          href={whatsappHref}
          target="_blank"
          rel="noreferrer noopener"
        >
          {runningFoot.whatsapp}
        </a>
        <span aria-hidden="true">·</span>
        <a className="mp-foot__link" href={mailtoHref}>
          {runningFoot.mail}
        </a>
        <span aria-hidden="true">·</span>
        <a className="mp-foot__link" href="#top" onClick={onTop}>
          {runningFoot.backToTop}
        </a>
      </span>
    </aside>
  );
}
