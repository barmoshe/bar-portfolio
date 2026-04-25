import { useRef, type CSSProperties, type ComponentType } from 'react';
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
import {
  MailIcon,
  PhoneIcon,
  LinkedInIcon,
  InstagramIcon,
  WhatsAppIcon,
  GitHubIcon,
  TikTokIcon,
  FacebookIcon,
} from '../ContactIcons';

type IconComponent = ComponentType<{ size?: number }>;

type Card = {
  href: string;
  target?: string;
  rel?: string;
  rotate: string;
  shadowColor: string;
  kickerColor: string;
  kickerLeft: string;
  title: string;
  value: string;
  Icon: IconComponent;
  size: 'big' | 'small';
};

// Big cards come first in source order; small chips follow. The two
// groups render in their own containers but share this single array so
// the keyboard tab order stays predictable.
const CARDS: Card[] = [
  {
    href: 'mailto:1barmoshe1@gmail.com',
    rotate: '-.9deg',
    shadowColor: 'var(--red)',
    kickerColor: 'var(--red)',
    kickerLeft: '// email',
    title: 'Write a proper letter.',
    value: '1barmoshe1@gmail.com',
    Icon: MailIcon,
    size: 'big',
  },
  {
    href: 'https://www.linkedin.com/in/barmoshe/',
    target: '_blank',
    rel: 'noopener',
    rotate: '-.5deg',
    shadowColor: 'var(--blue)',
    kickerColor: 'var(--blue)',
    kickerLeft: '// linkedin',
    title: 'Roles & referrals.',
    value: 'in/barmoshe',
    Icon: LinkedInIcon,
    size: 'big',
  },
  {
    href: 'https://wa.me/972546561465',
    target: '_blank',
    rel: 'noopener',
    rotate: '.5deg',
    shadowColor: 'var(--green)',
    kickerColor: 'var(--green)',
    kickerLeft: '// whatsapp',
    title: 'Send a message.',
    value: 'wa.me/972546561465',
    Icon: WhatsAppIcon,
    size: 'big',
  },
  {
    href: 'https://github.com/barmoshe',
    target: '_blank',
    rel: 'noopener',
    rotate: '1deg',
    shadowColor: 'var(--purple)',
    kickerColor: 'var(--ink-soft)',
    kickerLeft: '// github',
    title: 'Read the source.',
    value: 'github.com/barmoshe',
    Icon: GitHubIcon,
    size: 'big',
  },
  {
    href: 'tel:+972546561465',
    rotate: '0deg',
    shadowColor: 'var(--yellow)',
    kickerColor: 'var(--ink-soft)',
    kickerLeft: '// phone',
    title: 'Call or text.',
    value: '+972 54 656 1465',
    Icon: PhoneIcon,
    size: 'small',
  },
  {
    href: 'https://www.instagram.com/1barmoshe1',
    target: '_blank',
    rel: 'noopener',
    rotate: '0deg',
    shadowColor: 'var(--magenta)',
    kickerColor: 'var(--magenta)',
    kickerLeft: '// instagram',
    title: 'Life in frames.',
    value: '@1barmoshe1',
    Icon: InstagramIcon,
    size: 'small',
  },
  {
    href: 'https://www.tiktok.com/@barmoshe14',
    target: '_blank',
    rel: 'noopener',
    rotate: '0deg',
    shadowColor: 'var(--purple)',
    kickerColor: 'var(--purple)',
    kickerLeft: '// tiktok',
    title: 'Short clips.',
    value: '@barmoshe14',
    Icon: TikTokIcon,
    size: 'small',
  },
  {
    href: 'https://www.facebook.com/share/1E89hVfhG3/?mibextid=wwXIfr',
    target: '_blank',
    rel: 'noopener',
    rotate: '0deg',
    shadowColor: 'var(--blue)',
    kickerColor: 'var(--ink-soft)',
    kickerLeft: '// facebook',
    title: 'Old-school feed.',
    value: 'Bar Moshe',
    Icon: FacebookIcon,
    size: 'small',
  },
];

const BIG_CARDS = CARDS.filter((c) => c.size === 'big');
const SMALL_CARDS = CARDS.filter((c) => c.size === 'small');

// Big-card layout uses CSS grid with named areas so the icon, kicker,
// title, and value have explicit slots that don't collapse or wrap into
// each other on narrow viewports. minHeight keeps all 4 big cards the
// same size regardless of value-text length.
function bigRestStyle(c: Card): CSSProperties {
  return {
    display: 'grid',
    gridTemplateColumns: 'auto 1fr',
    gridTemplateRows: 'auto 1fr auto',
    gridTemplateAreas: `
      "icon  kicker"
      "title title"
      "value value"
    `,
    columnGap: 12,
    rowGap: 10,
    background: 'var(--paper)',
    border: '1.5px solid var(--ink)',
    padding: 20,
    minHeight: 168,
    transform: `rotate(${c.rotate})`,
    boxShadow: `6px 7px 0 ${c.shadowColor}`,
    textDecoration: 'none',
    color: 'var(--ink)',
    transition: 'transform .2s ease, box-shadow .2s ease',
  };
}

function bigHoverStyle(c: Card): CSSProperties {
  return {
    transform: 'rotate(0deg) translateY(-3px)',
    boxShadow: `9px 11px 0 ${c.shadowColor}`,
  };
}

const bigIconCellStyle = (color: string): CSSProperties => ({
  gridArea: 'icon',
  display: 'inline-flex',
  alignItems: 'center',
  color,
});

const bigKickerStyle = (color: string): CSSProperties => ({
  gridArea: 'kicker',
  alignSelf: 'center',
  justifySelf: 'end',
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color,
  whiteSpace: 'nowrap',
});

