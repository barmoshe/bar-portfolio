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
import { attachInkBleed } from '../../lib/inkBleed';

export default function Dossier() {
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

      const mm = gsap.matchMedia();

      mm.add(DESKTOP_QUERY, () => {
        if (!card) return;
        gsap.set(card, { xPercent: -30, y: 18, rotate: -10, opacity: 0 });
        gsap.to(card, {
          xPercent: 0,
          y: 0,
          rotate: -1.5,
          opacity: 1,
          duration: 1.1,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: root,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        });
      });

      mm.add(MOBILE_QUERY, () => {
        if (!card) return;
        gsap.set(card, { y: 60, opacity: 0, scale: 0.92, rotate: -3 });
        gsap.to(card, {
          y: 0,
          opacity: 1,
          scale: 1,
          rotate: -1.5,
          duration: 0.85,
          ease: 'back.out(1.4)',
          scrollTrigger: { trigger: root, start: 'top 95%' },
        });
      });

      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;

        if (tape) {
          gsap.set(tape, { scaleX: 0, transformOrigin: 'left center', opacity: 0 });
          gsap.to(tape, {
            scaleX: 1,
            opacity: 1,
            duration: 0.5,
            ease: 'power2.out',
            scrollTrigger: { trigger: root, start: 'top 60%' },
          });
        }

        if (idMeta.length) {
          gsap.set(idMeta, { opacity: 0, y: 10 });
          gsap.to(idMeta, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.05,
            scrollTrigger: { trigger: card ?? root, start: 'top 65%' },
          });
        }

        if (byline) {
          gsap.set(byline, { opacity: 0, x: -12 });
          gsap.to(byline, {
            opacity: 1,
            x: 0,
            duration: 0.6,
            scrollTrigger: { trigger: root, start: 'top 70%' },
          });
        }

        let cleanupBleed: (() => void) | null = null;
        if (bioH1) {
          split = new SplitText(bioH1, { type: 'words,chars' });
          gsap.set(split.words, { opacity: 0, yPercent: 60, rotate: -4 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.8,
            stagger: 0.06,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: bioH1, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(bioH1, 'dossier');
        }

        if (paras.length) {
          gsap.set(paras, { opacity: 0, y: 16 });
          gsap.to(paras, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            scrollTrigger: { trigger: root, start: 'top 55%' },
          });
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
    <article className="page" id="dossier" ref={rootRef}>
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
          <span>Build things</span>
          <b>FOCUS</b>
          <span>Full-Stack · AI-native · Builder</span>
          <b>REACH</b>
          <span>
            <a href="https://github.com/barmoshe" target="_blank" rel="noopener">
              github.com/barmoshe
            </a>
          </span>
        </div>
      </aside>

      <div className="bio">
        <p className="byline">
          From idea to the thing that runs - with people, with AI, with whatever.
        </p>
        <h1>
          Most things <em>just need</em>
          <br />
          doing.
        </h1>
        <div className="drop">
          <p>
            I'm Bar - a full-stack engineer with a builder's habit and an AI-native reflex.
            I like closing the gap between an idea and the thing that runs it: a feature
            shipped, a script that saves someone an afternoon, a weekend experiment that
            quietly becomes a tool I use daily.
          </p>
        </div>

        <p>
          I make software for a living and keep making it on the side: small tools,
          music-leaning experiments, half-formed ideas pulled forward until they hold. The
          through-line isn't a stack or a title.
        </p>

        <p className="credo">
          It's the habit of starting and the belief that{' '}
          <em>&ldquo;everything is only one prompt away&rdquo;</em>.
        </p>

        <p className="toolline">
          <b>WORKING ON</b>
          Full-stack product work · AI-assisted tooling · small things that make bigger
          things possible.
        </p>
      </div>
    </article>
  );
}
