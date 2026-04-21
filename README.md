# bar-portfolio

Bar Moshe's portfolio. A single-page site with a paper/ink aesthetic — cover page,
seven sections, a portrait slideshow with five transition effects, a project lightbox,
and a mobile bottom tab bar.

Built with **React 19 + Vite 6 + TypeScript**. Deployed as a static site to GitHub Pages.

Live: https://barmoshe.github.io/bar-portfolio/

## Develop

```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # dist/
npm run preview   # http://localhost:4173/bar-portfolio/
```

## Deploy

Push to `main` — `.github/workflows/deploy.yml` builds and publishes to GitHub Pages.
Set **Settings → Pages → Source → GitHub Actions** once.

## Layout

```
src/
├── main.tsx                        React root + styles.css
├── App.tsx                         top-level layout
├── styles.css                      original hand-tuned stylesheet
├── data/portfolio.ts               projects + contact + helpers
├── hooks/                          useTheme, useBootDismiss, useSectionObserver, useLightbox
└── components/
    ├── Boot, Strip, Grain, Crease,
    ├── TabBar, HeroSlides, Lightbox, CodeArt, HoverCard
    └── sections/
        ├── Dossier, Story, Experience,
        └── Repos, Music, Notes, Letter
public/
├── .nojekyll
└── portraits/img0..4.png
```

## License

MIT — see `LICENSE`.
