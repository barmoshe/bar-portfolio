import { useEffect, useRef, useState, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';
import { inkBleedUrl } from '../InkDefs';
import {
  isEnabled as isAudioEnabled,
  playFlip as sfxFlip,
  playNeedleDrop as sfxNeedleDrop,
  setEnabled as setAudioEnabled,
  startCrackle,
  stopCrackle,
  unlock as unlockAudio,
} from '../../lib/vinylAudio';

const AUDIO_KEY = 'bm:vinyl-audio';

type Track = {
  n: string;
  side: 'A' | 'B';
  tag: string;
  title: string;
  body: string;
  tags: string;
  /** Optional preview image, relative to `public/` (e.g. `'tracks/foo.png'`). Rendered above the body when set. */
  preview?: string;
};

// Placeholder tracks. These describe the *kind* of music-tech and
// game-audio work I get pulled into - hackathons, game jams, granular
// experiments - but the titles, years, and credits are stand-ins until
// the real inventory is wired up.
const TRACKS: Track[] = [
  {
    n: 'A1',
    side: 'A',
    tag: 'Global Game Jam · 2026',
    title: 'Mask Theme - adaptive score.',
    body:
      'Unity + FMOD layered score that ducks and crests with the player state. Vertical layers, horizontal cues, one 48-hour weekend.',
    tags: '#ggj   #fmod   #unity   #adaptive',
  },
  {
    n: 'A2',
    side: 'A',
    tag: 'Global Game Jam · 2025',
    title: 'Roots - chiptune SFX suite.',
    body:
      'A rack of square-wave SFX and a looping 8-bit bed for a two-button platformer. Squeezed into ~12 KB of sound payload.',
    tags: '#ggj   #chiptune   #webaudio',
  },
  {
    n: 'A3',
    side: 'A',
    tag: 'Music Hack Day · TLV',
    title: 'Generative Bazaar - web-audio station.',
    body:
      'Marketplace-themed generative composer. Scales chosen by city, drum patterns by temperature. Built on Tone.js in a single night.',
    tags: '#hackathon   #tonejs   #generative',
  },
  {
    n: 'B1',
    side: 'B',
    tag: 'Self-directed · 2026',
    title: 'Biome Synth - five-biome browser instrument.',
    body:
      'A playable world. Touch to make music across space, jungle, sea, cyberpunk, and tundra biomes - or let the AI DJ compose through DRIFT, PULSE, BLOOM, SURGE, DISSOLVE. Tone.js for audio, Three.js for the space biome, Canvas2D for the rest.',
    tags: '#tonejs   #threejs   #webaudio   #synth',
    preview: 'tracks/biome-synth.jpg',
  },
  {
    n: 'B2',
    side: 'B',
    tag: 'Research · 2024',
    title: 'Phrase Partner - ML melody sketchpad.',
    body:
      'A Magenta-backed notebook that riffs back at you. You play four bars, it extends eight, and marks what it borrowed from you.',
    tags: '#magenta   #midi   #ml',
  },
  {
    n: 'B3',
    side: 'B',
    tag: 'Patch · 2023',
    title: 'Grainfield - SuperCollider grain cloud.',
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

  // Audio preference - persisted across sessions. Default off because
  // browsers block unsolicited playback; the user has to tap the
  // toggle (or any page element if they previously opted in) to
  // actually unlock the AudioContext. See src/lib/vinylAudio.ts.
  const [audioOn, setAudioOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUDIO_KEY) === '1';
    } catch {
      return false;
    }
  });

  // If the stored preference is "on" but the context hasn't been
  // unlocked yet (fresh page load), lift the lock on the next user
  // gesture anywhere in the page. After that, subsequent sfx calls work.
  useEffect(() => {
    if (audioOn && !isAudioEnabled()) {
      const lift = () => {
        unlockAudio();
        setAudioEnabled(true);
        window.removeEventListener('pointerdown', lift);
        window.removeEventListener('keydown', lift);
      };
      window.addEventListener('pointerdown', lift, { once: true });
      window.addEventListener('keydown', lift, { once: true });
      return () => {
        window.removeEventListener('pointerdown', lift);
        window.removeEventListener('keydown', lift);
      };
    }
    if (!audioOn && isAudioEnabled()) setAudioEnabled(false);
    return undefined;
  }, [audioOn]);

  // Stop any looping crackle if the section unmounts.
  useEffect(() => () => stopCrackle(), []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    if (next) {
      unlockAudio();
      setAudioEnabled(true);
      // Tiny confirmation tap so the user hears the unlock worked.
      sfxNeedleDrop();
      // If the section is currently playing, resume the crackle loop.
      if (rigRef.current?.getAttribute('data-playing') === 'true') {
        setTimeout(startCrackle, 220);
      }
    } else {
      setAudioEnabled(false);
    }
    try {
      localStorage.setItem(AUDIO_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

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
          createReveal(
            stamp,
            { opacity: 0, rotate: 10, scale: 0.8 },
            { opacity: 1, rotate: -3, scale: 1, duration: 0.6, ease: 'back.out(2)' },
            { trigger: root, start: 'top 75%' },
          );
        }

        if (headline) {
          split = new SplitText(headline, { type: 'chars,words' });
          createReveal(
            split.chars,
            { opacity: 0, yPercent: 60 },
            { opacity: 1, yPercent: 0, duration: 0.65, stagger: 0.03, ease: 'power4.out' },
            { trigger: headline, start: 'top 80%' },
          );
          cleanupBleed = attachInkBleed(headline, 'music');
        }

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            { trigger: dek, start: 'top 85%' },
          );
        }

        if (rig) {
          // Rig fades in + tips forward. On play/replay we flip
          // data-playing which both starts the disc and swings the
          // tonearm over. The whole sketch group carries a persistent
          // low-scale feTurbulence displacement for a hand-drawn pen
          // wobble - we scrub it from a louder starting scale down to a
          // LOW resting scale (not zero: the wobble is the look).
          createReveal(
            rig,
            { opacity: 0, y: 40, rotate: -2 },
            { opacity: 1, y: 0, rotate: 0, duration: 0.9, ease: 'power3.out' },
            {
              trigger: rig,
              start: 'top 78%',
              onPlay: () => {
                rig.setAttribute('data-playing', 'true');
                if (isAudioEnabled()) {
                  sfxNeedleDrop();
                  // Delay crackle a hair so the needle-drop lands first.
                  window.setTimeout(startCrackle, 220);
                }
              },
              onLeaveBack: () => {
                rig.setAttribute('data-playing', 'false');
                stopCrackle();
              },
            },
          );

          const sketchGroup = rig.querySelector<SVGGElement>('g.sketch-ink');
          const feDisp = document.querySelector<SVGFEDisplacementMapElement>(
            'feDisplacementMap[data-ink-bleed="music-disc"]',
          );
          if (sketchGroup && feDisp) {
            sketchGroup.style.filter = inkBleedUrl('music-disc');
            createReveal(
              feDisp,
              { attr: { scale: 5 } },
              { attr: { scale: 1.3 }, duration: 1.1, ease: 'power3.out' },
              { trigger: rig, start: 'top 78%' },
            );
          }
        }

        const cards = list ? (Array.from(list.children) as HTMLElement[]) : [];
        if (cards.length && list) {
          createReveal(
            cards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' },
            { trigger: list, start: 'top 85%' },
          );
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
          const sketchGroup = rig?.querySelector<SVGGElement>('g.sketch-ink');
          if (sketchGroup) sketchGroup.style.filter = '';
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
        one-nighters, browser synths, granular patches. Sketched loose, not pressed.
      </p>

      <div className="music-stage" style={stageStyle}>
        <Rig ref={rigRef} side={side} />
        <div className="liner">
          <h3>Liner notes.</h3>
          <p style={linerIntro}>
            I compose sideways - keyboards are one entry point, but most of the work happens
            in Unity mixers, SuperCollider buffers, Tone.js graphs, and whatever the next
            jam theme demands. The sketch to the left spins every piece below, in order.
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
          <div className="rig-controls">
            <button
              type="button"
              className="sound-btn"
              data-on={audioOn ? 'true' : 'false'}
              aria-pressed={audioOn}
              aria-label={audioOn ? 'Mute vinyl sound' : 'Enable vinyl sound'}
              onClick={toggleAudio}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true" className="sound-ico">
                <path d="M4 9.5 L4 14.5 L8 14.5 L13 18 L13 6 L8 9.5 Z" />
                {audioOn ? (
                  <>
                    <path d="M16 9 Q18 12 16 15" fill="none" />
                    <path d="M18.5 7 Q21.5 12 18.5 17" fill="none" />
                  </>
                ) : (
                  <>
                    <line x1="16" y1="9" x2="22" y2="15" />
                    <line x1="22" y1="9" x2="16" y2="15" />
                  </>
                )}
              </svg>
              <span>{audioOn ? 'Sound on' : 'Sound off'}</span>
            </button>
            <button
              type="button"
              className="flip-btn"
              data-side={side}
              onClick={() => {
                sfxFlip();
                setSide(side === 'A' ? 'B' : 'A');
              }}
              aria-label={`Flip to side ${side === 'A' ? 'B' : 'A'}`}
            >
              <span className="dot" aria-hidden="true" />
              {side === 'A' ? 'Flip to side B →' : '← Flip to side A'}
            </button>
          </div>
          <p className="placeholder-note">
            // placeholder tracklist - swap in the real titles, years &amp; links anytime.
            Sound is synthesized in-browser (Web Audio API); no assets fetched.
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
            {t.preview ? (
              <div
                style={{
                  width: '70%',
                  aspectRatio: '1 / 1',
                  margin: '14px auto 10px',
                  filter:
                    'drop-shadow(0 2px 6px oklch(0 0 0 / .35)) drop-shadow(0 0 26px oklch(0.62 0.15 155 / .28))',
                }}
              >
                <img
                  src={`${import.meta.env.BASE_URL}${t.preview}`}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center 20%',
                    display: 'block',
                    WebkitMaskImage:
                      'radial-gradient(circle at center, #000 60%, transparent 92%)',
                    maskImage:
                      'radial-gradient(circle at center, #000 60%, transparent 92%)',
                  }}
                />
              </div>
            ) : null}
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

