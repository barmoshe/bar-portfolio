# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

`bar-portfolio` is a React 19 + Vite 6 + TypeScript site deployed to GitHub Pages at https://barmoshe.github.io/bar-portfolio/ via GitHub Actions on push to `main`. It is **three Vite entries served from one deploy** (see `vite.config.ts`):

| Entry | URL | Source | Role |
|---|---|---|---|
| `index.html` | `/bar-portfolio/` | `src/main.tsx` → `App.tsx` | English portfolio (single-page, hash-nav: `#intro`, `#background`, `#mixtape`, `#repos`, `#letter`). |
| `business/index.html` | `/bar-portfolio/business/` | `src/marketing/main.tsx` → `MarketingApp.tsx` | Marketing landing. Bilingual HE/EN with `bm:lang` persistence; first-visit pick is weighted random (70/30 HE/EN), resolved in the pre-paint script. |
| `backoffice/index.html` | `/bar-portfolio/backoffice/` | `src/backoffice/main.tsx` → `Backoffice.tsx` | Fictional Hebrew CRM demo (leads / invoices / calendar). `robots: noindex`. Storage-backed; no real backend. |

All three share `src/styles.css` (root tokens + theme) and the same `bm:theme` / a11y prefs via the inline pre-paint script that lives in each `<head>`.

## Routing (open these first when relevant)

- Stack, build, deploy, Vite base path, GitHub Actions → `knowledge/01-stack.md`
- Design tokens, oklch, typography, spacing → `knowledge/02-design-system.md`
- Theme toggle, pre-paint script, ink-wipe GSAP timeline → `knowledge/03-theming.md`
- HeroSlides fx cycle, GSAP, inkBleed, reduced-motion → `knowledge/04-animation.md`
- Component map, section ids, ink overlays, marketing-site map → `knowledge/05-components.md`
- Projects + contact data, types, helpers → `knowledge/06-data.md`
- Mixtape audio engine, master chain, sends, tape warp → `knowledge/07-mixtape-audio.md`
- Invariants, gotchas, "do not break" → `knowledge/99-caveats.md`
- Add a project → `recipes/add-project.md` (+ `prompts/add-project.md`)
- Customize colors / new palette → `recipes/customize-theme.md` (+ `prompts/customize-colors.md`)
- Edit a section → `recipes/edit-section.md` (+ `prompts/add-section-block.md`)
- Deploy / verify live → `recipes/deploy.md`
- Accessibility check (run after design changes) → `recipes/a11y-check.md`
- Design critique → `prompts/design-critique.md`
- Skill bundle that routes intents → `skills/portfolio-curator/SKILL.md`

Slash commands: `/new-project`, `/theme-preview`, `/deploy-check`, `/typecheck` - see `.claude/commands/`.

## High-level architecture

### Portfolio (`src/`)

`App.tsx` is the top-level layout. Read top-to-bottom - the JSX is the architecture:

```
<InkDefs />                 // SVG <defs> for #ink-bleed-* + #ink-crumple. MUST render first.
<Grain /> <Crease />        // Paper-texture overlays
<Boot ? />                  // Onboarding cover, dismissible; trapped focus until dismissed
<div inert={modalOpen}>
  <Strip />                 // Sticky nav: theme cycle, ⚙ accessibility panel, skip, anchors
  <main id="main" tabIndex={-1}>
    <Intro /> <Background /> <Suspense><Mixtape/></Suspense> <Repos/> <Letter/>
  </main>
  <TabBar />                // Mobile bottom nav (hidden ≥820px)
</div>
<Lightbox />                // Project modal, animates from card's getBoundingClientRect
<div class="ink-wipe" />    // Theme-flip overlay, mutated imperatively by useTheme
```

Section ids are stable (`intro/background/mixtape/repos/letter`) and consumed by `Strip` anchors, `TabBar`, and `useSectionObserver`. Mixtape is `React.lazy`'d so the WebAudio engine isn't paid for on first paint. `#showcase` in the URL hash is a top-level switch in `src/main.tsx` that mounts `Showcase` instead of `App` - it is the design-system preview, **not** a route.

### Three animation layers

