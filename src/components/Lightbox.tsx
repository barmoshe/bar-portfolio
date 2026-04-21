import { useEffect, useRef } from 'react';
import type { Project } from '../data/portfolio';
import CodeArt from './CodeArt';

type Props = {
  project: Project | null;
  idx: number | null;
  onClose: () => void;
};

export default function Lightbox({ project, idx, onClose }: Props) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);
  const open = project !== null && idx !== null;

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    addEventListener('keydown', onKey);
    return () => removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const onBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className={`lb${open ? ' open' : ''}`}
      id="lb"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lb-title"
      onClick={onBackdropClick}
    >
      <div className="lb-panel">
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
            {open && idx !== null ? <CodeArt idx={idx} /> : null}
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
