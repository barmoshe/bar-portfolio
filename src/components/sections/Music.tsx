import { useRef, useState, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { attachInkBleed } from '../../lib/inkBleed';
import { inkBleedUrl } from '../InkDefs';

type Track = {
  n: string;
  side: 'A' | 'B';
  tag: string;
  title: string;
  body: string;
  tags: string;
};

// Placeholder tracks. These describe the *kind* of music-tech and
// game-audio work I get pulled into — hackathons, game jams, granular
// experiments — but the titles, years, and credits are stand-ins until
// the real inventory is wired up.
const TRACKS: Track[] = [
  {
    n: 'A1',
    side: 'A',
    tag: 'Global Game Jam · 2026',
    title: 'Mask Theme — adaptive score.',
    body:
      'Unity + FMOD layered score that ducks and crests with the player state. Vertical layers, horizontal cues, one 48-hour weekend.',
    tags: '#ggj   #fmod   #unity   #adaptive',
  },
  {
    n: 'A2',
    side: 'A',
    tag: 'Global Game Jam · 2025',
    title: 'Roots — chiptune SFX suite.',
    body:
      'A rack of square-wave SFX and a looping 8-bit bed for a two-button platformer. Squeezed into ~12 KB of sound payload.',
    tags: '#ggj   #chiptune   #webaudio',
  },
  {
    n: 'A3',
    side: 'A',
    tag: 'Music Hack Day · TLV',
    title: 'Generative Bazaar — web-audio station.',
    body:
      'Marketplace-themed generative composer. Scales chosen by city, drum patterns by temperature. Built on Tone.js in a single night.',
    tags: '#hackathon   #tonejs   #generative',
  },
  {
    n: 'B1',
    side: 'B',
    tag: 'Self-directed',
    title: 'Cosmic Synth — 3D browser synthesizer.',
    body:
      'A WebGL galaxy that doubles as a performance surface. Stars are oscillators; nebulas are reverb zones. Specced via a Claude skill.',
    tags: '#webaudio   #webgl   #synth',
  },
  {
    n: 'B2',
    side: 'B',
    tag: 'Research · 2024',
    title: 'Phrase Partner — ML melody sketchpad.',
    body:
      'A Magenta-backed notebook that riffs back at you. You play four bars, it extends eight, and marks what it borrowed from you.',
    tags: '#magenta   #midi   #ml',
  },
  {
    n: 'B3',
    side: 'B',
    tag: 'Patch · 2023',
    title: 'Grainfield — SuperCollider grain cloud.',
    body:
      'A granular patch that samples room tone and rebuilds it as a slow harmonic field. Patched live, recorded to a single tape loop.',
    tags: '#supercollider   #granular   #drone',
  },
];

const stageStyle: CSSProperties = { marginTop: 36 };

const linerIntro: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--serif)',
  color: 'var(--ink-soft)',
  lineHeight: 1.65,
  fontSize: 'clamp(1rem, 1.3vw, 1.08rem)',
};

const cueList: CSSProperties = {
  margin: '18px 0 0',
  padding: 0,
  listStyle: 'none',
  display: 'grid',
  gap: 6,
  fontFamily: 'var(--mono)',
  fontSize: 12,
  letterSpacing: '.08em',
  color: 'var(--ink-soft)',
};

const cueItem: CSSProperties = {
  display: 'flex',
  gap: 10,
  alignItems: 'baseline',
};

const cueKey: CSSProperties = { color: 'var(--green)', minWidth: 92 };

