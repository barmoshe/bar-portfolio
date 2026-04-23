# bar-portfolio

<p>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 80" width="640" height="80" role="img" aria-label="bar · portfolio">
    <style>
      .title { font: 600 44px "Bodoni 72","Didot","Playfair Display",serif; fill: #1a1a1a; }
      .caret { fill: #d34a36; }
      .caret-blink { animation: blink 1.1s steps(2, start) infinite; }
      @keyframes blink { to { opacity: 0; } }
    </style>
    <text x="8" y="56" class="title">&lt;bar · portfolio /&gt;</text>
    <rect x="420" y="22" width="4" height="40" class="caret caret-blink"/>
  </svg>
</p>

<p>
  <img alt="React 19"       src="https://img.shields.io/badge/React-19-61dafb?logo=react&logoColor=white">
  <img alt="Vite 6"         src="https://img.shields.io/badge/Vite-6-646cff?logo=vite&logoColor=white">
  <img alt="TypeScript 5"   src="https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white">
  <img alt="GSAP 3"         src="https://img.shields.io/badge/GSAP-3-88ce02?logo=greensock&logoColor=white">
  <img alt="GitHub Pages"   src="https://img.shields.io/badge/GitHub%20Pages-deployed-2ea44f?logo=github">
  <img alt="License MIT"    src="https://img.shields.io/badge/license-MIT-6f42c1">
</p>

Bar Moshe's portfolio. A single-page paper-and-ink site - cover page, five sections (Intro, Background, Mixtape, Repos, Letter), a portrait slideshow with multiple clip-path transitions, a vinyl-themed mixtape with shuffled tracks, a collapsible project grid that opens into a lightbox, a mobile bottom tab bar, and an oklch design system that flips between light and dark via an ink-wipe GSAP timeline.

**Live:** https://barmoshe.github.io/bar-portfolio/ · **Design showcase:** [/#showcase](https://barmoshe.github.io/bar-portfolio/#showcase) · [/showcase.html](https://barmoshe.github.io/bar-portfolio/showcase.html)

## Design system at a glance

<p>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 200" width="720" height="200" role="img" aria-label="oklch token grid">
  <style>
    .lbl { font: 500 10px ui-monospace, "Courier New", monospace; fill: #1a1a1a; }
    .lbl-ink { font: 500 10px ui-monospace, "Courier New", monospace; fill: #f4efe4; }
    .title { font: 600 12px ui-monospace, "Courier New", monospace; fill: #555; text-transform: uppercase; letter-spacing: 0.06em; }
  </style>
  <text x="0" y="14" class="title">light · semantic</text>
  <g>
    <rect x="0"   y="24" width="100" height="60" fill="oklch(0.93 0.02 85)"/>  <text x="6" y="44" class="lbl">--paper</text>      <text x="6" y="58" class="lbl">.93 .02 85</text>
    <rect x="104" y="24" width="100" height="60" fill="oklch(0.88 0.03 80)"/>  <text x="110" y="44" class="lbl">--paper-2</text>   <text x="110" y="58" class="lbl">.88 .03 80</text>
    <rect x="208" y="24" width="100" height="60" fill="oklch(0.96 0.02 85)"/>  <text x="214" y="44" class="lbl">--surface-2</text> <text x="214" y="58" class="lbl">.96 .02 85</text>
    <rect x="312" y="24" width="100" height="60" fill="oklch(0.18 0.03 40)"/>  <text x="318" y="44" class="lbl-ink">--ink</text>   <text x="318" y="58" class="lbl-ink">.18 .03 40</text>
    <rect x="416" y="24" width="100" height="60" fill="oklch(0.34 0.04 40)"/>  <text x="422" y="44" class="lbl-ink">--ink-soft</text><text x="422" y="58" class="lbl-ink">.34 .04 40</text>
    <rect x="520" y="24" width="100" height="60" fill="oklch(0.48 0.03 40)"/>  <text x="526" y="44" class="lbl-ink">--ink-faint</text><text x="526" y="58" class="lbl-ink">.48 .03 40</text>
  </g>
  <text x="0" y="108" class="title">accents</text>
  <g>
    <rect x="0"   y="118" width="100" height="60" fill="oklch(0.58 0.22 25)"/>   <text x="6" y="138" class="lbl-ink">--red</text>    <text x="6" y="152" class="lbl-ink">.58 .22 25</text>
    <rect x="104" y="118" width="100" height="60" fill="oklch(0.44 0.14 150)"/>  <text x="110" y="138" class="lbl-ink">--green</text><text x="110" y="152" class="lbl-ink">.44 .14 150</text>
    <rect x="208" y="118" width="100" height="60" fill="oklch(0.45 0.16 250)"/>  <text x="214" y="138" class="lbl-ink">--blue</text> <text x="214" y="152" class="lbl-ink">.45 .16 250</text>
    <rect x="312" y="118" width="100" height="60" fill="oklch(0.86 0.17 90)"/>   <text x="318" y="138" class="lbl">--yellow</text>   <text x="318" y="152" class="lbl">.86 .17 90</text>
    <rect x="416" y="118" width="100" height="60" fill="oklch(0.62 0.22 340)"/>  <text x="422" y="138" class="lbl-ink">--magenta</text><text x="422" y="152" class="lbl-ink">.62 .22 340</text>
    <rect x="520" y="118" width="100" height="60" fill="oklch(0.46 0.22 295)"/>  <text x="526" y="138" class="lbl-ink">--purple</text><text x="526" y="152" class="lbl-ink">.46 .22 295</text>
  </g>
</svg>
</p>

Tokens live in `src/styles.css` (`:root` for light, `html.dark` for dark). The dark variant shifts hue to `~260` (cool) and pulls chroma back on accents so they don't glow on very dark surfaces. Full rationale: [`knowledge/02-design-system.md`](knowledge/02-design-system.md).

## Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | React 19 | Hooks-forward, small runtime, mature Vite integration. |
| Build | Vite 6 | Instant HMR, `base: '/bar-portfolio/'` for Pages. |
| Language | TypeScript 5 | Types keep `portfolio.ts` honest. |
| Animation | GSAP 3 + `@gsap/react` | `useGSAP`, ScrollTrigger, SplitText, Flip, `gsap.matchMedia`. |
| Styling | Hand-tuned CSS + oklch tokens | No Tailwind - intentional. See `knowledge/01-stack.md`. |
| Deploy | GitHub Actions → Pages | Push to `main` = deploy. |

## Develop

```bash
npm install
npm run dev        # http://localhost:5173
npm run typecheck  # tsc -b --noEmit
npm run build      # dist/
npm run preview    # http://localhost:4173/bar-portfolio/
```

**See the design system live →** [`/#showcase`](http://localhost:5173/#showcase) (live tokens via `getComputedStyle`) · [`/showcase.html`](http://localhost:5173/showcase.html) (standalone artifact).

## Deploy

Push to `main`. `.github/workflows/deploy.yml` runs `npm run build` and publishes `dist/` to Pages. Expect ~60–120 seconds from push to green. One-time setup: **Settings → Pages → Source → GitHub Actions**.

## Repo map

```
bar-portfolio/
├── src/
│   ├── main.tsx, App.tsx       React entry + top-level layout
│   ├── styles.css              oklch tokens + hand-tuned styles
│   ├── data/
│   │   ├── portfolio.ts        projects, contact, iconFor, shortDesc
│   │   └── tokens.ts           typed token catalog (for showcase)
│   ├── hooks/                  useTheme, useLightbox, useFolioScrub, …
│   ├── lib/                    gsap registrar, inkBleed
│   └── components/
│       ├── HeroSlides.tsx      fragile multi-fx cycle - see knowledge/04
│       ├── Lightbox, Strip, TabBar, Boot, Grain, Crease, HoverCard, CodeArt, InkDefs
│       ├── sections/           Intro, Background, Mixtape, Repos (collapsible), Letter
│       └── showcase/           #showcase route (ColorGrid, TypeSpecimen, FxPlayground)
├── public/
│   ├── .nojekyll               keeps Pages from eating folders
│   ├── portraits/              imgN.png for HeroSlides
│   └── showcase.html           standalone design-system artifact
├── knowledge/                  01-stack → 06-data + 99-caveats
├── recipes/                    add-project, customize-theme, edit-section, deploy
├── prompts/                    customize-colors, add-project, add-section-block, design-critique
├── skills/portfolio-curator/   SKILL.md - intent routing
└── .claude/
    ├── commands/               /new-project, /theme-preview, /deploy-check, /typecheck
    └── settings.local.json     scoped permissions allowlist
```

Start with [`CLAUDE.md`](CLAUDE.md) for the routing table, or [`knowledge/00-index.md`](knowledge/00-index.md) for the topic index.

## Contributing

This is a personal portfolio - issues and PRs welcome for bugs, accessibility, or documentation. For design changes, open an issue first.

## License

MIT - see [`LICENSE`](LICENSE).
