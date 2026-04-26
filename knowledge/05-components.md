# 05 - Component map

## Render order in `App.tsx`

```
<InkDefs />               // SVG <defs> for feDisplacementMap filters - must be first
<Grain />                 // Full-viewport noise overlay
<Crease />                // Horizontal fold line
<Boot ? />                // Full-screen onboarding (dismissible, hidden after skip)
<Strip />                 // Sticky top nav: theme toggle, skip button, section links
<main>
  <Intro />               // id="intro"      - 01 WHOAMI - hero, identity card, portrait slideshow
  <Background />          // id="background" - 02 BACKGROUND - work + education cards (Joomsy, Self-directed, Afeka, Wochit, Wix, Coding Academy, BPM College)
  <Mixtape />             // id="mixtape"    - 03 MIXTAPE - vinyl rig + tracks shuffled across sides each load
  <Repos onOpen={…} />    // id="repos"      - 04 REPOS - project grid (collapsible, default closed; opens Lightbox on click)
  <Letter />              // id="letter"     - 05 PING - contact cards
</main>
<TabBar />                // Mobile bottom nav (hidden > 820px)
<Lightbox />              // Fullscreen project modal, portaled into root
<div class="ink-wipe" />  // Theme transition overlay (imperative, driven by useTheme)
```

Folio numbers are hand-typed inside each section file (`<b>03</b> // MIXTAPE`).
If sections are reordered, renumber the `<b>NN</b>` literals too — there is no
auto-numbering. The folio fade is handled by `useFolioScrub`, which queries
`.page .folio` from the DOM and is sequence-agnostic.

**`InkDefs` must render before anything else** - it defines the SVG filters that `useInk` / `attachInkBleed` / certain sections reference by id. If you reorder, all filter-based effects go blank.

## Visual primitives (`src/components/`)

| File | Role | Key deps |
|---|---|---|
| `InkDefs.tsx` | SVG `<defs>` - `#ink-bleed-*` feDisplacementMap filters. Exports `inkBleedUrl(id)` and `InkBleedId` type. | - |
| `Grain.tsx` | Fixed-position `<canvas>` rendering low-frequency noise. Multiplies over the page. | - |
| `Crease.tsx` | Thin horizontal line with shadow - gives "folded paper" feel. | - |
| `Boot.tsx` | Onboarding cover. Click "Enter the portfolio" to dismiss. | - |
| `Strip.tsx` | Sticky top bar. Theme toggle, skip button, section anchor links. Props: `themeGlyph`, `themeLabel`, `onThemeCycle`, `onSkip`, `skipRemembered`. | `useTheme` (via props) |
| `TabBar.tsx` | Mobile bottom nav. Uses `useSectionObserver` to highlight active section. The `SECTIONS` const must mirror the page render order. | `useSectionObserver` |
| `HeroSlides.tsx` | Portrait slideshow with multi-fx cycle. **Fragile** - see `04-animation.md`. | GSAP, `lib/gsap` |
| `Lightbox.tsx` | Fullscreen project modal. Animates from `sourceRect` card position. Keyed by `openIdx`. | GSAP |
| `HoverCard.tsx` | Interactive card primitive. Used by `Letter` for contact cards. | - |
| `CodeArt.tsx` | Ascii/code-glyph display for project cards. Uses `iconFor` from `data/portfolio.ts`. | - |

Reveal animations are not a wrapper component anymore — sections call
`createReveal` from `src/lib/scrollReveal.ts` directly inside `useGSAP` blocks,
gated on `FULL_MOTION_QUERY` (and `MOBILE_QUERY` / `DESKTOP_QUERY` where the
choreography differs by viewport).

## Sections (`src/components/sections/`)

One component per section id. The section id is set on the **outermost element** (usually the `<section>` or `<article>`) so `useSectionObserver` picks it up.

| File | id | Role | Notes |
|---|---|---|---|
| `Intro.tsx` | `intro` | Hero intro with `HeroSlides`, taped ID card, byline, drop paragraph, credo card. | folio 01 // WHOAMI |
| `Background.tsx` | `background` | Work + education cards: Joomsy, Self-directed, Afeka, plus a small grid for Wochit, Wix, Coding Academy, BPM College. All inline (no `data/`-driven list). | folio 02 // BACKGROUND |
| `Mixtape.tsx` | `mixtape` | Vinyl-themed "tracks" section. Inline `TRACKS` array (typed as `TrackBase[]`) + `shuffleAndAssignSides()` that pins the first track to A1 and Fisher-Yates the rest into balanced A/B halves on each mount. Sketch rig (`Rig`) with RPM knob + start/stop button + side toggle, optional mini preview vinyls (`TrackVinyl`, image- or monogram-label), Web Audio SFX. | folio 03 // MIXTAPE |
| `Repos.tsx` | `repos` | Project grid. **Collapsible** — always starts closed; the toggle button (`.repos-toggle`) is the only way to expand. Body wraps `<div id="repos-body">`. Cards open `Lightbox` via `onOpen(idx)`. Reads `projects` from `data/portfolio.ts`. | folio 04 // REPOS, uses `CodeArt` |
| `Letter.tsx` | `letter` | Contact cards (`HoverCard` per channel: email, phone, LinkedIn, Instagram, WhatsApp, GitHub). Inline `CARDS` array; the `contact` object in `data/portfolio.ts` is for cross-section reuse. | folio 05 // PING |

