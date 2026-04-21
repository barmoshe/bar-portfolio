import { useEffect, useState } from 'react';
import { COLOR_BUCKETS, type ColorToken } from '../../data/tokens';

type Resolved = { token: ColorToken; value: string };

/**
 * Reads every color token off the live `<html>` element via `getComputedStyle`,
 * so the grid always mirrors whatever is in `src/styles.css` — no duplication.
 *
 * `mode` renders the grid inside a scoped wrapper that either adds or removes
 * the `dark` class for side-by-side light/dark comparison without flipping the
 * real document class.
 */
function readTokens(root: HTMLElement, tokens: readonly ColorToken[]): Resolved[] {
  const cs = getComputedStyle(root);
  return tokens.map((token) => ({
    token,
    value: cs.getPropertyValue(`--${token}`).trim() || '—',
  }));
}

function Swatch({ token, value, fg }: { token: ColorToken; value: string; fg: string }) {
  return (
    <div
      style={{
        background: `var(--${token})`,
        color: fg,
        padding: '14px 12px',
        borderRadius: 8,
        border: '1px solid var(--border)',
        minHeight: 84,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        fontFamily: 'var(--mono)',
        fontSize: 12,
        lineHeight: 1.3,
      }}
    >
      <strong style={{ fontWeight: 600 }}>--{token}</strong>
      <span style={{ opacity: 0.8 }}>{value}</span>
    </div>
  );
}

function Bucket({
  title,
  tokens,
  fg,
}: {
  title: string;
  tokens: readonly ColorToken[];
  fg: string;
}) {
  const [resolved, setResolved] = useState<Resolved[]>([]);
  useEffect(() => {
    setResolved(readTokens(document.documentElement, tokens));
  }, [tokens]);
  return (
    <section style={{ marginBottom: 20 }}>
      <h4 style={{ margin: '0 0 8px', fontFamily: 'var(--mono)', fontSize: 12, opacity: 0.7 }}>
        {title}
      </h4>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
          gap: 8,
        }}
      >
        {resolved.map((r) => (
          <Swatch key={r.token} token={r.token} value={r.value} fg={fg} />
        ))}
      </div>
    </section>
  );
}

export default function ColorGrid({ mode }: { mode: 'light' | 'dark' }) {
  // Scoped dark/light wrapper: force the class locally so this half of the
  // side-by-side renders the opposite theme without touching the real <html>.
  const wrapperClass = mode === 'dark' ? 'dark' : '';
  return (
    <div
      className={wrapperClass}
      style={{
        background: 'var(--paper)',
        color: 'var(--ink)',
        padding: 20,
        borderRadius: 12,
        border: '1px solid var(--border)',
      }}
    >
      <h3 style={{ margin: '0 0 12px', fontFamily: 'var(--display)' }}>{mode} mode</h3>
      <Bucket title="Surfaces" tokens={COLOR_BUCKETS.surfaces} fg="var(--ink)" />
      <Bucket title="Ink" tokens={COLOR_BUCKETS.ink} fg="var(--paper)" />
      <Bucket title="Accents" tokens={COLOR_BUCKETS.accents} fg="var(--paper)" />
      <Bucket title="Structure" tokens={COLOR_BUCKETS.structure} fg="var(--ink)" />
    </div>
  );
}
