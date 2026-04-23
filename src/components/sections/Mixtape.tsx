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
  playScratch as sfxScratch,
  setEnabled as setAudioEnabled,
  setRpm as setAudioRpm,
  setSide as setAudioSide,
  startBed,
  stopBed,
  unlock as unlockAudio,
} from '../../lib/vinylAudio';

const AUDIO_KEY = 'bm:vinyl-audio';
const RPM_KEY = 'bm:vinyl-rpm';

type Rpm = 33 | 45 | 78;
const RPM_OPTIONS: Rpm[] = [33, 45, 78];
const RPM_LABEL: Record<Rpm, string> = { 33: '33⅓', 45: '45', 78: '78' };
// Tempo multiplier vs. the 33⅓ baseline at which each composition was written.
const RPM_RATE: Record<Rpm, number> = { 33: 1, 45: 1.35, 78: 2.34 };
// Disc rotation period in seconds — 33⅓ rpm = 1.8 s/rev, scaled for the SVG.
const RPM_SPIN: Record<Rpm, string> = { 33: '3s', 45: '2.22s', 78: '1.28s' };

type Track = {
  n: string;
  side: 'A' | 'B';
  kind: 'post' | 'experiment';
  date: string;
  tag: string;
  title: string;
  body: string;
  hashtags: string;
  /** External write-up. Present on every Side A post and on merged Side B tracks. */
  href?: string;
  /** Preview image relative to `public/` (e.g. `'tracks/foo.jpg'`). Rendered as a mini vinyl. */
  preview?: string;
  /** How to fit the preview inside the label circle. 'cover' (default) crops to fill; 'contain' shrinks to show the whole image. */
  previewFit?: 'cover' | 'contain';
  /** Disc face color - shown in the thin outer rim (cover mode) and any letterbox bars (contain mode). Picked to match the preview art's edges. */
  previewBg?: string;
  /** Programmatic vinyl label - solid colored center with a monogram glyph. Used when there's no photo. */
  label?: { bg: string; monogram: string; fg?: string };
  featured?: boolean;
};

