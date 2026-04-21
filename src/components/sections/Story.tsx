import { useRef } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  FULL_MOTION_QUERY,
  MOBILE_QUERY,
  DESKTOP_QUERY,
} from '../../lib/gsap';

export default function Story() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const rule = root.querySelector<HTMLElement>('.rule');
      const cols = root.querySelectorAll<HTMLElement>('.cols > div');
      const pullquote = root.querySelector<HTMLElement>('.cols + div');
      const listItems = root.querySelectorAll<HTMLElement>('.cols li');

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;

        if (stamp) {
          gsap.set(stamp, { opacity: 0, rotate: 12, scale: 0.8 });
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
          split = new SplitText(headline, { type: 'words,chars' });
          gsap.set(split.words, { opacity: 0, yPercent: 100 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            duration: 0.8,
            stagger: 0.04,
            ease: 'power4.out',
            scrollTrigger: { trigger: headline, start: 'top 80%' },
          });
        }

        if (dek) {
          gsap.set(dek, { opacity: 0, y: 14 });
          gsap.to(dek, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            scrollTrigger: { trigger: dek, start: 'top 85%' },
          });
        }

        if (rule) {
          gsap.set(rule, { scaleX: 0, transformOrigin: 'left center' });
          gsap.to(rule, {
            scaleX: 1,
            duration: 0.9,
            ease: 'power3.inOut',
            scrollTrigger: { trigger: rule, start: 'top 85%' },
          });
        }

        if (pullquote) {
          gsap.set(pullquote, { opacity: 0, y: 22, rotate: 4 });
          gsap.to(pullquote, {
            opacity: 1,
            y: 0,
            rotate: 1.2,
            duration: 0.8,
            ease: 'back.out(1.6)',
            scrollTrigger: { trigger: pullquote, start: 'top 85%' },
          });
        }

        return () => {
          split?.revert();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        if (cols.length) {
          gsap.set(cols, { opacity: 0, y: 20 });
          gsap.to(cols, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            stagger: 0.12,
            scrollTrigger: { trigger: cols[0] ?? root, start: 'top 80%' },
          });
        }

        if (listItems.length) {
          gsap.set(listItems, { opacity: 0, x: -14 });
          gsap.to(listItems, {
            opacity: 1,
            x: 0,
            duration: 0.5,
            stagger: 0.06,
            scrollTrigger: { trigger: listItems[0] ?? root, start: 'top 80%' },
          });
        }
      });

      mm.add(MOBILE_QUERY, () => {
        cols.forEach((col) => {
          gsap.set(col, { opacity: 0, y: 18 });
          gsap.to(col, {
            opacity: 1,
            y: 0,
            duration: 0.55,
            ease: 'power3.out',
            scrollTrigger: { trigger: col, start: 'top 88%' },
          });

          const items = col.querySelectorAll<HTMLElement>('li');
          if (!items.length) return;
          gsap.set(items, { opacity: 0, y: 10 });
          gsap.to(items, {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.07,
            ease: 'power2.out',
            scrollTrigger: { trigger: col, start: 'top 85%' },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="story" ref={rootRef}>
      <div className="folio">
        <b>02</b> // PATH
      </div>
      <span className="stamp">A PATH</span>
      <h2 className="headline">
        Got here by <em>doing things.</em>
      </h2>
      <p className="dek">
        Music school → CS degree → shipping full-stack now. Not a straight line, but a line
        nonetheless.
      </p>
      <hr className="rule" />

      <div className="cols" style={{ marginTop: 32 }}>
        <div>
          <h3>Now</h3>
          <ul>
            <li>
              <strong>Joomsy</strong> - Software Engineer, Full-Stack. May 2025–present.
            </li>
            <li>
              <strong>Wochit</strong> - Customer Support Engineer. Nov 2021–present.
            </li>
          </ul>
        </div>
        <div>
          <h3>Education</h3>
          <ul>
            <li>
              <strong>Afeka</strong> - B.S. Computer Science
            </li>
            <li>
              <strong>Wix</strong> - DevOps Workshop
            </li>
            <li>
              <strong>Coding Academy</strong> - Full-Stack BootCamp
            </li>
            <li>
              <strong>BPM College</strong> - Music
            </li>
          </ul>
        </div>
      </div>

      <div
        style={{
          marginTop: 40,
          background: 'var(--paper)',
          border: '1.5px solid var(--green)',
          padding: 18,
          transform: 'rotate(1.2deg)',
          boxShadow: '5px 6px 0 var(--green)',
        }}
      >
        <p
          style={{
            margin: 0,
            fontFamily: 'var(--mono)',
            fontSize: 12,
            letterSpacing: '.1em',
            textTransform: 'uppercase',
            color: 'var(--ink-soft)',
          }}
        >
          How I work
        </p>
        <p style={{ margin: '10px 0 0', fontStyle: 'italic', color: 'var(--ink)' }}>
          Start small. Ship early. Listen to whoever's using it. Fix what actually matters.
        </p>
      </div>
    </article>
  );
}