export default function Music() {
  const rootRef = useRef<HTMLElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [side, setSide] = useState<'A' | 'B'>('A');
  const visible = TRACKS.filter((t) => t.side === side);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const rig = rigRef.current;
      const list = listRef.current;

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (stamp) {
          gsap.set(stamp, { opacity: 0, rotate: 10, scale: 0.8 });
          gsap.to(stamp, {
            opacity: 1,
            rotate: -3,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: root, start: 'top 75%' },
          });
        }

        if (headline) {
          split = new SplitText(headline, { type: 'chars,words' });
          gsap.set(split.chars, { opacity: 0, yPercent: 60 });
          gsap.to(split.chars, {
            opacity: 1,
            yPercent: 0,
            duration: 0.65,
            stagger: 0.03,
            ease: 'power4.out',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(headline, 'music');
        }

        if (dek) {
          gsap.set(dek, { opacity: 0, y: 12 });
          gsap.to(dek, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: dek, start: 'top 85%' },
          });
        }

        if (rig) {
          // Rig fades in + tips forward. On scroll enter we flip
          // data-playing which both starts the disc and swings the
          // tonearm over. The disc group also gets its own
          // `music-disc` feTurbulence filter scrubbed from high
          // displacement down to 0 so the grooves "settle in ink."
          gsap.set(rig, { opacity: 0, y: 40, rotate: -2 });
          gsap.to(rig, {
            opacity: 1,
            y: 0,
            rotate: 0,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: rig,
              start: 'top 78%',
              onEnter: () => rig.setAttribute('data-playing', 'true'),
              onLeaveBack: () => rig.setAttribute('data-playing', 'false'),
            },
          });

          const disc = rig.querySelector<SVGGElement>('g.disc');
          const feDisp = document.querySelector<SVGFEDisplacementMapElement>(
            'feDisplacementMap[data-ink-bleed="music-disc"]',
          );
          if (disc && feDisp) {
            disc.style.filter = inkBleedUrl('music-disc');
            gsap.set(feDisp, { attr: { scale: 7 } });
            gsap.to(feDisp, {
              attr: { scale: 0 },
              duration: 1.1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: rig,
                start: 'top 78%',
                id: 'ink-bleed-music-disc',
              },
            });
          }
        }

        const cards = list ? (Array.from(list.children) as HTMLElement[]) : [];
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 30 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: list, start: 'top 85%' },
          });
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
          const disc = rig?.querySelector<SVGGElement>('g.disc');
          if (disc) disc.style.filter = '';
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="music" ref={rootRef}>
      <div className="folio">
        <b>05</b> // OFF-KEYBOARD
      </div>
      <span className="stamp">OFF-KEYBOARD</span>
      <h2 className="headline">
        Sound I've <em>tinkered with.</em>
      </h2>
      <p className="dek">
        A running discography of music-tech experiments - game-jam scores, hackathon
        one-nighters, browser synths, granular patches. Pressed loose, not polished.
      </p>

      <div className="music-stage" style={stageStyle}>
        <Rig ref={rigRef} side={side} />
        <div className="liner">
          <h3>Liner notes.</h3>
          <p style={linerIntro}>
            I compose sideways - keyboards are one entry point, but most of the work happens
            in Unity mixers, SuperCollider buffers, Tone.js graphs, and whatever the next
            jam theme demands. The rig to the left spins every piece below, in order.
          </p>
          <ul style={cueList}>
            <li style={cueItem}>
              <span style={cueKey}>// side A</span>
              <span>Jams &amp; hackathons - built under time pressure.</span>
            </li>
            <li style={cueItem}>
              <span style={cueKey}>// side B</span>
              <span>Self-directed experiments - patches, synths, research.</span>
            </li>
            <li style={cueItem}>
              <span style={cueKey}>// rpm</span>
              <span>33⅓ - slow enough to hear the edits.</span>
            </li>
          </ul>
          <button
            type="button"
            className="flip-btn"
            data-side={side}
            onClick={() => setSide(side === 'A' ? 'B' : 'A')}
            aria-label={`Flip to side ${side === 'A' ? 'B' : 'A'}`}
          >
            <span className="dot" aria-hidden="true" />
            {side === 'A' ? 'Flip to side B →' : '← Flip back to side A'}
          </button>
          <p className="placeholder-note">
            // placeholder tracklist - swap in the real titles, years &amp; links anytime.
          </p>
        </div>
      </div>

      <div className="tracklist" ref={listRef}>
        {visible.map((t) => (
          <article key={t.n} className="track">
            <span className={t.side === 'B' ? 'n side-b' : 'n'}>{t.n}</span>
            <div className="meta">
              <span>{t.tag}</span>
              <span>Side {t.side}</span>
            </div>
            <h3>{t.title}</h3>
            <p>{t.body}</p>
            <div className="tags">{t.tags}</div>
          </article>
        ))}
      </div>
    </article>
  );
}

type RigProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  side: 'A' | 'B';
};

