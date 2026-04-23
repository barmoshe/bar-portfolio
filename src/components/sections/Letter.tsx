import { useRef, type CSSProperties } from 'react';
import HoverCard from '../HoverCard';
import {
  gsap,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';

type Card = {
  href: string;
  target?: string;
  rel?: string;
  rotate: string;
  shadowColor: string;
  kickerColor: string;
  kickerLeft: string;
  kickerRight: string;
  title: string;
  value: string;
};

const CARDS: Card[] = [
  {
    href: 'mailto:1barmoshe1@gmail.com',
    rotate: '-.9deg',
    shadowColor: 'var(--red)',
    kickerColor: 'var(--red)',
    kickerLeft: '// email',
    kickerRight: 'fastest',
    title: 'Write a proper letter.',
    value: '1barmoshe1@gmail.com',
  },
  {
    href: 'tel:+972546561465',
    rotate: '.7deg',
    shadowColor: 'var(--yellow)',
    kickerColor: 'var(--ink-soft)',
    kickerLeft: '// phone',
    kickerRight: 'GMT+3',
    title: 'Call or text.',
    value: '+972 54 656 1465',
  },
  {
    href: 'https://www.linkedin.com/in/barmoshe/',
    target: '_blank',
    rel: 'noopener',
    rotate: '-.5deg',
    shadowColor: 'var(--blue)',
    kickerColor: 'var(--blue)',
    kickerLeft: '// linkedin',
    kickerRight: 'work',
    title: 'Roles & referrals.',
    value: 'in/barmoshe',
  },
  {
    href: 'https://www.instagram.com/1barmoshe1',
    target: '_blank',
    rel: 'noopener',
    rotate: '-.8deg',
    shadowColor: 'var(--magenta)',
    kickerColor: 'var(--magenta)',
    kickerLeft: '// instagram',
    kickerRight: 'offstage',
    title: 'Life in frames.',
    value: '@1barmoshe1',
  },
  {
    href: 'https://wa.me/972546561465',
    target: '_blank',
    rel: 'noopener',
    rotate: '.5deg',
    shadowColor: 'var(--green)',
    kickerColor: 'var(--green)',
    kickerLeft: '// whatsapp',
    kickerRight: 'instant',
    title: 'Send a message.',
    value: 'wa.me/972546561465',
  },
  {
    href: 'https://github.com/barmoshe',
    target: '_blank',
    rel: 'noopener',
    rotate: '1deg',
    shadowColor: 'var(--purple)',
    kickerColor: 'var(--ink-soft)',
    kickerLeft: '// github',
    kickerRight: 'code',
    title: 'Read the source.',
    value: 'github.com/barmoshe',
  },
];

function restStyle(c: Card): CSSProperties {
  return {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: 'var(--paper)',
    border: '1.5px solid var(--ink)',
    padding: 22,
    transform: `rotate(${c.rotate})`,
    boxShadow: `6px 7px 0 ${c.shadowColor}`,
    textDecoration: 'none',
    color: 'var(--ink)',
    transition: 'transform .2s ease, box-shadow .2s ease',
  };
}

function hoverStyle(c: Card): CSSProperties {
  return {
    transform: 'rotate(0deg) translateY(-3px)',
    boxShadow: `9px 11px 0 ${c.shadowColor}`,
  };
}

const kickerStyle = (color: string): CSSProperties => ({
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color,
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
});

const titleStyle: CSSProperties = {
  fontFamily: 'var(--display)',
  fontSize: '1.35rem',
  lineHeight: 1.1,
  margin: 0,
};

const valueStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: '.95rem',
  color: 'var(--ink)',
};

// Fan-in scatter offsets per card (indexed). Desktop uses wide scatter;
// mobile stacks vertically so we use a tighter, bottom-biased rise.
const DESKTOP_SCATTER = [
  { x: -120, y: -40, r: -20 },
  { x: 140, y: -50, r: 24 },
  { x: -160, y: 30, r: -14 },
  { x: 130, y: 40, r: 22 },
  { x: -90, y: 70, r: -16 },
  { x: 160, y: 80, r: 20 },
];
// Tighter scatter for mobile - alternating left/right for visible motion.
const MOBILE_SCATTER = [
  { x: -32, y: 50, r: -6 },
  { x: 32, y: 55, r: 6 },
  { x: -28, y: 60, r: -5 },
  { x: 30, y: 50, r: 5 },
  { x: -34, y: 55, r: -4 },
  { x: 28, y: 60, r: 4 },
];

