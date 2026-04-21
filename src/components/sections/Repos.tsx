import { iconFor, projects, shortDesc } from '../../data/portfolio';

type Props = { onOpen: (idx: number) => void };

export default function Repos({ onOpen }: Props) {
  return (
    <article className="page" id="repos">
      <div className="folio">
        <b>04</b> // REPOS
      </div>
      <span className="stamp">ON GITHUB</span>
      <h2 className="headline">
        A few of the <em>many things</em> I've built.
      </h2>
      <div className="clip" id="proj-grid" style={{ marginTop: 28 }}>
        {projects.map((p, i) => (
          <article
            key={p.name}
            data-idx={i}
            tabIndex={0}
            role="button"
            aria-label={p.name}
            onClick={() => onOpen(i)}
          >
            <span className="num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <header className="head">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="path">~/{p.name}</span>
            </header>
            <div className="body">
              <div className="meta">
                <span className="glyph" aria-hidden="true">
                  {iconFor(p.language)}
                </span>
                <span className="lang">{p.language}</span>
              </div>
              <h3 className="t">{p.name}</h3>
              <p className="d">{shortDesc(p.description)}</p>
              <div className="go">View repo →</div>
            </div>
          </article>
        ))}
      </div>

      <aside
        className="gh-cta"
        style={{
          marginTop: 40,
          background: 'var(--ink)',
          color: 'var(--paper)',
          border: '1.5px solid var(--ink)',
          padding: '22px 26px',
          boxShadow: '6px 8px 0 var(--green)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--mono)',
              fontSize: 10.5,
              letterSpacing: '.25em',
              textTransform: 'uppercase',
              color: 'var(--green)',
            }}
          >
            More on GitHub
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontFamily: 'var(--serif)',
              color: 'oklch(0.9 0.02 85)',
              fontSize: '.98rem',
            }}
          >
            Experiments, scripts, and half-built ideas - all public.
          </p>
        </div>
        <a
          href="https://github.com/barmoshe"
          target="_blank"
          rel="noopener"
          style={{
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            fontSize: '.95rem',
            letterSpacing: '.06em',
            color: 'var(--ink)',
            background: 'var(--paper)',
            padding: '10px 18px',
            textDecoration: 'none',
            boxShadow: '4px 4px 0 var(--green)',
            whiteSpace: 'nowrap',
          }}
        >
          github.com/barmoshe →
        </a>
      </aside>
    </article>
  );
}
