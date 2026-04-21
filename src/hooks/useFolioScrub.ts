import { useEffect } from 'react';
import { gsap, ScrollTrigger, FULL_MOTION_QUERY } from '../lib/gsap';

// Scrub each .folio tag's opacity + x offset as its parent .page crosses the viewport.
// Fades in near the top, fades out as the next section takes over.
export function useFolioScrub() {
  useEffect(() => {
    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION_QUERY, () => {
      const folios = gsap.utils.toArray<HTMLElement>('.page .folio');
      const triggers: ScrollTrigger[] = [];

      folios.forEach((el) => {
        const page = el.closest<HTMLElement>('.page');
        if (!page) return;
        gsap.set(el, { opacity: 0, x: 16 });
        const t = ScrollTrigger.create({
          trigger: page,
          start: 'top 85%',
          end: 'bottom 20%',
          onEnter: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.5 }),
          onEnterBack: () => gsap.to(el, { opacity: 1, x: 0, duration: 0.5 }),
          onLeave: () => gsap.to(el, { opacity: 0, x: -8, duration: 0.35 }),
          onLeaveBack: () => gsap.to(el, { opacity: 0, x: 16, duration: 0.35 }),
        });
        triggers.push(t);
      });

      ScrollTrigger.refresh();

      return () => {
        triggers.forEach((t) => t.kill());
      };
    });
    return () => mm.revert();
  }, []);
}