// Side A = posts (public write-ups that stand on their own).
// Side B = experiments (builds, patches, synths, research).
// Two Side B tracks are merged with the post that covered them - they
// carry an `href` so the card links out, but the primary identity is
// the artifact, not the thread about it.
const TRACKS: Track[] = [
  {
    n: 'A1',
    side: 'A',
    kind: 'post',
    date: 'MAR 2025',
    tag: '★ featured',
    title: "Read it on Temporal's Code Exchange.",
    body:
      "My Cross-Language Data Processing Service - Python, Go, and TypeScript all coordinated through a single Temporal workflow - was picked up for Temporal's official Code Exchange, with a companion Medium write-up.",
    hashtags: '#temporal   #opensource   #python   #go',
    href: 'https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal',
    preview: 'tracks/temporal.jpg',
    previewBg: '#684b36',
    featured: true,
  },
  {
    n: 'A2',
    side: 'A',
    kind: 'post',
    date: 'FEB 2026',
    tag: '// launch',
    title: 'Shipping Joomsy - meaningful moments across the distance.',
    body:
      "Kids connect with grandparents, family, and friends through interactive video calls - reading books together, gesture-based games, more coming. Over 35M US grandparents live 200+ miles from a grandchild; we're building the bridge.",
    hashtags: '#startup   #product   #video',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7421903131573366784/',
    preview: 'tracks/joomsy.jpg',
    previewBg: '#f7c80c',
  },
  {
    n: 'A3',
    side: 'A',
    kind: 'post',
    date: 'JAN 2026',
    tag: '// gift',
    title: 'A tiny Flappy Bird for a wedding gift.',
    body:
      'My cousin Chen was getting married. Her fiancé is into DJI drones - so I built a small drone-themed Flappy Bird with a "Ring Delivered!" finish, a "Chen said YES!" screen, and an endless mode. Sometimes the best gift is 200 lines of web game.',
    hashtags: '#javascript   #canvas   #gift',
    href: 'https://v0-chenandoz.vercel.app/',
    preview: 'tracks/ring-quest.jpg',
    previewBg: '#91ccf5',
  },
  {
    n: 'A4',
    side: 'A',
    kind: 'post',
    date: 'OCT 2025',
    tag: '// devtool',
    title: 'A small GPT that rewrites messy PR notes into clean bullets.',
    body:
      'Takes half-written PR descriptions and turns them into Fix · Add · Update · Refactor · Remove. Writing a changelog now takes seconds instead of minutes.',
    hashtags: '#gpt   #devtools   #workflow',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7382760320420720640/',
  },
  {
    n: 'B1',
    side: 'B',
    kind: 'experiment',
    date: 'APR 2026',
    tag: 'Self-directed · 2026',
    title: 'Biome Synth - five-biome browser instrument.',
    body:
      'A playable world. Touch to make music across space, jungle, sea, cyberpunk, and tundra biomes - or let an AI DJ compose through DRIFT, PULSE, BLOOM, SURGE, DISSOLVE. The whole spec came out of a Claude skill I wrote that interviews you step-by-step until it has a full brief. Tone.js for audio, Three.js for the space biome, Canvas2D for the rest.',
    hashtags: '#tonejs   #threejs   #webaudio   #synth   #claude',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7450179482327576576/',
    preview: 'tracks/biome-synth.jpg',
    previewFit: 'contain',
    previewBg: '#12192f',
    featured: true,
  },
  {
    n: 'B2',
    side: 'B',
    kind: 'experiment',
    date: 'FEB 2026',
    tag: 'Global Game Jam · 2026',
    title: 'Masking Through - adaptive score for a cardboard-doctor short.',
    body:
      'Second year on audio duty. A cut-out cardboard world - tie-wearing doctor, smiling pink flowers, a hand-lettered title card - scored in Unity + FMOD with layered stems that duck and crest with the player state (vertical layers, horizontal cues). This time I let Cursor write the sound-effect code (C# synth, mixer, effects chain) while I conducted from the side. One 48-hour weekend, zero manual setup.',
    hashtags: '#ggj2026   #fmod   #unity   #cursor   #adaptive',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7423731964278358016/',
    preview: 'tracks/masking-through.jpg',
    previewBg: '#556b77',
  },
  {
    n: 'B3',
    side: 'B',
    kind: 'experiment',
    date: '2025',
    tag: 'Global Game Jam · 2025',
    title: 'Roots - chiptune SFX suite.',
    body:
      'A rack of square-wave SFX and a looping 8-bit bed for a two-button platformer. Squeezed into ~12 KB of sound payload.',
    hashtags: '#ggj   #chiptune   #webaudio',
  },
  {
    n: 'B4',
    side: 'B',
    kind: 'experiment',
    date: '2024',
    tag: 'Music Hack Day · TLV',
    title: 'Generative Bazaar - web-audio station.',
    body:
      'Marketplace-themed generative composer. Scales chosen by city, drum patterns by temperature. Built on Tone.js in a single night.',
    hashtags: '#hackathon   #tonejs   #generative',
  },
  {
    n: 'B5',
    side: 'B',
    kind: 'experiment',
    date: '2024',
    tag: 'Research · 2024',
    title: 'Phrase Partner - ML melody sketchpad.',
    body:
      'A Magenta-backed notebook that riffs back at you. You play four bars, it extends eight, and marks what it borrowed from you.',
    hashtags: '#magenta   #midi   #ml',
  },
  {
    n: 'B6',
    side: 'B',
    kind: 'experiment',
    date: '2023',
    tag: 'Patch · 2023',
    title: 'Grainfield - SuperCollider grain cloud.',
    body:
      'A granular patch that samples room tone and rebuilds it as a slow harmonic field. Patched live, recorded to a single tape loop.',
    hashtags: '#supercollider   #granular   #drone',
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

export default function Mixtape() {
  const rootRef = useRef<HTMLElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [side, setSide] = useState<'A' | 'B'>('A');
  const visible = TRACKS.filter((t) => t.side === side);

  const [audioOn, setAudioOn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(AUDIO_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [rpm, setRpm] = useState<Rpm>(() => {
    try {
      const v = parseInt(localStorage.getItem(RPM_KEY) ?? '33', 10) as Rpm;
      return RPM_OPTIONS.includes(v) ? v : 33;
    } catch {
      return 33;
    }
  });

  useEffect(() => {
    setAudioRpm(RPM_RATE[rpm]);
    rigRef.current?.style.setProperty('--spin-dur', RPM_SPIN[rpm]);
    try {
      localStorage.setItem(RPM_KEY, String(rpm));
    } catch {
      /* ignore */
    }
  }, [rpm]);

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

  useEffect(() => () => stopBed(), []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    if (next) {
      unlockAudio();
      setAudioEnabled(true);
      sfxNeedleDrop(side);
      if (rigRef.current?.getAttribute('data-playing') === 'true') {
        setTimeout(() => startBed(side), 220);
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
          cleanupBleed = attachInkBleed(headline, 'mixtape');
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
                  sfxNeedleDrop(side);
                  window.setTimeout(() => startBed(side), 220);
                }
              },
              onLeaveBack: () => {
                rig.setAttribute('data-playing', 'false');
                stopBed();
              },
            },
          );

          const sketchGroup = rig.querySelector<SVGGElement>('g.sketch-ink');
          const feDisp = document.querySelector<SVGFEDisplacementMapElement>(
            'feDisplacementMap[data-ink-bleed="mixtape-disc"]',
          );
          if (sketchGroup && feDisp) {
            sketchGroup.style.filter = inkBleedUrl('mixtape-disc');
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
    <article className="page" id="mixtape" ref={rootRef}>
      <div className="folio">
        <b>05</b> // MIXTAPE
      </div>
      <span className="stamp">MIXTAPE</span>
      <h2 className="headline">
        Things I've <em>pressed to tape.</em>
      </h2>
      <p className="dek">
        One running mixtape of what I ship and what I sketch - launches, posts, game-jam
        scores, browser synths, devtools. Flip the record to swap between the two sides.
      </p>

      <div className="music-stage" style={stageStyle}>
        <Rig ref={rigRef} side={side} />
        <div className="liner">
          <h3>Liner notes.</h3>
          <p style={linerIntro}>
            Side A ships. Side B experiments. The rig spins whichever side is queued.
          </p>
          <ul style={cueList}>
            <li style={cueItem}>
              <span style={cueKey}>// side A</span>
              <span>Posts &amp; launches.</span>
            </li>
            <li style={cueItem}>
              <span style={cueKey}>// side B</span>
              <span>Builds, patches, sketches.</span>
            </li>
          </ul>
          <div className="rig-controls">
            <button
              type="button"
              className="sound-btn"
              data-on={audioOn ? 'true' : 'false'}
              aria-pressed={audioOn}
              aria-label={
                audioOn
                  ? `Mute mixtape audio (Side ${side})`
                  : `Play mixtape audio (Side ${side})`
              }
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
                const next = side === 'A' ? 'B' : 'A';
                sfxFlip();
                setAudioSide(next);
                setSide(next);
              }}
              aria-label={`Flip to side ${side === 'A' ? 'B' : 'A'}`}
            >
              <span className="dot" aria-hidden="true" />
              {side === 'A' ? 'Flip to side B →' : '← Flip to side A'}
            </button>
            <div
              className="rpm-toggle"
              role="radiogroup"
              aria-label="Playback speed (RPM)"
            >
              <span className="rpm-toggle__label" aria-hidden="true">
                rpm
              </span>
              {RPM_OPTIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  role="radio"
                  aria-checked={rpm === r}
                  className="rpm-seg"
                  data-active={rpm === r ? 'true' : 'false'}
                  onClick={() => setRpm(r)}
                >
                  {RPM_LABEL[r]}
                </button>
              ))}
            </div>
          </div>
          <p className="placeholder-note">
            // Sound is synthesized in-browser (Web Audio API); no assets fetched.
            Side A plays a 78 BPM F-major lo-fi bed; Side B is a 60 BPM D-dorian lab
            drone. Side A cards open the full write-up; Side B carries the artifact.
          </p>
        </div>
      </div>

      <div className="tracklist" ref={listRef}>
        {visible.map((t) => (
          <article key={t.n} className="track" data-kind={t.kind}>
            <span className={t.side === 'B' ? 'n side-b' : 'n'}>{t.n}</span>
            <div className="meta">
              <span>{t.tag}</span>
              <span className="track-date">{t.date}</span>
            </div>
            <h3>{t.title}</h3>
            {t.preview || t.label ? <TrackVinyl track={t} /> : null}
            <p>{t.body}</p>
            {t.href ? (
              <a
                className="track-link"
                href={t.href}
                target="_blank"
                rel="noopener"
              >
                Read the post →
              </a>
            ) : null}
            <div className="tags">{t.hashtags}</div>
          </article>
        ))}
      </div>
    </article>
  );
}

