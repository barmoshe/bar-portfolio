# Recipe - Customize the theme

You want to shift the palette - new mood, new brand, new seasonal variation. The end state: updated `:root` and `html.dark` blocks in `src/styles.css`, a live preview in `#showcase`, AA contrast verified, ink-wipe still feels right, no component changes needed.

## The arc

The theme lives in two CSS blocks and one hook. Tokens are declared in `:root`, overridden in `html.dark`, and consumed by every component via `var(--…)`. The `useTheme` hook flips the `html.dark` class on toggle and orchestrates the ink-wipe GSAP timeline. If your changes respect the token contract, you don't touch a single `.tsx` file.

## 1. Decide the mood

Before generating colors, know:

- **Hue family** - warm (paper, amber, rust), cool (slate, teal, indigo), neutral (grayscale with a subtle tint), or vivid.
- **Contrast ambition** - do you want high-contrast editorial (sharp ink on paper) or a softer broadsheet feel?
- **Dark-mode intent** - same family, desaturated (typical), or a complementary shift (cooler dark, warmer light)?

## 2. Generate the palette

Use `prompts/customize-colors.md` with your mood brief as the `<brief>`. The prompt's constraints enforce:

- oklch-only (no hex, no rgb, no hsl).
- AA contrast ≥ 4.5:1 for body text pairs.
- ~30% chroma reduction in dark mode by default.
- Preservation of existing token names (don't rename `--paper` to `--canvas`).

Output is two drop-in CSS blocks, one for `:root` and one for `html.dark`, plus a contrast-ratio table.

## 3. Paste into `src/styles.css`

The tokens live in the top section of `styles.css` (first ~80 lines). Replace only the color-token declarations inside `:root { … }` and `html.dark { … }`. Don't touch typography tokens (`--serif`, `--display`, `--mono`, `--hand`) unless you explicitly want to reflow type as well - that's a separate concern.

Keep the variable names identical. If you added a new semantic alias in the prompt output, add it to **both** blocks so dark mode has coverage.

## 4. Preview live

```bash
npm run dev
```

Two preview surfaces:

- **`http://localhost:5173/#showcase`** - the React showcase reads tokens via `getComputedStyle`, so it updates the moment the CSS hot-reloads. Light and dark samples render side-by-side for direct comparison.
- **`http://localhost:5173/showcase.html`** - the standalone artifact. If you edited it in parallel, confirm it mirrors `styles.css` values; otherwise it will look stale. A comment at the top of `showcase.html` flags the sync requirement.

Walk every section (`#intro`, `#story`, `#experience`, `#repos`, `#mixtape`, `#letter`) in both light and dark modes. Look for:

- Body text legibility on `--paper`, `--paper-2`, `--surface-1/2`.
- Accent-on-surface pairings (red, blue, etc. on any `--surface-*`).
- `--border` visibility against surfaces.
- Ink-wipe transition - the GSAP circle mask should still feel "inky" against the new palette. If the clip-path endpoint color looks wrong, the wipe itself doesn't need editing; only the target theme does.

## 5. Verify AA

The `ColorGrid` in the showcase renders contrast ratios inline. Anything under 4.5:1 for body text or 3:1 for large text needs either a lightness bump, a chroma cut, or reassignment (e.g. move a small-text usage to a higher-contrast token).

If you want to recheck quickly off-site, the `palette-oklch` MCP's `contrast_check` tool is handy for single pairs.

## 6. Commit

See `recipes/deploy.md`.

---

Related:
- `knowledge/02-design-system.md` - token layers, naming, oklch rationale.
- `knowledge/03-theming.md` - why the ink-wipe works the way it does.
- `prompts/customize-colors.md` - the palette generator.
- `prompts/design-critique.md` - run after pasting to self-critique the result.
