import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../lib/gsap';
import { portfolioHeroSlides, type Slide } from '../data/heroSlides';

// Four ink-native transitions, drawn from a Fisher-Yates shuffle bag (see
// `pickNextFx` below) so the order varies and no fx plays twice in a row.
// Each is implemented as a GSAP timeline that tweens either CSS mask stops
// (bloom/brush/tear) or an SVG feDisplacementMap scale (crumple). The old
// reflow → rAF → flip dance is gone: GSAP owns frame scheduling, so there's
// no CSS-transition hazard.
const FX = ['bloom', 'brush', 'tear', 'crumple'] as const;
type Fx = (typeof FX)[number];

// Re-export so existing portfolio imports (boot screen preload) keep working.
export const SLIDES: Slide[] = portfolioHeroSlides;

// Carousel always starts on this slide; the first shuffle bag excludes it.
export const INITIAL_SLIDE_INDEX = 0;

const fisherYatesShuffle = <T,>(input: readonly T[]): T[] => {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

// First shuffle bag for the portfolio, computed once per page load. Both the
// boot screen (for preload prioritisation) and the carousel itself read from
// this so the order images warm in matches the order the user will see them.
// Surfaces that pass a custom `slides` prop compute their own bag.
export const INITIAL_BAG: readonly number[] = fisherYatesShuffle(
  SLIDES.map((_, i) => i).filter((i) => i !== INITIAL_SLIDE_INDEX),
);

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const INITIAL_HOLD_MS = 2500;
const BOOT_COMPLETE_EVENT = 'bar:boot-complete';

// Clear any inline state a previous fx may have left on a slide element.
const resetSlide = (el: HTMLElement) => {
  el.style.removeProperty('--bloom-x');
  el.style.removeProperty('--bloom-y');
  el.style.removeProperty('--bloom-r');
  el.style.removeProperty('--wipe-p');
  el.style.removeProperty('--wipe-a');
  el.style.removeProperty('--tear-p');
  el.style.removeProperty('--tear-a');
  el.style.removeProperty('filter');
  el.style.removeProperty('z-index');
  el.style.removeProperty('opacity');
  delete el.dataset.fx;
};

type HeroSlidesProps = {
  /** Override the slide list. Defaults to the portfolio portraits. */
  slides?: Slide[];
  /** Localized aria-label for the slideshow region. */
  ariaLabel?: string;
  /** Localized labels for the pause / resume button states. */
  pauseLabel?: { paused: string; playing: string };
};

export default function HeroSlides({
  slides: slidesProp,
  ariaLabel = 'Bar Moshe - portrait variations',
  pauseLabel = {
    paused: 'Resume portrait slideshow',
    playing: 'Pause portrait slideshow',
  },
}: HeroSlidesProps = {}) {
  const [slides] = useState<Slide[]>(() => slidesProp ?? SLIDES);
  const [idx, setIdx] = useState(0);
  // Mirrored as React state so the Pause/Play button can render its
  // aria-pressed and label correctly. The ref is still authoritative for
  // synchronous reads inside `schedule()` / `advance()`.
  const [paused, setPaused] = useState(false);
  const idxRef = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstAdvanceDoneRef = useRef(false);
  // Initial shuffle bag. Portfolio default reuses INITIAL_BAG so the boot
  // screen's preload order matches what the carousel renders. Custom slide
  // sets compute a fresh shuffle excluding INITIAL_SLIDE_INDEX.
  const initialBag = useMemo(() => {
    if (!slidesProp) return [...INITIAL_BAG];
    return fisherYatesShuffle(
      slidesProp.map((_, i) => i).filter((i) => i !== INITIAL_SLIDE_INDEX),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const bagRef = useRef<number[]>(initialBag);
  // FX selection mirrors the slide bag: a Fisher-Yates shuffle of the four
  // transitions, refilled when empty. `lastFxRef` lets the refill avoid
  // starting with the fx that just played, so the same fx never plays twice
  // in a row across bag boundaries.
  const fxBagRef = useRef<Fx[]>(fisherYatesShuffle(FX));
  const lastFxRef = useRef<Fx | null>(null);

  const stop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const refillBag = (avoid: number) => {
    const bag: number[] = [];
    for (let i = 0; i < slides.length; i++) {
      if (i !== avoid) bag.push(i);
    }
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j]!, bag[i]!];
    }
    bagRef.current = bag;
  };

  const pickNext = (): number => {
    if (bagRef.current.length === 0) refillBag(idxRef.current);
    return bagRef.current.shift()!;
  };

  const pickNextFx = (): Fx => {
    if (fxBagRef.current.length === 0) {
      const bag = fisherYatesShuffle(FX);
      if (lastFxRef.current && bag[0] === lastFxRef.current && bag.length > 1) {
        const swap = 1 + Math.floor(Math.random() * (bag.length - 1));
        [bag[0], bag[swap]] = [bag[swap]!, bag[0]!];
      }
      fxBagRef.current = bag;
    }
    const fx = fxBagRef.current.shift()!;
    lastFxRef.current = fx;
    return fx;
  };

  const schedule = () => {
    if (pausedRef.current) return;
    if (timerRef.current !== null) return;
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      advance();
    }, rand(2200, 3600));
  };

  const advance = () => {
    const root = rootRef.current;
    if (!root) return;
    if (tlRef.current?.isActive()) return;

    const els = Array.from(root.querySelectorAll<HTMLImageElement>('.slide'));
    if (!els.length) return;

    const prev = idxRef.current;
    const next = pickNext();
    const fx = pickNextFx();

    const outEl = els[prev]!;
    const inEl = els[next]!;
    const motionOk = window.matchMedia(FULL_MOTION_QUERY).matches;

    // Stack incoming slide above outgoing, both fully opaque. The mask/filter
    // on the incoming element is what hides it initially; the timeline then
    // tweens the mask/filter until the full image is revealed.
    gsap.set(outEl, { zIndex: 2, opacity: 1 });
    gsap.set(inEl, { zIndex: 3, opacity: 1 });

    idxRef.current = next;
    setIdx(next);

    if (!motionOk) {
      // Reduced-motion: instant swap, no mask, no filter.
      gsap.set(inEl, { opacity: 1, zIndex: 2, clearProps: 'z-index' });
      gsap.set(outEl, { opacity: 0, zIndex: 1, clearProps: 'z-index' });
      schedule();
      return;
    }

    // Seed the fx-specific starting state. Each fx randomizes whatever knobs
    // it has (center, angle, direction, intensity, duration) so consecutive
    // plays of the same fx don't look identical.
    inEl.dataset.fx = fx;
    let bloomEnd = '170%';
    let bloomDur = 1.05;
    let brushFrom = '-8%';
    let brushTo = '110%';
    let brushDur = 0.9;
    let tearDur = 0.8;
    let crumpleStart = 40;
    let crumpleDur = 1.05;
    if (fx === 'bloom') {
      inEl.style.setProperty('--bloom-x', `${rand(32, 68)}%`);
      inEl.style.setProperty('--bloom-y', `${rand(32, 68)}%`);
      bloomEnd = `${rand(155, 185)}%`;
      bloomDur = rand(0.95, 1.15);
    } else if (fx === 'brush') {
      inEl.style.setProperty('--wipe-a', `${rand(75, 115)}deg`);
      if (Math.random() < 0.5) {
        brushFrom = '110%';
        brushTo = '-8%';
      }
      brushDur = rand(0.85, 1.0);
    } else if (fx === 'tear') {
      inEl.style.setProperty('--tear-a', Math.random() < 0.5 ? '180deg' : '0deg');
      tearDur = rand(0.75, 0.95);
    } else if (fx === 'crumple') {
      crumpleStart = rand(28, 48);
      crumpleDur = rand(0.9, 1.25);
    }

    const feCrumple = document.querySelector<SVGFEDisplacementMapElement>(
      'feDisplacementMap[data-ink-crumple]',
    );

    // Promote .slide layers only while a transition is running. CSS scopes
    // `will-change` to `.mug.is-transitioning .slide` so idle hero doesn't
    // burn GPU memory on four always-composited layers.
    root.classList.add('is-transitioning');

    const tl = gsap.timeline({
      defaults: { ease: 'power3.out' },
      onComplete: () => {
        // Hand the slide off to CSS: outEl is no longer .is-active (React
        // already re-rendered), so clearing inline styles lets it fall back
        // to opacity:0. inEl keeps .is-active, so CSS holds opacity:1.
        resetSlide(outEl);
        resetSlide(inEl);
        if (feCrumple) gsap.set(feCrumple, { attr: { scale: 0 } });
        root.classList.remove('is-transitioning');
        tlRef.current = null;
        schedule();
      },
    });
    tlRef.current = tl;

    if (fx === 'bloom') {
      // Radial ink-blot opens from an off-center point.
      tl.fromTo(
        inEl,
        { '--bloom-r': '0%' },
        { '--bloom-r': bloomEnd, duration: bloomDur, ease: 'power2.out' },
      );
    } else if (fx === 'brush') {
      // Diagonal brush-stroke wipe with a soft trailing edge. Angle and
      // direction jitter; CSS reads `--wipe-a` for the gradient angle.
      tl.fromTo(
        inEl,
        { '--wipe-p': brushFrom },
        { '--wipe-p': brushTo, duration: brushDur, ease: 'power2.inOut' },
      );
    } else if (fx === 'tear') {
      // Paper-tear sweep. CSS reads `--tear-a` so the sweep can run either
      // top→bottom (180deg) or bottom→up (0deg) without rewriting stops.
      tl.fromTo(
        inEl,
        { '--tear-p': '-4%' },
        { '--tear-p': '108%', duration: tearDur, ease: 'power3.inOut' },
      );
    } else if (fx === 'crumple') {
      // Turbulent ink dissolve: displacement scale (jittered) → 0 while
      // opacity 0 → 1. Opacity tween shortened proportionally to duration.
      inEl.style.filter = 'url(#ink-crumple)';
      gsap.set(inEl, { opacity: 0 });
      if (feCrumple) {
        gsap.set(feCrumple, { attr: { scale: crumpleStart } });
        tl.to(feCrumple, { attr: { scale: 0 }, duration: crumpleDur, ease: 'power3.out' }, 0);
      }
      tl.to(inEl, { opacity: 1, duration: crumpleDur * 0.72, ease: 'power2.out' }, 0);
    }
  };

  useEffect(() => {
    let initialTimer: number | null = null;

    const startInitialHold = () => {
      if (firstAdvanceDoneRef.current) return;
      if (initialTimer !== null) return;
      initialTimer = window.setTimeout(() => {
        initialTimer = null;
        firstAdvanceDoneRef.current = true;
        if (!pausedRef.current) advance();
      }, INITIAL_HOLD_MS);
    };

    const alreadyBooted =
      (window as unknown as { __barBooted?: boolean }).__barBooted === true;
    if (alreadyBooted) {
      startInitialHold();
    } else {
      window.addEventListener(BOOT_COMPLETE_EVENT, startInitialHold, { once: true });
    }

    const onVis = () => {
      if (document.hidden) {
        stop();
        if (initialTimer !== null) {
          clearTimeout(initialTimer);
          initialTimer = null;
        }
      } else if (firstAdvanceDoneRef.current) {
        schedule();
      } else if ((window as unknown as { __barBooted?: boolean }).__barBooted) {
        startInitialHold();
      }
    };
    document.addEventListener('visibilitychange', onVis);

    return () => {
      window.removeEventListener(BOOT_COMPLETE_EVENT, startInitialHold);
      document.removeEventListener('visibilitychange', onVis);
      if (initialTimer !== null) clearTimeout(initialTimer);
      stop();
      tlRef.current?.kill();
      tlRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onMouseEnter = () => {
    if (paused) return;
    pausedRef.current = true;
    stop();
  };
  const onMouseLeave = () => {
    if (paused) return;
    pausedRef.current = false;
    if (firstAdvanceDoneRef.current) schedule();
  };

  // Keyboard-accessible Pause/Play (WCAG 2.2.2 Pause-Stop-Hide). Hover-pause
  // is a pointer affordance only; this button is what makes the auto-cycle
  // operable for keyboard, switch, and voice-control users. While `paused`
  // is true the button stays sticky-on regardless of pointer state.
  const togglePause = () => {
    setPaused((cur) => {
      const next = !cur;
      pausedRef.current = next;
      if (next) {
        stop();
      } else if (firstAdvanceDoneRef.current) {
        schedule();
      }
      return next;
    });
  };

  const base = import.meta.env.BASE_URL;

  return (
    <div
      className="mug"
      id="heroSlides"
      ref={rootRef}
      aria-label={ariaLabel}
      aria-roledescription="Auto-cycling slideshow"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {slides.map((s, i) => {
        const isActive = i === idx;
        return (
          <img
            key={s.src}
            className={`slide${isActive ? ' is-active' : ''}`}
            src={`${base}${s.src}`}
            alt={s.alt}
            data-caption={s.caption}
          />
        );
      })}
      <button
        type="button"
        className="mug-pause"
        aria-pressed={paused}
        aria-label={paused ? pauseLabel.paused : pauseLabel.playing}
        title={paused ? pauseLabel.paused : pauseLabel.playing}
        onClick={togglePause}
      >
        {paused ? '▶' : '❚❚'}
      </button>
    </div>
  );
}

// Keep Fx exported in case a future surface (e.g. a manual fx picker) needs it.
export type { Fx };
