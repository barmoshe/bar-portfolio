# Recipe — accessibility check

Run after any change that touches navigation, focus management, semantic structure,
animation, color tokens, or audio controls. Targets WCAG 2.2 AA.

## Quick gates (every PR)

1. `npm run typecheck && npm run lint`
   - `eslint-plugin-jsx-a11y` runs against the recommended ruleset (see `eslint.config.js`).
   - CI blocks the GitHub Pages deploy on lint failures (`.github/workflows/deploy.yml`).

2. `npm run dev` and open the DevTools Console.
   - `@axe-core/react` runs in dev only (gated on `import.meta.env.DEV` in `src/main.tsx`).
   - Walk through each section and confirm zero `[Issue]` rows.
   - Open the Repos lightbox and re-check.
   - Visit `/#showcase` and re-check.

## Manual keyboard walkthrough

Reload, then use only the keyboard:

- **First Tab** → "Skip to content" link slides in. Activate (Enter) → focus lands on `<main>`.
- Tab continues into Strip → Intro → Background → Mixtape (Start, RPM, Side flip via SVG roles, Mute, Volume slider) → Repos (toggle, then each project card button) → Letter cards (mailto / tel / external links).
- Shift+Tab reverses cleanly with no traps.
- On a project card, Enter/Space opens the Lightbox. Esc closes and focus returns to the originating card.
- Sticky `Strip` does not visually obscure any focused element (WCAG 2.4.11). `html { scroll-padding-top: 60px }` enforces this.

## Hash navigation focus

Click each Strip / TabBar link. After the scroll, type into DevTools Console:

```js
document.activeElement
```

Should report the matching `<article id="…">` (or `<main>` for the skip link), not the nav anchor.

## Reduced-motion

DevTools → Rendering → Emulate CSS media feature → `prefers-reduced-motion: reduce`.

- HeroSlides cycle is instant.
- Theme toggle ink-wipe is instant.
- All `gsap.matchMedia` timelines no-op (verified by absence of transforms on section reveal).
- Mixtape vinyl spin button does not animate; audio still plays.

## High-contrast

DevTools → Rendering → `prefers-contrast: more`.

- `--ink` / `--ink-soft` darken (light) or brighten (dark).
- `:focus-visible` outlines bump to 4px.
- No body-text pair drops below ~6:1.

## Color contrast spot checks

Use the WebAIM contrast checker on:

- Light: `--ink oklch(0.18 0.03 40)` on `--paper oklch(0.93 0.02 85)` → ≥ 12:1.
- Dark: `--ink oklch(0.96 0.008 260)` on `--paper oklch(0.17 0.012 260)` → ≥ 14:1.
- Strip text (`--paper` on `--ink`) → ≥ 12:1.
- Yellow `oklch(0.86 0.17 90)` is only used on selection / decorative chips, never for body text.

## Screen reader smoke (VoiceOver, ~5 minutes)

`Cmd+F5` to enable, then:

- Rotor → Landmarks: `nav` (Primary), `main`, `nav` (Mobile sections, on narrow viewports).
- Rotor → Headings: H1 (Intro mast) → H2 per section → H3 per card. No skipped levels.
- Mixtape Start button → audio begins, status region announces "Mixtape playing side A.".
- Volume slider → drag does not spam announcements (350ms trailing debounce; see `Mixtape.tsx`).

## Lighthouse

Chrome DevTools → Lighthouse → Accessibility category, mobile device.

Target: **score ≥ 95** on both `/` and `/#showcase`, in light and dark theme.

## WCAG 2.2 spot checks (the ones that actually move)

- **2.4.11 Focus Not Obscured**: Tab to a Strip link with the page mid-section — focused link visible above the sticky bar.
- **2.5.8 Target Size**: Strip toggles `min-width:44px;min-height:44px`; TabBar links `min-height:56px`; Mixtape SVG controls (knob r=17 / start r=16 / side flip 50×24) all clear the 24×24 minimum.
- **2.5.7 Dragging**: Volume is `<input type="range">` (keyboard arrows work). No drag-only interactions.

## Phase 2 manual checks

These cover features that the AA baseline doesn't include but disabled users actually rely on.

### Accessibility settings panel

1. Click the ⚙ icon in the Strip → panel opens; focus lands on the close button.
2. Tab through the controls in order: close → theme radios → contrast radios → text-size radios → readable checkbox.
3. Esc closes; focus returns to the ⚙ button.
4. Backdrop click closes (mouse).
5. Pick **Theme: Dark**, **Contrast: High**, **Text size: 125%**, **Readable: on** → reload. Page paints in those settings on the *first frame* (no flash to default).
6. Reset (Auto, Auto, 100%, off). OS-level `prefers-reduced-motion` and `prefers-contrast` still take effect when each panel option is "Auto".

### HeroSlides keyboard pause (WCAG 2.2.2 Level A)

1. Tab into the portrait slideshow region. The Pause button reveals (bottom-right).
2. Activate with Space → slides freeze; `aria-pressed="true"`.
3. Tab away → button stays visible because the slideshow is paused.
4. Tab back, activate again → slides resume; button hides on blur.

### Boot focus trap

1. Clear `localStorage.bm:skip` (or open in a private window). Reload.
2. The Boot cover is up. Tab repeatedly — focus stays on the Enter button (or cycles within the dialog), never escapes to the Strip behind.
3. Esc dismisses (new in Phase 2). Page transitions in.
4. After dismiss, Tab once → focus is somewhere reasonable inside the page (skip link reveals).

## Before merging

`npm run build` must succeed and produce a `dist/` with no `@axe-core/react` references (Vite tree-shakes the DEV branch).

```bash
grep -r "@axe-core" dist/ && echo "FAIL: axe-core leaked into prod bundle" || echo "OK: prod bundle clean"
```
