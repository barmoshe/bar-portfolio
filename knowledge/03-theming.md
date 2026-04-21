# 03 — Theming

Three cooperating layers make the theme system work. Understand all three before editing.

## 1. Pre-paint theme resolver (`index.html`)

Inline `<script>` inside `<head>`, running before `<body>`:

```js
(function(){
  try{
    var saved = localStorage.getItem("bm:theme");
    var mq = matchMedia("(prefers-color-scheme: dark)");
    var dark = saved === "dark" || (saved !== "light" && mq.matches);
    if (dark) document.documentElement.classList.add("dark");
    document.documentElement.dataset.themePref = saved || "auto";
  }catch(e){}
})();
```

- Reads `localStorage["bm:theme"]` (`"light"` | `"dark"` | `null`).
- If `null`, falls back to `prefers-color-scheme`.
- Applies `html.dark` class synchronously — before the browser paints any pixels, so there's no flash of light theme on a dark-mode load (**FOUC prevention**).
- Also writes `document.documentElement.dataset.themePref` so React can hydrate the UI state without re-reading localStorage.

**Invariant**: this script must stay inline in `<head>`. Moving it to `src/main.tsx` or an external file introduces a paint delay and reintroduces FOUC. See `99-caveats.md`.

## 2. `useTheme` hook (`src/hooks/useTheme.ts`)

State shape:

```ts
type ThemePref = 'auto' | 'light' | 'dark';
```

Storage key: `"bm:theme"` (same as the pre-paint resolver reads).

Cycle order on toggle: `auto → light → dark → auto`.

Exports:

```ts
useTheme(): {
  pref: ThemePref,
  cycle: (origin?: { x: number; y: number }) => void,
  glyph: string,   // "🌓" | "☀" | "☾"
  label: string,   // "Theme: auto (system)" | "Theme: light" | "Theme: dark"
}
```

Behavior:

- **Mount**: reads `localStorage`, does **not** re-apply the class (pre-paint script already did). Only syncs `dataset.themePref`.
- **Subsequent renders**: calls `apply(pref, systemDark)` which toggles `html.dark`.
- **`auto` mode**: subscribes to `matchMedia('(prefers-color-scheme: dark)')` `change` events, re-applies on OS theme flip.
- **`cycle(origin)`**: origin is the on-screen point that triggered the toggle (center of the theme button). Drives the ink-wipe (below). Without origin (e.g. programmatic cycle), flips the class instantly.

## 3. Ink-wipe transition (GSAP timeline)

The overlay `<div class="ink-wipe" />` is rendered in `App.tsx` and left invisible until a cycle triggers it. `runInkWipe()` in `useTheme.ts` builds one GSAP timeline per toggle:

1. `set` the wipe to `display:block; opacity:1; clipPath: circle(0% at <origin>)`.
2. `to` `clipPath: circle(150% at <origin>)` over 550ms with `power3.inOut` — disk blooms out from the click origin and fully covers the viewport.
3. `.call(flipTheme, [], '>-0.05')` — the `html.dark` class flip happens **while the page is hidden under the wipe**, so the user never sees a harsh un-transitioned flip.
4. `to` `opacity: 0` over 300ms.
5. `set` back to `display:none`, clear inline props.

**Reduced-motion short-circuit**: if `matchMedia('(prefers-reduced-motion: reduce)')` matches (or `.ink-wipe` element missing), `flipTheme()` runs immediately and the timeline is skipped.

## Semantics & gotchas

- Do not set `html.dark` from React without going through `apply()` — the theme pref dataset attribute will drift.
- Do not write to `localStorage["bm:theme"]` from anywhere else (there's one `write()` in `useTheme.ts`; keep it that way).
- The `.ink-wipe` element is intentionally not React-reactive. `useTheme` mutates it imperatively via GSAP. Don't try to move it to a stateful Framer-style component; the timing is too tight.
- If you add a new theme-aware surface, reference the existing tokens (`--paper`, `--ink`, `--surface-*`) rather than hard-coding — they auto-flip via `html.dark`.

## Related files

- `index.html` — inline pre-paint script.
- `src/hooks/useTheme.ts` — the whole hook + ink-wipe.
- `src/App.tsx` — renders `<div className="ink-wipe" aria-hidden="true" />` and wires `<Strip onThemeCycle={cycle} />`.
- `src/styles.css` — `.ink-wipe` styles (positioning, pointer-events, mix-blend-mode); `html.dark` overrides.
- `knowledge/02-design-system.md` — the token values that flip when `html.dark` toggles.
