/**
 * Self-built in-page accessibility settings panel. NOT an overlay widget.
 * Surfaces the personalization controls disabled users actually want:
 *   - Theme (auto / light / dark) — wraps existing useTheme.cycle
 *   - Contrast (auto / on / off) — overrides prefers-contrast per-site
 *   - Text size (100/110/125/150 %) — multiplies a --text-scale CSS var
 *   - Readable typography — swaps to a hyperlegible font stack
 *
 * Modal pattern: role=dialog, aria-modal=true, Esc closes, focus trapped
 * via Tab/Shift+Tab cycling within the panel, focus returned to opener
 * by the parent.
 */
import { useEffect, useRef } from 'react';
import { usePreferences, TEXT_SCALES, type ContrastPref, type TextScale } from '../hooks/usePreferences';
import type { ThemePref } from '../hooks/useTheme';

type Props = {
  themePref: ThemePref;
  onThemeChange: (next: ThemePref) => void;
  onClose: () => void;
};

const FOCUSABLE_SELECTOR =
  'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function AccessibilityPanel({ themePref, onThemeChange, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement | null>(null);
  const { contrast, setContrast, textScale, setTextScale, readable, setReadable } =
    usePreferences();

  // Focus the first control on mount.
  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;
    const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTOR);
    first?.focus();
  }, []);

  // Esc closes; Tab / Shift+Tab cycle focus inside the panel.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== 'Tab') return;
      const panel = panelRef.current;
      if (!panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusables.length === 0) return;
      const first = focusables[0]!;
      const last = focusables[focusables.length - 1]!;
      const active = document.activeElement as HTMLElement | null;
      if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    // Backdrop dismisses on click; keyboard close paths are Esc + the
    // explicit ✕ button below.
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
    <div className="a11y-backdrop" onClick={onBackdropClick}>
      <div
        className="a11y-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="a11y-panel-title"
        ref={panelRef}
      >
        <button
          type="button"
          className="a11y-close"
          aria-label="Close accessibility settings"
          onClick={onClose}
        >
          ×
        </button>
        <h2 id="a11y-panel-title">Accessibility</h2>
        <p className="dek">
          Site-level overrides. Your OS settings are still respected when each
          option is set to <em>Auto</em>.
        </p>

        <fieldset role="radiogroup" aria-labelledby="a11y-theme-legend">
          <legend id="a11y-theme-legend">Theme</legend>
          <div className="opt-row">
            {(['auto', 'light', 'dark'] as const).map((t) => (
              <button
                key={t}
                type="button"
                role="radio"
                aria-checked={themePref === t}
                className="opt"
                onClick={() => onThemeChange(t)}
              >
                {t === 'auto' ? 'Auto' : t === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset role="radiogroup" aria-labelledby="a11y-contrast-legend">
          <legend id="a11y-contrast-legend">Contrast</legend>
          <div className="opt-row">
            {(['auto', 'more', 'less'] as const).map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={contrast === c}
                className="opt"
                onClick={() => setContrast(c as ContrastPref)}
              >
                {c === 'auto' ? 'Auto' : c === 'more' ? 'High' : 'Normal'}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset role="radiogroup" aria-labelledby="a11y-size-legend">
          <legend id="a11y-size-legend">Text size</legend>
          <div className="opt-row">
            {TEXT_SCALES.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={textScale === s}
                className="opt"
                onClick={() => setTextScale(s as TextScale)}
              >
                {Math.round(s * 100)}%
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend>Typography</legend>
          <label className="a11y-toggle">
            <input
              type="checkbox"
              checked={readable}
              onChange={(e) => setReadable(e.target.checked)}
            />
            <span>Readable mode (looser line-height, hyperlegible font stack)</span>
          </label>
        </fieldset>

        <p className="a11y-note">
          Settings persist on this device. No tracking, no third-party widget.
        </p>
      </div>
    </div>
  );
}
