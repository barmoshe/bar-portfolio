import type { CSSProperties } from 'react';

const card = (rotate: string): CSSProperties => ({
  background: 'var(--paper)',
  border: '1.5px solid var(--ink)',
  padding: 24,
  transform: `rotate(${rotate})`,
  boxShadow: '6px 7px 0 var(--ink)',
});

const row: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: 12,
  flexWrap: 'wrap',
  gap: 10,
};

const h3: CSSProperties = { fontFamily: 'var(--display)', fontSize: '1.6rem', margin: 0 };

const date: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  color: 'var(--ink-soft)',
};

const role: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: 'var(--green)',
};

const body: CSSProperties = { margin: '10px 0 0', color: 'var(--ink-soft)' };

export default function Experience() {
  return (
    <article className="page" id="experience">
      <div className="folio">
        <b>03</b> // DEPLOYMENTS
      </div>
      <span className="stamp">EXPERIENCE</span>
      <h2 className="headline">Experience.</h2>
      <p className="dek">
        Paid work and self-directed work. All of it has shaped how I build.
      </p>

      <div style={{ marginTop: 40, display: 'grid', gap: 32 }}>
        <div style={card('-.8deg')}>
          <div style={row}>
            <h3 style={h3}>
              Joomsy{' '}
              <a
                href="https://www.joomsy.com"
                target="_blank"
                rel="noopener"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.1em',
                  color: 'var(--green)',
                  textDecoration: 'none',
                  marginLeft: 8,
                }}
              >
                joomsy.com →
              </a>
            </h3>
            <span style={date}>May 2025 – Present</span>
          </div>
          <p style={role}>Software Engineer, Full-Stack</p>
          <p style={body}>
            Early-stage startup. Five-person team. Primary developer owning full-stack
            architecture and database design, plus the deploy pipeline and infra it runs on.
            Every layer - frontend, backend, the plumbing between - shaped as the product
            finds its shape.
          </p>
        </div>

        <div style={card('.9deg')}>
          <div style={row}>
            <h3 style={h3}>Wochit</h3>
            <span style={date}>Nov 2021 – Present (4+ years)</span>
          </div>
          <p style={role}>Customer Support Engineer</p>
          <p style={body}>
            Cloud-based video editing platform at scale. Helping users navigate and optimize
            their experience via ZenDesk, Jira, and Intercom. Troubleshooting issues,
            collaborating with dev teams to ship fixes and feature improvements, and writing
            small JavaScript scripts to automate internal workflows.
          </p>
        </div>

        <div style={card('-.4deg')}>
          <div style={row}>
            <h3 style={h3}>Self-directed work</h3>
            <span style={date}>Ongoing</span>
          </div>
          <p style={role}>Builder / Maker / Hobbyist</p>
          <p style={body}>
            A lot of my work happens on my own time. I follow what I'm curious about and
            don't limit myself to one role or field. I build across the stack and different
            areas, including fullstack, DevOps, product design, creative coding, and game
            development. A wide variety of projects fall into this space, some of which you
            can see in{' '}
            <a href="#notes" style={{ color: 'var(--green)' }}>
              Dispatches
            </a>{' '}
            or on{' '}
            <a
              href="https://github.com/barmoshe"
              target="_blank"
              rel="noopener"
              style={{ color: 'var(--green)' }}
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </div>
    </article>
  );
}
