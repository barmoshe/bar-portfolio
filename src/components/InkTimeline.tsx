import { useRef } from 'react';
import { gsap, ScrollTrigger, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';
import { createReveal } from '../lib/scrollReveal';

// A hand-drawn vertical rail rendered beside the Story section. As the user
// scrolls through the parent, the path's stroke-dashoffset scrubs to zero -
// the line literally writes itself. Milestone dots fade/scale in via a
// ScrollTrigger.batch so the rail feels populated as it draws.
//
// Hidden on narrow viewports (see .ink-timeline CSS) since there's no room
// for a side rail on mobile.
type Props = { triggerRef: React.RefObject<HTMLElement | null> };

// Milestone y-offsets along a 1000-unit tall viewBox. Roughly aligned with the
// Story section's content rhythm.
const MILESTONES = [80, 220, 380, 540, 720, 900] as const;

// A slightly-drifting vertical path. Control points are tuned so the line
// wobbles like a fountain-pen stroke rather than a straight ruler.
const PATH_D =
  'M12 4 C 8 80, 16 160, 12 240 C 8 320, 17 400, 12 480 C 7 560, 15 640, 12 720 C 9 800, 15 880, 12 996';

export default function InkTimeline({ triggerRef }: Props) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);

  useGSAP(
    () => {
      const path = pathRef.current;
      const root = rootRef.current;
      const trigger = triggerRef.current;
      if (!path || !root || !trigger) return;

      const len = path.getTotalLength();
      gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });

      const mm = gsap.matchMedia();
      mm.add(`${FULL_MOTION_QUERY} and (min-width: 641px)`, () => {
        gsap.to(path, {
          strokeDashoffset: 0,
          ease: 'none',
          scrollTrigger: {
            id: 'story-timeline',
            trigger,
            start: 'top 80%',
            end: 'bottom 20%',
            scrub: 0.6,
            fastScrollEnd: true,
          },
        });

        const dots = root.querySelectorAll<SVGCircleElement>('circle');
        if (dots.length) {
          createReveal(
            dots,
            { opacity: 0, scale: 0, transformOrigin: '50% 50%' },
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.08, ease: 'back.out(2.2)' },
            { trigger, start: 'top 85%' },
          );
        }

        ScrollTrigger.refresh();
      });

      // Reduced motion or small screens: show the rail fully drawn, no scrub.
      mm.add('(prefers-reduced-motion: reduce), (max-width: 640px)', () => {
        gsap.set(path, { strokeDashoffset: 0 });
        gsap.set(root.querySelectorAll('circle'), { opacity: 1, scale: 1 });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div className="ink-timeline" aria-hidden="true" ref={rootRef}>
      <svg viewBox="0 0 24 1000" preserveAspectRatio="none">
        <path ref={pathRef} d={PATH_D} />
        {MILESTONES.map((cy) => (
          <circle key={cy} cx="12" cy={cy} r="4" />
        ))}
      </svg>
    </div>
  );
}
