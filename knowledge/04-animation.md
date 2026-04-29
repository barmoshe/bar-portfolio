# 04 - Animation

The site has three animation layers: **HeroSlides ink-native fx cycle**, **GSAP + ScrollTrigger orchestrations**, and **ink-bleed SVG filters**. All three must respect `prefers-reduced-motion`.

## 1. HeroSlides - ink-native fx cycle

File: `src/components/HeroSlides.tsx`.

Four transitions, drawn from a Fisher-Yates shuffle bag. The bag holds the four fx names; `pickNextFx` shifts from the front and refills with a fresh shuffle when empty. On refill, if the new bag's first item equals the fx that just played, it swaps with a random later index — so the same fx never plays twice in a row across bag boundaries. All are driven imperatively by a single GSAP timeline per advance; React owns only the resting `.is-active` class and the shuffle order.

```ts
const FX = ['bloom', 'brush', 'tear', 'crumple'] as const;
```

Each fx randomizes its own knobs (center, angle, direction, intensity, duration) so consecutive plays of the same fx don't look identical:

| Fx        | How it's animated                                              |
|-----------|----------------------------------------------------------------|
| `bloom`   | CSS `mask-image: radial-gradient(...)`, tween `--bloom-r` 0 → `rand(155, 185)%` over `rand(0.95, 1.15)s`. Center jitters per cycle (`--bloom-x/y`). |
| `brush`   | CSS `mask-image: linear-gradient(var(--wipe-a), ...)`. `--wipe-a` jitters in `rand(75, 115)deg`; 50% of the time the wipe direction is reversed (`110%` → `-8%`). Duration `rand(0.85, 1.0)s`. |
| `tear`    | CSS `mask-image: linear-gradient(var(--tear-a), ...)`. `--tear-a` flips between `180deg` (top→bottom) and `0deg` (bottom→up). Duration `rand(0.75, 0.95)s`. |
| `crumple` | SVG `#ink-crumple` filter applied inline; tween `feDisplacementMap` scale `rand(28, 48)` → 0 while opacity 0 → 1. Duration `rand(0.9, 1.25)s`; opacity tween shortened proportionally. |

### Why GSAP and not CSS transitions

The previous implementation relied on a `.is-enter` → forced-reflow → rAF → `.is-active` dance to coax CSS transitions to replay. That hack is gone. GSAP owns frame scheduling, so the transition always plays cleanly and the state machine is just `idxRef` + one timeline ref.

### The advance flow

```ts
// 1. pick next slide + fx; stack incoming above outgoing
gsap.set(outEl, { zIndex: 2, opacity: 1 });
gsap.set(inEl, { zIndex: 3, opacity: 1 });
inEl.dataset.fx = fx;

// 2. seed the fx's starting state (mask stop or filter scale)
//    then tween it to the finished state on a timeline

// 3. onComplete: resetSlide(out/in) clears inline styles; CSS takes over
//    via the .is-active class React already set via setIdx(next)
```

Only one transition runs at a time - `advance()` early-returns if the timeline is still active.

### The fx CSS

Lives in `src/styles.css`, under the `/* Slideshow */` block. Each `.slide[data-fx="<name>"]` declares its mask (or, for crumple, no mask) plus the custom props the JS tweens. Adding a fifth fx means:

1. Append to the `FX` tuple in `HeroSlides.tsx`.
2. Add a `.slide[data-fx="<name>"]` block to `styles.css` that defines the starting mask/filter and the custom props.
3. Add an `if (fx === '<name>')` branch in `advance()` that tweens those props.
4. Clear any new custom props in `resetSlide()`.

### The `#ink-crumple` SVG filter