const bigTitleStyle: CSSProperties = {
  gridArea: 'title',
  fontFamily: 'var(--display)',
  fontSize: '1.3rem',
  lineHeight: 1.15,
  margin: 0,
};

const bigValueStyle: CSSProperties = {
  gridArea: 'value',
  margin: 0,
  alignSelf: 'end',
  fontFamily: 'var(--mono)',
  fontSize: '.92rem',
  color: 'var(--ink)',
};

// Chip variant: same icon-left + label flex layout, but rendered in an
// equal-cell grid container so the row stays aligned regardless of
// label length (the previous flex-wrap version went ragged on mobile).
function chipRestStyle(c: Card): CSSProperties {
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    background: 'var(--paper)',
    border: '1.25px solid var(--ink)',
    padding: '9px 14px',
    borderRadius: 999,
    boxShadow: `4px 4px 0 ${c.shadowColor}`,
    textDecoration: 'none',
    color: 'var(--ink)',
    transition: 'transform .2s ease, box-shadow .2s ease',
    transform: 'rotate(0deg)',
    minWidth: 0,
  };
}

function chipHoverStyle(c: Card): CSSProperties {
  return {
    transform: 'rotate(0deg) translateY(-2px)',
    boxShadow: `6px 6px 0 ${c.shadowColor}`,
  };
}

const chipLabelStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 12,
  letterSpacing: '.04em',
  color: 'var(--ink)',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

// Fan-in scatter offsets per big card (4 entries — one per big card).
const DESKTOP_SCATTER = [
  { x: -120, y: -40, r: -20 },
  { x: 140, y: -50, r: 24 },
  { x: -160, y: 30, r: -14 },
  { x: 130, y: 40, r: 22 },
];

// Letter is the final section and tends to be read for longer; stretch the
// stale window so a user who lingers doesn't see it replay unnecessarily.
const LETTER_STALE_MS = 15000;

export default function Letter() {
  const rootRef = useRef<HTMLElement | null>(null);
  const bigGridRef = useRef<HTMLDivElement | null>(null);
  const smallRowRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const bigGrid = bigGridRef.current;
      const smallRow = smallRowRef.current;
      if (!root || !bigGrid || !smallRow) return;
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const footer = root.querySelector<HTMLElement>('.letter-footer');
      const bigCards = Array.from(bigGrid.children) as HTMLElement[];
      const chips = Array.from(smallRow.children) as HTMLElement[];

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

        if (chips.length) {
          createReveal(
            chips,
            { opacity: 0, y: 10 },
            { opacity: 1, y: 0, duration: 0.5, stagger: 0.06, ease: 'power2.out' },
            { trigger: smallRow, start: 'top 90%', staleAfterMs: LETTER_STALE_MS },
          );
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        if (!bigCards.length) return;
        createReveal(
          bigCards,
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
            rotate: (i: number) => parseFloat(BIG_CARDS[i]?.rotate ?? '0deg'),
            scale: 1,
            duration: 1,
            stagger: 0.08,
            ease: 'power4.out',
          },
          { trigger: bigGrid, start: 'top 80%', staleAfterMs: LETTER_STALE_MS },
        );
      });

      mm.add(MOBILE_QUERY, () => {
        if (!bigCards.length) return;
        // Paired per-row entry for the 2-col mobile grid: even-index cards
        // swoop from the left, odd-index cards from the right.
        createReveal(
          bigCards,
          {
            opacity: 0,
            x: (i: number) => (i % 2 === 0 ? -64 : 64),
            y: 18,
            rotate: 0,
            scale: 0.9,
          },
          {
            opacity: 1,
            x: 0,
            y: 0,
            rotate: 0,
            scale: 1,
            duration: 0.65,
            ease: 'back.out(1.5)',
            stagger: { each: 0.14, grid: [2, 2], axis: 'y', from: 'start' },
          },
          { trigger: bigGrid, start: 'top 85%', staleAfterMs: LETTER_STALE_MS },
        );
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
        ref={bigGridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
          gap: 24,
          maxWidth: 880,
          margin: '40px auto 0',
          padding: '0 4px',
        }}
      >
        {BIG_CARDS.map((c) => {
          const Icon = c.Icon;
          return (
            <HoverCard
              key={c.href}
              href={c.href}
              target={c.target}
              rel={c.rel}
              className="ink-taped"
              rest={bigRestStyle(c)}
              hover={bigHoverStyle(c)}
            >
              <span style={bigIconCellStyle(c.kickerColor)}>
                <Icon size={22} />
              </span>
              <span style={bigKickerStyle(c.kickerColor)}>{c.kickerLeft}</span>
              <h3 style={bigTitleStyle}>{c.title}</h3>
              <p
                style={{
                  ...bigValueStyle,
                  wordBreak: c.href.startsWith('mailto:') ? 'break-all' : 'normal',
                }}
              >
                {c.value}
              </p>
            </HoverCard>
          );
        })}
      </div>

      <div
        ref={smallRowRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
          gap: 12,
          margin: '24px auto 0',
          maxWidth: 720,
          padding: '0 4px',
        }}
      >
        {SMALL_CARDS.map((c) => {
          const Icon = c.Icon;
          return (
            <HoverCard
              key={c.href}
              href={c.href}
              target={c.target}
              rel={c.rel}
              rest={chipRestStyle(c)}
              hover={chipHoverStyle(c)}
            >
              <span style={{ display: 'inline-flex', flex: '0 0 auto', color: c.kickerColor }}>
                <Icon size={16} />
              </span>
              <span style={chipLabelStyle}>{c.value}</span>
            </HoverCard>
          );
        })}
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
