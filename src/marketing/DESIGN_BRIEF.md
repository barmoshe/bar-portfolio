# Marketing site (`/business/`) — Handoff

> Stripped to plain HTML. Black on white. System fonts. No
> animations, no decoration, no color, no theme. The page is
> functional but visually raw. **You're picking up from here.**

---

## Where things live

```
src/marketing/
├── MarketingApp.tsx           ← entry; mount your design here
├── MarketingHeader.tsx        ← header (brand, nav, lang toggle, ⚙)
├── main.tsx                   ← React mount; axe-core in dev
├── marketing.css              ← STRIPPED. Rewrite this for your design.
├── i18n.ts                    ← all copy (HE+EN). LOCKED.
├── LangContext.tsx, contact.ts, scrollToIntake.ts
├── hooks/useReveal.ts         ← IntersectionObserver fallback
├── sections/
│   ├── Cover.tsx              ← hero
│   ├── ProjectTemplates.tsx   ← 10 project-type cards
│   ├── Process.tsx            ← 3 steps + pull quote
│   ├── About.tsx              ← bio + 3 stats
│   ├── Intake.tsx             ← LOCKED. Re-skin chrome only.
│   ├── FAQ.tsx                ← <details> accordions
│   └── ContactCTA.tsx         ← closing CTA
└── components/                ← infra (see below)

business/index.html            ← entry HTML; pre-paint script lives here
src/lib/gsap.ts                ← GSAP + ScrollTrigger + SplitText + Flip
src/lib/scrollReveal.ts        ← createReveal() helper
src/components/InkDefs.tsx     ← SVG filters (turbulence, displacement)
src/hooks/useTheme.ts          ← theme cycle + ink-wipe transition
```

## Don't change

- **Copy** in `src/marketing/i18n.ts` (HE + EN both locked).
- **The intake form** in `sections/Intake.tsx`. The quest flow,
  validation, letter assembly, and WhatsApp/mail dispatch all
  work. Re-skin the chrome; don't touch the logic. The visible
  keyboard-shortcut hint was deliberately removed because the
  page is mobile-first / touch-only — keep it out.
- **Theme system** (`useTheme.ts` + the `.ink-wipe` overlay).
- **Pre-paint script** inline in `business/index.html` `<head>`.
  Sets theme + lang + a11y prefs synchronously to prevent FOUC.
- **`base: '/bar-portfolio/'`** in `vite.config.ts`. Don't rename
  `business/`. Don't break the Vite multi-entry.
- **`bm:lang` + `bm:theme`** are shared with the main portfolio.

## Hard tech constraints

- **No new runtime deps.** Only `react`, `react-dom`, `gsap`,
  `@gsap/react`. Build with CSS, SVG (including SVG filters), and
  GSAP. No Three.js, no Framer Motion, no Lottie, no canvas libs.
- **WCAG 2.2 AA.** `npm run lint` (jsx-a11y) blocks the deploy.
  `@axe-core/react` runs in dev. Visible `:focus-visible` outline
  on every interactive surface. Body-text contrast ≥ 4.5:1.
- **`prefers-reduced-motion: reduce`** must yield a usable static
  page for every animated thing.
- **GPU-only animations.** Animate `transform` / `opacity` /
  `filter` only. Never `width`, `height`, `top`, `left`.
- **Mobile-first.** Single-column base, multi-col only ≥720px.
  Interactive targets ≥ 48×48px. `100svh`, not `100vh`. No
  `:hover`-only state.
- **Bilingual HE + EN.** Layout uses logical properties so RTL
  flips automatically. Arrows need `[dir="rtl"]` mirror rules.

## Infra ready (use it, ignore it, or replace it)

Files left in `src/marketing/components/` from earlier attempts —
not currently mounted, available if useful:

| File | What it is |
|---|---|
| `LiquidField.tsx` | Full-viewport gooey CSS color field (GPU-cheap blob mass driven by GSAP). |
| `KineticHeadline.tsx` | Headline with per-line clip-path reveal. |
| `BloomCta.tsx` | Touch-first orb CTA with bloom-wash transition on tap. |
| `SectionZone.tsx` | Wraps a section and crossfades root CSS vars on enter via ScrollTrigger. |
| `PaperGrain.tsx` | Static SVG noise overlay. |
| `LangToggle.tsx`, `SectionHeading.tsx`, `RunningFoot.tsx` | Existing primitives. |

There's a **design-system showcase route** at `/#showcase` (dev) /
`/bar-portfolio/showcase.html` (prod) — use it as a sandbox to
prototype palettes and animations before wiring them into the
live `/business/` page.

## How to test

```
npm install
npm run dev          # http://localhost:5173/bar-portfolio/business/
npm run typecheck    # CI gate
npm run lint         # CI gate
npm run build
```

Deploys go live on push to `main` via GitHub Actions.

---

# What I want

A **magnificent, graphic, animated, designed** portfolio
marketing website. **Mobile-first.** **Unique** — the visitor
should never feel they've seen this page before. **Weird is
welcome.** **Unorthodox ideas are welcome.** Don't play it safe.

It should give a first-time visitor on their phone the **wow
effect** — something that stops their thumb mid-scroll.

That's the brief. The how is yours.

## Before you build anything

Do real UX/UI research. Look at award-winning marketing sites,
unconventional portfolios, unexpected color systems, mobile
interaction patterns, and form-conversion UX. Bring references
back. Then design with conviction.

Ideas welcome. Don't be orthodox.
