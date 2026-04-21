import { useRef } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

// A magnetic two-part ink cursor. One large soft blob lags behind a precise
// nib; both live inside the goo filter (see InkDefs #ink-blob) so they merge
// into one liquid shape as the cursor moves.
//
// Anchors flagged with data-magnet pull the cursor toward their centre on
// pointerenter; a click fires a splash ring via an on-demand timeline.
//
// Only mounted on pointer-capable, motion-allowed devices (gsap.matchMedia).

export default function InkCursor() {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const blobRef = useRef<SVGCircleElement | null>(null);
  const nibRef = useRef<SVGCircleElement | null>(null);
  const splashRef = useRef<SVGCircleElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const blob = blobRef.current;
      const nib = nibRef.current;
      const splash = splashRef.current;
      if (!root || !blob || !nib || !splash) return;

      const mm = gsap.matchMedia();

      mm.add(`${FULL_MOTION_QUERY} and (hover: hover) and (pointer: fine)`, () => {
        // Pointer-capable + motion-OK device: show the cursor, hide the system one.
        gsap.set(root, { opacity: 1 });
        document.documentElement.classList.add('ink-cursor-on');

        // Four independent quickTo setters so the nib reacts instantly while
        // the blob lags (rule 10: never call gsap.to on pointermove).
        const nibX = gsap.quickTo(nib, 'cx', { duration: 0.08, ease: 'power3.out' });
        const nibY = gsap.quickTo(nib, 'cy', { duration: 0.08, ease: 'power3.out' });
        const blobX = gsap.quickTo(blob, 'cx', { duration: 0.35, ease: 'power3.out' });
        const blobY = gsap.quickTo(blob, 'cy', { duration: 0.35, ease: 'power3.out' });

        // Magnet state: when hovering an element tagged data-magnet, we ease the
        // target position toward the element's centre (capped at 30% pull).
        const magnet = { x: 0, y: 0 };
        let magnetTarget: HTMLElement | null = null;
        let lastX = window.innerWidth / 2;
        let lastY = window.innerHeight / 2;
        gsap.set([nib, blob], { cx: lastX, cy: lastY });

        const applyPosition = () => {
          const tx = magnetTarget
            ? lastX + (magnet.x - lastX) * 0.28
            : lastX;
          const ty = magnetTarget
            ? lastY + (magnet.y - lastY) * 0.28
            : lastY;
          nibX(tx);
          nibY(ty);
          blobX(tx);
          blobY(ty);
        };

        const onMove = (e: PointerEvent) => {
          lastX = e.clientX;
          lastY = e.clientY;
          if (magnetTarget) {
            const r = magnetTarget.getBoundingClientRect();
            magnet.x = r.left + r.width / 2;
            magnet.y = r.top + r.height / 2;
          }
          applyPosition();
        };

        const onDown = (e: PointerEvent) => {
          // Splash ring at the nib position.
          const tl = gsap.timeline();
          tl.set(splash, { attr: { cx: e.clientX, cy: e.clientY, r: 6 }, opacity: 0.75 })
            .to(splash, { attr: { r: 38 }, opacity: 0, duration: 0.55, ease: 'power2.out' })
            .to(
              blob,
              {
                attr: { r: 22 },
                duration: 0.12,
                ease: 'power2.in',
                yoyo: true,
                repeat: 1,
              },
              0,
            );
        };

        // Magnet handling via event delegation. Scan up from the event target
        // for a [data-magnet] ancestor. Bound on document so new nodes (tabs,
        // cards, magnet-attributed elements mounted later) Just Work.
        const onOver = (e: PointerEvent) => {
          const target =
            (e.target as Element | null)?.closest<HTMLElement>('[data-magnet]') ?? null;
          if (target === magnetTarget) return;
          magnetTarget = target;
          gsap.to(blob, {
            attr: { r: magnetTarget ? 28 : 16 },
            duration: 0.35,
            ease: 'back.out(2)',
          });
        };

        const onOut = (e: PointerEvent) => {
          // Only clear when leaving the magnet (not when moving between its children).
          if (!magnetTarget) return;
          const related = (e.relatedTarget as Element | null)?.closest<HTMLElement>('[data-magnet]');
          if (related === magnetTarget) return;
          magnetTarget = null;
          gsap.to(blob, { attr: { r: 16 }, duration: 0.35, ease: 'power3.out' });
        };

        document.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerdown', onDown, { passive: true });
        document.addEventListener('pointerover', onOver, { passive: true });
        document.addEventListener('pointerout', onOut, { passive: true });

        return () => {
          document.removeEventListener('pointermove', onMove);
          document.removeEventListener('pointerdown', onDown);
          document.removeEventListener('pointerover', onOver);
          document.removeEventListener('pointerout', onOut);
          document.documentElement.classList.remove('ink-cursor-on');
        };
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div className="ink-cursor" ref={rootRef} aria-hidden="true">
      <svg width="100%" height="100%">
        <g filter="url(#ink-blob)">
          <circle ref={blobRef} r="16" cx="-40" cy="-40" className="ink-cursor-blob" />
          <circle ref={nibRef} r="4" cx="-40" cy="-40" className="ink-cursor-nib" />
        </g>
        <circle ref={splashRef} r="0" cx="-40" cy="-40" className="ink-cursor-splash" />
      </svg>
    </div>
  );
}
