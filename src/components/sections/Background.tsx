import { useRef, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';
import { createReveal } from '../../lib/scrollReveal';
import { attachInkBleed } from '../../lib/inkBleed';

const bigCard = (rotate: string): CSSProperties => ({
  background: 'var(--paper)',
  border: '1.5px solid var(--ink)',
  padding: 24,
  transform: `rotate(${rotate})`,
  boxShadow: '6px 7px 0 var(--ink)',
});

const smallCard = (rotate: string): CSSProperties => ({
  background: 'var(--paper)',
  border: '1.25px solid var(--ink)',
  padding: '14px 16px',
  transform: `rotate(${rotate})`,
  boxShadow: '4px 5px 0 var(--ink)',
});

const row: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: 12,
  flexWrap: 'wrap',
  gap: 10,
};

const rowCompact: CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'baseline',
  marginBottom: 6,
  flexWrap: 'wrap',
  gap: 8,
};

const h3: CSSProperties = { fontFamily: 'var(--display)', fontSize: '1.6rem', margin: 0 };
const h3Small: CSSProperties = { fontFamily: 'var(--display)', fontSize: '1.2rem', margin: 0 };

const date: CSSProperties = {
  fontFamily: 'var(--mono)',
  fontSize: 11,
  color: 'var(--ink-soft)',
};

const role: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: 12,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: 'var(--green)',
};

const roleEdu: CSSProperties = { ...role, color: 'var(--blue)' };

const roleSmall: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: 11,
  textTransform: 'uppercase',
  letterSpacing: '.1em',
  color: 'var(--green)',
};

const roleSmallEdu: CSSProperties = { ...roleSmall, color: 'var(--blue)' };

const body: CSSProperties = { margin: '10px 0 0', color: 'var(--ink-soft)' };
const bodySmall: CSSProperties = { margin: '6px 0 0', color: 'var(--ink-soft)', fontSize: '.95rem' };

const smallGrid: CSSProperties = {
  display: 'grid',
  gap: 20,
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  marginTop: 4,
};

