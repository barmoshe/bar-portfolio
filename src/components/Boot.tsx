import { useEffect, useMemo, useRef, useState } from 'react';
import { useAssetPreload } from '../hooks/useAssetPreload';
import { gsap, useGSAP, SplitText, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = { onGone: () => void };

// Portrait paths mirror HeroSlides.tsx so the browser cache is warm by the
// time the portfolio mounts behind the boot exit. Note img8 is intentionally
// missing from the slide set, matching HeroSlides.
const PORTRAIT_NAMES = [
  'img0',
  'img1',
  'img2',
  'img3',
  'img4',
  'img5',
  'img6',
  'img7',
  'img9',
  'img10',
  'img11',
  'img12',
  'img13',
  'img14',
  'img15',
];

export default function Boot({ onGone }: Props) {
  const [leaving, setLeaving] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const breathRef = useRef<gsap.core.Timeline | null>(null);
  const progressVisibleRef = useRef(false);

  const base = import.meta.env.BASE_URL;
  const assets = useMemo(
    () => PORTRAIT_NAMES.map((n) => `${base}portraits/${n}.png`),
    [base],
  );
  const { loaded, total, done } = useAssetPreload(assets);

  const dismiss = () => {
    if (leaving) return;
    setLeaving(true);
  };

  // Entrance choreography.
  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const mm = gsap.matchMedia();

      mm.add(FULL_MOTION_QUERY, () => {
        const versionMark = root.querySelector<SVGSVGElement>('.version-mark');
        const markPaths = versionMark
          ? Array.from(versionMark.querySelectorAll<SVGPathElement>('path'))
          : [];
        const version = root.querySelector<HTMLElement>('.version-tag');
        const mast = root.querySelector<HTMLElement>('.mast-main');
        const phrase = root.querySelector<HTMLElement>('.mast-phrase');
        const em = phrase?.querySelector<HTMLElement>('em') ?? null;
        const sub = root.querySelector<HTMLElement>('.sub');
        const btn = root.querySelector<HTMLElement>('.enter');
        const fe = document.querySelector<SVGFETurbulenceElement>(
          'feTurbulence[data-grain="wash"]',
        );

        let mastSplit: SplitText | null = null;

        const tl = gsap.timeline();
        tlRef.current = tl;

        // Beat 1 - "//" stroke-to-fill accent.
        if (markPaths.length) {
          markPaths.forEach((p) => {
            const len = p.getTotalLength();
            gsap.set(p, {
              strokeDasharray: len,
              strokeDashoffset: len,
              fillOpacity: 0,
            });
          });
          tl.to(
            markPaths,
            {
              strokeDashoffset: 0,
              duration: 0.45,
              ease: 'power2.out',
              stagger: 0.08,
            },
            0,
          );
          tl.to(
            markPaths,
            { fillOpacity: 1, duration: 0.25, ease: 'power2.out' },
            '>-0.1',
          );
        }

        // Beat 2 - version text slide.
        if (version) {
          gsap.set(version, { opacity: 0, x: -8 });
          tl.to(
            version,
            { opacity: 1, x: 0, duration: 0.4, ease: 'power3.out' },
            0.05,
          );
        }

        // Beat 3 - masthead letterpress clip-sweep.
        if (mast) {
          mastSplit = new SplitText(mast, { type: 'chars', charsClass: 'bmchar' });
          gsap.set(mastSplit.chars, {
            clipPath: 'inset(0 0 100% 0)',
            yPercent: 18,
            opacity: 1,
          });
          tl.to(
            mastSplit.chars,
            {
              clipPath: 'inset(0% 0% 0% 0%)',
              yPercent: 0,
              duration: 0.85,
              stagger: 0.04,
              ease: 'expo.out',
            },
            0.25,
          );
        }

        // Beat 4 - catchphrase reveal + "prompt" highlight.
        if (phrase) {
          gsap.set(phrase, { opacity: 0, y: 10 });
          tl.to(
            phrase,
            { opacity: 1, y: 0, duration: 0.55, ease: 'power3.out' },
            0.95,
          );
        }

        if (em) {
          gsap.set(em, { color: 'var(--ink-soft)' });
          tl.to(
            em,
            { color: 'var(--green)', duration: 0.3, ease: 'none' },
            '>-0.15',
          );
        }

        // Beat 5 - sub typewriter scaleX.
        if (sub) {
          gsap.set(sub, {
            transformOrigin: 'left center',
            scaleX: 0,
            opacity: 1,
          });
          tl.to(sub, { scaleX: 1, duration: 0.4, ease: 'power2.out' }, 1.15);
        }

        // Beat 6 - Enter button pen-down settle, then pulse restart.
        if (btn) {
          btn.classList.remove('pulse');
          gsap.set(btn, { opacity: 0, y: 16, rotate: -1.5, scale: 0.94 });
          tl.to(
            btn,
            {
              opacity: 1,
              y: 0,
              rotate: 0,
              scale: 1,
              duration: 0.5,
              ease: 'back.out(2.2)',
              onComplete: () => {
                btn.classList.remove('pulse');
                void btn.offsetWidth;
                btn.classList.add('pulse');
              },
            },
            1.4,
          );
        }

        // Beat 8 (parallel) - grain wash: coarser → settled.
        if (fe) {
          tl.fromTo(
            fe,
            { attr: { baseFrequency: '1.4 1.4' } },
            {
              attr: { baseFrequency: '0.9 0.9' },
              duration: 1.0,
              ease: 'power2.out',
            },
            0,
          );
        }

        // Beat 9 - ambient masthead breathing (post-entrance).
        // Use filter:brightness (compositor) instead of letterSpacing (layout)
        // so the infinite yoyo doesn't reflow the masthead every frame.
        let onVis: (() => void) | null = null;
        if (mast) {
          const breathTl = gsap.timeline({
            repeat: -1,
            yoyo: true,
            paused: true,
          });
          breathTl.to(mast, {
            filter: 'brightness(1.06)',
            duration: 5,
            ease: 'sine.inOut',
          });
          breathRef.current = breathTl;
          tl.call(
            () => {
              breathTl.play();
            },
            undefined,
            '>',
          );
          onVis = () => {
            if (document.hidden) breathTl.pause();
            else if (breathTl.totalProgress() > 0) breathTl.play();
          };
          document.addEventListener('visibilitychange', onVis);
        }

        return () => {
          if (onVis) document.removeEventListener('visibilitychange', onVis);
          mastSplit?.revert();
          breathRef.current?.kill();
          breathRef.current = null;
          tlRef.current = null;
        };
      });

      // Pointer drift on masthead - hover-capable + motion-OK only.
      mm.add(
        `${FULL_MOTION_QUERY} and (hover: hover)`,
        () => {
          const mast = root.querySelector<HTMLElement>('.mast-main');
          if (!mast) return;
          const xTo = gsap.quickTo(mast, 'x', {
            duration: 0.6,
            ease: 'power3.out',
          });
          const yTo = gsap.quickTo(mast, 'y', {
            duration: 0.6,
            ease: 'power3.out',
          });
          const onMove = (e: PointerEvent) => {
            const r = root.getBoundingClientRect();
            const nx = ((e.clientX - r.left) / r.width - 0.5) * 2;
            const ny = ((e.clientY - r.top) / r.height - 0.5) * 2;
            xTo(nx * 3);
            yTo(ny * 3);
          };
          const onLeave = () => {
            xTo(0);
            yTo(0);
          };
          root.addEventListener('pointermove', onMove, { passive: true });
          root.addEventListener('pointerleave', onLeave);
          return () => {
            root.removeEventListener('pointermove', onMove);
            root.removeEventListener('pointerleave', onLeave);
          };
        },
      );

      // Reduced motion: make sure everything is visible, quote included.
      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set(
          root.querySelectorAll(
            '.mast, .mast-main, .version-tag, .mast-quote, .mast-quote-rule, .mast-quote-text, .mast-quote-attr, .sub, .enter',
          ),
          { clearProps: 'all' },
        );
        const paths = root.querySelectorAll<SVGPathElement>('.version-mark path');
        gsap.set(paths, { clearProps: 'all', fillOpacity: 1 });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  // Loading bar: reveal after 700ms only if preload is still in-flight.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const progressBar = root.querySelector<HTMLElement>('.enter-progress');
    if (!progressBar) return;

    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    const id = window.setTimeout(() => {
      if (done || leaving) return;
      progressVisibleRef.current = true;
      if (prefersReduced) {
        gsap.set(progressBar, { opacity: 1 });
      } else {
        gsap.to(progressBar, {
          opacity: 1,
          duration: 0.3,
          ease: 'power2.out',
        });
      }
    }, 700);

    return () => window.clearTimeout(id);
  }, [done, leaving]);

  // Advance the fill bar as preload progresses, hide on completion.
  // Tween rather than snap so the bar reads as continuous progress, and
  // run in both motion modes so reduced-motion users see the fill too
  // (the previous quickSetter wiring lived inside the full-motion
  // matchMedia branch and never ran for reduced motion).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const fill = root.querySelector<HTMLElement>('.enter-progress-fill');
    const bar = root.querySelector<HTMLElement>('.enter-progress');
    if (!fill || !bar) return;

    const progress = total > 0 ? loaded / total : 1;
    const prefersReduced = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    if (prefersReduced) {
      gsap.set(fill, { scaleX: progress });
    } else {
      gsap.to(fill, {
        scaleX: progress,
        duration: 0.45,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    }

    if (done && progressVisibleRef.current) {
      gsap.to(bar, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.out',
        delay: 0.4,
      });
    }
  }, [loaded, total, done]);

  // Exit on dismiss, then call onGone.
  useEffect(() => {
    if (!leaving) return;
    const root = rootRef.current;
    if (!root) {
      onGone();
      return;
    }

    // Kill any in-flight entrance so the exit wash starts from the current
    // visible state instead of racing against half-finished tweens.
    tlRef.current?.kill();
    breathRef.current?.kill();
    tlRef.current = null;
    breathRef.current = null;

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
        <span className="version-tag">
          <svg
            className="version-mark"
            viewBox="0 0 22 12"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M4 11 L8 1 L10 1 L6 11 Z" />
            <path d="M13 11 L17 1 L19 1 L15 11 Z" />
          </svg>
          v1.3.7
        </span>
        <h1 className="mast">
          <span className="mast-main">BAR MOSHE</span>
        </h1>
        <p className="mast-phrase">
          it's only one <em>prompt</em> away.
        </p>
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
        <div
          className="enter-progress"
          aria-hidden="true"
          aria-label={`Loading assets ${loaded} of ${total}`}
        >
          <span className="enter-progress-fill" />
        </div>
      </div>
    </div>
  );
}
