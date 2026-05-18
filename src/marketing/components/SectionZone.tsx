import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { gsap, ScrollTrigger, FULL_MOTION_QUERY } from '../../lib/gsap';

/**
 * A 4-slot palette recipe for the liquid field. Each section
 * declares its own; ScrollTrigger crossfades the root CSS vars
 * (`--rs-blob-1..4`) when this section enters the viewport.
 */
export type ZonePalette = {
  blob1: string;
  blob2: string;
  blob3: string;
  blob4: string;
};

type Props = {
  /** Used as `data-zone` and for ScrollTrigger id. */
  name: string;
  /** Pop-color recipe for this section's blob field. */
  palette: ZonePalette;
  /** Wraps any element type — typically a <section>. */
  children: ReactNode;
};

/**
 * Wraps a section, tags it with `data-zone`, and registers a
 * ScrollTrigger that tweens the root `--rs-blob-*` CSS vars to
 * this palette when the section enters the viewport (50%+).
 * Reduced-motion: snap to the palette instantly on enter.
 */
export default function SectionZone({ name, palette, children }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const reduce = !matchMedia(FULL_MOTION_QUERY).matches;

    const setVars = (immediate: boolean) => {
      if (immediate || reduce) {
        root.style.setProperty('--rs-blob-1', palette.blob1);
        root.style.setProperty('--rs-blob-2', palette.blob2);
        root.style.setProperty('--rs-blob-3', palette.blob3);
        root.style.setProperty('--rs-blob-4', palette.blob4);
        return;
      }
      gsap.to(root, {
        duration: 0.7,
        ease: 'power2.inOut',
        // Use the CSS property setter directly so the browser
        // resolves the var update on the next frame.
        onUpdate: () => {},
        '--rs-blob-1': palette.blob1,
        '--rs-blob-2': palette.blob2,
        '--rs-blob-3': palette.blob3,
        '--rs-blob-4': palette.blob4,
      } as gsap.TweenVars);
    };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: () => setVars(false),
      onEnterBack: () => setVars(false),
      id: `zone-${name}`,
    });

    return () => {
      trigger.kill();
    };
  }, [name, palette.blob1, palette.blob2, palette.blob3, palette.blob4]);

  return (
    <div ref={ref} data-zone={name} className="ld-zone-host">
      {children}
    </div>
  );
}
