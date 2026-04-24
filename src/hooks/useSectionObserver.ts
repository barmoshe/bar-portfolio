import { useEffect, useState } from 'react';

export function useSectionObserver(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-40% 0px -50% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    // Re-scan on DOM mutations so lazy-mounted sections (e.g. the Suspense-
    // wrapped Mixtape) get picked up when their real element replaces the
    // placeholder. Without this, the observer stays bound to the detached
    // fallback node and that section's tab never activates.
    const observed = new WeakSet<Element>();
    const scan = () => {
      for (const id of ids) {
        const el = document.getElementById(id);
        if (el && !observed.has(el)) {
          io.observe(el);
          observed.add(el);
        }
      }
    };
    scan();

    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      mo.disconnect();
      io.disconnect();
    };
  }, [ids]);

  return activeId;
}
