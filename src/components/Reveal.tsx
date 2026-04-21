import { useRef, type CSSProperties, type ElementType, type ReactNode } from 'react';
import { gsap, useGSAP, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = {
  as?: ElementType;
  className?: string;
  id?: string;
  style?: CSSProperties;
  children: ReactNode;
  // Stagger animation for the container's *direct children*.
  stagger?: boolean;
  // Amount of stagger between children (seconds). Default 0.08.
  staggerAmount?: number;
  // Starting y offset (px). Default 28.
  y?: number;
  // Duration (seconds). Default 0.75.
  duration?: number;
  // Which edge of the viewport fires the trigger. Default "top 80%".
  start?: string;
  // Whether to replay when leaving and re-entering. Default: play once.
  once?: boolean;
};

export default function Reveal({
  as: Tag = 'div',
  className,
  id,
  style,
  children,
  stagger = false,
  staggerAmount = 0.08,
  y = 28,
  duration = 0.75,
  start = 'top 80%',
  once = true,
}: Props) {
  const ref = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = ref.current;
      if (!root) return;

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        if (stagger) {
          const kids = Array.from(root.children) as HTMLElement[];
          gsap.set(kids, { opacity: 0, y });
          gsap.to(kids, {
            opacity: 1,
            y: 0,
            duration,
            stagger: staggerAmount,
            scrollTrigger: {
              trigger: root,
              start,
              toggleActions: once ? 'play none none none' : 'play none none reverse',
            },
          });
        } else {
          gsap.set(root, { opacity: 0, y });
          gsap.to(root, {
            opacity: 1,
            y: 0,
            duration,
            scrollTrigger: {
              trigger: root,
              start,
              toggleActions: once ? 'play none none none' : 'play none none reverse',
            },
          });
        }
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} className={className} id={id} style={style}>
      {children}
    </Tag>
  );
}
