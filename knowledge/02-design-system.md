# 02 - Design system

All tokens are CSS custom properties defined in `src/styles.css`. No JS color values. No hex or hsl.

## Three tiers

The code doesn't enforce naming conventions, but the tokens naturally fall into three tiers:

1. **Primitive** - raw oklch values on literal color names (`--red`, `--green`, `--blue`, `--yellow`, `--magenta`, `--purple`, `--cyan`). These rarely change.
2. **Semantic** - role-based aliases (`--paper`, `--paper-2`, `--ink`, `--ink-soft`, `--ink-faint`, `--border`, `--shadow`, `--surface-1..3`, `--surface-strong`, `--surface-strong-fg`). Most component CSS consumes these.
3. **Component** - per-component overrides, defined inline in section styles (e.g. `.letter .send`, `.strip .toggle`). Prefer semantic tokens; only introduce component-level overrides when the role genuinely differs.

## Color tokens (light mode - `:root`)

| Token | Value | Role |
|---|---|---|
| `--paper` | `oklch(0.93 0.02 85)` | Page background (warm off-white) |
| `--paper-2` | `oklch(0.88 0.03 80)` | Slight tonal variant for gradients |
| `--surface-1` | `var(--paper)` | Default card surface |
| `--surface-2` | `oklch(0.96 0.02 85)` | Elevated card surface |
| `--surface-strong` | `oklch(0.18 0.03 40)` | Inverted accent band (nav strip, CTAs) |
| `--surface-strong-fg` | `var(--paper)` | Text on `surface-strong` |
| `--ink` | `oklch(0.18 0.03 40)` | Primary body text |
| `--ink-soft` | `oklch(0.34 0.04 40)` | Secondary text |
| `--ink-faint` | `oklch(0.48 0.03 40)` | Tertiary / meta text |
| `--border` | `oklch(0 0 0 / .2)` | Hairline borders |
| `--shadow` | `oklch(0.2 0.04 40 / .22)` | Soft drop shadows |
| `--red` `--green` `--blue` `--yellow` `--magenta` `--purple` `--cyan` | primitive oklch | Semantic accents (errors, CTAs, links, highlights) |

## Color tokens (dark mode - `html.dark`)

Darkmode isn't a mechanical invert. The calibration rules are:

- **Surfaces rise in lightness as elevation rises.** `--paper` (0.17) < `--surface-1` (0.22) < `--surface-2` (0.27). `--surface-strong` (0.10) is the *deepest* - used for the nav strip, opposite to light mode.
- **Hue shifts to cool.** All surfaces move from warm (hue 40–85) to cool (hue 260) for that after-dark feel.
- **Accents pull back chroma** so they don't glow on very dark surfaces (e.g. `--red` drops from `0.22` to `0.17` chroma, lightness up from `0.58` to `0.72`).
- **Text lightness is cool-hue matched to surfaces** (hue 260) so text doesn't visually vibrate against the ground.

## Typography tokens

```css
--serif:   "Iowan Old Style", "Georgia", ui-serif, serif;
--display: "Bodoni 72", "Didot", "Playfair Display", ui-serif, serif;
--mono:    ui-monospace, "Courier New", "JetBrains Mono", monospace;
--hand:    "Marker Felt", "Bradley Hand", "Comic Sans MS", cursive;
```

- `--display` - hero headlines, section titles. High-contrast modern serif.
- `--serif` - body copy, timeline entries, long-form text.
- `--mono` - meta labels, code, UI affordances, numeric data.
- `--hand` - whimsical accents (captions on the portrait slideshow, occasional margin notes). Use sparingly.

## Spacing & layout conventions

Not token-ized yet. The stylesheet uses raw `rem`, `px`, and `clamp(...)` values in situ. Common rhythm values observed:

- Section padding: `clamp(3rem, 8vw, 8rem)` (vertical).
- Body line-height: 1.55–1.7 for serif, 1.25 for display.
- Card radius: `12px`–`18px`; no unified `--radius` token yet (future work).

If introducing a new spacing or radius abstraction, add it as a primitive token in `:root` first, then consume it - don't spread magic numbers.

## Contrast policy

Every text/background pairing must meet **WCAG 2.2 AA** (4.5:1 for body, 3:1 for large text). When tweaking `--paper` or `--ink`, verify in `/#showcase` (the live route that reads computed styles and displays contrast ratios) or by running `prompts/customize-colors.md` which enforces the check.

Known tight pairings to retest when changing tokens:

- `--ink-faint` on `--paper`
- `--surface-strong-fg` on `--surface-strong`
- `--green` (dark mode) on `--surface-strong` (used by `.strip a:hover`)

## When adding a color

1. Check if an existing token fits. The palette is intentionally small.
2. If you genuinely need a new hue, add it as a primitive `--<name>` in both `:root` and `html.dark` (dark-mode variant with reduced chroma).
3. If it's a role-based addition (e.g. `--warn-surface`), add a semantic alias on top of the primitive.
4. Don't introduce hex or hsl - stay in oklch. For a guided generation, use `prompts/customize-colors.md`.
