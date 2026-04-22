// Music section — "Mixtape J-Card" layout.
//
// TODO: replace the placeholder tracks below with real titles, runtimes,
// link URLs, and tech-stack notes when the liner notes are ready.

import { useRef, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { attachInkBleed } from '../../lib/inkBleed';

type Track = {
  slot: string; // "A1", "B2"
  runtime: string; // "03:24"
  title: string;
  tech: string;
  href: string;
};

const SIDE_A: Track[] = [
  {
    slot: 'A1',
    runtime: '03:24',
    title: '[PLACEHOLDER] Browser granular synth',
    tech: 'webaudio · canvas',
    href: '#music',
  },
  {
    slot: 'A2',
    runtime: '02:51',
    title: '[PLACEHOLDER] Live-coding playground',
    tech: 'tidal · strudel',
    href: '#music',
  },
  {
    slot: 'A3',
    runtime: '04:07',
    title: '[PLACEHOLDER] Auto-DJ / beat-match prototype',
    tech: 'claude · webaudio',
    href: '#music',
  },
  {
    slot: 'A4',
    runtime: '01:58',
    title: '[PLACEHOLDER] MIDI gesture → visualizer',
    tech: 'webmidi · canvas',
    href: '#music',
  },
];

const SIDE_B: Track[] = [
  {
    slot: 'B1',
    runtime: '05:12',
    title: '[PLACEHOLDER] Global Game Jam 2026 — audio lead',
    tech: 'unity · c# synth',
    href: '#music',
  },
  {
    slot: 'B2',
    runtime: '04:30',
    title: '[PLACEHOLDER] Global Game Jam 2025 — procedural SFX',
    tech: 'unity',
    href: '#music',
  },
  {
    slot: 'B3',
    runtime: '03:45',
    title: '[PLACEHOLDER] Global Game Jam 2024 — sound design debut',
    tech: 'unity',
    href: '#music',
  },
  {
    slot: 'B4',
    runtime: '06:02',
    title: '[PLACEHOLDER] Music Hack Day — weekend build',
    tech: 'tbd',
    href: '#music',
  },
];

// Hand-placed jagged waveform across 800×60 viewBox.
const WAVE_PATH =
  'M0 30 L20 22 L40 18 L60 34 L80 15 L100 32 L120 10 L140 38 L160 14 L180 36 L200 22 L220 28 L240 8 L260 42 L280 20 L300 30 L320 12 L340 38 L360 18 L380 34 L400 16 L420 40 L440 20 L460 32 L480 14 L500 36 L520 22 L540 26 L560 10 L580 42 L600 18 L620 30 L640 14 L660 38 L680 20 L700 34 L720 16 L740 32 L760 24 L780 28 L800 30';

const cardStyle: CSSProperties = {
  background: 'var(--surface-1)',
  color: 'var(--ink)',
  border: '1.5px solid var(--ink)',
  boxShadow: '8px 10px 0 var(--ink)',
  transform: 'rotate(-.6deg)',
  padding: 0,
  overflow: 'hidden',
};

const spineStyle: CSSProperties = {
  background: 'var(--surface-strong)',
  color: 'var(--surface-strong-fg)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 12,
  padding: '10px 18px',
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.25em',
  textTransform: 'uppercase',
  borderBottom: '1.5px solid var(--ink)',
};

const tracklistStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
};

const sideColStyle = (borderRight: boolean): CSSProperties => ({
  padding: '20px 22px 12px',
  borderRight: borderRight ? '1.5px dashed var(--ink-faint)' : 'none',
  position: 'relative',
});

const sideHeaderStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'space-between',
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
  marginBottom: 14,
  paddingBottom: 8,
  borderBottom: '1px solid var(--ink-faint)',
};

const sideLetterStyle = (color: string): CSSProperties => ({
  fontFamily: 'var(--display)',
  fontWeight: 800,
  fontSize: '1.9rem',
  color,
  lineHeight: 1,
  letterSpacing: 0,
});

const rowStyle: CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '34px 50px 1fr auto',
  alignItems: 'baseline',
  gap: 10,
  padding: '8px 6px',
  borderBottom: '1px dotted var(--ink-faint)',
  position: 'relative',
};

