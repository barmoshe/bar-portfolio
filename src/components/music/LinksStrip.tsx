interface Chip {
  glyph: string;
  label: string;
  url: string;
}

const CHIPS: readonly Chip[] = [
  { glyph: '✎', label: 'first audio app', url: 'https://github.com/barmoshe/WhiteNoiseGenerator' },
  { glyph: '↓', label: 'first DAW plugin', url: 'https://github.com/barmoshe/GainIsWhatYouNEED' },
  { glyph: '∞', label: 'full-stack music app', url: 'https://github.com/barmoshe/Israelify-backend' },
];

export default function LinksStrip() {
  return (
    <aside className="synth-links" aria-label="Related repositories">
      <ul className="synth-links__row">
        {CHIPS.map((c, i) => (
          <li key={c.url} style={{ transform: `rotate(${(i - 1) * 0.6}deg)` }}>
            <a href={c.url} target="_blank" rel="noreferrer">
              <span className="synth-links__glyph" aria-hidden="true">
                {c.glyph}
              </span>
              <span className="synth-links__label">{c.label}</span>
            </a>
          </li>
        ))}
      </ul>
      <p className="synth-links__caption">
        // this synth is built from scratch in the browser; these are its cousins.
      </p>
    </aside>
  );
}
