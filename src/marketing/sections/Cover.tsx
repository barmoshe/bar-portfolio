import { useEffect, useRef, useState } from 'react';
import { useLang } from '../LangContext';
import { INTAKE_ID } from '../scrollToIntake';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';

/**
 * Hero — three sticker "beat" cards stacked with an offset rhythm,
 * the DOING beat centered and elevated so the kanban triptych reads
 * in one glance above the fold on a 390×844 phone. Then two CTAs.
 *
 * The DOING pulse runs ONLY while the hero is on-screen
 * (IntersectionObserver gate, capped to one concurrent pulser per
 * page per the mobile motion budget).
 */
export default function Cover() {
  const { t } = useLang();
  const { cover, board } = t;
  const rootRef = useRef<HTMLElement | null>(null);
  const doingPillRef = useRef<HTMLSpanElement | null>(null);
  const [pulseAlive, setPulseAlive] = useState(false);

  // Pause the DOING pulse when the hero leaves the viewport so we
  // don't burn battery animating off-screen pixels.
  useEffect(() => {
    const el = doingPillRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setPulseAlive(entry.isIntersecting),
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Entrance choreography. Single GSAP timeline; reduced-motion users
  // get an opacity-only fade with no stagger.
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION_QUERY, () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
        tl.set('[data-anim-target]', { autoAlpha: 0 });
        tl.fromTo(
          '[data-anim-target="eyebrow"]',
          { y: 8 },
          { autoAlpha: 1, y: 0, duration: 0.36 },
        );
        tl.fromTo(
          '[data-anim-target="title"]',
          { y: 14 },
          { autoAlpha: 1, y: 0, duration: 0.42 },
          '-=0.18',
        );
        tl.fromTo(
          '[data-anim-target="beat-1"]',
          { y: 24, rotate: -4 },
          { autoAlpha: 1, y: 0, rotate: -1, duration: 0.46 },
          '-=0.2',
        );
        tl.fromTo(
          '[data-anim-target="beat-2"]',
          { y: 28, rotate: 4, scale: 0.92 },
          {
            autoAlpha: 1,
            y: 0,
            rotate: 1,
            scale: 1,
            duration: 0.52,
            ease: 'back.out(1.4)',
          },
          '-=0.32',
        );
        tl.fromTo(
          '[data-anim-target="beat-3"]',
          { y: 24, rotate: -4 },
          { autoAlpha: 1, y: 0, rotate: -0.5, duration: 0.46 },
          '-=0.36',
        );
        tl.fromTo(
          '[data-anim-target="cta"]',
          { y: 16 },
          { autoAlpha: 1, y: 0, duration: 0.32, stagger: 0.08 },
          '-=0.28',
        );
        tl.fromTo(
          '[data-anim-target="standfirst"]',
          { y: 12 },
          { autoAlpha: 1, y: 0, duration: 0.36 },
          '-=0.18',
        );
        tl.fromTo(
          '[data-anim-target="scroll-cue"]',
          { y: -8 },
          { autoAlpha: 1, y: 0, duration: 0.4 },
          '-=0.2',
        );
      });

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('[data-anim-target]', { autoAlpha: 1, y: 0, rotate: 0, scale: 1 });
      });

      return () => mm.kill();
    },
    { scope: rootRef },
  );

  const verbs = cover.headlineLines;
  // Map the three visible beats to TODO / DOING / DONE.
  const beats = [
    { verb: verbs[0] ?? 'תאר.', status: board.status.todo,  cls: 'mp-status--todo'  },
    { verb: verbs[1] ?? 'אבנה.', status: board.status.doing, cls: 'mp-status--doing' },
    { verb: verbs[2] ?? 'תחליט.', status: board.status.done,  cls: 'mp-status--done'  },
  ];

  return (
    <section
      id="top"
      className="mp-hero"
      aria-labelledby="cover-headline"
      ref={rootRef}
    >
      <p className="mp-hero__eyebrow" data-anim-target="eyebrow">
        {cover.issueLine}
      </p>

      {/* The three sticker beats below ARE the visible H1; this
          element exists for screen readers / search engines only. */}
      <h1 id="cover-headline" className="visually-hidden">
        {cover.headlineLines.join(' ')}
      </h1>

      <ol className="mp-hero__stack" aria-hidden="true">
        {beats.map((b, i) => (
          <li key={i} className={`mp-hero__row mp-hero__row--${i + 1}`}>
            <article
              className={`mp-card mp-hero__beat mp-hero__beat--${i + 1}`}
              data-anim-target={`beat-${i + 1}`}
            >
              <span className="mp-hero__verb">{b.verb}</span>
              <span
                className={`mp-status ${b.cls}`}
                ref={i === 1 ? doingPillRef : undefined}
                data-alive={i === 1 ? (pulseAlive ? 'true' : 'false') : undefined}
              >
                {b.status}
              </span>
            </article>
          </li>
        ))}
      </ol>

      <div className="mp-hero__ctas">
        <a
          className="mp-cta mp-cta--primary"
          href={`#${INTAKE_ID}`}
          data-anim-target="cta"
        >
          ✦ {cover.ctaStart}
        </a>
        <a
          className="mp-cta mp-cta--secondary"
          href="#contents"
          data-anim-target="cta"
        >
          {cover.ctaBrowse} ↓
        </a>
      </div>

      <p className="mp-hero__standfirst" data-anim-target="standfirst">
        {cover.standfirst}
      </p>

      <a
        className="mp-hero__scroll-cue"
        href="#contents"
        data-anim-target="scroll-cue"
      >
        {cover.scrollHint}
      </a>
    </section>
  );
}