const Rig = ({ ref, side }: RigProps) => (
  <div className="rig" ref={ref} data-playing="false" data-side={side} aria-hidden="true">
    <svg viewBox="0 0 240 240" role="img" aria-label="Spinning vinyl on a turntable with a patiphone horn">
      {/* Turntable base (ink slab under the disc) */}
      <rect x="10" y="36" width="220" height="176" rx="6" className="base" />

      {/* The disc + grooves rotate together. Everything mounted OFF the disc
          (tonearm, spindle, sheen, horn) stays static. The disc group also
          carries the `ink-bleed-music-disc` feTurbulence filter that GSAP
          scrubs from scale 7 → 0 on scroll enter so the grooves settle
          into ink rather than popping in as CAD circles. */}
      <g className="disc">
        <circle cx="108" cy="120" r="92" className="wax" />
        {/* Concentric grooves. Spacing + contrast give the "pressed vinyl"
            read without needing a texture. Every 4th ring is slightly
            brighter, mirroring the way real LPs alternate band edges. */}
        {Array.from({ length: 24 }).map((_, i) => {
          const r = 24 + i * 2.9;
          return (
            <circle
              key={i}
              cx="108"
              cy="120"
              r={r}
              className={i % 4 === 0 ? 'groove bright' : 'groove'}
            />
          );
        })}

        {/* Center label. Fill color is CSS-driven — green for Side A,
            magenta for Side B (see .rig[data-side="B"] .label). */}
        <circle cx="108" cy="120" r="26" className="label" />
        <circle cx="108" cy="120" r="26" className="label-ring" />

        {/* Label text — wraps the spindle on two arcs so it reads as
            hand-lettered sleeve art when the disc is at rest and blurs
            into a solid ring once it's spinning. Top arc shows a
            permanent studio mark; bottom arc flips with the active side. */}
        <defs>
          <path
            id="music-label-top"
            d="M 88 120 A 20 20 0 0 1 128 120"
            fill="none"
          />
          <path
            id="music-label-bottom"
            d="M 128 120 A 20 20 0 0 1 88 120"
            fill="none"
          />
        </defs>
        <text className="label-text">
          <textPath href="#music-label-top" startOffset="50%" textAnchor="middle">
            BAR · MIX
          </textPath>
        </text>
        <text className="label-text">
          <textPath href="#music-label-bottom" startOffset="50%" textAnchor="middle">
            {side === 'A' ? 'SIDE A · 33⅓ RPM' : 'SIDE B · 33⅓ RPM'}
          </textPath>
        </text>

        {/* Tiny off-center mark - catches the eye and confirms spin */}
        <circle cx="108" cy="100" r="1.2" fill="var(--paper)" opacity=".6" />
      </g>

      {/* Static sheen — a pair of thin arcs suggesting overhead light on the
          lacquer. Sits above the disc so it stays fixed while the wax
          rotates underneath. */}
      <path
        d="M 40 90 A 92 92 0 0 1 176 90"
        className="sheen"
        strokeWidth="2"
        opacity=".08"
      />
      <path
        d="M 50 160 A 92 92 0 0 0 166 160"
        className="sheen"
        strokeWidth="1"
        opacity=".05"
      />

      {/* Spindle — the pin the vinyl sits on. Static. */}
      <circle cx="108" cy="120" r="3" className="spindle" />
      <circle cx="108" cy="120" r="1.1" className="spindle-hole" />

      {/* Patiphone / gramophone horn — a small flared cone rising from the
          bottom-right of the base. Stays static; the three <circle.puff>
          elements inside the mouth loop a scale+fade animation whenever
          the rig is marked data-playing (see .rig .puff in styles.css). */}
      <g className="horn">
        {/* Neck: short tapered pipe from base edge up to the body */}
        <path
          d="M 213 205 L 219 205 L 223 190 L 217 190 Z"
          className="horn-neck"
        />
        {/* Body: flared cone curving up toward the mouth */}
        <path
          d="M 217 190 L 224 190 L 236 160 L 230 154 L 226 160 L 220 175 Z"
          className="horn-body"
        />
        {/* Mouth rim: tilted ellipse suggesting the open end */}
        <ellipse
          cx="231"
          cy="156"
          rx="6"
          ry="4"
          transform="rotate(-38 231 156)"
          className="horn-rim"
        />
        {/* Sound "puff" rings — emanate from the horn mouth. The
            animation is paused by default and flips to running only
            once the rig is marked data-playing="true". */}
        <circle cx="231" cy="156" r="5" className="puff" />
        <circle cx="231" cy="156" r="5" className="puff" />
        <circle cx="231" cy="156" r="5" className="puff" />
      </g>

      {/* Tonearm. Pivot is top-right of the base; the arm swings from a
          resting position (off the record) over to the outer groove when
          .rig[data-playing="true"] flips via scroll trigger. */}
      <g className="tonearm">
        {/* Counterweight (outside the pivot) */}
        <rect x="196" y="34" width="18" height="10" rx="2" className="arm-counterweight" />
        {/* Pivot / base joint */}
        <circle cx="198" cy="40" r="6" className="arm-joint" />
        {/* Main shaft from pivot toward the record center */}
        <rect x="108" y="37.5" width="90" height="5" rx="2" className="arm-shaft" />
        {/* Headshell (angled down slightly in the resting geometry; the whole
            arm rotates as a unit via the CSS transform on .tonearm) */}
        <rect x="100" y="42" width="18" height="9" rx="1" className="arm-head" />
        {/* Needle */}
        <path d="M 104 51 L 100 58 L 108 58 Z" className="arm-needle" />
      </g>
    </svg>
  </div>
);