// All-stroke sketch rig. The whole `<g class="sketch-ink">` group is wrapped
// by a feTurbulence/feDisplacementMap filter (ink-bleed-music-disc) at a
// persistent low scale so every line reads as hand-drawn - that's the
// "sketch vibes" signature. Fills are kept to paper / paper-2 / one accent
// color (the side dot). Everything else is ink linework.
const Rig = ({ ref, side }: RigProps) => (
  <div className="rig" ref={ref} data-playing="false" data-side={side} aria-hidden="true">
    <svg viewBox="0 0 240 240" role="img" aria-label="Sketched vinyl with gramophone horn">
      <g className="sketch-ink">
        {/* Turntable base - sketchy rounded rectangle on paper */}
        <rect x="10" y="36" width="220" height="176" rx="4" className="sk-base" />
        {/* A few ink hatch marks at the bottom corners suggest a wooden
            plinth without needing a fill. */}
        <g className="sk-hatch">
          <path d="M 22 198 L 32 208" />
          <path d="M 34 198 L 44 208" />
          <path d="M 46 198 L 56 208" />
          <path d="M 186 198 L 196 208" />
          <path d="M 198 198 L 208 208" />
          <path d="M 210 198 L 220 208" />
        </g>

        {/* Vinyl disc - paper-tinted wax with a stroked rim and a small
            set of concentric grooves (7 rings, not 22, so the sketch
            doesn't look like a target). The disc + its grooves rotate
            together inside g.disc (CSS keyframe). */}
        <g className="disc">
          <circle cx="108" cy="120" r="92" className="sk-wax" />
          <circle cx="108" cy="120" r="88" className="sk-rim" />

          {[82, 74, 66].map((r) => (
            <circle key={r} cx="108" cy="120" r={r} className="sk-groove" />
          ))}

          {/* Center label - paper circle with a smaller printed circle
              and an accent dot whose fill swaps with the active side. */}
          <circle cx="108" cy="120" r="58" className="sk-label" />
          <circle cx="108" cy="120" r="50" className="sk-label-inner" />
          <circle cx="108" cy="120" r="6" className="sk-label-dot" />

          <defs>
            <path
              id="music-label-top"
              d="M 64 120 A 44 44 0 0 1 152 120"
              fill="none"
            />
            <path
              id="music-label-bottom"
              d="M 152 120 A 44 44 0 0 1 64 120"
              fill="none"
            />
          </defs>
          <text className="sk-label-text">
            <textPath href="#music-label-top" startOffset="50%" textAnchor="middle">
              BAR · MIX
            </textPath>
          </text>
          <text className="sk-label-text">
            <textPath href="#music-label-bottom" startOffset="50%" textAnchor="middle">
              {side === 'A' ? 'SIDE A · 33⅓' : 'SIDE B · 33⅓'}
            </textPath>
          </text>

          {/* Witness mark - a small ink dot off-center that confirms spin */}
          <circle cx="108" cy="74" r="1.4" className="sk-witness" />
        </g>

        {/* Spindle pokes through the label - static, doesn't rotate */}
        <circle cx="108" cy="120" r="1.8" className="sk-spindle" />

        {/* Gramophone horn - line-art bell with interior hatch shading,
            a tilted mouth rim, and three sound-wave arcs rippling off
            the opening when data-playing="true". */}
        <g className="horn">
          {/* Mount box at the base */}
          <rect x="212" y="200" width="14" height="12" rx="1.5" className="sk-horn-mount" />
          {/* Neck: tapered pipe from mount up into the flare */}
          <path d="M 214 200 L 220 200 L 223 186 L 217 186 Z" className="sk-horn-neck" />
          {/* Body: bell-shaped flare curving up-right */}
          <path
            d="M 217 187
               C 219 180, 225 172, 230 164
               L 234 154
               L 237 162
               C 234 172, 228 182, 223 187 Z"
            className="sk-horn-body"
          />
          {/* Mouth rim: tilted ellipse at the bell's open end */}
          <ellipse
            cx="235"
            cy="158"
            rx="5"
            ry="2.6"
            transform="rotate(-42 235 158)"
            className="sk-horn-rim"
          />
          {/* Three short diagonal hatches inside the bell for shading */}
          <g className="sk-horn-hatch">
            <path d="M 221 182 L 225 178" />
            <path d="M 224 176 L 228 170" />
            <path d="M 228 168 L 231 163" />
          </g>
          {/* Sound waves - three nested arcs that fade and drift outward
              from the mouth on loop when the rig is "playing". */}
          <g className="sk-waves">
            <path d="M 240 154 Q 244 158 240 162" className="sk-wave w1" />
            <path d="M 244 150 Q 250 158 244 166" className="sk-wave w2" />
            <path d="M 248 147 Q 256 158 248 169" className="sk-wave w3" />
          </g>
        </g>

        {/* Tonearm - line art. Pivot is top-right of the base; the arm
            swings from rest (~26°) to play (~2°) via the --arm-rot var
            flipped by .rig[data-playing="true"] in styles.css. */}
        <g className="tonearm">
          {/* Pivot base plate */}
          <rect x="190" y="44" width="16" height="6" rx="1" className="sk-arm-base" />
          {/* Counterweight */}
          <rect x="198" y="34" width="14" height="8" rx="1.5" className="sk-arm-counterweight" />
          {/* Pivot joint circle */}
          <circle cx="198" cy="40" r="5" className="sk-arm-joint" />
          {/* Shaft line from pivot to headshell */}
          <line x1="108" y1="40" x2="196" y2="40" className="sk-arm-shaft" />
          {/* Headshell */}
          <rect x="100" y="37" width="14" height="8" rx="1" className="sk-arm-head" />
          {/* Needle pointing down at the groove */}
          <path d="M 105 45 L 102 52 L 109 52 Z" className="sk-arm-needle" />
        </g>
      </g>
    </svg>
  </div>
);
