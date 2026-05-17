import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLang } from '../LangContext';
import HebrewBet from '../components/HebrewBet';
import { scrollToIntake } from '../scrollToIntake';

const FULL_MOTION = '(prefers-reduced-motion: no-preference)';

export default function Cover() {
  const { t } = useLang();
  const { cover } = t;
  const headlineRef = useRef<HTMLHeadingElement | null>(null);

  // Letter-by-letter type-in on first paint. The headline is split in JSX
  // into per-character spans; GSAP animates them with a stagger. Each
  // line gets a small line-level delay so the three manifesto lines land
  // in sequence rather than as one wave. useLayoutEffect (not useEffect)
  // so the initial-hidden state is applied before the browser's first
  // paint — avoids a flash of the final-state characters.
  useLayoutEffect(() => {
    const root = headlineRef.current;
    if (!root) return;
    if (!matchMedia(FULL_MOTION).matches) return;

    const lines = Array.from(root.querySelectorAll<HTMLElement>('.mp-cover__h-line'));
    const ctx = gsap.context(() => {
      lines.forEach((line, lineIndex) => {
        const chars = line.querySelectorAll<HTMLElement>('.mp-cover__h-char');
        gsap.from(chars, {
          yPercent: 110,
          opacity: 0,
          duration: 0.7,
          ease: 'power3.out',
          stagger: 0.035,
          delay: 0.15 + lineIndex * 0.35,
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

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

        <h1 className="mp-cover__h" id="cover-headline" ref={headlineRef}>
          {cover.headlineLines.map((line, lineIdx) => (
            <span className="mp-cover__h-line" key={lineIdx}>
              {/* Each character wrapped so GSAP can animate them individually.
                  aria-hidden + visually-hidden full-line below preserves SR text. */}
              <span aria-hidden="true">
                {Array.from(line).map((ch, i) => (
                  <span className="mp-cover__h-char" key={i}>
                    {ch === ' ' ? ' ' : ch}
                  </span>
                ))}
              </span>
              <span className="visually-hidden">{line}</span>
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
