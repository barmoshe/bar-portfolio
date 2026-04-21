import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

// Breathing grain overlay. The .grain wrapper lives fixed over the page;
// inside, an inline SVG applies a fractalNoise filter to a rectangle and GSAP
// loops the baseFrequency between two values over 8s so the paper texture
// feels like it's still drying. Reduced-motion freezes the texture.
export default function Grain() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const feTurbRef = useRef<SVGFETurbulenceElement | null>(null);

  useGSAP(
    () => {
      const fe = feTurbRef.current;
      if (!fe) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        gsap.to(fe, {
          attr: { baseFrequency: '0.92 0.92' },
          duration: 8,
          ease: 'sine.inOut',
          yoyo: true,
          repeat: -1,
        });
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
            type="fractalNoise"
            baseFrequency="0.9 0.9"
            numOctaves="2"
            stitchTiles="stitch"
          />
          <feColorMatrix
            type="matrix"
            values="
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0 0
              0 0 0 0.9 0"
          />
        </filter>
        <rect width="100%" height="100%" filter="url(#grain-filter)" />
      </svg>
    </div>
  );
}
