import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

// Breathing grain overlay. The .grain wrapper lives fixed over the page;
// inside, an inline SVG applies a fractalNoise filter to a rectangle and GSAP
// loops the baseFrequency between two values so the paper texture feels like
// it's still drying. SVG filters are CPU-bound, so the loop is deliberately
// slow and pauses while the tab is hidden. Reduced-motion freezes it entirely.
export default function Grain() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const feTurbRef = useRef<SVGFETurbulenceElement | null>(null);

  useGSAP(
    () => {
      const fe = feTurbRef.current;
      if (!fe) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        // Delay the infinite yoyo so the Boot entrance can run a one-shot
        // grain "wash" (baseFrequency 1.4 → 0.9) without fighting this loop.
        const tween = gsap.to(fe, {
          attr: { baseFrequency: '0.92 0.92' },
          duration: 16,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
          delay: 1.1,
        });
        const onVis = () => {
          if (document.hidden) tween.pause();
          else tween.play();
        };
        document.addEventListener('visibilitychange', onVis);
        return () => {
          document.removeEventListener('visibilitychange', onVis);
          tween.kill();
        };
      });
      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div className="grain" aria-hidden="true" ref={rootRef}>
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence
            ref={feTurbRef}
            data-grain="wash"
            type="fractalNoise"
            baseFrequency="0.9 0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0.2
              0 0 0 0 0.15
              0 0 0 0 0.1
              0 0 0 0.35 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
