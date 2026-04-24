import { useEffect, useState } from 'react';

// Scroll-spy for the tab bar. Picks whichever tracked section is crossing an
// anchor line ~35% from the top of the viewport, with explicit pinning at the
// top and bottom of the document so the first/last tabs are correct at the
// edges. Re-evaluates on scroll, resize, and when a tracked id's element
// appears in the DOM (covers lazy/Suspense-mounted sections).
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

      const doc = document.documentElement;
      const y = window.scrollY;

      if (y <= 2) return apply(ids[0] ?? null);
      if (y + vh >= doc.scrollHeight - 2) return apply(ids[ids.length - 1] ?? null);

      const anchor = vh * 0.35;
      let contained: string | null = null;
      let nearest: { id: string; distance: number } | null = null;

      for (const id of ids) {
        const el = document.getElementById(id);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.height <= 0) continue;
        if (r.top <= anchor && r.bottom > anchor) {
          contained = id;
          break;
        }
        const mid = (r.top + r.bottom) / 2;
        const distance = Math.abs(mid - anchor);
        if (!nearest || distance < nearest.distance) nearest = { id, distance };
      }

      apply(contained ?? nearest?.id ?? null);
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
