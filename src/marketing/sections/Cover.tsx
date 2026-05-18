import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useLang } from '../LangContext';
import Caret from '../components/Caret';
import Prompt from '../components/Prompt';
import BuildLine from '../components/BuildLine';
import { scrollToIntake } from '../scrollToIntake';

const FULL_MOTION = '(prefers-reduced-motion: no-preference)';

export default function Cover() {
  const { t } = useLang();
  const { cover, build } = t;
  const stageRef = useRef<HTMLDivElement | null>(null);

  // Build-log type-on: the prompt, then each BuildLine row, then the
  // manifesto comment lines. One GSAP timeline so the order is stable
  // and a single reduced-motion gate kills everything. The DOM is
  // already in its final state — the timeline only animates entrance,
  // so reduced motion mode simply skips the tween and the page is
  // already correct.
  useLayoutEffect(() => {
    const root = stageRef.current;
    if (!root) return;
    if (!matchMedia(FULL_MOTION).matches) return;

    const prompt = root.querySelector<HTMLElement>('.mp-cover__prompt-row');
    const lines = root.querySelectorAll<HTMLElement>('.mp-buildline');
    const comments = root.querySelectorAll<HTMLElement>('.mp-cover__comment-line');

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power2.out' } });
      if (prompt) tl.from(prompt, { opacity: 0, y: 8, duration: 0.35 });
      tl.from(lines, { opacity: 0, x: -10, duration: 0.4, stagger: 0.18 }, '+=0.12');
      tl.from(comments, { opacity: 0, y: 6, duration: 0.45, stagger: 0.1 }, '+=0.2');
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

  // Screen-reader text: collapse the manifesto comment lines into one
  // human sentence so assistive tech doesn't hear the slash-comment marks.
  const manifesto = cover.headlineLines.join(' ');

  return (
    <section className="mp-cover mp-buildlog" id="top" aria-labelledby="cover-headline">
      <div className="mp-cover__inner" ref={stageRef}>
        <p className="mp-cover__build-id" aria-hidden="true">
          [ {build.buildId} ]
        </p>

        <p className="mp-cover__prompt-row">
          <Prompt>{build.promptCmd}</Prompt>
          <span className="mp-cover__prompt-arg" aria-hidden="true"> _</span>
          <Caret className="mp-cover__caret" />
        </p>

        <ul className="mp-cover__buildlines" aria-label={build.pipeline.caption}>
          {build.buildLines.map((line) => (
            <BuildLine
              key={line.label}
              label={line.label}
              status={line.status}
              state={line.state}
            />
          ))}
        </ul>

        <h1 className="mp-cover__h" id="cover-headline">
          <span className="visually-hidden">{manifesto}</span>
          <span className="mp-cover__comment" aria-hidden="true">
            {cover.headlineLines.map((line, i) => (
              <span className="mp-cover__comment-line" key={i}>
                <span className="mp-cover__comment-mark">//</span> {line}
              </span>
            ))}
          </span>
        </h1>

        <p className="mp-cover__standfirst">{cover.standfirst}</p>

        <div className="mp-cover__cmds">
          <a
            className="mp-cover__cmd mp-cover__cmd--primary"
            href="#brief"
            onClick={onBrief}
          >
            <span className="mp-cover__cmd-bracket" aria-hidden="true">[</span>
            <span className="mp-cover__cmd-label">{build.startCmd}</span>
            <span className="mp-cover__cmd-arrow" aria-hidden="true">→</span>
            <span className="mp-cover__cmd-bracket" aria-hidden="true">]</span>
          </a>
          <a
            className="mp-cover__cmd"
            href="#contents"
            onClick={onScrollHint}
          >
            <span className="mp-cover__cmd-bracket" aria-hidden="true">[</span>
            <span className="mp-cover__cmd-label">{build.browseCmd}</span>
            <span className="mp-cover__cmd-arrow" aria-hidden="true">↓</span>
            <span className="mp-cover__cmd-bracket" aria-hidden="true">]</span>
          </a>
        </div>

        <p className="mp-cover__byline" aria-hidden="true">
          {cover.byline}
        </p>
      </div>
    </section>
  );
}
