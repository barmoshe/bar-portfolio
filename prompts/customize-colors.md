<instructions>
You are generating a new color palette for the bar-portfolio site. The site uses oklch() tokens declared in `:root` (light mode) and overridden in `html.dark` (dark mode). Your output is pasted verbatim into `src/styles.css`, replacing the existing color-token declarations.

Your job: take the mood brief below, produce two drop-in CSS blocks (one `:root`, one `html.dark`) that satisfy every constraint, then print a contrast-ratio table so the human reviewer can verify AA compliance at a glance.
</instructions>

<brief>
Mood / adjectives: {{MOOD_ADJECTIVES}}
Hue family (warm / cool / neutral / vivid): {{HUE_FAMILY}}
Seed hue in oklch degrees (optional): {{SEED_HUE}}
Any references (brands, paintings, films) to evoke: {{REFERENCES}}
Dark-mode intent (same family desaturated / complementary shift / custom): {{DARK_MODE_INTENT}}
</brief>

<constraints>
1. Color format: oklch() only. No hex, no rgb, no hsl.
2. Preserve every existing token name. Do not rename `--paper`, `--ink`, etc. Do not remove tokens. You may suggest a new semantic alias, but only if you include it in BOTH `:root` and `html.dark`.
3. Token set to produce, in this order:
   - Paper surfaces: `--paper`, `--paper-2`, `--surface-1`, `--surface-2`, `--surface-strong`
   - Ink: `--ink`, `--ink-soft`, `--ink-faint`
   - Border: `--border`
   - Accents: `--red`, `--green`, `--blue`, `--yellow`, `--magenta`, `--purple`, `--cyan`
   - Shadow: `--shadow`
4. Contrast: body text (`--ink` on `--paper`, `--ink` on `--surface-1`, `--ink` on `--surface-2`) must be ≥ 4.5:1. Soft text (`--ink-soft` on `--paper`) must be ≥ 4.5:1 if used for body, ≥ 3:1 if used for captions only. Accent-on-surface pairs used for links or buttons must be ≥ 4.5:1.
5. Dark mode: reduce chroma ~25–35% vs light for accents. Lift lightness for ink tokens (they become paper-like); drop lightness for paper tokens (they become ink-like). Don't mechanically invert - calibrate each token.
6. Ink-wipe compatibility: the transition uses a circle clip-path over the theme - no token should be pure #000 or pure white. Keep `--ink` lightness ≥ 0.18 in light mode and ≤ 0.92 in dark mode.
7. No Tailwind, no hex fallbacks, no `@theme` or other config files. Output is raw CSS variables.
</constraints>

<output_format>
## Light mode - paste into `:root { … }` in `src/styles.css`

```css
--paper: oklch(…);
--paper-2: oklch(…);
--surface-1: oklch(…);
--surface-2: oklch(…);
--surface-strong: oklch(…);
--ink: oklch(…);
--ink-soft: oklch(…);
--ink-faint: oklch(…);
--border: oklch(…);
--red: oklch(…);
--green: oklch(…);
--blue: oklch(…);
--yellow: oklch(…);
--magenta: oklch(…);
--purple: oklch(…);
--cyan: oklch(…);
--shadow: oklch(…);
```

## Dark mode - paste into `html.dark { … }` in `src/styles.css`

```css
(same variable list with dark-mode values)
```

## Contrast table

| Pair | Ratio | Passes |
|---|---|---|
| `--ink` on `--paper` (light) | x.xx:1 | AA body ✓/✗ |
| `--ink` on `--surface-1` (light) | … | … |
| `--ink-soft` on `--paper` (light) | … | … |
| `--blue` on `--paper` (light) | … | … |
| (repeat for dark mode) | | |

## Notes

Brief prose - 3–5 sentences - on the mood decision, the dark-mode calibration, and any pair that sits near an AA floor and should be used sparingly.
</output_format>