// Mini vinyl record for a track. The preview image is clipped into the
// center label; clicking flicks the disc through two fast rotations via
// the Web Animations API (re-triggerable, and bypassed when the user
// prefers reduced motion).
function TrackVinyl({ track }: { track: Track }) {
  const discRef = useRef<SVGGElement | null>(null);

  const spin = () => {
    const disc = discRef.current;
    if (!disc) return;
    if (isAudioEnabled()) sfxScratch(track.side);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    disc.animate(
      [{ transform: 'rotate(0deg)' }, { transform: 'rotate(720deg)' }],
      { duration: 900, easing: 'cubic-bezier(.2,.7,.2,1)' },
    );
  };

  const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      spin();
    }
  };

  const displayTitle = track.title.replace(/\.$/, '').split(' - ')[0];

  return (
    <div
      className="track-vinyl"
      role="button"
      tabIndex={0}
      aria-label={`Spin ${displayTitle}`}
      onClick={spin}
      onKeyDown={onKey}
    >
      <svg viewBox="0 0 200 200" aria-hidden="true">
        <defs>
          <clipPath id={`vinyl-label-${track.n}`}>
            <circle cx="100" cy="100" r="86" />
          </clipPath>
        </defs>
        <g className="disc" ref={discRef}>
          <circle
            cx="100"
            cy="100"
            r="94"
            className="wax"
            {...(track.previewBg ? { style: { fill: track.previewBg } } : {})}
          />
          <circle cx="100" cy="100" r="92" className="rim" />
          {track.preview ? (
            <image
              href={`${import.meta.env.BASE_URL}${track.preview}`}
              x="14"
              y="14"
              width="172"
              height="172"
              preserveAspectRatio={track.previewFit === 'contain' ? 'xMidYMid meet' : 'xMidYMid slice'}
              clipPath={`url(#vinyl-label-${track.n})`}
            />
          ) : track.label ? (
            <>
              <circle cx="100" cy="100" r="86" fill={track.label.bg} />
              <text
                x="100"
                y="100"
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--display)"
                fontSize="84"
                fontWeight="700"
                fill={track.label.fg ?? 'var(--paper)'}
                letterSpacing="-0.02em"
              >
                {track.label.monogram}
              </text>
            </>
          ) : null}
          <circle cx="100" cy="100" r="86" className="label-ring" />
          <circle cx="100" cy="100" r="18" className="label-inner" />
        </g>
        <circle cx="100" cy="100" r="2.5" className="spindle" />
      </svg>
    </div>
  );
}

