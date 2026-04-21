# 04 — Animation

The site has three animation layers: **HeroSlides fx cycle** (fragile — read this first), **GSAP + ScrollTrigger orchestrations**, and **ink-bleed SVG filters**. All three must respect `prefers-reduced-motion`.

## 1. HeroSlides — the fragile five-fx cycle

File: `src/components/HeroSlides.tsx`.

Five transition effects, cycled round-robin:

```ts
const FX = ['fade', 'iris', 'wipe', 'skew', 'blinds'] as const;
```

Each is implemented in CSS via `clip-path`, `transform`, or `opacity`. The React state machine toggles classes in a **very specific order**; getting it wrong breaks all five.

### The state machine

```ts
const [idx, setIdx] = useState(0);                          // current slide
const [enteringFrom, setEnteringFrom] = useState<number | null>(null); // prev slide
const [fxByIdx, setFxByIdx] = useState<Record<number, Fx>>({ 0: 'fade' });
```

`advance()` sets `enteringFrom = cur`, `setIdx(next)`. This triggers render where:

- Slide `enteringFrom` has class `is-active` (still showing).
- Slide `idx` has class `is-enter` (positioned for entry, not yet animating).

Immediately after commit, `useLayoutEffect([enteringFrom, idx])` runs:

```ts
const el = rootRef.current?.querySelectorAll<HTMLElement>('.slide')[idx];
if (el) void el.offsetHeight;              // 1. force reflow so .is-enter is painted
const raf = requestAnimationFrame(() => {  // 2. next frame
  setEnteringFrom(null);                   // 3. flip to is-active → CSS transitions play
  schedule();
});
```

The **three critical steps**:

1. **Reflow** (`void el.offsetHeight`) — forces the browser to commit `.is-enter` styles. Skip this and step 3's class change coalesces with `.is-enter` and the transition never plays.
2. **`requestAnimationFrame`** — waits for the next paint tick. Skip this and the browser batches `.is-enter` + `.is-active` in the same frame, same result: no transition.
3. **`setEnteringFrom(null)`** — removes `.is-enter`, sets `.is-active` on the new slide. CSS transition from enter state → active state plays.

**Never "simplify" this** into a plain `setState` inside the event handler, a `Promise.resolve().then(…)`, a `setTimeout(… , 0)`, or a React transition. Every one of those has been tried; they all break clip-path animations in Chrome or Safari.

### The fx CSS

Lives in `src/styles.css`. Each `.slide[data-fx="<name>"]` defines:

- An **enter state** (`.slide.is-enter[data-fx=…]`) — the starting clip-path / transform / opacity.
- An **active state** (`.slide.is-active[data-fx=…]`) — the ending state. Transitions between the two.

When editing a fx, keep the names aligned with the `FX` array. Adding a sixth fx is safe — append to both the array and the CSS.

### Auto-advance

Random interval between 3–10 seconds (`rand(3000, 10000)`). Pauses on:

- `mouseenter` on the slideshow container (resumes on `mouseleave`).
- `document.hidden === true` (tab switch, resumes on visibility).

## 2. GSAP + ScrollTrigger

File: `src/lib/gsap.ts` — single module that registers plugins and re-exports.

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

## 3. Ink-bleed SVG filter (`src/lib/inkBleed.ts`)

A section heading can scrub its own `feDisplacementMap` scale from a high value down to 0 as it scrolls into view — so letters "bleed" into the page and resolve into sharp glyphs.

```ts
attachInkBleed(el, id, { from = 22, trigger?, start = 'top 80%' }): () => void
```

- `id: InkBleedId` — a section-unique id (defined in `src/components/InkDefs.tsx`). Each section gets its own `#ink-bleed-<id>` SVG filter so concurrent tweens never touch the same `feDisplacementMap`.
- Returns a cleanup that removes the inline `filter` style and kills the tween. **Always** call it from the matchMedia branch cleanup — otherwise reduced-motion flips leave the heading with a stale filter.

## 4. The ink-wipe

See `03-theming.md`. Not motion per se — it's a theme-transition mask, driven by `useTheme`. Lives in `App.tsx` as `<div className="ink-wipe" />`.

## Reduced-motion audit checklist

For any new animation:

- ☐ Wrapped in `gsap.matchMedia` / branch on `FULL_MOTION_QUERY`?
- ☐ Reduced-motion branch either omitted (no motion) or gives an instantaneous fallback?
- ☐ If imperative DOM manipulation: cleaned up on component unmount?
- ☐ ScrollTrigger instance has a stable `id`?
- ☐ No jumping between layout-triggering properties (width/height/top/left) — transforms/opacity/filter only?
