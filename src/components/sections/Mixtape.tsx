import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
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
  setMuted as setAudioMuted,
  setReducedMotion as setAudioReducedMotion,
  setRpm as setAudioRpm,
  setSide as setAudioSide,
  setVolume as setAudioVolume,
  startBed,
  stopBed,
  unlock as unlockAudio,
} from '../../lib/vinylAudio';

const AUDIO_KEY = 'bm:vinyl-audio';
const RPM_KEY = 'bm:vinyl-rpm';
const VOLUME_KEY = 'bm:vinyl-volume';
const MUTE_KEY = 'bm:vinyl-mute';
const VOLUME_DEFAULT = 0.65;

type Rpm = 33 | 45 | 78;
const RPM_OPTIONS: Rpm[] = [33, 45, 78];
const RPM_LABEL: Record<Rpm, string> = { 33: '33⅓', 45: '45', 78: '78' };
// Tempo multiplier vs. the 33⅓ baseline at which each composition was written.
const RPM_RATE: Record<Rpm, number> = { 33: 1, 45: 1.35, 78: 2.34 };
// Disc rotation period in seconds — 33⅓ rpm = 1.8 s/rev, scaled for the SVG.
const RPM_SPIN: Record<Rpm, string> = { 33: '3s', 45: '2.22s', 78: '1.28s' };
// Angle of each detent notch on the knob rim (degrees from the bottom of
// the knob, positive clockwise). Three-click stop: 33 sweeps left, 78
// sweeps right.
const RPM_ANGLE: Record<Rpm, number> = { 33: -40, 45: 0, 78: 40 };

