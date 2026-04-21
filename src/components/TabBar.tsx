import { useEffect, useRef } from 'react';
import { useSectionObserver } from '../hooks/useSectionObserver';

const SECTIONS = ['dossier', 'experience', 'repos', 'notes', 'letter'] as const;

export default function TabBar() {
  const activeId = useSectionObserver(SECTIONS);
  const navRef = useRef<HTMLElement | null>(null);
  const pillRef = useRef<HTMLSpanElement | null>(null);

  const isCurrent = (id: string) =>
    activeId === id ? { 'aria-current': 'true' as const } : {};

  // Scroll-synced pill driven by a self-scheduling rAF loop. Position/size are
  // written directly to pill.style so there is no chance of a GSAP tween or
  // matchMedia cleanup interfering. IntersectionObserver still drives
  // `aria-current` for a11y.
  useEffect(() => {
    const nav = navRef.current;
    const pill = pillRef.current;
    if (!nav || !pill) return;

    let rafId = 0;
    let alive = true;

    const tick = () => {
      if (!alive) return;
      const sections: HTMLElement[] = [];
      const tabs: HTMLElement[] = [];
      for (const id of SECTIONS) {
        const s = document.getElementById(id);
        const t = nav.querySelector<HTMLElement>(`a[data-target="${id}"]`);
        if (!s || !t) {
          rafId = requestAnimationFrame(tick);
          return;
        }
        sections.push(s);
        tabs.push(t);
      }

      const anchor = window.innerHeight * 0.45;
      const tops = sections.map((el) => el.getBoundingClientRect().top);
      const last = tops.length - 1;

      let i = 0;
      let progress = 0;
      if ((tops[0] as number) >= anchor) {
        i = 0;
      } else if ((tops[last] as number) <= anchor) {
        i = last;
      } else {
        for (let k = 0; k < last; k++) {
          const a = tops[k] as number;
          const b = tops[k + 1] as number;
          if (a <= anchor && b > anchor) {
            i = k;
            progress = b === a ? 0 : (anchor - a) / (b - a);
            break;
          }
        }
      }

      const tabA = tabs[i]!;
      const tabB = tabs[Math.min(i + 1, last)]!;
      const navRect = nav.getBoundingClientRect();
      const rA = tabA.getBoundingClientRect();
      const rB = tabB.getBoundingClientRect();
      const xA = rA.left - navRect.left;
      const xB = rB.left - navRect.left;
      const x = xA + (xB - xA) * progress;
      const w = rA.width + (rB.width - rA.width) * progress;

      pill.style.transform = `translate3d(${x}px,0,0)`;
      pill.style.width = `${w}px`;
      pill.style.opacity = '1';

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, []);

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
