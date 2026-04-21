// Shared SVG <defs> mounted once at the root.
//
// Two filter families live here:
//   #ink-blob                       goo filter used by the InkCursor so the
//                                   trailing dots merge into one liquid shape.
//   #ink-bleed-<id> (×N)            turbulence + displacement filters used by
//                                   section headings, the boot screen, and the
//                                   handwriting timeline. The feDisplacementMap
//                                   `scale` attribute is the tween target - each
//                                   filter gets its own id so multiple headings
//                                   can animate independently (see best-practice
//                                   rule 11 in the plan).

const BLEED_IDS = [
  'dossier',
  'story',
  'experience',
  'repos',
  'music',
  'notes',
  'letter',
  'boot',
  'timeline',
] as const;

export type InkBleedId = (typeof BLEED_IDS)[number];

export const inkBleedUrl = (id: InkBleedId) => `url(#ink-bleed-${id})`;

export default function InkDefs() {
  return (
    <svg
      aria-hidden="true"
      width="0"
      height="0"
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }}
    >
      <defs>
        {/* Goo filter: merges overlapping shapes (cursor blob + nib + splash) */}
        <filter id="ink-blob" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="
              1 0 0 0 0
              0 1 0 0 0
              0 0 1 0 0
              0 0 0 22 -11"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>

        {/* One ink-bleed filter per target. Each gets its own seed so the
            turbulence pattern doesn't repeat across adjacent elements. */}
        {BLEED_IDS.map((id, i) => (
          <filter
            key={id}
            id={`ink-bleed-${id}`}
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.05"
              numOctaves="1"
              seed={i + 1}
              result="turb"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="turb"
              scale="0"
              xChannelSelector="R"
              yChannelSelector="G"
              data-ink-bleed={id}
            />
          </filter>
        ))}
      </defs>
    </svg>
  );
}