const slotStyle = (color: string): CSSProperties => ({
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.12em',
  color: 'var(--paper)',
  background: color,
  padding: '2px 6px',
  width: 'fit-content',
  justifySelf: 'start',
});

const runtimeStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  color: 'var(--ink-soft)',
  letterSpacing: '.08em',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--serif)',
  fontSize: '1rem',
  color: 'var(--ink)',
  lineHeight: 1.35,
  margin: 0,
};

const techStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 10.5,
  letterSpacing: '.12em',
  color: 'var(--ink-soft)',
  textTransform: 'lowercase',
  textAlign: 'right',
  whiteSpace: 'nowrap',
};

const playStyle: CSSProperties = {
  position: 'absolute',
  left: -14,
  top: '50%',
  transform: 'translateY(-50%)',
  fontSize: 12,
  color: 'var(--ink)',
};

const marginNoteStyle = (rotate: string): CSSProperties => ({
  fontFamily: 'var(--hand)',
  color: 'var(--green)',
  fontSize: 18,
  transform: `rotate(${rotate})`,
  marginTop: 10,
  display: 'inline-block',
});

const waveWrapStyle: CSSProperties = {
  padding: '6px 20px 10px',
  borderTop: '1.5px dashed var(--ink-faint)',
  borderBottom: '1.5px solid var(--ink)',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 10,
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '10px 18px',
  fontFamily: 'var(--mono)',
  fontSize: 10.5,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--ink-soft)',
};

function ReelHole() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      aria-hidden="true"
      style={{ display: 'inline-block', flex: 'none' }}
    >
      <circle cx="6" cy="6" r="4.5" fill="none" stroke="currentColor" strokeWidth="1" />
      <circle cx="6" cy="6" r="1" fill="currentColor" />
    </svg>
  );
}

type SideProps = {
  letter: 'A' | 'B';
  title: string;
  tracks: Track[];
  color: string;
  note: string;
  noteRotate: string;
  borderRight: boolean;
};

function SideColumn({
  letter,
  title,
  tracks,
  color,
  note,
  noteRotate,
  borderRight,
}: SideProps) {
  return (
    <div style={sideColStyle(borderRight)}>
      <div style={sideHeaderStyle}>
        <span style={sideLetterStyle(color)}>Side {letter}</span>
        <span>{title}</span>
      </div>
      <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
        {tracks.map((t) => (
          <li key={t.slot}>
            <a
              href={t.href}
              className="mixtape-row"
              data-track-side={letter}
              aria-label={`Placeholder track ${t.slot}: ${t.title.replace('[PLACEHOLDER] ', '')}`}
              style={rowStyle}
            >
              <span aria-hidden="true" className="mixtape-play" style={playStyle}>
                ▶
              </span>
              <span style={slotStyle(color)}>{t.slot}</span>
              <span style={runtimeStyle}>{t.runtime}</span>
              <p style={titleStyle}>{t.title}</p>
              <span style={techStyle}>{t.tech}</span>
            </a>
          </li>
        ))}
      </ul>
      <span style={marginNoteStyle(noteRotate)}>{note}</span>
    </div>
  );
}