1. **HeroSlides fx cycle** (`src/components/HeroSlides.tsx`) - four ink-native transitions (`bloom`, `brush`, `tear`, `crumple`), one GSAP timeline at a time, Fisher-Yates shuffle bag prevents repeats across boundaries. See `knowledge/04-animation.md`.
2. **Scroll reveals** (`src/lib/scrollReveal.ts`) - `createReveal()` builds a paused tween + ScrollTrigger; replays only after the section has been off-screen ≥ `staleAfterMs` (default 8s).
3. **Ink-bleed headings** (`src/lib/inkBleed.ts`) - `attachInkBleed(el, id, opts)` scrubs `feDisplacementMap.scale` from a `from` value down to 0 as the heading enters viewport. Each `id` is its own filter in `InkDefs.tsx` so concurrent tweens never collide.

All three branch on `FULL_MOTION_QUERY` from `src/lib/gsap.ts` and use `useGSAP` (not raw `useEffect`).

### Theme system (three cooperating layers)

1. **Inline pre-paint script** in each `<head>` - reads `bm:theme` and a11y prefs, sets `html.dark` / `html.dataset.contrast` / `--text-scale` synchronously to avoid FOUC. The `business/` page also resolves `bm:lang` here to set `<html lang>` / `<html dir>`.
2. **`useTheme` hook** (`src/hooks/useTheme.ts`) - `auto → light → dark → auto` cycle. On user toggle, calls `runInkWipe(origin)` which builds a GSAP timeline: bloom a circle clip from the click origin, flip `html.dark` while the page is masked, fade the wipe out.
3. **Reduced-motion short-circuit** - skips the timeline, flips instantly.

### Accessibility prefs (Phase 2)

