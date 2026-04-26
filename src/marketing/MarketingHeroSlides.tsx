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

const pickNext = (current: number, total: number): number => {
  if (total < 2) return 0;
  let next = current;
  while (next === current) next = Math.floor(Math.random() * total);
  return next;
};

const randInterval = () => MIN_MS + Math.random() * (MAX_MS - MIN_MS);

export default function MarketingHeroSlides() {
  const slides = marketingHeroSlides;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => { pausedRef.current = paused; }, [paused]);

  useEffect(() => {
    if (slides.length < 2) return;
    const reduced = matchMedia(PREFERS_REDUCED);
    if (reduced.matches) return;

    const tick = () => {
      if (pausedRef.current) {
        timerRef.current = window.setTimeout(tick, 600);
        return;
      }
      setActive((cur) => pickNext(cur, slides.length));
      timerRef.current = window.setTimeout(tick, randInterval());
    };
    timerRef.current = window.setTimeout(tick, randInterval());

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [slides.length]);

  const base = import.meta.env.BASE_URL;

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