export default function Music() {
  const rootRef = useRef<HTMLElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const card = cardRef.current;
      const wave = waveRef.current;
      if (!root || !card) return;

      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const rowsA = Array.from(
        card.querySelectorAll<HTMLElement>('[data-track-side="A"]'),
      );
      const rowsB = Array.from(
        card.querySelectorAll<HTMLElement>('[data-track-side="B"]'),
      );

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
          split = new SplitText(headline, { type: 'words' });
          gsap.set(split.words, { opacity: 0, yPercent: 60 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power4.out',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(headline, 'music');
        }

        if (dek) {
          gsap.set(dek, { opacity: 0, y: 14 });
          gsap.to(dek, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: dek, start: 'top 85%' },
          });
        }

        // J-card folds down onto the page.
        gsap.set(card, {
          opacity: 0,
          y: 36,
          rotateX: -12,
          transformPerspective: 900,
          transformOrigin: 'top center',
        });
        gsap.to(card, {
          opacity: 1,
          y: 0,
          rotateX: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 85%' },
        });

        if (wave) {
          const len = wave.getTotalLength();
          gsap.set(wave, { strokeDasharray: len, strokeDashoffset: len });
          gsap.to(wave, {
            strokeDashoffset: 0,
            duration: 1.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: card, start: 'top 75%' },
          });
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        [rowsA, rowsB].forEach((rows) => {
          if (!rows.length) return;
          gsap.set(rows, { opacity: 0, y: 10 });
          gsap.to(rows, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power3.out',
            scrollTrigger: { trigger: card, start: 'top 80%' },
          });
        });
      });

      mm.add(MOBILE_QUERY, () => {
        const all = [...rowsA, ...rowsB];
        if (!all.length) return;
        gsap.set(all, { opacity: 0, x: -12 });
        gsap.to(all, {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="music" ref={rootRef}>
      <style>{MIXTAPE_CSS}</style>

      <div className="folio">
        <b>05</b> // OFF-KEYBOARD
      </div>
      <span className="stamp">MIXTAPE</span>
      <h2 className="headline">
        Liner notes, <em>mostly in progress.</em>
      </h2>
      <p className="dek">
        Music-tech sketches on Side A, game-jam audio duty and hackathon nights on Side B.
        Placeholder tape — real details coming.
      </p>

      <section style={{ marginTop: 36 }}>
        <div ref={cardRef} className="mixtape-card" style={cardStyle}>
          <div className="mixtape-spine" style={spineStyle}>
            <span>♪ BAR MOSHE</span>
            <span
              className="mixtape-spine-side"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 12 }}
            >
              <ReelHole />
              Side A / Side B
              <ReelHole />
            </span>
            <span>90 MIN · Dolby B ▾</span>
          </div>

          <div className="mixtape-tracklist" style={tracklistStyle}>
            <SideColumn
              letter="A"
              title="Studio Experiments"
              tracks={SIDE_A}
              color="var(--magenta)"
              note="ideas, mostly WIP →"
              noteRotate="-2deg"
              borderRight={true}
            />
            <SideColumn
              letter="B"
              title="Live Sessions"
              tracks={SIDE_B}
              color="var(--cyan)"
              note="← full stacks of caffeine"
              noteRotate="1.5deg"
              borderRight={false}
            />
          </div>

          <div style={waveWrapStyle}>
            <svg
              viewBox="0 0 800 60"
              preserveAspectRatio="none"
              width="100%"
              height="48"
              aria-hidden="true"
            >
              <path
                ref={waveRef}
                d={WAVE_PATH}
                fill="none"
                stroke="var(--ink)"
                strokeOpacity=".45"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div style={footerStyle}>
            <span>Total ≈ 31:49</span>
            <span>Placeholder tape — real liner notes coming soon</span>
          </div>
        </div>
      </section>
    </article>
  );
}

// Scoped style overrides for :hover and mobile stacking. Kept inline so this
// section ships self-contained and styles.css stays untouched.
const MIXTAPE_CSS = `
  #music .mixtape-row {
    color: var(--ink);
    text-decoration: none;
    transition: transform .2s ease, background .2s ease;
  }
  #music .mixtape-row:hover,
  #music .mixtape-row:focus-visible {
    transform: translateX(4px);
    background: oklch(0 0 0 / .05);
    outline: none;
  }
  #music .mixtape-row:hover .mixtape-play,
  #music .mixtape-row:focus-visible .mixtape-play {
    opacity: 1;
  }
  #music .mixtape-row .mixtape-play {
    opacity: 0;
    transition: opacity .2s ease;
  }
  html.dark #music .mixtape-row:hover,
  html.dark #music .mixtape-row:focus-visible {
    background: oklch(1 0 0 / .06);
  }
  @media (max-width: 820px) {
    #music .mixtape-card { transform: none !important; }
    #music .mixtape-tracklist { grid-template-columns: 1fr !important; }
    #music .mixtape-tracklist > div:first-child {
      border-right: none !important;
      border-bottom: 1.5px dashed var(--ink-faint);
    }
    #music .mixtape-spine { padding: 10px 14px !important; font-size: 10px !important; }
    #music .mixtape-spine .mixtape-spine-side { display: none !important; }
    #music .mixtape-row {
      grid-template-columns: auto auto 1fr !important;
      grid-template-rows: auto auto !important;
      gap: 6px 10px !important;
    }
    #music .mixtape-row > p { grid-column: 1 / -1 !important; }
    #music .mixtape-row > span:last-child { display: none !important; }
  }
`;
