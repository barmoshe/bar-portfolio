# CLAUDE.md - bar-portfolio routing

You are assisting inside the `bar-portfolio` repo - a React 19 + Vite 6 + TypeScript portfolio site, deployed to GitHub Pages at https://barmoshe.github.io/bar-portfolio/ via GitHub Actions.

## Routing (open these first when relevant)

- Stack, build, deploy, Vite base path, GitHub Actions  →  `knowledge/01-stack.md`
- Design tokens, oklch, typography, spacing             →  `knowledge/02-design-system.md`
- Theme toggle, pre-paint script, ink-wipe GSAP timeline →  `knowledge/03-theming.md`
- HeroSlides fx cycle, GSAP, inkBleed, reduced-motion   →  `knowledge/04-animation.md`
- Component map, section ids, ink overlays              →  `knowledge/05-components.md`
- Projects + contact data, types, helpers               →  `knowledge/06-data.md`
- Invariants, gotchas, "do not break"                    →  `knowledge/99-caveats.md`
- Add a project                                          →  `recipes/add-project.md` (+ `prompts/add-project.md`)
- Customize colors / new palette                         →  `recipes/customize-theme.md` (+ `prompts/customize-colors.md`)
- Edit a section                                         →  `recipes/edit-section.md` (+ `prompts/add-section-block.md`)
- Deploy / verify live                                   →  `recipes/deploy.md`
- Design critique                                        →  `prompts/design-critique.md`
- Skill bundle that routes intents                       →  `skills/portfolio-curator/SKILL.md`

Slash commands: `/new-project`, `/theme-preview`, `/deploy-check`, `/typecheck` - see `.claude/commands/`.

## Things that must not be broken

1. **Pre-paint theme script** - inline in `index.html` `<head>`. Do not externalize, defer, or move into React.
2. **`HeroSlides` fx cycle** - four ink-native transitions (`bloom`, `brush`, `tear`, `crumple`) are GSAP-driven from `src/components/HeroSlides.tsx`. One timeline at a time (advance is serialized). `resetSlide()` must clear every fx-specific inline style on completion or the next cycle starts from stale state. See `knowledge/04-animation.md`.
3. **`base: '/bar-portfolio/'`** in `vite.config.ts` - if the repo is renamed, update this in lockstep.
4. **`public/.nojekyll`** - must land in `dist/`. Keeps GitHub Pages' Jekyll from stripping underscore folders.

Full rationale and anti-patterns: `knowledge/99-caveats.md`.

## Defaults

- Colors: `oklch()` only. New tokens land in `:root` **and** `html.dark` together. Body-text pairs must clear WCAG AA (≥ 4.5:1).
- Motion: prefer `transform` / `opacity` / `filter`. Respect `prefers-reduced-motion` via `gsap.matchMedia` + `FULL_MOTION_QUERY` from `src/lib/gsap.ts`.
- Styling: CSS custom properties in `src/styles.css`. Tailwind is intentionally rejected - see `knowledge/01-stack.md`.
- No new runtime deps for cosmetic changes. Current deps: `react`, `react-dom`, `gsap`, `@gsap/react`.
- Routing: single page + hash links (`#intro`, `#background`, `#mixtape`, `#repos`, `#letter`). Do not add React Router. Note that `#repos` auto-expands the collapsed Repos section.

## Scripts

```
npm install        # once
npm run dev        # http://localhost:5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # http://localhost:4173/bar-portfolio/
npm run typecheck  # tsc -b --noEmit
```

Design showcase: `http://localhost:5173/#showcase` (live tokens) · `http://localhost:5173/showcase.html` (standalone artifact).

## Branching

`main` is the deploy branch. `.github/workflows/deploy.yml` publishes on push. Feature branches are fine; merge to `main` to ship. One-time setup: **Settings → Pages → Source → GitHub Actions**.
