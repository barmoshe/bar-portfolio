import { useEffect, useState } from 'react';

// Scroll-spy for the tab bar. Picks the last tracked section whose top has
// crossed an anchor line ~35% down the viewport. This matches the classic
// "whichever section you most recently scrolled into" behavior and handles
// short final sections (e.g. a collapsed Repos followed by Letter) without
// needing special edge cases. Re-evaluates on scroll, resize, and when a
// tracked id's element is added or removed from the DOM (for lazy/Suspense-
// mounted sections like Mixtape).
export function useSectionObserver(ids: readonly string[]): string | null {
  const [activeId, setActiveId] = useState<string | null>(ids[0] ?? null);

  useEffect(() => {
    if (!ids.length) return;

    let rafId = 0;
    let lastId: string | null = null;

    const apply = (next: string | null) => {
      if (next === lastId) return;
      lastId = next;
      setActiveId(next);
    };

    const pick = () => {
      rafId = 0;
      const vh = window.innerHeight;
      if (!vh) return;

      const anchor = vh * 0.35;
      let candidate: string | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.height <= 0) continue;
        if (r.top <= anchor) candidate = id;
      }

      apply(candidate ?? ids[0] ?? null);
    };

    const schedule = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);

    const trackedIds = new Set(ids);
    const touchesTracked = (node: Node): boolean => {
      if (!(node instanceof HTMLElement)) return false;
      if (node.id && trackedIds.has(node.id)) return true;
      for (const id of trackedIds) {
        if (node.querySelector?.(`#${CSS.escape(id)}`)) return true;
      }
      return false;
    };
    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        for (const n of m.addedNodes) if (touchesTracked(n)) return schedule();
        for (const n of m.removedNodes) if (touchesTracked(n)) return schedule();
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      mo.disconnect();
    };
  }, [ids]);

  return activeId;
}