// Letter is the final section and tends to be read for longer; stretch the
// stale window so a user who lingers doesn't see it replay unnecessarily.
const LETTER_STALE_MS = 15000;

export default function Letter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = gridRef.current;
      if (!root || !grid) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const footer = root.querySelector<HTMLElement>('.letter-footer');
      const cards = Array.from(grid.children) as HTMLElement[];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (headline) {
          split = new SplitText(headline, { type: 'chars,words' });
          createReveal(
            split.chars,
            { opacity: 0, yPercent: 80, rotate: -6 },
            { opacity: 1, yPercent: 0, rotate: 0, duration: 0.7, stagger: 0.04, ease: 'back.out(1.8)' },
            { trigger: headline, start: 'top 80%', staleAfterMs: LETTER_STALE_MS },
          );
          cleanupBleed = attachInkBleed(headline, 'letter');
        }

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6, delay: 0.2 },
            { trigger: dek, start: 'top 85%', staleAfterMs: LETTER_STALE_MS },
          );
        }

        if (footer) {
          createReveal(
            footer,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.6 },
            { trigger: footer, start: 'top 90%', staleAfterMs: LETTER_STALE_MS },
          );
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        if (!cards.length) return;
        createReveal(
          cards,
          {
            opacity: 0,
            x: (i: number) => DESKTOP_SCATTER[i % DESKTOP_SCATTER.length]!.x,
            y: (i: number) => DESKTOP_SCATTER[i % DESKTOP_SCATTER.length]!.y,
            rotate: (i: number) => DESKTOP_SCATTER[i % DESKTOP_SCATTER.length]!.r,
            scale: 0.85,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: (i: number) => parseFloat(CARDS[i]?.rotate ?? '0deg'),
            scale: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'power4.out',
          },
          { trigger: grid, start: 'top 80%', staleAfterMs: LETTER_STALE_MS },
        );
      });

      mm.add(MOBILE_QUERY, () => {
        cards.forEach((el, i) => {
          const s = MOBILE_SCATTER[i % MOBILE_SCATTER.length]!;
          createReveal(
            el,
            { opacity: 0, x: s.x, y: s.y, rotate: s.r, scale: 0.88 },
            {
              opacity: 1,
              x: 0,
              y: 0,
              rotate: parseFloat(CARDS[i]?.rotate ?? '0deg'),
              scale: 1,
              duration: 0.75,
              ease: 'back.out(1.4)',
            },
            { trigger: el, start: 'top 92%', staleAfterMs: LETTER_STALE_MS },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="letter" ref={rootRef}>
      <div className="folio">
        <b>05</b> // PING
      </div>
      <h2 className="headline" style={{ textAlign: 'center' }}>
        Say <em>hi.</em>
      </h2>
      <p
        className="dek"
        style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Email, phone, or DM — whichever's easiest. I usually reply the same day.
      </p>

      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 40,
          maxWidth: 880,
          margin: '40px auto 0',
          padding: '0 4px',
        }}
      >
        {CARDS.map((c) => (
          <HoverCard
            key={c.href}
            href={c.href}
            target={c.target}
            rel={c.rel}
            className="ink-taped"
            rest={restStyle(c)}
            hover={hoverStyle(c)}
          >
            <div style={kickerStyle(c.kickerColor)}>
              <span>{c.kickerLeft}</span>
              <span>{c.kickerRight}</span>
            </div>
            <h3 style={titleStyle}>{c.title}</h3>
            <p style={{ ...valueStyle, wordBreak: c.href.startsWith('mailto:') ? 'break-all' : 'normal' }}>
              {c.value}
            </p>
          </HoverCard>
        ))}
      </div>

      <p
        className="letter-footer"
        style={{
          margin: '36px auto 0',
          maxWidth: 560,
          fontFamily: 'var(--serif)',
          fontStyle: 'italic',
          fontSize: '1rem',
          lineHeight: 1.55,
          color: 'var(--ink-soft)',
          textAlign: 'center',
        }}
      >
        Based in Tel Aviv · Open to remote ·{' '}
        <span
          style={{
            fontFamily: 'var(--mono)',
            fontStyle: 'normal',
            fontSize: '.8em',
            letterSpacing: '.15em',
            textTransform: 'uppercase',
            color: 'var(--green)',
          }}
        >
          ● available now
        </span>
      </p>
    </article>
  );
}
