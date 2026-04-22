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
    href: 'https://open.spotify.com/user/21s4s2znrtdcexhasidrxi37y',
    target: '_blank',
    rel: 'noopener',
    rotate: '.5deg',
    shadowColor: 'var(--green)',
    kickerColor: 'var(--green)',
    kickerLeft: '// spotify',
    kickerRight: 'listening',
    title: "What's in rotation.",
    value: 'open.spotify.com',
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
          gsap.set(split.chars, { opacity: 0, yPercent: 80, rotate: -6 });
          gsap.to(split.chars, {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.7,
            stagger: 0.04,
            ease: 'back.out(1.8)',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(headline, 'letter');
        }

        if (dek) {
          gsap.set(dek, { opacity: 0, y: 12 });
          gsap.to(dek, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            delay: 0.2,
            scrollTrigger: { trigger: dek, start: 'top 85%' },
          });
        }

        if (footer) {
          gsap.set(footer, { opacity: 0, y: 16 });
          gsap.to(footer, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: footer, start: 'top 90%' },
          });
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        cards.forEach((el, i) => {
          const s = DESKTOP_SCATTER[i % DESKTOP_SCATTER.length]!;
          gsap.set(el, { opacity: 0, x: s.x, y: s.y, rotate: s.r, scale: 0.85 });
        });
        gsap.to(cards, {
          opacity: 1,
          x: 0,
          y: 0,
          rotate: (i) => parseFloat(CARDS[i]?.rotate ?? '0deg'),
          scale: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power4.out',
          scrollTrigger: { trigger: grid, start: 'top 80%' },
        });
      });

      mm.add(MOBILE_QUERY, () => {
        cards.forEach((el, i) => {
          const s = MOBILE_SCATTER[i % MOBILE_SCATTER.length]!;
          gsap.set(el, { opacity: 0, x: s.x, y: s.y, rotate: s.r, scale: 0.88 });
          gsap.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: parseFloat(CARDS[i]?.rotate ?? '0deg'),
            scale: 1,
            duration: 0.75,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="letter" ref={rootRef}>
      <div className="folio">
        <b>07</b> // PING
      </div>
      <h2 className="headline" style={{ textAlign: 'center' }}>
        Say <em>hi.</em>
      </h2>
      <p
        className="dek"
        style={{ textAlign: 'center', marginLeft: 'auto', marginRight: 'auto' }}
      >
        Pick a channel. I actually reply - usually same day.
      </p>

      <div
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
          gap: 22,
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
