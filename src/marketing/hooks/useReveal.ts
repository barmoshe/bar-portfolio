import { useEffect } from 'react';

// Fallback section reveals for browsers without CSS scroll-driven
// animations (Firefox, older Safari). When `animation-timeline: view()`
// is supported, this hook does nothing and the CSS @supports block in
// marketing.css owns the reveal. Reduced motion stamps every section
// .is-in immediately so nothing is ever stuck invisible.
export function useReveal() {
  useEffect(() => {
    if (CSS.supports('animation-timeline: view()')) return;
    const sections = document.querySelectorAll<HTMLElement>('.mp-section');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) {
      sections.forEach((el) => el.classList.add('is-in'));
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
      { rootMargin: '0px 0px -15% 0px', threshold: 0.05 }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
}
