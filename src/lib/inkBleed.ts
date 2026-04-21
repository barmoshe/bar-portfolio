import { gsap } from './gsap';
import { inkBleedUrl, type InkBleedId } from '../components/InkDefs';

// Attach one of the shared #ink-bleed-<id> filters to a heading and tween the
// feDisplacementMap's `scale` attribute from a high value down to 0 as the
// heading enters view. Returns a cleanup that removes the inline filter and
// kills the tween - call it from the enclosing matchMedia branch cleanup so
// reduced-motion flips leave the heading pristine.
//
// Each section owns a unique InkBleedId so concurrent tweens never touch the
// same feDisplacementMap (see InkDefs.tsx).
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
