/**
 * Subtle paper-grain noise overlay. SVG fractal noise rendered once,
 * mixed at low opacity over the page to give a printed-paper feel.
 * Pure SVG filter - no raster asset, no bundle cost beyond ~400 bytes.
 */
export default function PaperGrain() {
  return (
    <svg
      className="mp-grain"
      aria-hidden="true"
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <filter id="mp-grain-filter">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.9"
          numOctaves="2"
          stitchTiles="stitch"
        />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0 0
                  0 0 0 0.55 0"
        />
      </filter>
      <rect width="100%" height="100%" filter="url(#mp-grain-filter)" />
    </svg>
  );
}
