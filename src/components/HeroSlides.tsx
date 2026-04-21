import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Slide = { src: string; alt: string; caption: string };

const FX = ['fade', 'iris', 'wipe', 'skew', 'blinds'] as const;
type Fx = (typeof FX)[number];

const SLIDES: Slide[] = [
  { src: 'portraits/img0.png', alt: 'Bar Moshe - painting', caption: 'oil · painted' },
  { src: 'portraits/img1.png', alt: 'Bar Moshe - sketch', caption: 'pencil · notebook' },
  { src: 'portraits/img2.png', alt: 'Bar Moshe - photo', caption: 'photo' },
  { src: 'portraits/img3.png', alt: 'Bar Moshe - cubist', caption: 'cubist · study' },
  { src: 'portraits/img4.png', alt: 'Bar Moshe - 3d', caption: '3d · render' },
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

export default function HeroSlides() {
  // idx = the slide that should be active once the transition settles.
  // enteringFrom = the previously-active slide during the transition (it keeps
  // `is-active` so both slides are stacked visually until the next frame).
  const [idx, setIdx] = useState(0);
  const [enteringFrom, setEnteringFrom] = useState<number | null>(null);
  const [fxByIdx, setFxByIdx] = useState<Record<number, Fx>>({ 0: 'fade' });
  const fxCounter = useRef(0);
  const pausedRef = useRef(false);
  const timerRef = useRef<number | null>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  const stop = () => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const advance = () => {
    setIdx((cur) => {
      const next = (cur + 1) % SLIDES.length;
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
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      advance();
    }, rand(3000, 10000));
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

  // Enter transition: force reflow with is-enter committed, then flip to is-active
  // on the next frame by clearing enteringFrom.
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

  const onMouseEnter = () => {
    pausedRef.current = true;
    stop();
  };
  const onMouseLeave = () => {
    pausedRef.current = false;
    schedule();
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
      {SLIDES.map((s, i) => {
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
    </div>
  );
}