Defined in `src/components/InkDefs.tsx` alongside the `#ink-bleed-*` family. Single shared instance - safe because `advance()` serializes transitions. If you ever overlap HeroSlides transitions (don't), each would need its own filter.

### Auto-advance

Uniform random interval `rand(2200, 3600)ms` between transitions. Pauses on:

- `mouseenter` on the slideshow container (resumes on `mouseleave`).
- `document.hidden === true` (tab switch; resumes on visibility).

### Reduced-motion

`advance()` checks `window.matchMedia(FULL_MOTION_QUERY).matches`. When reduced, it skips the timeline entirely and does an instant opacity swap. CSS (`@media (prefers-reduced-motion: reduce)`) strips any mask/filter that would otherwise linger.

## 2. GSAP + ScrollTrigger

File: `src/lib/gsap.ts` - single module that registers plugins and re-exports.

```ts
gsap.registerPlugin(ScrollTrigger, SplitText, Flip, useGSAP);
gsap.defaults({ ease: 'power3.out', duration: 0.6 });
```

Shared media-query constants:

```ts
REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';
FULL_MOTION_QUERY    = '(prefers-reduced-motion: no-preference)';
MOBILE_QUERY         = '(prefers-reduced-motion: no-preference) and (max-width: 820px)';
DESKTOP_QUERY        = '(prefers-reduced-motion: no-preference) and (min-width: 821px)';
```

### Conventions

- **Always wrap in `gsap.matchMedia`** and branch on `FULL_MOTION_QUERY`. This gives reduced-motion users a static fallback for free.
- **Use `useGSAP` (from `@gsap/react`)** in components, not raw `useEffect`. It handles React Strict Mode double-invocation and auto-cleans contexts.
- **Scope refs** when possible: `useGSAP(fn, { scope: rootRef })` so selectors don't leak.
- **Return cleanup from the matchMedia callback** to drop listeners (`root.removeEventListener`, ScrollTrigger kills, etc.).
- **ScrollTrigger instance ids**: use section-stable ids (e.g. `ink-bleed-<InkBleedId>`) so hot reload doesn't leak duplicate triggers.

### Reveal re-trigger rule (`src/lib/scrollReveal.ts`)

Section reveals use `createReveal(target, fromVars, toVars, opts)`, which builds a paused tween and a ScrollTrigger wired to replay it when the section has been off-screen for longer than `staleAfterMs` (default `DEFAULT_REVEAL_STALE_MS = 8000`). Continuous up-and-down scrolling is a no-op after the first play; returning via the TabBar a few seconds later re-plays the reveal from its initial state.

- Don't combine with `scrub` - the staleness check assumes discrete play, not scrub progress. The InkTimeline path keeps the plain ScrollTrigger API for its scrub.
- Tune per section: `Intro` uses 5s, `Letter` uses 15s; everything else inherits the default.
- Side-effects (audio, `data-*` attributes) attach via the `onPlay` / `onLeave` / `onLeaveBack` options - `onPlay` fires only on actual (re)plays, not skipped entries.

## 3. Ink-bleed SVG filter (`src/lib/inkBleed.ts`)

A section heading can scrub its own `feDisplacementMap` scale from a high value down to 0 as it scrolls into view - so letters "bleed" into the page and resolve into sharp glyphs.

```ts
attachInkBleed(el, id, { from = 22, trigger?, start = 'top 80%' }): () => void
```

- `id: InkBleedId` - a section-unique id (defined in `src/components/InkDefs.tsx`). Each section gets its own `#ink-bleed-<id>` SVG filter so concurrent tweens never touch the same `feDisplacementMap`.
- Returns a cleanup that removes the inline `filter` style and kills the tween. **Always** call it from the matchMedia branch cleanup - otherwise reduced-motion flips leave the heading with a stale filter.

## 4. The ink-wipe

See `03-theming.md`. Not motion per se - it's a theme-transition mask, driven by `useTheme`. Lives in `App.tsx` as `<div className="ink-wipe" />`.

## Reduced-motion audit checklist

For any new animation:

- ☐ Wrapped in `gsap.matchMedia` / branch on `FULL_MOTION_QUERY`?
- ☐ Reduced-motion branch either omitted (no motion) or gives an instantaneous fallback?
- ☐ If imperative DOM manipulation: cleaned up on component unmount?
- ☐ ScrollTrigger instance has a stable `id`?
- ☐ No jumping between layout-triggering properties (width/height/top/left) - transforms/opacity/filter only?
