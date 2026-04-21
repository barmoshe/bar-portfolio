// Static paper-grain overlay. The .grain wrapper lives fixed over the page;
// inside, an inline SVG applies a fractalNoise filter to a rectangle. The
// turbulence used to loop between two baseFrequency values so the paper felt
// like it was still drying, but that tween runs the entire page lifetime and
// is CPU-bound (SVG filters re-render every frame), so we now paint the grain
// once and leave it. The Boot entrance still tweens the same feTurbulence
// (data-grain="wash") for a one-shot wash on load.
export default function Grain() {
  return (
    <div className="grain" aria-hidden="true">
      <svg xmlns="http://www.w3.org/2000/svg">
        <filter id="grain-filter">
          <feTurbulence
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
