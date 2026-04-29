import { useEffect, useRef, useState } from 'react';
import { marketingHeroSlides } from '../data/marketingHeroSlides';

/**
 * Marketing hero slideshow. Distinct from the portfolio's HeroSlides:
 * fast random cadence (1-2s), simple opacity crossfade, no GSAP, no
 * ink transitions. The pause button is visually hidden but stays in
 * the DOM and reachable via Tab so WCAG 2.2.2 (Pause/Stop/Hide for
 * moving content) is still met for keyboard + screen-reader users.
 */

const MIN_MS = 1000;
const MAX_MS = 2000;
const FADE_MS = 450;
const PREFERS_REDUCED = '(prefers-reduced-motion: reduce)';

const fisherYatesShuffle = <T,>(input: readonly T[]): T[] => {
  const out = input.slice();
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j]!, out[i]!];
  }
  return out;
};

// Build a fresh shuffle of all slide indices except `avoid`, so the next
// pick is never the slide that's already on screen. Once the bag empties,
// the caller refills it — this guarantees every image appears once before
// any repeat.
const refillBag = (total: number, avoid: number): number[] => {
  const indices: number[] = [];
  for (let i = 0; i < total; i++) {
    if (i !== avoid) indices.push(i);
  }
  return fisherYatesShuffle(indices);
};

const randInterval = () => MIN_MS + Math.random() * (MAX_MS - MIN_MS);

export default function MarketingHeroSlides() {
  const slides = marketingHeroSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const bagRef = useRef<number[]>([]);
  // Frozen at mount to keep hook order stable across resize.
  const [isDesktop] = useState(
    () => typeof window !== 'undefined' && matchMedia('(min-width: 821px)').matches
  );

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    if (!isDesktop) return;
    if (slides.length < 2) return;
    const reduced = matchMedia(PREFERS_REDUCED);
    if (reduced.matches) return;

    const tick = () => {
      if (pausedRef.current) {
        timerRef.current = window.setTimeout(tick, 600);
        return;
      }
      setActive((cur) => {
        if (bagRef.current.length === 0) bagRef.current = refillBag(slides.length, cur);
        return bagRef.current.shift()!;
      });
      timerRef.current = window.setTimeout(tick, randInterval());
    };
    timerRef.current = window.setTimeout(tick, randInterval());

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slides.length, isDesktop]);

  const base = import.meta.env.BASE_URL;

  if (!isDesktop) {
    const first = slides[0];
    return (
      <div className="mp-slides mp-slides--static">
        <img
          className="mp-slide is-active"
          src={`${base}${first.src}`}
          alt={first.alt}
          loading="eager"
          decoding="async"
        />
      </div>
    );
  }

  return (
    <div
      className="mp-slides"
      aria-label="בר משה - דיוקנים"
      aria-roledescription="סלייד-שואו אוטומטי"
      aria-live="off"
    >
      {slides.map((s, i) => (
        <img
          key={s.src}
          className={`mp-slide${i === active ? ' is-active' : ''}`}
          src={`${base}${s.src}`}
          alt={s.alt}
          loading={i === 0 ? 'eager' : 'lazy'}
          decoding="async"
          style={{ transitionDuration: `${FADE_MS}ms` }}
        />
      ))}
      <button
        type="button"
        className="mp-slides__pause"
        aria-pressed={paused}
        aria-label={paused ? 'הפעל מחדש את סלייד-שואו הדיוקנים' : 'השהה את סלייד-שואו הדיוקנים'}
        title={paused ? 'הפעל סלייד-שואו' : 'השהה סלייד-שואו'}
        onClick={() => setPaused((p) => !p)}
      >
        {paused ? '▶' : '❚❚'}
      </button>
    </div>
  );
}
