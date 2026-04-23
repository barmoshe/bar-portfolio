# Recipe - Edit a section

You want to add a paragraph, a link list, a card block, or a quote to one of the existing sections. The end state: the content renders in the right section, active-section highlighting in `TabBar` and `Strip` still works, reveal/hover animations feel consistent, reduced-motion mode still produces readable static content.

## The arc

Each section is one file under `src/components/sections/` whose outermost element carries `id="<name>"`. `useSectionObserver` watches those ids to drive nav highlighting, so as long as the id stays on the outermost element, navigation keeps working for free. Inside the section, the site has a small set of primitives (`Reveal`, `HoverCard`, `InkTimeline`, `CodeArt`) - reach for those before inventing new animation code.

## 1. Find the section

Map from section id to file:

| id | file | folio |
|---|---|---|
| `intro` | `src/components/sections/Intro.tsx` | 01 // WHOAMI |
| `background` | `src/components/sections/Background.tsx` | 02 // BACKGROUND |
| `mixtape` | `src/components/sections/Mixtape.tsx` | 03 // MIXTAPE |
| `repos` | `src/components/sections/Repos.tsx` | 04 // REPOS (collapsible) |
| `letter` | `src/components/sections/Letter.tsx` | 05 // PING |

(See `knowledge/05-components.md` for the full table with roles and primitives used.)

## 2. Decide the block type

- **Body text** - drop a `<p>` inside the section's main column. To match neighbours, register it with the section's `useGSAP` block via `createReveal` from `src/lib/scrollReveal.ts` (gated on `FULL_MOTION_QUERY`).
- **Link list** - a `<ul>` with the section's usual link styling (see existing siblings). For row-by-row reveal, give the `<li>`s a class and feed them to `createReveal` with a `stagger`.
- **Card block** - reuse `<HoverCard>` (used by `Letter`). Don't build a new card primitive unless the hover interaction is genuinely different.
- **Quote / pull** - the site has a consistent "fold" typography for quotes (serif display, a leading rule). Match whatever the nearest existing quote does (see Intro's credo card).
- **Background card** - if you want to add another work or education entry, append a `bigCard`/`smallCard` block in `Background.tsx`; the styling helpers and reveal animations already exist there.
- **Mixtape track** - append a literal to the `TRACKS: TrackBase[]` array in `Mixtape.tsx`. The first entry is pinned to A1; everything else shuffles into balanced halves on each page load. Drop the disc art in `public/tracks/` and reference via `preview: 'tracks/<file>.jpg'` (or use `label: { bg, monogram }` for a programmatic disc).

## 3. Preserve the section id

The outermost tag of the section component carries the id. Any restructuring that pushes the id onto a child breaks `useSectionObserver` and the mobile `TabBar` highlighting.

If you're splitting a section into two semantic regions, pick one to keep the id and make the other a normal `<div>`; don't introduce a new id without also registering it with the observer (see the "Adding a new section" procedure in `knowledge/05-components.md`).

## 4. Respect reduced motion

If you add any imperative animation (rare - prefer primitives), wrap it in `gsap.matchMedia` branching on `FULL_MOTION_QUERY` as in `src/lib/gsap.ts`. `<Reveal>` and `<HoverCard>` already handle this internally, so sticking to primitives gets you reduced-motion behavior for free.

Test by toggling `prefers-reduced-motion` in your OS or via devtools rendering settings.

## 5. Preview

```bash
npm run dev
```

Scroll through, confirm the new block reads well at mobile and desktop widths (break at ~820px for mobile nav). Watch that:

- The section still tracks in the top `Strip` and bottom `TabBar`.
- Reveal cadence feels continuous with neighbors.
- No layout shift on image/font load (FOUC is handled by the pre-paint script and font loading, but new heavy blocks can reintroduce CLS).

## 6. Typecheck and commit

```bash
npm run typecheck
```

Then push via `recipes/deploy.md`.

---

Related:
- `knowledge/05-components.md` - primitives and section map.
- `knowledge/04-animation.md` - when an animation warrants new GSAP code.
- `prompts/add-section-block.md` - scaffold for a one-off block.
