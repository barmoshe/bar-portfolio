import { useLayoutEffect, useRef } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../../lib/gsap';

type Props = {
  /** One line per array entry; rendered as a stacked block heading. */
  lines: string[];
  /** Element to render — h1 for the cover, h2 elsewhere. */
  as?: 'h1' | 'h2';
  id?: string;
  className?: string;
};

/**
 * Per-line clip-reveal heading. Each line is wrapped in an inner
 * span; on mount GSAP tweens clip-path from `inset(0 0 110% 0)`
 * to `inset(0%)` with a small upward slide and stagger.
 *
 * Reduced-motion: text renders at its natural state, no tween.
 * Full text remains in the DOM the whole time so screen readers
 * read the heading normally (no aria-hidden on the lines).
 */
export default function KineticHeadline({ lines, as = 'h1', id, className }: Props) {
  const ref = useRef<HTMLHeadingElement | null>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    if (!matchMedia(FULL_MOTION_QUERY).matches) return;

    const inners = root.querySelectorAll<HTMLElement>('.ld-kinetic__inner');
    const ctx = gsap.context(() => {
      gsap.set(inners, { clipPath: 'inset(0 0 110% 0)', yPercent: 30 });
      gsap.to(inners, {
        clipPath: 'inset(0% 0% -2% 0%)',
        yPercent: 0,
        duration: 0.95,
        ease: 'power3.out',
        stagger: 0.12,
        delay: 0.1,
      });
    }, root);
    return () => ctx.revert();
  }, [lines]);

  const Tag = as;
  const composedClass = ['ld-kinetic', className].filter(Boolean).join(' ');

  return (
    <Tag id={id} ref={ref} className={composedClass}>
      {lines.map((line, i) => (
        <span className="ld-kinetic__line" key={i}>
          <span className="ld-kinetic__inner">{line}</span>
        </span>
      ))}
    </Tag>
  );
}
