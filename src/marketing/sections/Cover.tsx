import { useLang } from '../LangContext';
import HebrewBet from '../components/HebrewBet';
import { scrollToIntake } from '../scrollToIntake';

export default function Cover() {
  const { t } = useLang();
  const { cover } = t;

  const onScrollHint = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const next = document.getElementById('contents');
    if (!next) return;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    next.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  const onBrief = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    scrollToIntake();
  };

  return (
    <section className="mp-cover" id="top" aria-labelledby="cover-headline">
      <HebrewBet className="mp-cover__glyph" />

      <div className="mp-cover__inner">
        <p className="mp-cover__issue" aria-hidden="true">
          {cover.issueLine}
        </p>

        <h1 className="mp-cover__h" id="cover-headline">
          {cover.headlineLines.map((line, i) => (
            <span className="mp-cover__h-line" key={i} style={{ '--i': i } as React.CSSProperties}>
              {line}
            </span>
          ))}
        </h1>

        <p className="mp-cover__standfirst">{cover.standfirst}</p>

        <p className="mp-cover__byline">{cover.byline}</p>

        <div className="mp-cover__foot">
          <a className="mp-cover__hint" href="#contents" onClick={onScrollHint}>
            <span className="mp-cover__hint-arrow" aria-hidden="true">↓</span>
            <span>{cover.scrollHint}</span>
          </a>
          <a className="mp-cover__brief" href="#brief" onClick={onBrief}>
            {t.masthead.briefLink} ←
          </a>
        </div>
      </div>
    </section>
  );
}
