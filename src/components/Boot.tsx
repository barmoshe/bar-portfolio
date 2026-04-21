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
        const mast = root.querySelector<HTMLElement>('.mast-main');
        const version = root.querySelector<HTMLElement>('.version-tag');
        const tag = root.querySelector<HTMLElement>('.mast-tag');
        const sub = root.querySelector<HTMLElement>('.sub');
        const btn = root.querySelector<HTMLElement>('.enter');
        const hint = root.querySelector<HTMLElement>('.enter-hint');

        let split: SplitText | null = null;
        const tl = gsap.timeline();

        if (mast) {
          split = new SplitText(mast, { type: 'chars', charsClass: 'bmchar' });
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

    // Choose the ink-burst origin from the Enter button if we have it, so the
    // wash blooms out of whatever the user just clicked; fall back to centre.
    const btn = root.querySelector<HTMLElement>('.enter');
    const rootRect = root.getBoundingClientRect();
    let xPct = 50;
    let yPct = 50;
    if (btn) {
      const r = btn.getBoundingClientRect();
      xPct = ((r.left + r.width / 2 - rootRect.left) / rootRect.width) * 100;
      yPct = ((r.top + r.height / 2 - rootRect.top) / rootRect.height) * 100;
    }

    const feDisp = document.querySelector<SVGFEDisplacementMapElement>(
      'feDisplacementMap[data-ink-bleed="boot"]',
    );

    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION_QUERY, () => {
      gsap.set(root, {
        '--ink-r': '0%',
        '--ink-x': `${xPct}%`,
        '--ink-y': `${yPct}%`,
      });
      root.classList.add('ink-exit');
      if (feDisp) gsap.set(feDisp, { attr: { scale: 0 } });

      const tl = gsap.timeline({ onComplete: onGone });
      tl.to(root, {
        '--ink-r': '140%',
        duration: 0.9,
        ease: 'power2.inOut',
      });
      if (feDisp) {
        tl.to(
          feDisp,
          { attr: { scale: 40 }, duration: 0.9, ease: 'power2.in' },
          '<',
        );
      }
      tl.to(root, { opacity: 0, duration: 0.2 }, 0.7);
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
          <span className="mast-main">BAR MOSHE</span>
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
          data-magnet
          onClick={dismiss}
        >
          Enter the portfolio
        </button>
        <div className="enter-hint">press any key · or click anywhere</div>
      </div>
    </div>
  );
}
