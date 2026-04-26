import { useEffect, useMemo, useRef, useState } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../lib/gsap';
import { portfolioHeroSlides, type Slide } from '../data/heroSlides';

// Four ink-native transitions, cycled round-robin. Each is implemented as a
// GSAP timeline that tweens either CSS mask stops (bloom/brush/tear) or an
// SVG feDisplacementMap scale (crumple). The old reflow → rAF → flip dance
// is gone: GSAP owns frame scheduling, so there's no CSS-transition hazard.
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
  el.style.removeProperty('--tear-p');
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
  const fxCounter = useRef(0);
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

  const schedule = () => {
    if (pausedRef.current) return;
    if (timerRef.current !== null) return;
    const maxMs = Math.min(2000 + fxCounter.current * 160, 4000);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      advance();
    }, rand(1200, maxMs));
  };

  const advance = () => {
    const root = rootRef.current;
    if (!root) return;
    if (tlRef.current?.isActive()) return;

    const els = Array.from(root.querySelectorAll<HTMLImageElement>('.slide'));
    if (!els.length) return;

    const prev = idxRef.current;
    const next = pickNext();
    const fx = FX[fxCounter.current % FX.length]!;
    fxCounter.current += 1;

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

    // Seed the fx-specific starting state.
    inEl.dataset.fx = fx;
    if (fx === 'bloom') {
      inEl.style.setProperty('--bloom-x', `${rand(32, 68)}%`);
      inEl.style.setProperty('--bloom-y', `${rand(32, 68)}%`);
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
        { '--bloom-r': '170%', duration: 1.05, ease: 'power2.out' },
      );
    } else if (fx === 'brush') {
      // Diagonal brush-stroke wipe with a soft trailing edge.
      tl.fromTo(
        inEl,
        { '--wipe-p': '-8%' },
        { '--wipe-p': '110%', duration: 0.9, ease: 'power2.inOut' },
      );
    } else if (fx === 'tear') {
      // Paper-tear sweep top-to-bottom. Short duration, firmer easing.
      tl.fromTo(
        inEl,
        { '--tear-p': '-4%' },
        { '--tear-p': '108%', duration: 0.8, ease: 'power3.inOut' },
      );
    } else if (fx === 'crumple') {
      // Turbulent ink dissolve: displacement scale 40 → 0 while opacity 0 → 1.
      inEl.style.filter = 'url(#ink-crumple)';
      gsap.set(inEl, { opacity: 0 });
      if (feCrumple) {
        gsap.set(feCrumple, { attr: { scale: 40 } });
        tl.to(feCrumple, { attr: { scale: 0 }, duration: 1.05, ease: 'power3.out' }, 0);
      }
      tl.to(inEl, { opacity: 1, duration: 0.75, ease: 'power2.out' }, 0);
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
