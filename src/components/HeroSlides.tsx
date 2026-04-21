import { useEffect, useRef, useState } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../lib/gsap';

type Slide = { src: string; alt: string; caption: string };

// Four ink-native transitions, cycled round-robin. Each is implemented as a
// GSAP timeline that tweens either CSS mask stops (bloom/brush/tear) or an
// SVG feDisplacementMap scale (crumple). The old reflow → rAF → flip dance
// is gone: GSAP owns frame scheduling, so there's no CSS-transition hazard.
const FX = ['bloom', 'brush', 'tear', 'crumple'] as const;
type Fx = (typeof FX)[number];

const SLIDES: Slide[] = [
  { src: 'portraits/img0.png', alt: 'Bar Moshe - painting', caption: 'oil · painted' },
  { src: 'portraits/img1.png', alt: 'Bar Moshe - sketch', caption: 'pencil · notebook' },
  { src: 'portraits/img2.png', alt: 'Bar Moshe - photo', caption: 'photo' },
  { src: 'portraits/img3.png', alt: 'Bar Moshe - cubist', caption: 'cubist · study' },
  { src: 'portraits/img4.png', alt: 'Bar Moshe - 3d', caption: '3d · render' },
  { src: 'portraits/img5.png', alt: 'Bar Moshe - ink watercolor', caption: 'ink · watercolor' },
  { src: 'portraits/img6.png', alt: 'Bar Moshe - cyberpunk', caption: 'cyberpunk · halftone' },
  { src: 'portraits/img7.png', alt: 'Bar Moshe - cartoon', caption: 'cartoon · ubisoft' },
  { src: 'portraits/img8.png', alt: 'Bar Moshe - pop art', caption: 'pop · neon' },
  { src: 'portraits/img9.png', alt: 'Bar Moshe - cubist painted', caption: 'cubist · painted' },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

const INITIAL_HOLD_MS = 4000;
const BOOT_COMPLETE_EVENT = 'bar:boot-complete';

const shuffleRest = (list: Slide[]): Slide[] => {
  const [first, ...rest] = list;
  for (let i = rest.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [rest[i], rest[j]] = [rest[j]!, rest[i]!];
  }
  return [first!, ...rest];
};

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

export default function HeroSlides() {
  const [slides] = useState<Slide[]>(() => shuffleRest(SLIDES));
  const [idx, setIdx] = useState(0);
  const idxRef = useRef(0);
  const fxCounter = useRef(0);
  const naturalIdxRef = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const firstAdvanceDoneRef = useRef(false);

  const stop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const img0Idx = slides.findIndex((s) => s.src === 'portraits/img0.png');

  const schedule = () => {
    if (pausedRef.current) return;
    if (timerRef.current !== null) return;
    const maxMs = Math.min(2500 + fxCounter.current * 200, 5000);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      advance();
    }, rand(1500, maxMs));
  };

  const advance = () => {
    const root = rootRef.current;
    if (!root) return;
    if (tlRef.current?.isActive()) return;

    const els = Array.from(root.querySelectorAll<HTMLImageElement>('.slide'));
    if (!els.length) return;

    const prev = idxRef.current;
    // Every 5th transition forces img0 back in; other transitions advance
    // `naturalIdxRef` around the rest of the shuffle, skipping img0 so the
    // forced resurface stays meaningful.
    const changeNum = fxCounter.current + 1;
    const forceImg0 = img0Idx >= 0 && changeNum % 5 === 0;
    if (!forceImg0) {
      let np = (naturalIdxRef.current + 1) % slides.length;
      if (np === img0Idx) np = (np + 1) % slides.length;
      naturalIdxRef.current = np;
    }
    const next = forceImg0 ? img0Idx : naturalIdxRef.current;
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
    pausedRef.current = true;
    stop();
  };
  const onMouseLeave = () => {
    pausedRef.current = false;
    if (firstAdvanceDoneRef.current) schedule();
  };

  const base = import.meta.env.BASE_URL;

  return (
    <div
      className="mug"
      id="heroSlides"
      ref={rootRef}
      aria-label="Bar Moshe - portrait variations"
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
    </div>
  );
}

// Keep Fx exported in case a future surface (e.g. a manual fx picker) needs it.
export type { Fx };