type RigProps = {
  ref: React.RefObject<HTMLDivElement | null>;
  side: 'A' | 'B';
};

// All-stroke sketch rig. The whole `<g class="sketch-ink">` group is wrapped
// by a feTurbulence/feDisplacementMap filter (ink-bleed-mixtape-disc) at a
// persistent low scale so every line reads as hand-drawn.
const Rig = ({ ref, side }: RigProps) => (
  <div className="rig" ref={ref} data-playing="false" data-side={side} aria-hidden="true">
    <svg viewBox="0 0 240 240" role="img" aria-label="Sketched vinyl with gramophone horn">
      <g className="sketch-ink">
        <rect x="10" y="36" width="220" height="176" rx="4" className="sk-base" />
        <g className="sk-hatch">
          <path d="M 22 198 L 32 208" />
          <path d="M 34 198 L 44 208" />
          <path d="M 46 198 L 56 208" />
          <path d="M 186 198 L 196 208" />
          <path d="M 198 198 L 208 208" />
          <path d="M 210 198 L 220 208" />
        </g>

        <g className="disc">
          <circle cx="108" cy="120" r="92" className="sk-wax" />
          <circle cx="108" cy="120" r="88" className="sk-rim" />

          {[82, 74, 66].map((r) => (
            <circle key={r} cx="108" cy="120" r={r} className="sk-groove" />
          ))}

          <circle cx="108" cy="120" r="58" className="sk-label" />
          <circle cx="108" cy="120" r="50" className="sk-label-inner" />
          <circle cx="108" cy="120" r="6" className="sk-label-dot" />

          <defs>
            <path
              id="mixtape-label-top"
              d="M 64 120 A 44 44 0 0 1 152 120"
              fill="none"
            />
            <path
              id="mixtape-label-bottom"
              d="M 152 120 A 44 44 0 0 1 64 120"
              fill="none"
            />
          </defs>
          <text className="sk-label-text">
            <textPath href="#mixtape-label-top" startOffset="50%" textAnchor="middle">
              BAR · MIX
            </textPath>
          </text>
          <text className="sk-label-text">
            <textPath href="#mixtape-label-bottom" startOffset="50%" textAnchor="middle">
              {side === 'A' ? 'SIDE A · POSTS' : 'SIDE B · LAB'}
            </textPath>
          </text>

          <circle cx="108" cy="74" r="1.4" className="sk-witness" />
        </g>

        <circle cx="108" cy="120" r="1.8" className="sk-spindle" />

        <g className="horn">
          <rect x="212" y="200" width="14" height="12" rx="1.5" className="sk-horn-mount" />
          <path d="M 214 200 L 220 200 L 223 186 L 217 186 Z" className="sk-horn-neck" />
          <path
            d="M 217 187
               C 219 180, 225 172, 230 164
               L 234 154
               L 237 162
               C 234 172, 228 182, 223 187 Z"
            className="sk-horn-body"
          />
          <ellipse
            cx="235"
            cy="158"
            rx="5"
            ry="2.6"
            transform="rotate(-42 235 158)"
            className="sk-horn-rim"
          />
          <g className="sk-horn-hatch">
            <path d="M 221 182 L 225 178" />
            <path d="M 224 176 L 228 170" />
            <path d="M 228 168 L 231 163" />
          </g>
          <g className="sk-waves">
            <path d="M 240 154 Q 244 158 240 162" className="sk-wave w1" />
            <path d="M 244 150 Q 250 158 244 166" className="sk-wave w2" />
            <path d="M 248 147 Q 256 158 248 169" className="sk-wave w3" />
          </g>
        </g>

        <g className="tonearm">
          <rect x="190" y="44" width="16" height="6" rx="1" className="sk-arm-base" />
          <rect x="198" y="34" width="14" height="8" rx="1.5" className="sk-arm-counterweight" />
          <circle cx="198" cy="40" r="5" className="sk-arm-joint" />
          <line x1="108" y1="40" x2="196" y2="40" className="sk-arm-shaft" />
          <rect x="100" y="37" width="14" height="8" rx="1" className="sk-arm-head" />
          <path d="M 105 45 L 102 52 L 109 52 Z" className="sk-arm-needle" />
        </g>
      </g>
    </svg>
  </div>
);
