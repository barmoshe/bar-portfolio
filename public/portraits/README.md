# portraits/

Source images for the `HeroSlides` portrait slideshow on the `#intro` section.

## Contents

`img0.png` … `img4.png` - five portrait variations, each in a different medium (oil, sketch, photo, cubist, 3d render). The captions are defined in `src/components/HeroSlides.tsx`.

## Naming

Zero-indexed, `imgN.png`, contiguous. Adding a sixth requires editing the `SLIDES` array in `HeroSlides.tsx` - see `knowledge/04-animation.md` and `knowledge/05-components.md`.

## Path resolution

Images are referenced as:

```ts
`${import.meta.env.BASE_URL}portraits/imgN.png`
```

That expands to `/portraits/imgN.png` in dev and `/bar-portfolio/portraits/imgN.png` in preview / prod. Do not hardcode absolute paths.

## Format

PNG for now. A future webp migration is plausible - the portraits are large enough that the savings would be meaningful and browsers have universal webp support. If migrating, keep `.png` fallbacks or rename the SLIDES entries in lockstep.

Vite copies `public/` verbatim into `dist/` - no hashing, no optimization. If you need cache-busting for updated portraits, bump the filename.
