const PANGRAM = 'Sphinx of black quartz, judge my vow.';

type Row = { token: string; family: string; label: string };

const ROWS: Row[] = [
  { token: 'display', family: 'var(--display)', label: 'Display' },
  { token: 'serif', family: 'var(--serif)', label: 'Serif' },
  { token: 'mono', family: 'var(--mono)', label: 'Mono' },
  { token: 'hand', family: 'var(--hand)', label: 'Hand' },
];

const SIZES = [
  { name: 'H1', size: 48 },
  { name: 'H2', size: 28 },
  { name: 'Body', size: 16 },
  { name: 'Caption', size: 12 },
];

export default function TypeSpecimen() {
  return (
    <div
      style={{
        background: 'var(--surface-1)',
        color: 'var(--ink)',
        padding: 20,
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ margin: '0 0 16px', fontFamily: 'var(--display)' }}>Type specimen</h3>
      {ROWS.map((row) => (
        <section key={row.token} style={{ marginBottom: 24 }}>
          <header
            style={{
              fontFamily: 'var(--mono)',
              fontSize: 11,
              opacity: 0.7,
              marginBottom: 8,
              letterSpacing: 0.4,
              textTransform: 'uppercase',
            }}
          >
            --{row.token} · {row.label}
          </header>
          <div style={{ display: 'grid', gap: 6 }}>
            {SIZES.map((s) => (
              <div
                key={s.name}
                style={{
                  fontFamily: row.family,
                  fontSize: s.size,
                  lineHeight: 1.15,
                  color: 'var(--ink)',
                }}
              >
                <span style={{ fontFamily: 'var(--mono)', fontSize: 11, opacity: 0.5, marginRight: 8 }}>
                  {s.name}
                </span>
                {PANGRAM}
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
