import { useEffect, useRef } from 'react';
import { useSectionObserver } from '../hooks/useSectionObserver';
import { gsap, FULL_MOTION_QUERY } from '../lib/gsap';

const SECTIONS = ['dossier', 'experience', 'repos', 'notes', 'letter'] as const;

export default function TabBar() {
  const activeId = useSectionObserver(SECTIONS);
  const navRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);
  const prevRectRef = useRef<{ x: number; w: number } | null>(null);

  const isCurrent = (id: string) =>
    activeId === id ? { 'aria-current': 'true' as const } : {};

  useEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;
    const active = nav.querySelector<HTMLElement>(`a[data-target="${activeId}"]`);
    if (!active) {
      gsap.to(pill, { opacity: 0, duration: 0.2 });
      return;
    }
    const navRect = nav.getBoundingClientRect();
    const aRect = active.getBoundingClientRect();
    const x = aRect.left - navRect.left;
    const w = aRect.width;

    // Spawn an ink drop at the previous pill position so the handoff feels wet.
    const prev = prevRectRef.current;
    prevRectRef.current = { x, w };

    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION_QUERY, () => {
      gsap.to(pill, {
        x,
        width: w,
        opacity: 1,
        duration: 0.55,
        ease: 'power4.out',
      });

      if (prev && (prev.x !== x || prev.w !== w)) {
        const drop = document.createElement('span');
        drop.className = 'ink-drop';
        drop.style.left = `${prev.x + prev.w / 2 - 3}px`;
        nav.appendChild(drop);
        gsap
          .timeline({ onComplete: () => drop.remove() })
          .fromTo(
            drop,
            { scale: 0.4, opacity: 0.85 },
            { scale: 1.6, opacity: 0, duration: 0.55, ease: 'power2.out' },
          );
      }
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.set(pill, { x, width: w, opacity: 1 });
    });
    return () => mm.revert();
  }, [activeId]);

  return (
    <nav className="tabbar" aria-label="Mobile sections" ref={navRef}>
      <span className="tabbar-pill" aria-hidden="true" ref={pillRef} />
      <a href="#dossier" data-target="dossier" aria-label="About" data-magnet {...isCurrent('dossier')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <circle cx="12" cy="8" r="4" />
          <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
        </svg>
        <span>About</span>
      </a>
      <a
        href="#experience"
        data-target="experience"
        aria-label="Work"
        data-magnet
        {...isCurrent('experience')}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <rect x="3" y="7" width="18" height="13" rx="2" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </svg>
        <span>Work</span>
      </a>
      <a href="#repos" data-target="repos" aria-label="Open Source" data-magnet {...isCurrent('repos')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M8 18l-6-6 6-6" />
          <path d="M16 6l6 6-6 6" />
        </svg>
        <span>Repos</span>
      </a>
      <a href="#notes" data-target="notes" aria-label="Writing" data-magnet {...isCurrent('notes')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 5h16M4 10h16M4 15h10M4 20h8" />
        </svg>
        <span>Notes</span>
      </a>
      <a href="#letter" data-target="letter" aria-label="Contact" data-magnet {...isCurrent('letter')}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M3 7l9 6 9-6" />
          <rect x="3" y="5" width="18" height="14" rx="2" />
        </svg>
        <span>Contact</span>
      </a>
    </nav>
  );
}
