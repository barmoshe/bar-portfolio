type Props = {
  themeGlyph: string;
  themeLabel: string;
  onThemeCycle: () => void;
  onSkip: () => void;
  skipRemembered: boolean;
};

export default function Strip({
  themeGlyph,
  themeLabel,
  onThemeCycle,
  onSkip,
  skipRemembered,
}: Props) {
  return (
    <nav className="strip" aria-label="Primary">
      <span className="mark">bm@v2.0.0</span>
      <a className="key" href="#dossier">About</a>
      <a className="key" href="#story">Story</a>
      <a href="#experience">Work</a>
      <a href="#repos">Open Source</a>
      <a href="#music">Music</a>
      <a href="#notes">Notes</a>
      <a href="#letter">Contact</a>
      <span className="grow" />
      <button
        className="toggle theme-btn"
        id="themeBtn"
        type="button"
        title={themeLabel}
        aria-label={themeLabel}
        onClick={onThemeCycle}
      >
        {themeGlyph}
      </button>
      <button
        className="toggle"
        id="skipBtn"
        title="Remember: skip cover"
        onClick={onSkip}
        disabled={skipRemembered}
      >
        {skipRemembered ? 'remembered ✓' : 'Remember me'}
      </button>
    </nav>
  );
}
