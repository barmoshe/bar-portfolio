import { useRef } from 'react';
import { iconFor, projects, shortDesc } from '../../data/portfolio';
import {
  gsap,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { attachInkBleed } from '../../lib/inkBleed';

type Props = { onOpen: (idx: number) => void };

export default function Repos({ onOpen }: Props) {
  const rootRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      const grid = gridRef.current;
      if (!root || !grid) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const cards = Array.from(grid.children) as HTMLElement[];
      const nums = grid.querySelectorAll<HTMLElement>('.num');
      const cta = root.querySelector<HTMLElement>('.gh-cta');

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (stamp) {
          gsap.set(stamp, { opacity: 0, rotate: 10, scale: 0.8 });
          gsap.to(stamp, {
            opacity: 1,
            rotate: -3,
            scale: 1,
            duration: 0.6,
            ease: 'back.out(2)',
            scrollTrigger: { trigger: root, start: 'top 75%' },
          });
        }

        if (headline) {
          split = new SplitText(headline, { type: 'words' });
          gsap.set(split.words, { opacity: 0, yPercent: 60 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.7,
            stagger: 0.05,
            ease: 'power4.out',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
          cleanupBleed = attachInkBleed(headline, 'repos');
        }

        if (cta) {
          gsap.set(cta, { opacity: 0, y: 24 });
          gsap.to(cta, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            scrollTrigger: { trigger: cta, start: 'top 88%' },
          });
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        if (cards.length) {
          gsap.set(cards, { opacity: 0, y: 36, scale: 0.96 });
          gsap.to(cards, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
            scrollTrigger: { trigger: grid, start: 'top 80%' },
          });
        }

        if (nums.length) {
          gsap.set(nums, { opacity: 0, rotate: -180, scale: 0 });
          gsap.to(nums, {
            opacity: 1,
            rotate: 8,
            scale: 1,
            duration: 0.7,
            stagger: 0.1,
            ease: 'back.out(2.5)',
            delay: 0.3,
            scrollTrigger: { trigger: grid, start: 'top 80%' },
          });
        }
      });

      mm.add(MOBILE_QUERY, () => {
        cards.forEach((el, i) => {
          const num = el.querySelector<HTMLElement>('.num');
          const xFrom = i % 2 === 0 ? -24 : 24;
          gsap.set(el, { opacity: 0, x: xFrom, y: 50, scale: 0.92 });
          if (num) gsap.set(num, { opacity: 0, scale: 0.4, rotate: -90 });

          const tl = gsap.timeline({
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
          tl.to(el, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.7,
            ease: 'back.out(1.4)',
          });
          if (num) {
            tl.to(
              num,
              {
                opacity: 1,
                scale: 1,
                rotate: 8,
                duration: 0.55,
                ease: 'back.out(2.5)',
              },
              '-=0.4',
            );
          }
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="repos" ref={rootRef}>
      <div className="folio">
        <b>04</b> // REPOS
      </div>
      <span className="stamp">ON GITHUB</span>
      <h2 className="headline">
        A few of the <em>many things</em> I've built.
      </h2>
      <div className="clip" id="proj-grid" ref={gridRef} style={{ marginTop: 28 }}>
        {projects.map((p, i) => (
          <article
            key={p.name}
            className="ink-peelable"
            data-idx={i}
            data-flip-id={`repo-${i}`}
            data-magnet
            tabIndex={0}
            role="button"
            aria-label={p.name}
            onClick={() => onOpen(i)}
          >
            <span className="num" aria-hidden="true">
              {String(i + 1).padStart(2, '0')}
            </span>
            <header className="head">
              <span className="dots" aria-hidden="true">
                <i />
                <i />
                <i />
              </span>
              <span className="path">~/{p.name}</span>
            </header>
            <div className="body">
              <div className="meta">
                <span className="glyph" aria-hidden="true">
                  {iconFor(p.language)}
                </span>
                <span className="lang">{p.language}</span>
              </div>
              <h3 className="t">{p.name}</h3>
              <p className="d">{shortDesc(p.description)}</p>
              <div className="go">View repo →</div>
            </div>
          </article>
        ))}
      </div>

      <aside
        className="gh-cta"
        style={{
          marginTop: 40,
          background: 'var(--ink)',
          color: 'var(--paper)',
          border: '1.5px solid var(--ink)',
          padding: '22px 26px',
          boxShadow: '6px 8px 0 var(--green)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <p
            style={{
              margin: 0,
              fontFamily: 'var(--mono)',
              fontSize: 10.5,
              letterSpacing: '.25em',
              textTransform: 'uppercase',
              color: 'var(--green)',
            }}
          >
            More on GitHub
          </p>
          <p
            style={{
              margin: '4px 0 0',
              fontFamily: 'var(--serif)',
              color: 'oklch(0.9 0.02 85)',
              fontSize: '.98rem',
            }}
          >
            Experiments, scripts, and half-built ideas - all public.
          </p>
        </div>
        <a
          href="https://github.com/barmoshe"
          target="_blank"
          rel="noopener"
          style={{
            fontFamily: 'var(--mono)',
            fontWeight: 700,
            fontSize: '.95rem',
            letterSpacing: '.06em',
            color: 'var(--ink)',
            background: 'var(--paper)',
            padding: '10px 18px',
            textDecoration: 'none',
            boxShadow: '4px 4px 0 var(--green)',
            whiteSpace: 'nowrap',
          }}
        >
          github.com/barmoshe →
        </a>
      </aside>
    </article>
  );
}
