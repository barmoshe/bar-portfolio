import { useEffect, useRef, useState } from 'react';
import { useBootDismiss } from '../hooks/useBootDismiss';
import { gsap, useGSAP, SplitText, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = { onGone: () => void };

export default function Boot({ onGone }: Props) {
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
  };

  useBootDismiss(!leaving, dismiss);

  // Entrance choreography.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        const mast = root.querySelector<HTMLElement>('.mast');
        const version = root.querySelector<HTMLElement>('.version-tag');
        const tag = root.querySelector<HTMLElement>('.mast-tag');
        const sub = root.querySelector<HTMLElement>('.sub');
        const btn = root.querySelector<HTMLElement>('.enter');
        const hint = root.querySelector<HTMLElement>('.enter-hint');

        let split: SplitText | null = null;
        const tl = gsap.timeline();

        if (mast) {
          // Split only the first text node of .mast (the "BAR MOSHE" text),
          // keeping .mast-tag intact as its own animated item.
          split = new SplitText(mast, {
            type: 'chars,words',
            charsClass: 'bmchar',
            // Don't split deeply into .mast-tag — it's handled separately.
            ignore: '.mast-tag',
          });
          gsap.set(split.chars, { opacity: 0, yPercent: 40, rotate: -8 });
          tl.to(split.chars, {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.7,
            stagger: 0.045,
            ease: 'back.out(1.6)',
          });
        }

        if (version) {
          gsap.set(version, { opacity: 0, y: -6 });
          tl.to(version, { opacity: 1, y: 0, duration: 0.4 }, 0.05);
        }

        if (tag) {
          gsap.set(tag, { opacity: 0, x: 18 });
          tl.to(tag, { opacity: 1, x: 0, duration: 0.55 }, '-=0.3');
        }

        if (sub) {
          gsap.set(sub, { opacity: 0, y: 8 });
          tl.to(sub, { opacity: 1, y: 0, duration: 0.45 }, '-=0.25');
        }

        if (btn) {
          gsap.set(btn, { opacity: 0, scale: 0.9 });
          tl.to(btn, { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(2)' }, '-=0.2');
        }

        if (hint) {
          gsap.set(hint, { opacity: 0 });
          tl.to(hint, { opacity: 1, duration: 0.5 }, '-=0.2');
        }

        tlRef.current = tl;

        return () => {
          split?.revert();
        };
      });

      // Reduced motion: make sure everything is visible
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          root.querySelectorAll('.mast, .version-tag, .mast-tag, .sub, .enter, .enter-hint'),
          { clearProps: 'all' },
        );
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Exit on dismiss, then call onGone.
  useEffect(() => {
    if (!leaving) return;
    const root = rootRef.current;
    if (!root) {
      onGone();
      return;
    }
    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION_QUERY, () => {
      gsap.to(root, {
        opacity: 0,
        y: -24,
        scale: 0.98,
        duration: 0.55,
        ease: 'power2.inOut',
        onComplete: onGone,
      });
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.to(root, { opacity: 0, duration: 0.15, onComplete: onGone });
    });
    return () => mm.revert();
  }, [leaving, onGone]);

  return (
    <div
      className="boot"
      id="boot"
      role="dialog"
      aria-label="Cover"
      ref={rootRef}
    >
      <div className="cover">
        <span className="version-tag">v2.0.0</span>
        <h1 className="mast">
          BAR MOSHE
          <span className="mast-tag">
            it's only one <em>prompt</em> away.
          </span>
        </h1>
        <p className="sub">Full-Stack · AI · Builder</p>
        <button
          className="enter pulse"
          id="enter"
          type="button"
          aria-label="Enter portfolio"
          onClick={dismiss}
        >
          Enter the portfolio
        </button>
        <div className="enter-hint">press any key · or click anywhere</div>
      </div>
    </div>
  );
}
