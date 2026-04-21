import { useEffect, useRef, useState } from 'react';
import type { Project } from '../data/portfolio';
import type { SourceRect } from '../hooks/useLightbox';
import CodeArt from './CodeArt';
import { gsap, FULL_MOTION_QUERY } from '../lib/gsap';

type Props = {
  project: Project | null;
  idx: number | null;
  sourceRect: SourceRect;
  onClose: () => void;
};

export default function Lightbox({ project, idx, sourceRect, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const backdropRef = useRef<HTMLDivElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const open = project !== null && idx !== null;
  const [mounted, setMounted] = useState(open);

  // Keep mounted during exit animation.
  useEffect(() => {
    if (open) setMounted(true);
  }, [open]);

  // Open: FLIP-style morph from source rect → natural panel rect.
  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);

    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) return () => removeEventListener('keydown', onKey);

    const mm = gsap.matchMedia();
    mm.add(FULL_MOTION_QUERY, () => {
      gsap.killTweensOf([panel, backdrop]);
      gsap.fromTo(
        backdrop,
        { opacity: 0 },
        { opacity: 1, duration: 0.35, ease: 'power2.out' },
      );

      const panelRect = panel.getBoundingClientRect();
      if (sourceRect && panelRect.width > 0 && panelRect.height > 0) {
        const dx = sourceRect.left + sourceRect.width / 2 - (panelRect.left + panelRect.width / 2);
        const dy = sourceRect.top + sourceRect.height / 2 - (panelRect.top + panelRect.height / 2);
        const sx = sourceRect.width / panelRect.width;
        const sy = sourceRect.height / panelRect.height;
        gsap.fromTo(
          panel,
          { x: dx, y: dy, scaleX: sx, scaleY: sy, opacity: 0.4, transformOrigin: 'center center' },
          {
            x: 0,
            y: 0,
            scaleX: 1,
            scaleY: 1,
            opacity: 1,
            duration: 0.65,
            ease: 'power4.out',
          },
        );
      } else {
        gsap.fromTo(
          panel,
          { opacity: 0, scale: 0.9, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
        );
      }

      const body = panel.querySelector<HTMLElement>('.lb-body');
      const art = panel.querySelector<HTMLElement>('.lb-art');
      const close = panel.querySelector<HTMLElement>('.lb-close');
      const bodyKids = body ? Array.from(body.children) as HTMLElement[] : [];

      let detachSpot: (() => void) | null = null;
      if (art) {
        gsap.fromTo(art, { opacity: 0 }, { opacity: 1, duration: 0.4, delay: 0.15 });

        // Pointer-tracked spotlight on the art panel. quickSetters write the CSS
        // custom props directly, no tween allocation per pointermove (rule 10).
        const setX = gsap.quickSetter(art, '--spot-x', 'px');
        const setY = gsap.quickSetter(art, '--spot-y', 'px');
        const onPointer = (ev: PointerEvent) => {
          const r = art.getBoundingClientRect();
          setX(ev.clientX - r.left);
          setY(ev.clientY - r.top);
        };
        art.addEventListener('pointermove', onPointer, { passive: true });
        gsap.fromTo(
          art,
          { '--spot-size': '0px' },
          { '--spot-size': '600px', duration: 0.55, ease: 'power3.out', delay: 0.2 },
        );
        detachSpot = () => art.removeEventListener('pointermove', onPointer);
      }
      if (bodyKids.length) {
        gsap.fromTo(
          bodyKids,
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.45, stagger: 0.06, delay: 0.2 },
        );
      }
      if (close) {
        gsap.fromTo(
          close,
          { opacity: 0, rotate: -90, scale: 0 },
          { opacity: 1, rotate: 0, scale: 1, duration: 0.4, ease: 'back.out(2)', delay: 0.3 },
        );
      }

      return () => {
        detachSpot?.();
      };
    });

    return () => {
      removeEventListener('keydown', onKey);
      mm.revert();
    };
  }, [open, onClose, sourceRect]);

  // Close: reverse-ish exit, then unmount.
  useEffect(() => {
    if (open || !mounted) return;
    const panel = panelRef.current;
    const backdrop = backdropRef.current;
    if (!panel || !backdrop) {
      setMounted(false);
      return;
    }
    const mm = gsap.matchMedia();
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      setMounted(false);
    };
    mm.add(FULL_MOTION_QUERY, () => {
      gsap.killTweensOf([panel, backdrop]);
      gsap.to(backdrop, { opacity: 0, duration: 0.3 });

      if (sourceRect) {
        const panelRect = panel.getBoundingClientRect();
        const dx = sourceRect.left + sourceRect.width / 2 - (panelRect.left + panelRect.width / 2);
        const dy = sourceRect.top + sourceRect.height / 2 - (panelRect.top + panelRect.height / 2);
        const sx = sourceRect.width / panelRect.width;
        const sy = sourceRect.height / panelRect.height;
        gsap.to(panel, {
          x: dx,
          y: dy,
          scaleX: sx,
          scaleY: sy,
          opacity: 0,
          duration: 0.45,
          ease: 'power3.in',
          onComplete: finish,
        });
      } else {
        gsap.to(panel, {
          opacity: 0,
          scale: 0.9,
          y: 10,
          duration: 0.3,
          onComplete: finish,
        });
      }
    });
    mm.add('(prefers-reduced-motion: reduce)', () => {
      gsap.to([panel, backdrop], { opacity: 0, duration: 0.15, onComplete: finish });
    });
    return () => {
      mm.revert();
      finish();
    };
  }, [open, mounted, sourceRect]);

  if (!mounted) return null;

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="lb open"
      id="lb"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      ref={backdropRef}
      onClick={onBackdropClick}
    >
      <div className="lb-panel" ref={panelRef}>
        <span className="tape" aria-hidden="true" />
        <button
          className="lb-close"
          id="lbClose"
          aria-label="Close"
          ref={closeBtnRef}
          onClick={onClose}
        >
          ×
        </button>
        <div className="grid">
          <div className="lb-art" id="lbArt">
            {idx !== null ? <CodeArt idx={idx} /> : null}
          </div>
          <div className="lb-body">
            <div className="kicker" id="lbKicker">
              {project ? `GITHUB · ${project.language}` : ''}
            </div>
            <h3 id="lb-title">{project?.name ?? ''}</h3>
            <p id="lbBlurb">{project?.description ?? ''}</p>
            <div style={{ marginTop: 10 }}>
              <p
                style={{
                  margin: 0,
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.1em',
                  textTransform: 'uppercase',
                  color: 'var(--ink-soft)',
                }}
              >
                Language
              </p>
              <p id="lbLang" style={{ margin: '4px 0 0', color: 'var(--ink)' }}>
                {project?.language ?? ''}
              </p>
            </div>
            <div style={{ marginTop: 12 }}>
              <a
                id="lbLink"
                href={project?.url ?? '#'}
                target="_blank"
                rel="noopener"
                style={{
                  display: 'inline-block',
                  padding: '8px 12px',
                  background: 'var(--green)',
                  color: 'var(--paper)',
                  borderRadius: 4,
                  textDecoration: 'none',
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.1em',
                }}
              >
                → View on GitHub
              </a>
            </div>
            {project?.extras?.length ? (
              <div id="lbExtras" style={{ marginTop: 14 }}>
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'var(--mono)',
                    fontSize: 11,
                    letterSpacing: '.1em',
                    textTransform: 'uppercase',
                    color: 'var(--ink-soft)',
                  }}
                >
                  More on this project
                </p>
                <ul
                  id="lbExtrasList"
                  style={{
                    margin: '6px 0 0',
                    paddingLeft: 16,
                    fontFamily: 'var(--serif)',
                    fontSize: '.95rem',
                    lineHeight: 1.6,
                  }}
                >
                  {project.extras.map((x) => (
                    <li key={x.url}>
                      <a
                        href={x.url}
                        target="_blank"
                        rel="noopener"
                        style={{ color: 'var(--green)' }}
                      >
                        {x.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
