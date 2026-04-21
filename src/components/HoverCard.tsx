import { useRef, type CSSProperties, type ReactNode } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = {
  href: string;
  target?: string;
  rel?: string;
  rest: CSSProperties;
  hover: CSSProperties;
  children: ReactNode;
};

// Parse a box-shadow that looks like "6px 7px 0 var(--red)" into just the offsets
// so we can animate them. Falls back to a direct style swap if the format is unexpected.
function parseShadow(s: string | undefined): { x: number; y: number; color: string } | null {
  if (!s) return null;
  const m = s.match(/(-?\d+(?:\.\d+)?)px\s+(-?\d+(?:\.\d+)?)px\s+0\s+(.+)/);
  if (!m) return null;
  return { x: parseFloat(m[1]!), y: parseFloat(m[2]!), color: m[3]!.trim() };
}

function parseRotate(transform: string | undefined): number {
  if (!transform) return 0;
  const m = transform.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
  return m ? parseFloat(m[1]!) : 0;
}

function parseY(transform: string | undefined): number {
  if (!transform) return 0;
  const m = transform.match(/translateY\((-?\d+(?:\.\d+)?)px\)/);
  return m ? parseFloat(m[1]!) : 0;
}

export default function HoverCard({
  href,
  target,
  rel,
  rest,
  hover,
  children,
}: Props) {
  const ref = useRef<HTMLAnchorElement | null>(null);
  const quickRef = useRef<{
    rotate: (v: number) => void;
    y: (v: number) => void;
    shadowX: (v: number) => void;
    shadowY: (v: number) => void;
    peel: (v: number) => void;
  } | null>(null);

  const restRotate = parseRotate(rest.transform as string);
  const restShadow = parseShadow(rest.boxShadow as string);
  const hoverRotate = parseRotate(hover.transform as string);
  const hoverY = parseY(hover.transform as string);
  const hoverShadow = parseShadow(hover.boxShadow as string);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        quickRef.current = {
          rotate: gsap.quickTo(el, 'rotate', { duration: 0.35, ease: 'power3.out' }),
          y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' }),
          shadowX: gsap.quickTo(el, '--sh-x', { duration: 0.35, ease: 'power3.out' }),
          shadowY: gsap.quickTo(el, '--sh-y', { duration: 0.35, ease: 'power3.out' }),
          peel: gsap.quickTo(el, '--peel', { duration: 0.4, ease: 'back.out(2)' }),
        };
        gsap.set(el, { rotate: restRotate, '--peel': 0 });
        if (restShadow) {
          gsap.set(el, {
            '--sh-x': `${restShadow.x}px`,
            '--sh-y': `${restShadow.y}px`,
          });
        }
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  const onEnter = () => {
    const q = quickRef.current;
    if (!q) return;
    q.rotate(hoverRotate);
    q.y(hoverY);
    q.peel(1);
    if (hoverShadow) {
      q.shadowX(hoverShadow.x);
      q.shadowY(hoverShadow.y);
    }
  };
  const onLeave = () => {
    const q = quickRef.current;
    if (!q) return;
    q.rotate(restRotate);
    q.y(0);
    q.peel(0);
    if (restShadow) {
      q.shadowX(restShadow.x);
      q.shadowY(restShadow.y);
    }
  };

  // Rest style with a shadow expressed via CSS vars so GSAP can tween the offsets
  // while the color stays static.
  const shadowColor = hoverShadow?.color ?? restShadow?.color ?? 'var(--ink)';
  const style: CSSProperties = {
    ...rest,
    boxShadow: restShadow
      ? `var(--sh-x, ${restShadow.x}px) var(--sh-y, ${restShadow.y}px) 0 ${shadowColor}`
      : (rest.boxShadow as string | undefined),
    transform: 'none', // rotate/y now handled by GSAP
    transition: 'none', // GSAP drives it
  };

  return (
    <a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      className="ink-peelable"
      style={style}
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
    >
      {children}
    </a>
  );
}
