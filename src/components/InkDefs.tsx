// Shared SVG <defs> mounted once at the root.
//
// Filter family:
//   #ink-bleed-<id> (×N)            turbulence + displacement filters used by
//                                   section headings, the boot screen, and the
//                                   handwriting timeline. The feDisplacementMap
//                                   `scale` attribute is the tween target - each
//                                   filter gets its own id so multiple headings
//                                   can animate independently (see best-practice
//                                   rule 11 in the plan).

const BLEED_IDS = [
  'intro',
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
        {/* Crumple filter: HeroSlides uses this during the "crumple" fx.
            Only one slide animates it at a time (advance() serializes), so a
            single shared instance is safe. */}
        <filter
          id="ink-crumple"
          x="-20%"
          y="-20%"
          width="140%"
          height="140%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015 0.022"
            numOctaves="1"
            seed="11"
            result="turb"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="0"
            xChannelSelector="R"
            yChannelSelector="G"
            data-ink-crumple="true"
          />
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
