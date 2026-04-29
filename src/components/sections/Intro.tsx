import { useRef } from 'react';
import HeroSlides from '../HeroSlides';
import {
  gsap,
  ScrollTrigger,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';

// Intro is the first thing the viewer sees. Keep the stale window short so
// TabBar returns feel fresh quickly.
const INTRO_STALE_MS = 5000;

export default function Intro() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const card = root.querySelector<HTMLElement>('.id-card');
      const bioH1 = root.querySelector<HTMLElement>('.bio h1');
      const byline = root.querySelector<HTMLElement>('.bio .byline');
      const paras = root.querySelectorAll<HTMLElement>('.bio p, .bio .drop');
      const tape = root.querySelector<HTMLElement>('.id-card .tape');
      const idMeta = root.querySelectorAll<HTMLElement>('.id-meta > *');
      const credoCard = root.querySelector<HTMLElement>('.credo-card');
      const credoTape = root.querySelector<HTMLElement>('.credo-card .tape');

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_QUERY, () => {
        if (card) {
          createReveal(
            card,
            { xPercent: -30, y: 18, rotate: -10, opacity: 0 },
            { xPercent: 0, y: 0, rotate: -1.5, opacity: 1, duration: 1.1, ease: 'power4.out' },
            { trigger: root, start: 'top 70%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        if (credoCard) {
          createReveal(
            credoCard,
            { y: 40, rotate: -8, opacity: 0 },
            { y: 0, rotate: -1.5, opacity: 1, duration: 0.9, ease: 'power4.out' },
            { trigger: credoCard, start: 'top 85%', staleAfterMs: INTRO_STALE_MS },
          );
        }
      });

      mm.add(MOBILE_QUERY, () => {
        if (card) {
          createReveal(
            card,
            { y: 60, opacity: 0, scale: 0.92, rotate: -3 },
            { y: 0, opacity: 1, scale: 1, rotate: -1.5, duration: 0.85, ease: 'back.out(1.4)' },
            { trigger: root, start: 'top 95%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        if (credoCard) {
          createReveal(
            credoCard,
            { y: 40, scale: 0.92, rotate: -4, opacity: 0 },
            { y: 0, scale: 1, rotate: -1, opacity: 1, duration: 0.75, ease: 'back.out(1.4)' },
            { trigger: credoCard, start: 'top 92%', staleAfterMs: INTRO_STALE_MS },
          );
        }
      });

      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;

        if (tape) {
          createReveal(
            tape,
            { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            { trigger: root, start: 'top 60%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        if (credoTape) {
          createReveal(
            credoTape,
            { scaleX: 0, transformOrigin: 'left center', opacity: 0 },
            { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.out' },
            { trigger: credoCard ?? root, start: 'top 78%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        if (idMeta.length) {
          createReveal(
            idMeta,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.45, stagger: 0.05 },
            { trigger: card ?? root, start: 'top 65%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        if (byline) {
          createReveal(
            byline,
            { opacity: 0, x: -12 },
            { opacity: 1, x: 0, duration: 0.6 },
            { trigger: root, start: 'top 70%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        let cleanupBleed: (() => void) | null = null;
        if (bioH1) {
          split = new SplitText(bioH1, { type: 'words,chars' });
          createReveal(
            split.words,
            { opacity: 0, yPercent: 60, rotate: -4 },
            { opacity: 1, yPercent: 0, rotate: 0, duration: 0.8, stagger: 0.06, ease: 'back.out(1.6)' },
            { trigger: bioH1, start: 'top 80%', staleAfterMs: INTRO_STALE_MS },
          );
          cleanupBleed = attachInkBleed(bioH1, 'intro');
        }

        if (paras.length) {
          createReveal(
            paras,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08 },
            { trigger: root, start: 'top 55%', staleAfterMs: INTRO_STALE_MS },
          );
        }

        ScrollTrigger.refresh();

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="intro" ref={rootRef}>
      <div className="folio">
        <b>01</b> // WHOAMI
      </div>

      <aside className="id-card">
        <span className="tape" aria-hidden="true" />
        <HeroSlides />
        <div className="id-meta">
          <b>NAME</b>
          <span>Bar Moshe</span>
          <b>ROLE</b>
          <span>Builder</span>
          <b>FOCUS</b>
          <span>Full-stack · AI-native · makes things</span>
          <b>REACH</b>
          <span>
            <a href="https://github.com/barmoshe" target="_blank" rel="me noopener">
              github.com/barmoshe
            </a>
          </span>
        </div>
      </aside>

      <div className="bio">
        <p className="byline">
          Builder by default. Stack and field are negotiable.
        </p>
        <h1>
          I just <em>build the thing.</em>
        </h1>
        <div className="drop">
          <p>
            I'm Bar. I build software, mostly. Web apps, hardware experiments,
            game-jam soundtracks, weekend scripts that turn into daily tools.
          </p>
        </div>

        <p>
          My day job is full-stack. Off-hours, I work on whatever I'm curious about.
          The two help each other: side projects keep my skills sharp, the day job
          keeps the side projects practical.
        </p>

        <p>
          Title and stack matter less than the habit of building. That, and one belief
          I keep proving to myself:
        </p>

        <aside className="credo-card" aria-label="credo">
          <span className="tape" aria-hidden="true" />
          <blockquote>&ldquo;It&rsquo;s only one prompt away&rdquo;</blockquote>
        </aside>

        <p className="toolline">
          <span className="prompt">&gt;&nbsp;now</span>
          <span className="args">
            builder
            <span className="sep">·</span>
            full-stack
            <span className="sep">·</span>
            AI-native
            <span className="sep">·</span>
            happy shipping things
          </span>
          <span className="caret" aria-hidden="true" />
        </p>
      </div>
    </article>
  );
}
