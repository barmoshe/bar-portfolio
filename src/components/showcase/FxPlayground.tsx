import { useLayoutEffect, useRef, useState } from 'react';

/**
 * A miniature reproduction of the `HeroSlides` fx cycle - two slides, same
 * `.slide` / `.is-enter` / `.is-active` class contract as in styles.css. Lets
 * you trigger each of the five transitions in isolation for inspection.
 *
 * Intentionally reuses the same `void el.offsetHeight` + RAF pattern as
 * HeroSlides so any CSS change meant for production transitions also lands
 * here. See `knowledge/04-animation.md`.
 */

const FX = ['fade', 'iris', 'wipe', 'skew', 'blinds'] as const;
type Fx = (typeof FX)[number];

const SLIDES = [
  { src: 'portraits/img0.png', alt: 'Slide A' },
  { src: 'portraits/img1.png', alt: 'Slide B' },
];

export default function FxPlayground() {
  const base = import.meta.env.BASE_URL;
  const [idx, setIdx] = useState(0);
  const [enteringFrom, setEnteringFrom] = useState<number | null>(null);
  const [fx, setFx] = useState<Fx>('fade');
  const rootRef = useRef<HTMLDivElement | null>(null);

  const play = (selectedFx: Fx) => {
    setFx(selectedFx);
    setEnteringFrom(idx);
    setIdx((i) => 1 - i);
  };

  useLayoutEffect(() => {
    if (enteringFrom === null) return;
    const el = rootRef.current?.querySelectorAll<HTMLElement>('.slide')[idx];
    if (el) void el.offsetHeight;
    const raf = requestAnimationFrame(() => setEnteringFrom(null));
    return () => cancelAnimationFrame(raf);
  }, [enteringFrom, idx]);

  return (
    <div
      style={{
        background: 'var(--surface-1)',
        color: 'var(--ink)',
        padding: 20,
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--display)' }}>Fx playground</h3>
      <div
        className="mug"
        ref={rootRef}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 360,
          aspectRatio: '3 / 4',
          margin: '0 auto 16px',
          overflow: 'hidden',
          borderRadius: 8,
          background: 'var(--paper-2)',
        }}
      >
        {SLIDES.map((s, i) => {
          const isActive = enteringFrom !== null ? i === enteringFrom : i === idx;
          const isEnter = enteringFrom !== null && i === idx;
          const cls = `slide${isActive ? ' is-active' : ''}${isEnter ? ' is-enter' : ''}`;
          return (
            <img
              key={s.src}
              className={cls}
              src={`${base}${s.src}`}
              alt={s.alt}
              {...(isActive || isEnter ? { 'data-fx': fx } : {})}
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
            />
          );
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
        {FX.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => play(f)}
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 12,
              padding: '6px 12px',
              background: f === fx ? 'var(--ink)' : 'transparent',
              color: f === fx ? 'var(--paper)' : 'var(--ink)',
              border: '1px solid var(--border)',
              borderRadius: 6,
              cursor: 'pointer',
            }}
          >
            {f}
          </button>
        ))}
      </div>
    </div>
  );
}