`src/components/AccessibilityPanel.tsx` (opened from `Strip`'s ⚙ button) reads/writes `bm:contrast`, `bm:text-scale`, `bm:readable` via `src/hooks/usePreferences.ts`. The inline pre-paint script in **all three** entry HTMLs mirrors the same reads - if you add a pref, update both sides in lockstep.

### Marketing site (`src/marketing/`)

A separate Vite entry; not a route. `MarketingApp` wraps `LangProvider`. Strings live in `src/marketing/i18n.ts` (HE + EN dictionaries), persisted as `bm:lang` and surfaced through `useLang()` as `{ lang, setLang, toggle, t }`. Three semantic accents (`--mp-primary` magenta, `--mp-accent-2` orange, `--mp-accent-3` blue) carry fixed roles. **Under the current "BOARD" direction these map to kanban states**: magenta = TODO, orange = DOING, blue = DONE; WhatsApp green (`--mp-whatsapp`) is reserved for the dispatch CTA. See `knowledge/02-design-system.md` § Marketing color-meaning. Shares `bm:theme` with the portfolio.

### Backoffice (`src/backoffice/`)

Standalone Hebrew/RTL CRM-style demo. Views in `views/`, primitives in `components/`, fake backend in `lib/backend.ts` + `lib/storage.ts`, route state in `lib/route.ts`/`useRoute()`. Marked `noindex,nofollow`. No real data leaves localStorage.

### Mixtape audio (`src/lib/mixtapeAudio.ts` + `src/lib/mixtapeTracks.ts`)

Small flat WebAudio engine backed by pre-rendered MP3s under `public/audio/{sideA,sideB,sfx}/`. Side A is lofi hip hop; Side B is house/techno. `AudioContext` is constructed **only inside `unlock()`**, which is **only** invoked from the Start-button click in `Mixtape.tsx` - do not add any other unlock path. Note: `knowledge/07-mixtape-audio.md` currently describes a "removed" state but the engine is live; trust the code over that doc when they disagree.

## Things that must not be broken

1. **Pre-paint theme script** - inline in each entry `<head>` (`index.html`, `business/index.html`, `backoffice/index.html`). Do not externalize, defer, or move into React.
2. **`HeroSlides` fx cycle** - `advance()` early-returns if the previous timeline is still active (the shared `#ink-crumple` filter assumes serial execution). `resetSlide()` must clear every fx-specific inline style on completion or the next cycle starts from stale state. See `knowledge/04-animation.md`.
3. **`base: '/bar-portfolio/'`** in `vite.config.ts` - if the repo is renamed, update this in lockstep with absolute URLs in `index.html`, `business/index.html`, `public/sitemap.xml`, `public/robots.txt`.
4. **`public/.nojekyll`** - must land in `dist/`. Keeps GitHub Pages' Jekyll from stripping underscore folders.
5. **Mixtape audio gating** - `AudioContext` only inside `unlock()`, invoked only from the Start button. Do not restore the Tone.js build or the previous procedural zero-dep engine verbatim.
6. **Accessibility floor (WCAG 2.2 AA)** - `npm run lint` (jsx-a11y/recommended) runs in CI and **blocks the deploy** (`.github/workflows/deploy.yml`). `@axe-core/react` runs in dev only via `src/main.tsx` and `src/marketing/main.tsx`. Skip link, `<main id="main" tabIndex={-1}>`, hash-nav focus handoff, and `:focus-within` on the Repos card pattern are intentional - don't unwind. Run `recipes/a11y-check.md` after any change to navigation, focus, semantic structure, animation, color tokens, or audio controls.
7. **Accessibility panel parity** - `AccessibilityPanel` ↔ `usePreferences` ↔ pre-paint scripts must stay in sync. Do not install a third-party a11y overlay (UserWay, accessiBe). `HeroSlides` has a keyboard-accessible Pause button (WCAG 2.2.2); `Boot` has a focus trap.
8. **`InkDefs` first child of `App.tsx`** - filter lookups in `attachInkBleed` go through DOM id resolution; reordering blanks every filter effect.
9. **Vite multi-entry** - `vite.config.ts` declares three inputs. Removing `business/` or `backoffice/` from `rollupOptions.input` drops them from `dist/`.

Full rationale and anti-patterns: `knowledge/99-caveats.md`.

## Defaults

- **Colors**: `oklch()` only. New tokens land in `:root` **and** `html.dark` together. Body-text pairs must clear WCAG AA (≥ 4.5:1). Marketing palette is scoped to `.mp-root` in `src/marketing/marketing.css`.
- **Motion**: prefer `transform` / `opacity` / `filter`. Respect `prefers-reduced-motion` via `gsap.matchMedia` + `FULL_MOTION_QUERY` from `src/lib/gsap.ts`. Always use `useGSAP` from `@gsap/react` (not raw `useEffect`).
- **Styling**: CSS custom properties in `src/styles.css`. Tailwind is intentionally rejected - see `knowledge/01-stack.md`.
- **No new runtime deps for cosmetic changes.** Current deps: `react`, `react-dom`, `gsap`, `@gsap/react`. Static metadata (SEO, JSON-LD) is hand-edited in the HTML files, not generated via `react-helmet`.
- **Routing**: hash links only. Do not add React Router (it would require reworking `Strip`, `TabBar`, `useSectionObserver`, and the `#showcase` switch). The `#repos` hash does not auto-expand Repos; the in-section toggle is the only opener.
- **Project content** lives in `src/data/portfolio.ts` (typed `Project[]`). Section copy lives in JSX inside `src/components/sections/*.tsx`. Mixtape `TRACKS` and Letter `CARDS` are inline arrays in their section files (first `TRACKS` entry is pinned to A1; rest shuffle into balanced halves).

## Scripts

```
npm install        # once
npm run dev        # http://localhost:5173/  (note: vite dev does NOT prefix base; visit /, /business/, /backoffice/)
npm run lint       # eslint . - required to pass in CI before deploy
npm run typecheck  # tsc -b --noEmit
npm run build      # tsc -b && vite build → dist/  (builds all three entries)
npm run preview    # http://localhost:4173/bar-portfolio/  (preview DOES use base path)
```

No test runner is configured.

**Design showcase**: `http://localhost:5173/#showcase` (live tokens via `getComputedStyle`) · `http://localhost:5173/showcase.html` (standalone artifact). On preview/prod, prefix with `/bar-portfolio/`.

## Deploy & branching

`main` is the deploy branch. `.github/workflows/deploy.yml` runs `npm ci && npm run lint && npm run build` then `actions/deploy-pages@v4`. Concurrency is `group: pages, cancel-in-progress: false` - pushes queue cleanly (cancelling mid-deploy would orphan the in-flight Pages deployment; don't change this). Expect ~60–120s push-to-green.

Feature branches are fine; merge to `main` to ship. One-time setup: **Settings → Pages → Source → GitHub Actions**.
