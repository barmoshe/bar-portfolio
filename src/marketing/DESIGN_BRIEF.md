# Marketing site (`/business/`) — As-Built

> Direction: **"לוח / BOARD"** — kanban-as-narrative.
> Mobile-first, RTL-native, GSAP + CSS + SVG only.
> Implemented 2026-05-18.

The page is a working sticker-kanban: every visible block is a card
with a status pill (`לעשות` / `בעבודה` / `בוצע`), sections are
columns, and the intake form is one live ticket the visitor fills
and "ships" via a 600 ms long-press on the dispatch button. The
medium IS the pitch — the page demonstrates the build-first
workflow it sells.

---

## Where things live

```
src/marketing/
├── MarketingApp.tsx           ← root: wraps in .mp-root .mp-board,
│                                seeds ScrollTrigger.config
├── MarketingHeader.tsx        ← sticky bar (brand, lang, ⚙)
├── main.tsx                   ← React mount; axe-core in dev
├── marketing.css              ← FULL design system. Tokens, sticker
│                                primitives, all section chrome,
│                                AccessibilityPanel re-skin
├── i18n.ts                    ← copy (HE+EN). Existing keys LOCKED.
│                                Adds: board.status.*, board.columns.*,
│                                board.brief, board.progress, board.ringHold
├── LangContext.tsx, contact.ts, scrollToIntake.ts
├── hooks/
│   ├── useReveal.ts           ← IntersectionObserver fallback (unused)
│   └── useLongPress.ts        ← 600ms hold-to-confirm w/ rAF progress
├── sections/
│   ├── Cover.tsx              ← 2-row offset hero stack (3 sticker beats)
│   ├── ProjectTemplates.tsx   ← "BACKLOG" column, 10 ticket cards
│   ├── Process.tsx            ← 3 step cards w/ scroll-driven status morph
│   ├── About.tsx              ← bio ticket + 3 stat micro-cards (count-up)
│   ├── Intake.tsx             ← live ticket; LOCKED logic, re-skinned chrome
│   ├── FAQ.tsx                ← <details> sticker cards
│   └── ContactCTA.tsx         ← DONE-slam closing card
└── components/                ← infra (mostly unused; see below)

business/index.html            ← entry HTML; pre-paint script + Google
                                  Fonts (Rubik + Heebo)
src/lib/gsap.ts                ← GSAP + ScrollTrigger + SplitText + Flip
src/lib/scrollReveal.ts        ← createReveal() helper
src/components/InkDefs.tsx     ← SVG filters (turbulence, displacement)
src/hooks/useTheme.ts          ← theme cycle + ink-wipe transition
```

## Visual DNA

- **Sticker card** primitive: 2.5px ink border, 6px offset shadow
  that pops to magenta on hover/focus/`data-pressed="true"`. On
  ≤640px the shadow compresses to 4px so cards don't crowd each other.
- **Status pill** primitive: rounded, ink-bordered, color-coded.
  `--mp-primary` (raspberry magenta) = TODO,
  `--mp-accent-2` (warm amber) = DOING,
  `--mp-accent-3` (deep teal-cobalt) = DONE.
  WhatsApp green (`--mp-whatsapp`) is reserved for the dispatch CTA.
- **DOING pulse**: `box-shadow` + `opacity` only — no `filter`
  keyframes (mobile-battery friendly). `data-alive` is toggled by an
  IntersectionObserver so off-screen pulses stop. Cap: 1 concurrent
  pulser on the page.
- **Column ribbon**: `border-inline-start: 6px` in a status color
  (BACKLOG = magenta, etc.) gives the kanban metaphor without
  needing horizontal columns (which die on mobile).
- **Typography**: Rubik (display, 400-900) + Heebo (body, 400-900)
  via Google Fonts.
- **Focus ring**: 3px magenta outline at 3px offset on every
  interactive surface.

## Motion budget (low-end Android target)

- ≤ 1 concurrently-animating SVG `<filter>`. No `baseFrequency`
  keyframes on mobile.
