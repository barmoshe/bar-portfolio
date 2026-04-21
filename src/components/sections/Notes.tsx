import type { CSSProperties, ReactNode } from 'react';
import HoverCard from '../HoverCard';

type Entry = {
  href: string;
  rotate: string;
  shadowColor: string; // css token
  featured?: boolean;
  date: string;
  tag: string;
  title: ReactNode;
  desc: ReactNode;
  hashtags: string;
};

const ENTRIES: Entry[] = [
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7306517964575408128/',
    rotate: '.6deg',
    shadowColor: 'var(--green)',
    featured: true,
    date: 'MAR 2025',
    tag: '★ featured',
    title: "Featured on Temporal's Code Exchange.",
    desc: (
      <>
        My Cross-Language Data Processing Service - Python, Go, and TypeScript all
        coordinated through a single Temporal workflow - was picked up for Temporal's
        official Code Exchange, with a companion Medium write-up.
      </>
    ),
    hashtags: '#temporal   #opensource   #python   #go',
  },
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7421903131573366784/',
    rotate: '-.6deg',
    shadowColor: 'var(--ink)',
    date: 'FEB 2026',
    tag: '// launch',
    title: 'Shipping Joomsy - meaningful moments across the distance.',
    desc: (
      <>
        Kids connect with grandparents, family, and friends through interactive video calls
        - reading books together, gesture-based games, more coming. Over 35M US
        grandparents live 200+ miles from a grandchild; we're building the bridge.
      </>
    ),
    hashtags: '#startup   #product   #video',
  },
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7450179482327576576/',
    rotate: '-.8deg',
    shadowColor: 'var(--ink)',
    date: 'APR 2026',
    tag: '// recent',
    title: 'Cosmic Synth, specced by a Claude skill I wrote.',
    desc: (
      <>
        A Claude skill that interviews you step-by-step (via{' '}
        <code style={{ fontFamily: 'var(--mono)', fontSize: '.9em' }}>AskUserQuestion</code>)
        until it has a full spec. Used it to scope out a browser-based 3D synthesizer with a
        reactive galaxy visualizer and an auto-DJ composing drums, bass, and melodies.
      </>
    ),
    hashtags: '#claude   #skill   #webaudio',
  },
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7409202248351707136/',
    rotate: '.8deg',
    shadowColor: 'var(--ink)',
    date: 'JAN 2026',
    tag: '// gift',
    title: 'A tiny Flappy Bird for a wedding gift.',
    desc: (
      <>
        My cousin Chen was getting married. Her fiancé is into DJI drones - so I built a
        small drone-themed Flappy Bird with a <em>"Ring Delivered!"</em> finish, a{' '}
        <em>"Chen said YES!"</em> screen, and an endless mode. Sometimes the best gift is
        200 lines of web game.
      </>
    ),
    hashtags: '#javascript   #canvas   #gift',
  },
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7423731964278358016/',
    rotate: '1.1deg',
    shadowColor: 'var(--ink)',
    date: 'FEB 2026',
    tag: '// ggj 2026',
    title: 'Second year at Global Game Jam - Cursor on the baton.',
    desc: (
      <>
        Theme was <em>masks</em>. I stayed on audio duty but this time let Cursor write the
        sound-effect code - a Unity/C# synth, mixer, and effects chain - while I conducted
        from the side. Vibe coding, zero manual setup.
      </>
    ),
    hashtags: '#ggj2026   #cursor   #gamesound',
  },
  {
    href: 'https://www.linkedin.com/feed/update/urn:li:activity:7382760320420720640/',
    rotate: '-1deg',
    shadowColor: 'var(--ink)',
    date: 'OCT 2025',
    tag: '// devtool',
    title: 'A small GPT that rewrites messy PR notes into clean bullets.',
    desc: (
      <>
        Takes half-written PR descriptions and turns them into{' '}
        <code style={{ fontFamily: 'var(--mono)', fontSize: '.9em' }}>
          Fix · Add · Update · Refactor · Remove
        </code>
        . Writing a changelog now takes seconds instead of minutes.
      </>
    ),
    hashtags: '#gpt   #devtools   #workflow',
  },
];

function restStyle(e: Entry): CSSProperties {
  const base: CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    background: 'var(--paper)',
    color: 'var(--ink)',
    border: '1.5px solid var(--ink)',
    padding: 20,
    transform: `rotate(${e.rotate})`,
    textDecoration: 'none',
    transition: 'transform .2s ease, box-shadow .2s ease',
  };
  if (e.featured) {
    return {
      ...base,
      borderLeft: `6px solid ${e.shadowColor}`,
      boxShadow: `6px 7px 0 ${e.shadowColor}`,
    };
  }
  return { ...base, boxShadow: `5px 6px 0 ${e.shadowColor}` };
}

function hoverStyle(e: Entry): CSSProperties {
  return {
    transform: 'rotate(0deg) translateY(-3px)',
    boxShadow: e.featured ? `9px 11px 0 ${e.shadowColor}` : `8px 10px 0 ${e.shadowColor}`,
  };
}

const kickerStyle: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--green)',
  display: 'flex',
  justifyContent: 'space-between',
  gap: 10,
  alignItems: 'center',
};

const tagStyle: CSSProperties = {
  background: 'var(--green)',
  color: 'var(--paper)',
  padding: '3px 8px',
  letterSpacing: '.18em',
};

const titleStyle: CSSProperties = {
  fontFamily: 'var(--display)',
  fontSize: '1.45rem',
  lineHeight: 1.1,
  margin: 0,
};

const descStyle: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--serif)',
  color: 'var(--ink-soft)',
  lineHeight: 1.5,
};

const hashtagsStyle = (featured: boolean): CSSProperties => ({
  marginTop: 'auto',
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.15em',
  color: featured ? 'var(--green)' : 'var(--ink-soft)',
  textTransform: 'uppercase',
});

export default function Notes() {
  return (
    <article className="page" id="notes">
      <div className="folio">
        <b>06</b> // DISPATCHES
      </div>
      <span className="stamp">FIELD NOTES</span>
      <h2 className="headline">
        Things I've <em>posted about.</em>
      </h2>
      <p className="dek">
        A handful of things I've built and shared - tools, experiments, game-jam sound
        code, the occasional wedding gift. Each card opens the full write-up.
      </p>

      <div
        style={{
          marginTop: 40,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(300px,1fr))',
          gap: 22,
        }}
      >
        {ENTRIES.map((e) => (
          <HoverCard
            key={e.href}
            href={e.href}
            target="_blank"
            rel="noopener"
            rest={restStyle(e)}
            hover={hoverStyle(e)}
          >
            <div style={kickerStyle}>
              <span>{e.date}</span>
              {e.featured ? <span style={tagStyle}>{e.tag}</span> : <span>{e.tag}</span>}
            </div>
            <h3 style={titleStyle}>{e.title}</h3>
            <p style={descStyle}>{e.desc}</p>
            <div style={hashtagsStyle(!!e.featured)}>{e.hashtags}</div>
          </HoverCard>
        ))}
      </div>

      <p
        style={{
          margin: '30px 0 0',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
          textAlign: 'center',
        }}
      >
        More on{' '}
        <a
          href="https://www.linkedin.com/in/barmoshe/"
          target="_blank"
          rel="noopener"
          style={{ color: 'var(--blue)' }}
        >
          my profile
        </a>
        .
      </p>
    </article>
  );
}
