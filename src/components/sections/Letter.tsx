import type { CSSProperties } from 'react';
import HoverCard from '../HoverCard';

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
    shadowColor: 'var(--ink)',
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

export default function Letter() {
  return (
    <article className="page" id="letter">
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
