import type { ReactNode } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../../lib/gsap';

type Props = {
  children: ReactNode;
  href: string;
  /** Optional onClick - called before the bloom transition fires. */
  onActivate?: () => void;
  /**
   * Element id to scroll to after the bloom wash completes.
   * If absent, the link follows its href normally (no transition).
   */
  scrollTargetId?: string;
  /** Override the bloom wash color. Defaults to current `--rs-pop-2`. */
  bloomColor?: string;
  /** Visible arrow glyph after the label. Default "→". */
  arrow?: string;
  /** ghost variant = ghost outline button. Default = filled orb. */
  variant?: 'orb' | 'ghost';
  ariaLabel?: string;
};

/**
 * Touch-first bloom CTA. Renders as a tap-friendly orb (min 64px
 * tall, 72px ≥ 720). On activate: a circular color wash blooms
 * from the tap point and the page scrolls to the target. Reduces
 * to a plain instant scroll under prefers-reduced-motion.
 *
 * Designed for *touch first* - no hover-only behavior; press
 * feedback uses CSS :active scale; bloom plays on both tap and
 * keyboard activation (clientX/Y come from the bounding rect
 * centre when keyboard-triggered).
 */
export default function BloomCta({
  children,
  href,
  onActivate,
  scrollTargetId,
  bloomColor,
  arrow = '→',
  variant = 'orb',
  ariaLabel,
}: Props) {
  const handle = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onActivate?.();
    if (!scrollTargetId) return; // let the link follow normally
    e.preventDefault();

    const target = document.getElementById(scrollTargetId);
    if (!target) return;

    const reduce = !matchMedia(FULL_MOTION_QUERY).matches;
    if (reduce) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      return;
    }

    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const x = (e.clientX || rect.left + rect.width / 2);
    const y = (e.clientY || rect.top + rect.height / 2);

    runBloom(x, y, bloomColor, () => {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  };

  const className = variant === 'ghost' ? 'ld-orb ld-orb--ghost' : 'ld-orb';

  return (
    <a
      className={className}
      href={href}
      onClick={handle}
      aria-label={ariaLabel}
    >
      <span className="ld-orb__label">{children}</span>
      <span className="ld-orb__arrow" aria-hidden="true">{arrow}</span>
    </a>
  );
}

/**
 * Render a single bloom overlay, play the timeline, clean up.
 * Uses a fresh DOM node each invocation so concurrent bloom calls
 * never race over the same element.
 */
function runBloom(x: number, y: number, color: string | undefined, after: () => void) {
  const overlay = document.createElement('div');
  overlay.className = 'ld-bloom';
  overlay.style.setProperty('--bloom-x', `${x}px`);
  overlay.style.setProperty('--bloom-y', `${y}px`);
  if (color) overlay.style.setProperty('--bloom-color', color);
  document.body.appendChild(overlay);

  const tl = gsap.timeline({
    onComplete: () => {
      overlay.remove();
    },
  });

  tl.fromTo(
    overlay,
    {
      opacity: 0.85,
      clipPath: `circle(0% at ${x}px ${y}px)`,
    },
    {
      opacity: 1,
      clipPath: `circle(150% at ${x}px ${y}px)`,
      duration: 0.55,
      ease: 'power3.inOut',
    },
  );
  // Scroll fires at the apex when the screen is fully washed
  tl.call(after, [], '>-0.05');
  tl.to(
    overlay,
    {
      opacity: 0,
      duration: 0.35,
      ease: 'power2.out',
    },
    '>',
  );
}
