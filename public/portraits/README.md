# portraits/

Source images for the `HeroSlides` portrait slideshow on the `#intro` section.

## Contents

`img0.png` … `img22.png` - portrait variations across multiple media (oil, sketch, photo, cubist, 3d render, painterly, cartoon, stained-glass, monochrome blue, fiery, cosmic-lightning, forest, etc.). The captions and order are defined in `src/data/heroSlides.ts`; `HeroSlides.tsx` reads that list.

`img8.png` is intentionally absent - the index is non-contiguous. New entries should append fresh indices rather than backfill the gap.

`img19.png` is a luminance-mapped blue-only variation derived from `img18.png` (navy → cyan LUT). Treat it as a derived asset: re-running the LUT on a different source updates it.

## Naming

`imgN.png`, mostly contiguous (gap at `img8`). Adding another portrait means dropping `imgN.png` here **and** appending an entry to `portfolioHeroSlides` in `src/data/heroSlides.ts` - see `knowledge/04-animation.md` and `knowledge/05-components.md`.

## Path resolution

Images are referenced as:

```ts
`${import.meta.env.BASE_URL}portraits/imgN.png`
```

That expands to `/portraits/imgN.png` in dev and `/bar-portfolio/portraits/imgN.png` in preview / prod. Do not hardcode absolute paths.

## Format

PNG for now. A future webp migration is plausible - the portraits are large enough that the savings would be meaningful and browsers have universal webp support. If migrating, keep `.png` fallbacks or rename the SLIDES entries in lockstep.

Vite copies `public/` verbatim into `dist/` - no hashing, no optimization. If you need cache-busting for updated portraits, bump the filename.
