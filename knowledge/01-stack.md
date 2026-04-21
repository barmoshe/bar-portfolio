# 01 — Stack

## Runtime

- **React 19** with `StrictMode`, rendered from `src/main.tsx` into `#root` in `index.html`.
- **Vite 6** for dev server, build, and preview.
- **TypeScript 5** with project references (`tsconfig.json` → `tsconfig.app.json` + `tsconfig.node.json`).
- **GSAP 3** + `@gsap/react` for animations. Registered plugins: `ScrollTrigger`, `SplitText`, `Flip`, `useGSAP`. See `src/lib/gsap.ts`.
- **No UI library, no Tailwind, no styled-components.** All styling lives in a single `src/styles.css` (~700 lines) using CSS custom properties as design tokens. This is deliberate — see `99-caveats.md`.

## Scripts

```
npm install        # once
npm run dev        # http://localhost:5173/
npm run build      # tsc -b && vite build  → dist/
npm run preview    # http://localhost:4173/bar-portfolio/  (serves dist/)
npm run typecheck  # tsc -b --noEmit
```

## Critical Vite config

`vite.config.ts`:

```ts
export default defineConfig({
  plugins: [react()],
  base: '/bar-portfolio/',
});
```

- `base: '/bar-portfolio/'` is **mandatory**. GitHub Pages serves the app at `https://barmoshe.github.io/bar-portfolio/` (a subpath, not the domain root). Vite rewrites module URLs and `import.meta.env.BASE_URL` accordingly.
- If the repo is ever renamed, update `base` in lockstep, or every asset URL breaks post-deploy.
- `src/` imports are bundled. `public/` is copied verbatim to `dist/`. Use `import.meta.env.BASE_URL` when referencing `public/` files from TSX (see `HeroSlides.tsx` portraits loop).

## Deploy

`.github/workflows/deploy.yml` runs on push to `main`:

1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 20, npm cache)
3. `npm ci`
4. `npm run build`
5. `actions/upload-pages-artifact@v3` (path: `dist`)
6. `actions/deploy-pages@v4` (environment: `github-pages`)

One-time setup: **Settings → Pages → Source → GitHub Actions**.

`public/.nojekyll` must end up in `dist/` or GitHub Pages' Jekyll processor will strip directories beginning with `_`. Since Vite copies `public/` verbatim, this works automatically — **do not delete the file**.

## Why no Tailwind

- The stylesheet was hand-written for this site's paper/ink aesthetic (grain overlays, clip-path transitions, oklch-tuned dark mode) — utility classes would fight that more than help.
- oklch CSS vars give us perceptually-even themes for free; Tailwind v4 would add the same mechanism but force a migration of ~700 lines of CSS.
- Build output stays small (no utility CSS bloat; no Tailwind compile step).
- CLAUDE.md's invariants explicitly call out "Not migrated to Tailwind on purpose" for `src/styles.css`.

If a future contributor wants Tailwind, they should propose it as a discrete ADR, not as an incidental refactor.

## File-layer reading order

```
index.html                               Vite entry + inline pre-paint theme script
vite.config.ts                           base path + React plugin
src/main.tsx                             React root, imports styles.css once
src/App.tsx                              Top-level layout, owns boot/skip/lightbox/folio-scrub
src/styles.css                           Design tokens + all CSS
src/data/portfolio.ts                    Typed project & contact data + helpers
src/hooks/*.ts                           Stateful concerns: theme, boot, observer, lightbox, …
src/lib/gsap.ts                          GSAP registration + motion-query constants
src/lib/inkBleed.ts                      attachInkBleed — feDisplacementMap tween utility
src/components/*.tsx                     Visual primitives & overlays
src/components/sections/*.tsx            Page-level section components (one per section id)
src/components/showcase/*.tsx            Design-system preview, mounted on #showcase hash
public/portraits/*.png                   Portrait assets, consumed with BASE_URL prefix
public/showcase.html                     Standalone (non-React) showcase artifact
public/.nojekyll                         GitHub Pages must-keep
```
