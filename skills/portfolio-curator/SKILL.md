---
name: portfolio-curator
description: Route editing intents for bar-portfolio — add or edit projects in src/data/portfolio.ts, tweak oklch color tokens in src/styles.css, edit section content under src/components/sections, and verify GitHub Pages deploys. Use when the user asks to update portfolio content, styling, or to ship changes to the live site.
license: MIT
---

# portfolio-curator

Routing skill for the `bar-portfolio` repo (React 19 + Vite 6 + TypeScript, deployed to GitHub Pages at https://barmoshe.github.io/bar-portfolio/).

## What this skill does

Matches the user's intent to one of four workflows, opens the relevant recipe + prompt, and keeps the four site invariants intact:

1. Pre-paint theme script stays inline in `index.html` `<head>`.
2. `HeroSlides` fx cycle — `.is-enter` → forced reflow → RAF → `.is-active`.
3. `base: '/bar-portfolio/'` in `vite.config.ts`.
4. `public/.nojekyll` must land in `dist/`.

Full rationale: `knowledge/99-caveats.md`.

## Intent → path

| User says something like… | Open |
|---|---|
| "add a project", "new repo entry", "put this on the portfolio" | `recipes/add-project.md` → `prompts/add-project.md` |
| "change the colors", "new palette", "make it warmer/cooler" | `recipes/customize-theme.md` → `prompts/customize-colors.md` |
| "edit the dossier/story/experience/…", "add a paragraph to <section>" | `recipes/edit-section.md` → `prompts/add-section-block.md` |
| "deploy", "push live", "ship it" | `recipes/deploy.md` |
| "critique the design", "something looks off" | `prompts/design-critique.md` |

## Slash commands (in `.claude/commands/`)

For repeatable automation:

- `/new-project` — runs `recipes/add-project.md` end-to-end with prompts.
- `/theme-preview` — starts dev server, opens `http://localhost:5173/#showcase`.
- `/deploy-check` — clean status → push → poll GH Actions → curl live URL.
- `/typecheck` — `npm run typecheck` with error summary.

## Background (open only if needed)

- Stack, build, deploy pipeline → `knowledge/01-stack.md`
- Design system and oklch token model → `knowledge/02-design-system.md`
- Theme system (pre-paint, useTheme, ink-wipe) → `knowledge/03-theming.md`
- Animation layers (HeroSlides, GSAP, inkBleed) → `knowledge/04-animation.md`
- Component map and state ownership → `knowledge/05-components.md`
- Data model and helpers → `knowledge/06-data.md`
- Invariants and gotchas → `knowledge/99-caveats.md`

## Operating rules

- Never edit site behavior without first checking `knowledge/99-caveats.md` for the relevant invariant.
- Prefer reusing primitives (`Reveal`, `HoverCard`, `InkTimeline`, `CodeArt`) over new animation code.
- Never introduce Tailwind, React Router, or new runtime dependencies for cosmetic changes.
- All color work is oklch. All motion work respects `prefers-reduced-motion` via `gsap.matchMedia` + `FULL_MOTION_QUERY` from `src/lib/gsap.ts`.
- The `main` branch is the deploy branch — pushing is deploying.

## When in doubt

Open `knowledge/00-index.md` — it's the routing table for everything else.
