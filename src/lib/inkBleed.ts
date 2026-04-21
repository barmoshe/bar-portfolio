import { gsap } from './gsap';
import { inkBleedUrl, type InkBleedId } from '../components/InkDefs';

/**
 * Attach one of the shared `#ink-bleed-<id>` filters to a heading and tween the
 * `feDisplacementMap`'s `scale` attribute from a high value down to 0 as the
 * heading enters view. Letters "bleed" into the page and resolve to sharp glyphs.
 *
 * @param el       Heading element to apply the filter to.
 * @param id       Section-unique `InkBleedId` (see `src/components/InkDefs.tsx`).
 *                 Each section owns its own id so concurrent tweens never share
 *                 an `feDisplacementMap`.
 * @param opts.from    Starting scale value for the displacement (default 22).
 * @param opts.trigger ScrollTrigger target; defaults to `el`.
 * @param opts.start   ScrollTrigger `start` string (default `'top 80%'`).
 *
 * @returns Cleanup that removes the inline `filter` style and kills the tween.
 *          Always call it from the enclosing `matchMedia` branch cleanup — the
 *          reduced-motion flip otherwise leaves the heading with a stale filter.
 *
 * See `knowledge/04-animation.md`.
 */
export function attachInkBleed(
  el: HTMLElement,
  id: InkBleedId,
  opts: { from?: number; trigger?: Element | null; start?: string } = {},
): () => void {
  const { from = 22, trigger, start = 'top 80%' } = opts;
  const feDisp = document.querySelector<SVGFEDisplacementMapElement>(
    `feDisplacementMap[data-ink-bleed="${id}"]`,
  );
  if (!feDisp) return () => {};

  const prevFilter = el.style.filter;
  el.style.filter = inkBleedUrl(id);
  gsap.set(feDisp, { attr: { scale: from } });

  const tween = gsap.to(feDisp, {
    attr: { scale: 0 },
    duration: 0.9,
    ease: 'power3.out',
    scrollTrigger: { trigger: trigger ?? el, start, id: `ink-bleed-${id}` },
  });

  return () => {
    tween.scrollTrigger?.kill();
    tween.kill();
    el.style.filter = prevFilter;
  };
}