## Where state lives

| Concern | Owner | File |
|---|---|---|
| Theme pref | `useTheme` | `src/hooks/useTheme.ts` |
| Boot dismiss | `App` state + `useBootDismiss` | `src/App.tsx`, `src/hooks/useBootDismiss.ts` |
| Lightbox open/close | `useLightbox` | `src/hooks/useLightbox.ts` |
| Active section (mobile tab highlight) | `useSectionObserver` | `src/hooks/useSectionObserver.ts` |
| Asset preload progress | `useAssetPreload` | `src/hooks/useAssetPreload.ts` |
| Scroll-driven folio fades | `useFolioScrub` | `src/hooks/useFolioScrub.ts` (GSAP ScrollTrigger) |

## Marketing site (`/business/`)

Hebrew-first marketing landing at `/business/` lives in `src/marketing/`. It is a **separate Vite entry** (`business/index.html` -> `src/marketing/main.tsx`) styled by `src/marketing/marketing.css` (scoped to `.mp-root`). Visual idiom: bold sticker geometry, magenta primary accent, thick borders, offset shadows. Theme is shared with the portfolio via `bm:theme`.

| File | Role |
|---|---|
| `MarketingApp.tsx` | Page shell. Mounts `MarketingHeader`, `<main>` with sections, `Footer`, `StickyCTA`, `ink-wipe`. |
| `MarketingHeader.tsx` | Sticky bar: brand wordmark, back-to-portfolio link, theme toggle, a11y panel button. Uses shared `useTheme` + `AccessibilityPanel`. |
| `MarketingHeroSlides.tsx` | Standalone slideshow. Random 1-2s opacity crossfade. Pause button is visually hidden but keyboard-focusable to satisfy WCAG 2.2.2. Distinct from the portfolio's `HeroSlides` (no GSAP, no ink fx). |
| `StickyCTA.tsx` | Mobile-only fixed bottom row: WhatsApp + email. Hidden ≥ 821px. |
| `Footer.tsx` | Compact footer. |
| `contact.ts` | `mailtoHref`, `whatsappHref`, and `buildWhatsAppHref(text)` for audience-specific pre-filled messages. |
| `sections/HeroPitch.tsx` | id `top`. Sticker badge, headline, lead, "questions" list, WhatsApp + mail CTAs, smaller `MarketingHeroSlides` column on desktop, stats strip. |
| `sections/AudienceBento.tsx` | id `audience`. Four sticker tiles linking directly to WhatsApp with audience-specific pre-filled messages from `data/audiences.ts`. |
| `sections/Services.tsx` | id `services`. Three service tiles (`tutoring`, `guiding`, `building`) from `data/services.ts`. |
| `sections/Process.tsx` | id `process`. Numbered three-step timeline. |
| `sections/Proof.tsx` | id `proof`. Testimonials with rotating accent (`primary`/`accent2`/`accent3`) from `data/proof.ts`. |
| `sections/FAQ.tsx` | id `faq`. Native `<details>`/`<summary>` accordion. |
| `sections/ContactCTA.tsx` | id `contact`. Final magenta CTA banner. |

Marketing data lives in `src/data/` next to portfolio data: `services.ts`, `audiences.ts`, `proof.ts`, `marketingHeroSlides.ts`.

## Adding a new section

1. Create `src/components/sections/<Name>.tsx`.
2. Outer element gets `id="<name>"` - lowercase, stable.
3. Import + render in `App.tsx` inside `<main>` in the right position.
4. Add the section to `Strip`'s anchor list and `TabBar`'s tab list (so nav highlighting works).
5. Register the id with `useSectionObserver`'s call-site (currently the `ids` array is inlined in `TabBar`).
6. Reuse primitives (`Reveal`, `HoverCard`, `InkTimeline`) before introducing new animation code.

## Adding a new overlay

`InkDefs` filters are capped at the enum defined in `InkDefs.tsx`. Adding a new filter:

1. Extend `InkBleedId` union.
2. Add a new `<filter id="ink-bleed-<id>">` to `InkDefs.tsx`.
3. Consume via `attachInkBleed(el, id, opts)` from `src/lib/inkBleed.ts`.
