import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

type Slide = { src: string; alt: string; caption: string };

const FX = ['fade', 'iris', 'wipe', 'skew', 'blinds'] as const;
type Fx = (typeof FX)[number];

const SLIDES: Slide[] = [
  { src: 'portraits/img0.png', alt: 'Bar Moshe - painting', caption: 'oil · painted' },
  { src: 'portraits/img1.png', alt: 'Bar Moshe - sketch', caption: 'pencil · notebook' },
  { src: 'portraits/img2.png', alt: 'Bar Moshe - photo', caption: 'photo' },
  { src: 'portraits/img3.png', alt: 'Bar Moshe - cubist', caption: 'cubist · study' },
  { src: 'portraits/img4.png', alt: 'Bar Moshe - 3d', caption: '3d · render' },
  { src: 'portraits/img5.png', alt: 'Bar Moshe - ink watercolor', caption: 'ink · watercolor' },
  { src: 'portraits/img6.png', alt: 'Bar Moshe - cyberpunk', caption: 'cyberpunk · halftone' },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const shuffleRest = (list: Slide[]): Slide[] => {
  const [first, ...rest] = list;
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  return [first!, ...rest];
};

export default function HeroSlides() {
  const [slides] = useState<Slide[]>(() => shuffleRest(SLIDES));
  const [idx, setIdx] = useState(0);
  const [enteringFrom, setEnteringFrom] = useState<number | null>(null);
  const [fxByIdx, setFxByIdx] = useState<Record<number, Fx>>({ 0: 'fade' });
  const fxCounter = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const captionRef = useRef<HTMLSpanElement | null>(null);
  const dotsRef = useRef<HTMLDivElement | null>(null);

  const stop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = () => {
    setIdx((cur) => {
      const next = (cur + 1) % slides.length;
      const fx = FX[fxCounter.current % FX.length]!;
      fxCounter.current += 1;
      setFxByIdx((prev) => ({ ...prev, [next]: fx }));
      setEnteringFrom(cur);
      return next;
    });
  };

  const schedule = () => {
    if (pausedRef.current) return;
    if (timerRef.current !== null) return;
    const maxMs = Math.min(4000 + fxCounter.current * 250, 7000);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      advance();
    }, rand(2000, maxMs));
  };

  useEffect(() => {
    schedule();
    const onVis = () => {
      if (document.hidden) stop();
      else schedule();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => {
      document.removeEventListener('visibilitychange', onVis);
      stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /**
   * Fragile fx cycle — do not "simplify".
   *
   * Three critical steps, every one required:
   *   1. `void el.offsetHeight`  — forces a synchronous reflow so `.is-enter`
   *      styles land before step 3 flips to `.is-active`. Skip this and the
   *      browser coalesces both class changes in a single recompute; no
   *      transition plays.
   *   2. `requestAnimationFrame` — defers step 3 to the next paint. Skip this
   *      and we're still in the same frame as the state commit; same result.
   *   3. `setEnteringFrom(null)` — removes `.is-enter`, sets `.is-active` on
   *      the new slide. CSS transitions from enter → active state now play.
   *
   * Alternatives that have been tried and break at least one of the five fx:
   *   - plain setState in the event handler
   *   - Promise.resolve().then(...)
   *   - setTimeout(..., 0)
   *   - React.useTransition
   *
   * See `knowledge/04-animation.md` and `knowledge/99-caveats.md`.
   */
  useLayoutEffect(() => {
    if (enteringFrom === null) return;
    const el = rootRef.current?.querySelectorAll<HTMLElement>('.slide')[idx];
    if (el) void el.offsetHeight;
    const raf = requestAnimationFrame(() => {
      setEnteringFrom(null);
      schedule();
    });
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enteringFrom, idx]);

  // Caption flip + dot pop on slide change.
  useGSAP(
    () => {
      const cap = captionRef.current;
      if (!cap) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          cap,
          { yPercent: 120, opacity: 0, rotate: -3 },
          { yPercent: 0, opacity: 1, rotate: 0, duration: 0.55, ease: 'back.out(2)' },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [idx], scope: rootRef },
  );

  useGSAP(
    () => {
      const dots = dotsRef.current;
      if (!dots) return;
      const active = dots.querySelector<HTMLElement>(`[data-i="${idx}"]`);
      if (!active) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.fromTo(
          active,
          { scale: 0.6 },
          { scale: 1.35, duration: 0.4, ease: 'back.out(2.5)' },
        );
      });
      return () => mm.revert();
    },
    { dependencies: [idx], scope: rootRef },
  );

  // Subtle mouse parallax on the portrait stack.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION_QUERY} and (hover: hover)`, () => {
        const xTo = gsap.quickTo(root, '--tilt-x', { duration: 0.5, ease: 'power3.out' });
        const yTo = gsap.quickTo(root, '--tilt-y', { duration: 0.5, ease: 'power3.out' });
        gsap.set(root, { '--tilt-x': 0, '--tilt-y': 0 });

        // Counter-parallax on the caption card: inverted sign, 0.2× magnitude.
        // Reads the current caption node each move since the node re-keys on
        // slide change, so quickTo is rebuilt per-move rather than cached.
        const cap = captionRef.current;
        const capX = cap
          ? gsap.quickTo(cap, 'x', { duration: 0.6, ease: 'power3.out' })
          : null;
        const capY = cap
          ? gsap.quickTo(cap, 'y', { duration: 0.6, ease: 'power3.out' })
          : null;

        const onMove = (e: MouseEvent) => {
          const r = root.getBoundingClientRect();
          const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
          const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
          xTo(nx * 6);
          yTo(ny * 6);
          capX?.(-nx * 1.2);
          capY?.(-ny * 1.2);
        };
        const onLeave = () => {
          xTo(0);
          yTo(0);
          capX?.(0);
          capY?.(0);
        };
        root.addEventListener('mousemove', onMove);
        root.addEventListener('mouseleave', onLeave);
        return () => {
          root.removeEventListener('mousemove', onMove);
          root.removeEventListener('mouseleave', onLeave);
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  const onMouseEnter = () => {
    pausedRef.current = true;
    stop();
  };
  const onMouseLeave = () => {
    pausedRef.current = false;
    schedule();
  };

  const base = import.meta.env.BASE_URL;
  const currentCaption = slides[idx]?.caption ?? '';

  return (
    <div
      className="mug"
      id="heroSlides"
      ref={rootRef}
      aria-label="Bar Moshe - portrait variations"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      style={{
        transform:
          'translate3d(calc(var(--tilt-x, 0) * 1px), calc(var(--tilt-y, 0) * 1px), 0)',
      }}
    >
      {slides.map((s, i) => {
        const isActive = enteringFrom !== null ? i === enteringFrom : i === idx;
        const isEnter = enteringFrom !== null && i === idx;
        const cls = `slide${isActive ? ' is-active' : ''}${isEnter ? ' is-enter' : ''}`;
        const fx = fxByIdx[i];
        return (
          <img
            key={s.src}
            className={cls}
            src={`${base}${s.src}`}
            alt={s.alt}
            data-caption={s.caption}
            {...(fx && (isActive || isEnter) ? { 'data-fx': fx } : {})}
          />
        );
      })}
      <span className="slide-caption" key={currentCaption} ref={captionRef}>
        {currentCaption}
      </span>
      <div className="slide-dots" ref={dotsRef} aria-hidden="true">
        {slides.map((_, i) => (
          <button
            key={i}
            type="button"
            data-i={i}
            aria-current={i === idx ? 'true' : undefined}
            tabIndex={-1}
          />
        ))}
      </div>
    </div>
  );
}
