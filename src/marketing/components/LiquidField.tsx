import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../../lib/gsap';

/**
 * The full-viewport gooey color field. 4 blurred radial-gradient
 * blobs translate continuously in long looping arcs; the parent
 * `.ld-field` applies `filter: blur() contrast()` which fuses the
 * soft circles into one liquid mass with crisp meeting edges.
 *
 * Colors are driven by `--rs-blob-1..4` CSS vars on the root —
 * SectionZone crossfades those vars when a section enters view.
 * GPU-cheap: only `transform` is animated. Falls back to a static
 * field under prefers-reduced-motion.
 */
export default function LiquidField() {
  const root = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (!matchMedia(FULL_MOTION_QUERY).matches) return;
      const blobs = root.current?.querySelectorAll<HTMLElement>('.ld-blob');
      if (!blobs?.length) return;

      // Each blob travels its own long looping arc. The recipes
      // are tuned so the four phases never align — the merged
      // mass keeps reshaping rather than pulsing in sync.
      const recipes = [
        { dx: '14vw',  dy: '12vh',  dur: 38, rot:  6 },
        { dx: '-18vw', dy: '8vh',   dur: 44, rot: -8 },
        { dx: '10vw',  dy: '-14vh', dur: 50, rot:  5 },
        { dx: '-12vw', dy: '-10vh', dur: 46, rot: -7 },
      ];

      blobs.forEach((blob, i) => {
        const r = recipes[i % recipes.length];
        gsap.to(blob, {
          x: r.dx,
          y: r.dy,
          rotation: r.rot,
          duration: r.dur,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: root },
  );

  return (
    <div className="ld-field" aria-hidden="true" ref={root}>
      <div className="ld-blob ld-blob--1" />
      <div className="ld-blob ld-blob--2" />
      <div className="ld-blob ld-blob--3" />
      <div className="ld-blob ld-blob--4" />
    </div>
  );
}
