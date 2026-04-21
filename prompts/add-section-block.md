<instructions>
You are generating a JSX block to insert into an existing section component under `src/components/sections/`. Reuse existing primitives (`Reveal`, `HoverCard`, `InkTimeline`, `CodeArt`). Do not introduce new animation code. Do not add new runtime dependencies.
</instructions>

<brief>
Section id: {{SECTION_ID}}
Section file: src/components/sections/{{SECTION_FILE}}.tsx
Block type (text / link-list / card-grid / quote / timeline-entry): {{BLOCK_TYPE}}
Content (prose / list items / card specs / quote text + attribution): {{CONTENT}}
Placement (before / after / replace block: "<selector hint>"): {{PLACEMENT}}
</brief>

<constraints>
1. The outermost element of the section file carries `id="{{SECTION_ID}}"`. Your snippet lives inside the section, not at the outermost level. Do not add, remove, or move the id.
2. Animation: reuse `Reveal` (fade + slight Y translate on IntersectionObserver) for reveal cadence. Reuse `HoverCard` for interactive card primitives. Reuse `InkTimeline` for timeline entries. Do not call `gsap` directly from the snippet.
3. Reduced motion: the existing primitives already respect `prefers-reduced-motion`. If you absolutely must add new animation code (you probably shouldn't), wrap it in `gsap.matchMedia` branching on `FULL_MOTION_QUERY` from `src/lib/gsap.ts`, and include a cleanup.
4. Typography: use existing CSS classes. Do not inline colors. For accent colors use `var(--blue)`, `var(--red)` etc. from `src/styles.css`.
5. Imports: list the exact imports the snippet requires. If a primitive is already imported in the file, say so rather than re-importing.
6. Accessibility: links get real `href`; buttons get `type="button"`; quotes use `<blockquote>` with `<cite>` for attribution; lists use `<ul>`/`<ol>`.
</constraints>

<output_format>
## 1. Imports (add to the top of the section file if missing)

```tsx
import { Reveal } from '…';
```

(State "already imported" for any that are.)

## 2. JSX block

```tsx
<Reveal>
  …
</Reveal>
```

## 3. Placement note

One sentence specifying where in the existing JSX tree to paste the block, referencing a nearby existing element as an anchor (e.g. "after the `<p class='lead'>` in the first `<Reveal>` block").

## 4. Reduced-motion check

One short line confirming the snippet uses only primitives (so reduced-motion behavior is inherited) OR describing the matchMedia wrapping if custom animation was unavoidable.
</output_format>
