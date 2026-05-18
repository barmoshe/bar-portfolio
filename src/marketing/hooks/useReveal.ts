import { useEffect } from 'react';

// Section reveal — the only scroll-related animation on the marketing
// site. Adds `.is-in` to every `.mp-section` (and any `.mp-reveal`
// opt-in) when it enters the viewport, then unobserves so the reveal
// runs exactly once. Reduced motion stamps `.is-in` immediately so no
// element is ever stuck invisible.
export function useReveal() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>(
      '.mp-section, .mp-reveal',
    );
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-in');
            io.unobserve(e.target);
          }
        });
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0.05 },
    );
    targets.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
