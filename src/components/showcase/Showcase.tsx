import ColorGrid from './ColorGrid';
import TypeSpecimen from './TypeSpecimen';
import FxPlayground from './FxPlayground';

/**
 * Design showcase — mounted when `window.location.hash === '#showcase'`.
 * Renders color tokens (live, via getComputedStyle), type specimens, and an
 * isolated fx playground. See `knowledge/02-design-system.md`.
 */
export default function Showcase() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'var(--paper)',
        color: 'var(--ink)',
        padding: '40px 24px 80px',
        fontFamily: 'var(--serif)',
      }}
    >
      <header style={{ maxWidth: 1200, margin: '0 auto 24px' }}>
        <h1 style={{ margin: 0, fontFamily: 'var(--display)', fontSize: 40 }}>
          bar-portfolio · design showcase
        </h1>
        <p style={{ margin: '8px 0 0', color: 'var(--ink-soft)', maxWidth: 720 }}>
          Live-reading the token catalog from <code>:root</code> and <code>html.dark</code>. Edit{' '}
          <code>src/styles.css</code> and hot-reload reflects here immediately.
        </p>
        <p style={{ marginTop: 8 }}>
          <a href="./" style={{ color: 'var(--blue)' }}>
            ← back to portfolio
          </a>
        </p>
      </header>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto 24px',
        }}
      >
        <ColorGrid mode="light" />
        <ColorGrid mode="dark" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: 20,
          maxWidth: 1200,
          margin: '0 auto',
        }}
      >
        <TypeSpecimen />
        <FxPlayground />
      </div>
    </main>
  );
}
