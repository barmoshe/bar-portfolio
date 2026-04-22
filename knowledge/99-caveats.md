# 99 - Caveats & invariants

Things that look innocuous but break something when changed. Read before refactoring.

## The four "must not be broken" items (from `CLAUDE.md`)

### 1. Pre-paint theme script stays inline in `<head>`

File: `index.html`. The `(function(){…})()` IIFE inside `<head>` that reads `localStorage["bm:theme"]` and adds `html.dark` synchronously. **Do not**:

- Move it to `src/main.tsx` (React mounts after first paint → flash of light theme on dark-mode loads).
- Extract it to an external `<script src="…">` in `<head>` (async/defer → same problem).
- Minify or wrap it in a module - `<head>` scripts run synchronously by default; a `type="module"` makes it deferred.

Keep it verbatim in `<head>`. If you need to add to the logic, extend the IIFE in place.

### 2. `HeroSlides` fx cycle - GSAP-owned, one timeline at a time

File: `src/components/HeroSlides.tsx`. See `04-animation.md`.

The old reflow → rAF → `.is-enter` → `.is-active` dance is gone - GSAP owns frame scheduling now, which made the dance unnecessary. The current invariants are:

- `advance()` early-returns if the previous timeline is still active. Don't let two transitions overlap; the shared `#ink-crumple` filter assumes serial execution.
- The incoming slide's inline styles (mask custom props, `filter`, `opacity`, `z-index`) must be cleared in `onComplete` via `resetSlide()`. Otherwise React's class-based resting state (`.is-active` ↔ `opacity: 1`) is overridden by stale inline values.
- `setIdx(next)` must happen *before* GSAP starts tweening. React re-renders flip `.is-active` synchronously; GSAP's inline styles outrank CSS during the transition window.
- `resetSlide()` must list every fx-specific custom prop. Forget one and the next cycle starts from a stale state.

### 3. `base: '/bar-portfolio/'` in `vite.config.ts`

If the repo is renamed, update this in lockstep. Also update `knowledge/01-stack.md` and any hardcoded absolute URLs (there should be none - `import.meta.env.BASE_URL` is used throughout).

### 4. `public/.nojekyll` must end up in `dist/`

GitHub Pages runs Jekyll by default, which strips directories beginning with `_`. Vite's asset hashing produces `dist/assets/…` which is fine, but if we ever change the output dir to `dist/_app/…` or similar, GH Pages would eat it. `public/.nojekyll` is an empty file that disables Jekyll for the whole deploy - don't delete it.

## Additional caveats

### `InkDefs` must render before any consumer

If `<InkDefs />` is not the first child in `App.tsx`, any `<filter id="ink-bleed-*">` lookup in `attachInkBleed` fails - the filter doesn't exist yet in the DOM. Order in `App.tsx` is: `InkDefs → Grain → Crease → Boot → Strip → main → …`.

### Ink-wipe is imperative DOM, not React state

The `.ink-wipe` div in `App.tsx` is mutated directly by GSAP from `useTheme.ts`. Don't wrap it in a state-driven component - the timing depends on the synchronous class flip happening at exactly `>-0.05` seconds into the GSAP timeline, something React rendering can't guarantee.

### `useGSAP` from `@gsap/react` - always use it

Never raw `useEffect` for GSAP animations. `useGSAP` handles:

- React Strict Mode double-invoke (dev).
- Automatic `gsap.context()` cleanup on unmount.
- Scope tethering so selectors don't leak cross-component.

### `gsap.matchMedia` wraps every animation

Every animation should branch on `FULL_MOTION_QUERY` (re-exported from `src/lib/gsap.ts`). Reduced-motion users get static content for free. See `04-animation.md`.

### Localhost preview port

Dev server: `http://localhost:5173/` (Vite default).
Preview server: `http://localhost:4173/bar-portfolio/` (note the `/bar-portfolio/` base path is respected in preview but NOT in dev).

So showcase URLs:

- Dev: `http://localhost:5173/#showcase` and `http://localhost:5173/showcase.html`
- Preview: `http://localhost:4173/bar-portfolio/#showcase` and `http://localhost:4173/bar-portfolio/showcase.html`
- Prod: `https://barmoshe.github.io/bar-portfolio/#showcase` and `https://barmoshe.github.io/bar-portfolio/showcase.html`

### `localStorage` in SSR / tests

All reads are wrapped in try/catch (see `useTheme.ts`, `App.tsx`'s `readSkip`). If you introduce a third place that reads localStorage, keep the same pattern - GitHub Pages doesn't SSR, but tests or a static prerender might, and synchronous localStorage access throws in those contexts.

### GitHub Pages propagation delay

After `git push origin main`, the GitHub Actions workflow runs build + deploy in ~1–2 minutes. Live URL typically serves the new deploy within 60 seconds of the workflow going green. If you `curl` and get stale content, wait another 30s before debugging.

### Tailwind is not coming

See `01-stack.md`. If you think you need Tailwind, re-read that section first. The current CSS is ~700 lines, hand-tuned, and isn't a performance problem.

### Don't add React Router

The site is single-page with anchor links (`#intro`, `#story`, …). Adding a router would require reworking:

- Section id ↔ anchor link bindings in `Strip` and `TabBar`.
- `useSectionObserver` (which watches scroll position).
- The `#showcase` hash check in `App.tsx`.

All for a marginal benefit. If the site grows into multiple routes, revisit.