export default function Background() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const bigCards = root.querySelectorAll<HTMLElement>('[data-bg-big]');
      const smallCards = root.querySelectorAll<HTMLElement>('[data-bg-small]');
      const bigRotations = [-0.8, 0.9, -0.4];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;
        let cleanupBleed: (() => void) | null = null;

        if (stamp) {
          createReveal(
            stamp,
            { opacity: 0, rotate: 10, scale: 0.8 },
            { opacity: 1, rotate: -3, scale: 1, duration: 0.6, ease: 'back.out(2)' },
            { trigger: root, start: 'top 75%' },
          );
        }

        if (headline) {
          split = new SplitText(headline, { type: 'words,chars' });
          createReveal(
            split.words,
            { opacity: 0, yPercent: 100 },
            { opacity: 1, yPercent: 0, duration: 0.8, stagger: 0.04, ease: 'power4.out' },
            { trigger: headline, start: 'top 80%' },
          );
          cleanupBleed = attachInkBleed(headline, 'background');
        }

        if (dek) {
          createReveal(
            dek,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.6 },
            { trigger: dek, start: 'top 85%' },
          );
        }

        return () => {
          split?.revert();
          cleanupBleed?.();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        bigCards.forEach((el, i) => {
          const target = bigRotations[i] ?? 0;
          createReveal(
            el,
            {
              opacity: 0,
              y: 40,
              rotate: target + (i % 2 === 0 ? -8 : 8),
              scale: 0.94,
            },
            {
              opacity: 1,
              y: 0,
              rotate: target,
              scale: 1,
              duration: 0.9,
              ease: 'back.out(1.4)',
              delay: i * 0.08,
            },
            { trigger: el, start: 'top 82%' },
          );
        });

        smallCards.forEach((el, i) => {
          const target = i % 2 === 0 ? -0.4 : 0.5;
          createReveal(
            el,
            { opacity: 0, y: 24, rotate: target + (i % 2 === 0 ? -4 : 4), scale: 0.96 },
            {
              opacity: 1,
              y: 0,
              rotate: target,
              scale: 1,
              duration: 0.7,
              ease: 'back.out(1.3)',
              delay: i * 0.05,
            },
            { trigger: el, start: 'top 88%' },
          );
        });
      });

      mm.add(MOBILE_QUERY, () => {
        bigCards.forEach((el, i) => {
          const target = bigRotations[i] ?? 0;
          const startRotate = target + (i % 2 === 0 ? -4 : 4);
          createReveal(
            el,
            { opacity: 0, y: 50, rotate: startRotate, scale: 0.92 },
            {
              opacity: 1,
              y: 0,
              rotate: target,
              scale: 1,
              duration: 0.75,
              ease: 'back.out(1.3)',
            },
            { trigger: el, start: 'top 92%' },
          );
        });

        smallCards.forEach((el, i) => {
          const target = i % 2 === 0 ? -0.3 : 0.3;
          createReveal(
            el,
            { opacity: 0, y: 30, rotate: target + (i % 2 === 0 ? -3 : 3) },
            {
              opacity: 1,
              y: 0,
              rotate: target,
              duration: 0.6,
              ease: 'back.out(1.2)',
            },
            { trigger: el, start: 'top 94%' },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="background" ref={rootRef}>
      <div className="folio">
        <b>02</b> // BACKGROUND
      </div>
      <span className="stamp">BACKGROUND</span>
      <h2 className="headline">
        I work on the <em>interesting</em> things, and there are a lot of them.
      </h2>
      <p className="dek">Building, engineering, designing, composing.</p>

      <div
        aria-label="Card legend"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: 18,
          marginTop: 24,
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '.12em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
        }}
      >
        <span>
          <span aria-hidden="true" style={{ color: 'var(--green)', marginRight: 6 }}>●</span>
          Experience
        </span>
        <span>
          <span aria-hidden="true" style={{ color: 'var(--blue)', marginRight: 6 }}>◆</span>
          Education
        </span>
      </div>

      <div style={{ marginTop: 24, display: 'grid', gap: 32 }}>
        <div data-bg-big style={bigCard('-.8deg')}>
          <div style={row}>
            <h3 style={h3}>
              Joomsy{' '}
              <a
                href="https://www.joomsy.com"
                target="_blank"
                rel="noopener"
                style={{
                  fontFamily: 'var(--mono)',
                  fontSize: 11,
                  letterSpacing: '.1em',
                  color: 'var(--green)',
                  textDecoration: 'none',
                  marginLeft: 8,
                }}
              >
                joomsy.com →
              </a>
            </h3>
            <span style={date}>May 2025 – Present</span>
          </div>
          <p style={role}><span aria-hidden="true">● </span>Software Engineer, Full-Stack</p>
          <p style={body}>
            Early-stage startup. Small team. I lead full-stack architecture and
            database design, plus the deploy pipeline and the infrastructure it runs
            on. I work across every layer: frontend, backend, and everything in between.
          </p>
        </div>

        <div data-bg-big style={bigCard('.9deg')}>
          <div style={row}>
            <h3 style={h3}>Self-directed work</h3>
            <span style={date}>Ongoing</span>
          </div>
          <p style={role}><span aria-hidden="true">● </span>Builder / Maker</p>
          <p style={body}>
            A lot of my work happens on my own time, across many areas: full-stack,
            DevOps, product design, creative coding, game dev, and music tools. Some
            of it shows up in{' '}
            <a href="#mixtape" style={{ color: 'var(--green)' }}>
              the mixtape
            </a>{' '}
            or on{' '}
            <a
              href="https://github.com/barmoshe"
              target="_blank"
              rel="noopener"
              style={{ color: 'var(--green)' }}
            >
              GitHub
            </a>
            .
          </p>
        </div>

        <div data-bg-big style={bigCard('-.4deg')}>
          <div style={row}>
            <h3 style={h3}>Afeka</h3>
            <span style={date}>Oct 2020 – Aug 2023</span>
          </div>
          <p style={roleEdu}><span aria-hidden="true">◆ </span>B.S. Computer Science</p>
          <p style={body}>
            A wide range, from low-level assembly to .NET, on top of foundational
            coursework in operating systems, data structures, and algorithms.
          </p>
        </div>

        <div style={smallGrid}>
          <div data-bg-small style={smallCard('-.3deg')}>
            <div style={rowCompact}>
              <h3 style={h3Small}>Wochit</h3>
              <span style={date}>Oct 2021 – Present</span>
            </div>
            <p style={roleSmall}><span aria-hidden="true">● </span>Customer Support Engineer</p>
            <p style={bodySmall}>
              Frontline support and dev-team liaison for a cloud video editor at scale.
            </p>
          </div>

          <div data-bg-small style={smallCard('.4deg')}>
            <div style={rowCompact}>
              <h3 style={h3Small}>Wix, Tel Aviv</h3>
              <span style={date}>Workshop</span>
            </div>
            <p style={roleSmallEdu}><span aria-hidden="true">◆ </span>DevOps Workshop</p>
            <p style={bodySmall}>
              Hands-on with EKS, Kubernetes, Terraform, microservices.
            </p>
          </div>

          <div data-bg-small style={smallCard('-.2deg')}>
            <div style={rowCompact}>
              <h3 style={h3Small}>Coding Academy</h3>
              <span style={date}>Bootcamp</span>
            </div>
            <p style={roleSmallEdu}><span aria-hidden="true">◆ </span>Full-Stack Bootcamp</p>
            <p style={bodySmall}>
              Intensive Node / React / MongoDB course for students with prior coding
              experience.
            </p>
          </div>

          <div data-bg-small style={smallCard('.3deg')}>
            <div style={rowCompact}>
              <h3 style={h3Small}>BPM College</h3>
              <span style={date}>Feb 2019 – Aug 2019</span>
            </div>
            <p style={roleSmallEdu}><span aria-hidden="true">◆ </span>Ableton Certification</p>
            <p style={bodySmall}>
              My first certification. Ableton Live and music theory.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