type Track = {
  n: string;
  side: 'A' | 'B';
  kind: 'post' | 'experiment';
  date: string;
  tag: string;
  title: string;
  body: string;
  hashtags: string;
  /** External write-up. Present on posts and on experiment tracks that also have a companion post. */
  href?: string;
  /** Override the track-link label when `href` points somewhere other than a blog post (e.g. a live app). */
  linkLabel?: string;
  /** Optional second external link rendered after the primary `href`. Used for write-ups that accompany a live app. */
  secondaryHref?: string;
  /** Label for `secondaryHref`. Defaults to `'Read the write-up →'` in the renderer. */
  secondaryLabel?: string;
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

type TrackBase = Omit<Track, 'n' | 'side'>;

// Source list. Side ('A'/'B') and track number ('A1', 'B2', ...) are assigned
// at runtime by `shuffleAndAssignSides` so each page load gets a fresh layout
// with a balanced split (counts differ by at most 1). The first entry is
// pinned to A1 — keep the Temporal track on top.
const TRACKS: TrackBase[] = [
  {
    kind: 'post',
    date: 'MAR 2025',
    tag: '★ featured',
    title: "Read it on Temporal's Code Exchange.",
    body:
      "My Cross-Language Data Processing Service, which coordinates Python, Go, and TypeScript through a single Temporal workflow, was picked up for Temporal's official Code Exchange. A Medium write-up went out with it.",
    hashtags: '#temporal   #opensource   #python   #go',
    href: 'https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal',
    preview: 'tracks/temporal.jpg',
    previewBg: '#684b36',
    featured: true,
  },
  {
    kind: 'post',
    date: 'JAN 2026',
    tag: '// gift',
    title: 'A tiny Flappy Bird for a wedding gift.',
    body:
      'My cousin Chen was getting married. Her fiancé is into DJI drones, so I built a small drone-themed Flappy Bird with a "Ring Delivered!" finish, a "Chen said YES!" screen, and an endless mode. About 200 lines of code, given as a wedding gift.',
    hashtags: '#javascript   #canvas   #gift',
    href: 'https://v0-chenandoz.vercel.app/',
    preview: 'tracks/ring-quest.jpg',
    previewBg: '#91ccf5',
  },
  {
    kind: 'post',
    date: 'FEB 2026',
    tag: '// launch',
    title: 'Shipping Joomsy — meaningful moments across the distance.',
    body:
      'Kids connect with grandparents, family, and friends through interactive video calls — reading books together, playing gesture-based games, with more coming. Over 35 million US grandparents live more than 200 miles from a grandchild. Joomsy helps close that distance.',
    hashtags: '#startup   #product   #video',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7421903131573366784/',
    preview: 'tracks/joomsy.jpg',
    previewBg: '#f7c80c',
  },
  {
    kind: 'experiment',
    date: 'MAR 2023',
    tag: 'Tech-Music Hack · Afeka × Rimon',
    title: 'MIDI Violin — Arduino hack, 3rd place.',
    body:
      'Second year at the Afeka × Rimon Tech-Music Hackathon. My first time using an Arduino. After 24 hours, the team had wired a real violin into a MIDI controller that handles vibrato and glissando (mostly). We added fairy lights for fun. Placed third.',
    hashtags: '#arduino   #midi   #hackathon',
    href: 'https://www.linkedin.com/posts/barmoshe_musichackathon-arduino-midiviolin-share-7047819554294501377-CTdU',
    preview: 'tracks/midi-violin.jpg',
    previewBg: '#8d512e',
  },
  {
    kind: 'post',
    date: 'AUG 2024',
    tag: '// bootcamp final',
    title: 'Israelify — our Spotify-clone final project.',
    body:
      'Final project from Coding Academy Israel. Built in a pair over a few weeks: a music streaming platform with real-time collaboration and personalized recommendations. Node.js and MongoDB backend, React frontend. Demo and repos in the post.',
    hashtags: '#react   #nodejs   #mongodb   #bootcamp',
    href: 'https://www.linkedin.com/posts/barmoshe_proud-to-present-israelifyspotify-web-clone-share-7224361235268476928-Qu9-',
    preview: 'tracks/israelify.jpg',
    previewBg: '#2f7be0',
  },
  {
    kind: 'experiment',
    date: 'APR 2026',
    tag: 'Self-directed · 2026',
    title: 'Biome Synth — five-biome browser instrument.',
    body:
      'Started as a Claude skill I wrote that interviews you with AskUserQuestion to build a full project brief, no technical background needed. I used that brief to build the app: a browser instrument with five biomes and an AI DJ that moves through five states (DRIFT, PULSE, BLOOM, SURGE, DISSOLVE). Built with Tone.js, Three.js, and Canvas2D, polished in Lovable.',
    hashtags: '#tonejs   #threejs   #webaudio   #synth   #claude',
    href: 'https://biome-synth.lovable.app/',
    linkLabel: 'Play the app →',
    secondaryHref:
      'https://www.linkedin.com/posts/barmoshe_claude-skill-activity-7450179482327576576-M9J9',
    secondaryLabel: 'Read the write-up →',
    preview: 'tracks/biome-synth.jpg',
    previewFit: 'contain',
    previewBg: '#12192f',
    featured: true,
  },
  {
    kind: 'experiment',
    date: 'JAN 2025',
    tag: 'Global Game Jam · 2025',
    title: 'Hamster Bubbles — my first Global Game Jam, on audio.',
    body:
      'My first Global Game Jam: 48 hours to build a game around a secret theme announced at the start of the weekend. The theme was "Bubbles." First time taking on sound design and music for a project. Big thanks to Yuval Dorfman, Noam Goldfarb, Yotam Goren, and Yuval Beck for getting through the chaos with me.',
    hashtags: '#ggj   #sfx   #gamejam   #audio',
    href: 'https://www.linkedin.com/posts/barmoshe_globalgamejam-sfx-ggj-activity-7289377770042773505-u7Me',
    preview: 'tracks/hamster-bubbles.jpg',
    previewBg: '#a3d4f5',
  },
  {
    kind: 'experiment',
    date: 'FEB 2026',
    tag: 'Global Game Jam · 2026',
    title: 'Masking Through — adaptive score for a cardboard-doctor short.',
    body:
      'Second year doing audio. A cut-out cardboard world: tie-wearing doctor, smiling pink flowers, a hand-lettered title card. Scored in Unity and FMOD with layered stems that respond to player state (vertical layers, horizontal cues). I had Cursor write the sound-effect code (C# synth, mixer, effects chain) while I directed. One 48-hour weekend, no manual setup.',
    hashtags: '#ggj2026   #fmod   #unity   #cursor   #adaptive',
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7423731964278358016/',
    preview: 'tracks/masking-through.jpg',
    previewBg: '#556b77',
  },
];

// Pin the first track to A1; Fisher-Yates the rest, then split into two
// near-equal halves and assign Side A / Side B with sequential numbers
// (A1, A2, ..., B1, B2, ...). Side A gets the first ceil(N/2) tracks,
// Side B gets the rest, so the counts differ by at most 1.
function shuffleAndAssignSides(base: TrackBase[]): Track[] {
  const [pinned, ...rest] = base;
  const arr = [...rest];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  const ordered = pinned ? [pinned, ...arr] : arr;
  const sideACount = Math.ceil(ordered.length / 2);
  let aIdx = 0;
  let bIdx = 0;
  return ordered.map((t, i) => {
    const side: 'A' | 'B' = i < sideACount ? 'A' : 'B';
    const n = side === 'A' ? `A${++aIdx}` : `B${++bIdx}`;
    return { ...t, side, n };
  });
}

const stageStyle: CSSProperties = { marginTop: 36 };


export default function Mixtape() {
  const rootRef = useRef<HTMLElement | null>(null);
  const rigRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const [side, setSide] = useState<'A' | 'B'>('A');
  const tracks = useMemo(() => shuffleAndAssignSides(TRACKS), []);
  const visible = tracks.filter((t) => t.side === side);

  // Intentionally session-only — every page load starts muted/stopped so the
  // user's first gesture is always the explicit Start button. A previously
  // persisted "on" combined with the old auto-unlock-on-any-click listener
  // let audio start without the user pressing Start; that felt like autoplay.
  const [audioOn, setAudioOn] = useState<boolean>(false);

  const [rpm, setRpm] = useState<Rpm>(() => {
    try {
      const v = parseInt(localStorage.getItem(RPM_KEY) ?? '33', 10) as Rpm;
      return RPM_OPTIONS.includes(v) ? v : 33;
    } catch {
      return 33;
    }
  });

  const [volume, setVolume] = useState<number>(() => {
    try {
      const raw = localStorage.getItem(VOLUME_KEY);
      const parsed = raw == null ? VOLUME_DEFAULT : parseFloat(raw);
      return Number.isFinite(parsed) ? Math.max(0, Math.min(1, parsed)) : VOLUME_DEFAULT;
    } catch {
      return VOLUME_DEFAULT;
    }
  });

  const [muted, setMuted] = useState<boolean>(() => {
    try {
      return localStorage.getItem(MUTE_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [announce, setAnnounce] = useState('');
  // Re-announce identical strings (e.g. two consecutive volume tweaks at the
  // same percentage) by appending a zero-width space — the screen reader
  // sees a "different" value and re-reads it.
  const announceRef = useRef(0);
  const announceMessage = (msg: string) => {
    announceRef.current += 1;
    setAnnounce(msg + '​'.repeat(announceRef.current % 2));
  };

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
    setAudioVolume(volume);
    try {
      localStorage.setItem(VOLUME_KEY, volume.toFixed(3));
    } catch {
      /* ignore */
    }
  }, [volume]);

  useEffect(() => {
    setAudioMuted(muted);
    try {
      localStorage.setItem(MUTE_KEY, muted ? '1' : '0');
    } catch {
      /* ignore */
    }
  }, [muted]);

  // Forward `prefers-reduced-motion` into the audio engine. Mirrors how the
  // visual layer suppresses motion — we suppress the audio "motion" layer
  // (tape wow/flutter, ghost snares, fills, swells) but keep the music
  // playing.
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setAudioReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useEffect(() => {
    if (!audioOn && isAudioEnabled()) setAudioEnabled(false);
  }, [audioOn]);

  useEffect(() => () => stopBed(), []);

  const toggleAudio = () => {
    const next = !audioOn;
    setAudioOn(next);
    if (next) {
      unlockAudio();
      setAudioEnabled(true);
      // Re-apply current volume / mute / reduced-motion state — the audio
      // chain may have just been instantiated and won't have heard the
      // earlier setters.
      setAudioVolume(volume);
      setAudioMuted(muted);
      sfxNeedleDrop(side);
      setTimeout(() => startBed(side), 220);
      announceMessage(`Mixtape playing side ${side}.`);
    } else {
      setAudioEnabled(false);
      announceMessage('Mixtape stopped.');
    }
    try {
      localStorage.setItem(AUDIO_KEY, next ? '1' : '0');
    } catch {
      /* ignore */
    }
  };

  const flipSide = () => {
    const next = side === 'A' ? 'B' : 'A';
    sfxFlip();
    setAudioSide(next);
    setSide(next);
    announceMessage(`Now playing side ${next}.`);
  };

  const onVolumeChange = (v: number) => {
    setVolume(v);
    announceMessage(`Volume ${Math.round(v * 100)} percent.`);
  };

  const toggleMute = () => {
    const next = !muted;
    setMuted(next);
    announceMessage(next ? 'Audio muted.' : 'Audio unmuted.');
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
              },
              onLeaveBack: () => {
                rig.setAttribute('data-playing', 'false');
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
        <b>03</b> // MIXTAPE
      </div>
      <span className="stamp">MIXTAPE</span>
      <h2 className="headline">
        What I've <em>made.</em>
      </h2>
      <p className="dek">
        A mix of finished projects and experiments, shuffled across both sides. Flip to switch sides, tap a card to read more.
      </p>

      <div className="music-stage" style={stageStyle}>
        <Rig
          ref={rigRef}
          side={side}
          audioOn={audioOn}
          rpm={rpm}
          volume={volume}
          muted={muted}
          onAudioToggle={toggleAudio}
          onFlip={flipSide}
          onRpmChange={setRpm}
          onVolumeChange={onVolumeChange}
          onMuteToggle={toggleMute}
        />
        <div className="vinyl-live" role="status" aria-live="polite" aria-atomic="true">
          {announce}
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
                {t.linkLabel ?? 'Read the post →'}
              </a>
            ) : null}
            {t.secondaryHref ? (
              <a
                className="track-link"
                href={t.secondaryHref}
                target="_blank"
                rel="noopener"
              >
                {t.secondaryLabel ?? 'Read the write-up →'}
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
  audioOn: boolean;
  rpm: Rpm;
  volume: number;
  muted: boolean;
  onAudioToggle: () => void;
  onFlip: () => void;
  onRpmChange: (r: Rpm) => void;
  onVolumeChange: (v: number) => void;
  onMuteToggle: () => void;
};

// All-stroke sketch rig. The whole `<g class="sketch-ink">` group is wrapped
// by a feTurbulence/feDisplacementMap filter (ink-bleed-mixtape-disc) at a
// persistent low scale so every line reads as hand-drawn.
const Rig = ({
  ref,
  side,
  audioOn,
  rpm,
  volume,
  muted,
  onAudioToggle,
  onFlip,
  onRpmChange,
  onVolumeChange,
  onMuteToggle,
}: RigProps) => (
  <>
  <div
    className="rig"
    ref={ref}
    data-playing="false"
    data-audio={audioOn ? 'on' : 'off'}
    data-side={side}
  >
    <svg
      viewBox="0 0 240 300"
      role="group"
      aria-label="Mixtape turntable. RPM knob, start button, and side toggle."
    >
      <g className="sketch-ink">
        <rect x="10" y="36" width="220" height="246" rx="4" className="sk-base" />
        <line x1="20" y1="214" x2="220" y2="214" className="sk-divider" />

        <g className="disc">
          <circle cx="108" cy="120" r="92" className="sk-wax" />
          <circle cx="108" cy="120" r="88" className="sk-rim" />

          {[82, 74, 66].map((r) => (
            <circle key={r} cx="108" cy="120" r={r} className="sk-groove" />
          ))}

          <circle cx="108" cy="120" r="58" className="sk-label" />
          <circle cx="108" cy="120" r="50" className="sk-label-inner" />
          <circle cx="108" cy="120" r="10" className="sk-label-dot" />

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
              {side === 'A' ? 'SIDE A · HITS' : 'SIDE B · CUTS'}
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

        <g
          className="sk-knob"
          role="button"
          aria-label={`Playback speed: ${RPM_LABEL[rpm]} rpm. Click to cycle speeds.`}
          tabIndex={0}
          data-rpm={rpm}
          onClick={() => {
            const i = RPM_OPTIONS.indexOf(rpm);
            onRpmChange(RPM_OPTIONS[(i + 1) % RPM_OPTIONS.length]);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              const i = RPM_OPTIONS.indexOf(rpm);
              onRpmChange(RPM_OPTIONS[(i + 1) % RPM_OPTIONS.length]);
            }
          }}
        >
          <circle cx="46" cy="232" r="17" className="sk-knob-body" />
          <circle cx="46" cy="232" r="13" className="sk-knob-cap" />
          {RPM_OPTIONS.map((r) => {
            const rad = (RPM_ANGLE[r] * Math.PI) / 180;
            const x1 = 46 + 13 * Math.sin(rad);
            const y1 = 232 + 13 * Math.cos(rad);
            const x2 = 46 + 17 * Math.sin(rad);
            const y2 = 232 + 17 * Math.cos(rad);
            return (
              <line
                key={r}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                className="sk-knob-notch"
                data-active={rpm === r ? 'true' : 'false'}
              />
            );
          })}
          <text x="46" y="235" className="sk-knob-value" textAnchor="middle">
            {RPM_LABEL[rpm]}
          </text>
          <text x="46" y="256" className="sk-ctrl-label">RPM</text>
        </g>

        <g
          className="sk-button"
          role="button"
          aria-pressed={audioOn}
          aria-label={
            audioOn
              ? `Stop mixtape (Side ${side})`
              : `Start mixtape (Side ${side})`
          }
          tabIndex={0}
          data-on={audioOn ? 'true' : 'false'}
          onClick={onAudioToggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAudioToggle();
            }
          }}
        >
          <circle cx="120" cy="232" r="16" className="sk-button-rim" />
          <circle cx="120" cy="232" r="12" className="sk-button-cap" />
          {audioOn ? (
            <rect
              x="115"
              y="227"
              width="10"
              height="10"
              rx="1"
              className="sk-button-glyph"
            />
          ) : (
            <path
              d="M 116 226 L 116 238 L 126 232 Z"
              className="sk-button-glyph"
            />
          )}
          <text x="120" y="257" className="sk-ctrl-label">
            {audioOn ? 'STOP' : 'START'}
          </text>
        </g>

        <g
          className="sk-toggle"
          role="button"
          aria-label={`Flip to side ${side === 'A' ? 'B' : 'A'}. Currently on side ${side}.`}
          tabIndex={0}
          data-side={side}
          onClick={onFlip}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onFlip();
            }
          }}
        >
          <rect x="170" y="220" width="50" height="24" rx="4" className="sk-toggle-body" />
          <rect
            x={side === 'A' ? 172 : 197}
            y="222"
            width="21"
            height="20"
            rx="3"
            className="sk-toggle-cap"
          />
          <text x="182" y="236" className="sk-toggle-letter">A</text>
          <text x="208" y="236" className="sk-toggle-letter">B</text>
          <text x="195" y="257" className="sk-ctrl-label">SIDE</text>
        </g>

        <text x="120" y="272" className="sk-caption-kicker" textAnchor="middle">
          NOW CUEING · <tspan className="sk-caption-side">SIDE {side}</tspan>
        </text>
      </g>
    </svg>
  </div>
  <div className="rig-controls">
    <button
      type="button"
      className="vinyl-mute"
      aria-pressed={muted}
      aria-label={muted ? 'Unmute mixtape audio' : 'Mute mixtape audio'}
      onClick={onMuteToggle}
      data-muted={muted ? 'true' : 'false'}
    >
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4 9 H8 L13 5 V19 L8 15 H4 Z" />
        {muted ? (
          <>
            <line x1="16" y1="9" x2="21" y2="14" />
            <line x1="21" y1="9" x2="16" y2="14" />
          </>
        ) : (
          <>
            <path d="M16 8 Q19 12 16 16" fill="none" />
            <path d="M18 6 Q22 12 18 18" fill="none" />
          </>
        )}
      </svg>
      <span className="vinyl-mute-label">{muted ? 'MUTED' : 'MUTE'}</span>
    </button>
    <label className="vinyl-volume">
      <span className="vinyl-volume-label">VOL</span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={Math.round(volume * 100)}
        onChange={(e) => onVolumeChange(parseInt(e.target.value, 10) / 100)}
        aria-label="Mixtape master volume"
        aria-valuetext={`${Math.round(volume * 100)} percent`}
      />
      <span className="vinyl-volume-readout">{Math.round(volume * 100)}</span>
    </label>
  </div>
  </>
);