- No CSS `filter` keyframes. Use `box-shadow` + `opacity`.
- ≤ 8 concurrent GSAP scroll-driven transforms per frame.
- ≤ 12 active ScrollTriggers (`ScrollTrigger.batch` for BACKLOG).
- All infinite/loop animations IO-gated via `data-alive`.
- `100svh` everywhere (never `100vh`).
- `ScrollTrigger.config({ ignoreMobileResize: true })` seeded at boot.
- Never `ScrollTrigger.normalizeScroll(true)` — breaks input focus
  on iOS Safari.
- Reduced-motion short-circuits via `gsap.matchMedia` +
  `FULL_MOTION_QUERY` (from `src/lib/gsap.ts`).

## Don't change

- **Copy** in `src/marketing/i18n.ts` (HE + EN existing strings
  LOCKED). New `board.*` keys are additive and safe to extend.
- **The intake form** in `sections/Intake.tsx`. The quest flow,
  validation, letter assembly, and WhatsApp/mail dispatch all
  work. Re-skin the chrome; don't touch the logic. The visible
  keyboard-shortcut hint was deliberately removed — keep it out.
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
  `box-shadow` / `clip-path` only. Never `width`, `height`, `top`,
  `left`, `filter`.
- **Mobile-first.** Single-column base, multi-col only ≥720px.
  Interactive targets ≥ 48×48px. `100svh`, not `100vh`. No
  `:hover`-only state.
- **Bilingual HE + EN.** Layout uses logical properties so RTL
  flips automatically. Arrows need `[dir="rtl"]` mirror rules.

## Available infra (mostly unused by BOARD)

Files left in `src/marketing/components/` from earlier attempts —
not currently mounted, available if a future direction needs them:

| File | What it is |
|---|---|
| `LiquidField.tsx` | Full-viewport gooey CSS color field (GSAP). |
| `KineticHeadline.tsx` | Per-line clip-path headline reveal. |
| `BloomCta.tsx` | Touch-first orb CTA with bloom-wash transition. |
| `SectionZone.tsx` | Crossfades root CSS vars on enter via ScrollTrigger. |
| `PaperGrain.tsx` | Static SVG noise overlay. |
| `LangToggle.tsx` | Active. Renders the HE/EN pill in the header. |
| `SectionHeading.tsx`, `RunningFoot.tsx` | Editorial-era leftovers; BOARD uses its own `.mp-h` + no per-section footer. |

There's a **design-system showcase route** at `/#showcase` (dev) /
`/bar-portfolio/showcase.html` (prod) for prototyping in isolation.

## How to test

```
npm install
npm run dev          # http://localhost:5173/bar-portfolio/business/
npm run typecheck    # CI gate
npm run lint         # CI gate
npm run build
```

Deploys go live on push to `main` via GitHub Actions.

## Verification checklist (BOARD)

- [ ] Every visible block is a sticker card with a status pill.
- [ ] Hero shows three offset cards above the fold on 390×844.
- [ ] DOING card pulses; only one element pulses at a time.
- [ ] Process step pills morph TODO → DOING → DONE in order as you
      scroll past each card (exactly one DOING at any time).
- [ ] Intake header pill morphs across chapters; brief sidebar is
      a sticky `<details>` on mobile, true sidebar from 820px up.
- [ ] Field commit triggers a border-bloom on the matching brief row.
- [ ] Final SEND requires 600ms hold; ring draws; keyboard Enter
      fires immediately.
- [ ] HE + EN both render. Status pills use Hebrew labels in HE.
- [ ] Reduced-motion: every animation collapses to a usable
      static state.

---

# History

| Date | Direction | Why we moved on |
|---|---|---|
| 2026-05-17 | Editorial Hebrew brutalism (Issue 01) | Magazine framing felt formal; not the right voice for a builder-for-hire pitch. |
| 2026-05-18 AM | "Build Log" terminal motif | Too dev-coded for non-technical leads (~50% of the audience). |
| 2026-05-18 PM | "Liquid Drift" gooey blobs | Loud and pretty but didn't say anything about what the page is selling. |
| 2026-05-18 PM | **"BOARD" — current** | The medium IS the pitch: you describe a card, watch it get built, decide. |
