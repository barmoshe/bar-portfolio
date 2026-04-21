# 05 — Component map

## Render order in `App.tsx`

```
<InkDefs />               // SVG <defs> for feDisplacementMap filters — must be first
<Grain />                 // Full-viewport noise overlay
<Crease />                // Horizontal fold line
<Boot ? />                // Full-screen onboarding (dismissible, hidden after skip)
<Strip />                 // Sticky top nav: theme toggle, skip button, section links
<main>
  <Dossier />             // id="dossier"   — hero / intro / portrait slideshow
  <Story />               // id="story"     — narrative + timeline
  <Experience />          // id="experience"— work history cards
  <Repos onOpen={…} />    // id="repos"     — project grid (opens Lightbox on click)
  <Music />               // id="music"     — music / sound work
  <Notes />               // id="notes"     — thoughts / writing
  <Letter />              // id="letter"    — contact form (mailto)
</main>
<TabBar />                // Mobile bottom nav (hidden > 820px)
<Lightbox />              // Fullscreen project modal, portaled into root
<div class="ink-wipe" />  // Theme transition overlay (imperative, driven by useTheme)
<InkCursor />             // Custom mouse follower (desktop only)
```

**`InkDefs` must render before anything else** — it defines the SVG filters that `useInk` / `attachInkBleed` / certain sections reference by id. If you reorder, all filter-based effects go blank.

## Visual primitives (`src/components/`)

| File | Role | Key deps |
|---|---|---|
| `InkDefs.tsx` | SVG `<defs>` — `#ink-bleed-*` feDisplacementMap filters. Exports `inkBleedUrl(id)` and `InkBleedId` type. | — |
| `Grain.tsx` | Fixed-position `<canvas>` rendering low-frequency noise. Multiplies over the page. | — |
| `Crease.tsx` | Thin horizontal line with shadow — gives "folded paper" feel. | — |
| `Boot.tsx` | Onboarding screen. Dismisses on any keydown/pointerdown (except `.strip`/`.toggle`). Uses `useBootDismiss`. | `useBootDismiss` |
| `Strip.tsx` | Sticky top bar. Theme toggle, skip button, section anchor links. Props: `themeGlyph`, `themeLabel`, `onThemeCycle`, `onSkip`, `skipRemembered`. | `useTheme` (via props) |
| `TabBar.tsx` | Mobile bottom nav. Uses `useSectionObserver` to highlight active section. | `useSectionObserver` |
| `HeroSlides.tsx` | Portrait slideshow with 5-fx cycle. **Fragile** — see `04-animation.md`. | GSAP, `lib/gsap` |
| `Lightbox.tsx` | Fullscreen project modal. Animates from `sourceRect` card position. Keyed by `openIdx`. | GSAP |
| `HoverCard.tsx` | Interactive card primitive. Used by `Repos`. | — |
| `CodeArt.tsx` | Ascii/code-glyph display for project cards. Uses `iconFor` from `data/portfolio.ts`. | — |
| `InkCursor.tsx` | Custom cursor follower. Desktop only (hover check). | — |
| `InkTimeline.tsx` | GSAP-driven timeline component. Used by `Experience` and `Story`. | GSAP |
| `Reveal.tsx` | IntersectionObserver-triggered reveal wrapper. Fade + slight Y translate. | IO |

## Sections (`src/components/sections/`)

One component per section id. The section id is set on the **outermost element** (usually the `<section>` or `<article>`) so `useSectionObserver` picks it up.

| File | id | Role | Primitives used |
|---|---|---|---|
| `Dossier.tsx` | `dossier` | Hero intro with `HeroSlides`, identity card, quick facts. | `HeroSlides`, `Reveal` |
| `Story.tsx` | `story` | Education + narrative timeline. | `InkTimeline`, `Reveal` |
| `Experience.tsx` | `experience` | Work history cards (Joomsy, Wochit). | `InkTimeline`, `Reveal` |
| `Repos.tsx` | `repos` | Project grid. Cards open `Lightbox` via `onOpen(idx)`. Reads `projects` from `data/portfolio.ts`. | `HoverCard`, `CodeArt` |
| `Music.tsx` | `music` | Music/sound experiments. | `Reveal` |
| `Notes.tsx` | `notes` | Blog / notes links. | `Reveal` |
| `Letter.tsx` | `letter` | Contact form (mailto action + copy email to clipboard). Renders `contact` from `data/portfolio.ts`. | — |

## Where state lives

| Concern | Owner | File |
|---|---|---|
| Theme pref | `useTheme` | `src/hooks/useTheme.ts` |
| Boot dismiss | `App` state + `useBootDismiss` | `src/App.tsx`, `src/hooks/useBootDismiss.ts` |
| Lightbox open/close | `useLightbox` | `src/hooks/useLightbox.ts` |
| Active section (mobile tab highlight) | `useSectionObserver` | `src/hooks/useSectionObserver.ts` |
| Asset preload progress | `useAssetPreload` | `src/hooks/useAssetPreload.ts` |
| Scroll-driven folio fades | `useFolioScrub` | `src/hooks/useFolioScrub.ts` (GSAP ScrollTrigger) |

## Adding a new section

1. Create `src/components/sections/<Name>.tsx`.
2. Outer element gets `id="<name>"` — lowercase, stable.
3. Import + render in `App.tsx` inside `<main>` in the right position.
4. Add the section to `Strip`'s anchor list and `TabBar`'s tab list (so nav highlighting works).
5. Register the id with `useSectionObserver`'s call-site (currently the `ids` array is inlined in `TabBar`).
6. Reuse primitives (`Reveal`, `HoverCard`, `InkTimeline`) before introducing new animation code.

## Adding a new overlay

`InkDefs` filters are capped at the enum defined in `InkDefs.tsx`. Adding a new filter:

1. Extend `InkBleedId` union.
2. Add a new `<filter id="ink-bleed-<id>">` to `InkDefs.tsx`.
3. Consume via `attachInkBleed(el, id, opts)` from `src/lib/inkBleed.ts`.
