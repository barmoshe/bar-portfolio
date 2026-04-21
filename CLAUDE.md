# Repo notes

## Stack

React 19 + Vite 6 + TypeScript, statically deployed to GitHub Pages.

- `index.html` — Vite entry at repo root. Keeps an inline pre-paint theme script in
  `<head>` — **must stay inline** to avoid a flash of light theme on dark-mode loads.
- `src/main.tsx` — React root; imports `styles.css` once.
- `src/styles.css` — the original hand-tuned stylesheet (oklch tokens, 5-effect slideshow
  animations, container queries, light/dark themes). Not migrated to Tailwind on purpose.
- `src/App.tsx` — top-level layout (grain, crease, boot, strip, main sections, tabbar, lightbox).
- `src/components/` — all React components; sections under `src/components/sections/`.
- `src/hooks/` — `useTheme`, `useBootDismiss`, `useSectionObserver`, `useLightbox`.
- `src/data/portfolio.ts` — projects + contact data, `iconFor`, `shortDesc` helpers.
- `public/portraits/` — portrait PNGs, copied verbatim into `dist/` by Vite.
- `public/.nojekyll` — keeps GitHub Pages' Jekyll processor from stripping folders.

## Scripts

```
npm install        # once
npm run dev        # vite dev server on :5173
npm run build      # tsc -b && vite build → dist/
npm run preview    # serve dist/ at :4173/bar-portfolio/
npm run typecheck  # tsc -b --noEmit
```

## Vite config

`base: '/bar-portfolio/'` in `vite.config.ts` is required so asset URLs resolve under
the GitHub Pages project path (`https://barmoshe.github.io/bar-portfolio/`). Portrait
paths use `import.meta.env.BASE_URL` so they pick up the base automatically.

## Branching

`main` is the deploy branch — push to `main` triggers the GitHub Actions workflow
(`.github/workflows/deploy.yml`) which runs `npm run build` and publishes `dist/` to
GitHub Pages. Feature branches are fine; merge to `main` to ship.

One-time setup: in GitHub Settings → Pages, set the source to **GitHub Actions**.

## Things that must not be broken

1. **Pre-paint theme script** — do not move out of `<head>` in `index.html`.
2. **`HeroSlides` fx cycle** — the `.is-enter` → reflow → `.is-active` sequence in
   `src/components/HeroSlides.tsx` is what drives the five clip-path transitions; a naive
   state flip breaks all of them.
3. **`base` in `vite.config.ts`** — changing the repo name means updating this.
4. **`public/.nojekyll`** — must land in `dist/`.
