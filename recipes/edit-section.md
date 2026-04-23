# Recipe - Edit a section

You want to add a paragraph, a link list, a card block, or a quote to one of the existing sections. The end state: the content renders in the right section, active-section highlighting in `TabBar` and `Strip` still works, reveal/hover animations feel consistent, reduced-motion mode still produces readable static content.

## The arc

Each section is one file under `src/components/sections/` whose outermost element carries `id="<name>"`. `useSectionObserver` watches those ids to drive nav highlighting, so as long as the id stays on the outermost element, navigation keeps working for free. Inside the section, the site has a small set of primitives (`Reveal`, `HoverCard`, `InkTimeline`, `CodeArt`) - reach for those before inventing new animation code.

## 1. Find the section

Map from section id to file:

| id | file |
|---|---|
| `intro` | `src/components/sections/Intro.tsx` |
| `story` | `src/components/sections/Story.tsx` |
| `experience` | `src/components/sections/Experience.tsx` |
| `repos` | `src/components/sections/Repos.tsx` |
| `mixtape` | `src/components/sections/Mixtape.tsx` |
| `letter` | `src/components/sections/Letter.tsx` |

(See `knowledge/05-components.md` for the full table with roles and primitives used.)

## 2. Decide the block type

- **Body text** - drop a `<p>` inside the section's main column. Wrap it in `<Reveal>` if surrounding blocks are revealed, so the scroll cadence stays consistent.
- **Link list** - a `<ul>` with the section's usual link styling (see existing siblings). If the list is long enough that it earns a row-by-row reveal, wrap each `<li>` in `<Reveal delay={…}>`; otherwise wrap the whole `<ul>`.
- **Card block** - reuse `<HoverCard>`. Don't build a new card primitive unless the hover interaction is genuinely different.
- **Quote / pull** - the site has a consistent "fold" typography for quotes (serif display, a leading rule). Match whatever the nearest existing quote does.
- **Timeline entry** - use `InkTimeline` (already used in `Story.tsx` and `Experience.tsx`). Its item shape is documented inline; the key constraint is a stable `key` per entry.

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
