import { useRef, type CSSProperties } from 'react';
import {
  gsap,
  SplitText,
  useGSAP,
  MOBILE_QUERY,
  DESKTOP_QUERY,
  FULL_MOTION_QUERY,
} from '../../lib/gsap';

const trackCard = (rotate: string): CSSProperties => ({
  position: 'relative',
  background: 'var(--paper)',
  border: '1.5px dashed var(--green)',
  padding: 22,
  transform: `rotate(${rotate})`,
  boxShadow: '5px 6px 0 var(--green)',
  minHeight: 220,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
});

const kicker: CSSProperties = {
  margin: 0,
  fontFamily: 'var(--mono)',
  fontSize: 11,
  letterSpacing: '.22em',
  textTransform: 'uppercase',
  color: 'var(--green)',
};

const title: CSSProperties = {
  fontFamily: 'var(--display)',
  fontSize: '1.6rem',
  margin: '8px 0 0',
  lineHeight: 1.05,
};

const desc: CSSProperties = {
  margin: '10px 0 0',
  color: 'var(--ink-soft)',
  fontFamily: 'var(--serif)',
};

const foot = (rotate: string): CSSProperties => ({
  margin: 0,
  fontFamily: 'var(--hand)',
  color: 'var(--green)',
  fontSize: 18,
  transform: `rotate(${rotate})`,
  alignSelf: 'flex-end',
});

export default function Music() {
  const rootRef = useRef<HTMLElement | null>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;
      const stamp = root.querySelector<HTMLElement>('.stamp');
      const headline = root.querySelector<HTMLElement>('.headline');
      const dek = root.querySelector<HTMLElement>('.dek');
      const cards = root.querySelectorAll<HTMLElement>('[data-music-card]');
      const foots = root.querySelectorAll<HTMLElement>('[data-music-foot]');
      const targetRotations = [-1, 1.2, -0.6];

      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION_QUERY, () => {
        let split: SplitText | null = null;

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
          gsap.set(split.words, { opacity: 0, yPercent: 80, rotate: -3 });
          gsap.to(split.words, {
            opacity: 1,
            yPercent: 0,
            rotate: 0,
            duration: 0.7,
            stagger: 0.06,
            ease: 'back.out(1.6)',
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

        foots.forEach((el, i) => {
          gsap.set(el, { opacity: 0, scale: 0.4, y: 10 });
          gsap.to(el, {
            opacity: 1,
            scale: 1,
            y: 0,
            duration: 0.6,
            ease: 'back.out(2.5)',
            delay: 0.3 + i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 90%' },
          });
        });

        return () => {
          split?.revert();
        };
      });

      mm.add(DESKTOP_QUERY, () => {
        cards.forEach((el, i) => {
          const target = targetRotations[i] ?? 0;
          gsap.set(el, { opacity: 0, y: 40, rotate: target - 6, scale: 0.95 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            rotate: target,
            scale: 1,
            duration: 0.85,
            ease: 'back.out(1.5)',
            delay: i * 0.1,
            scrollTrigger: { trigger: el, start: 'top 85%' },
          });
        });
      });

      mm.add(MOBILE_QUERY, () => {
        cards.forEach((el, i) => {
          const target = targetRotations[i] ?? 0;
          const startRotate = target + (i % 2 === 0 ? -5 : 5);
          gsap.set(el, { opacity: 0, y: 55, rotate: startRotate, scale: 0.9 });
          gsap.to(el, {
            opacity: 1,
            y: 0,
            rotate: target,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)',
            scrollTrigger: { trigger: el, start: 'top 92%' },
          });
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <article className="page" id="music" ref={rootRef}>
      <div className="folio">
        <b>05</b> // OFF-KEYBOARD
      </div>
      <span className="stamp">MUSIC</span>
      <h2 className="headline">
        The other <em>instrument.</em>
      </h2>
      <p className="dek">
        Before the editor, there was a DAW. Music is where a lot of my thinking about
        systems, timing, and craft started - and where it keeps going.
      </p>

      <div
        style={{
          marginTop: 36,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
          gap: 20,
          alignItems: 'stretch',
        }}
      >
        <div data-music-card style={trackCard('-1deg')}>
          <div>
            <p style={kicker}>Track 01 · //TODO</p>
            <h3 style={title}>Coming soon.</h3>
            <p style={desc}>
              Placeholder for an Ableton track. Embed, waveform, or short clip will go here.
            </p>
          </div>
          <p data-music-foot style={foot('-2deg')}>▶ soon.</p>
        </div>

        <div data-music-card style={trackCard('1.2deg')}>
          <div>
            <p style={kicker}>Track 02 · //TODO</p>
            <h3 style={title}>Also soon.</h3>
            <p style={desc}>Another slot for a track or MIDI GPT-generated loop.</p>
          </div>
          <p data-music-foot style={foot('2deg')}>♪ ♪ ♪</p>
        </div>

        <div
          data-music-card
          style={{
            ...trackCard('-.6deg'),
            background: 'var(--ink)',
            color: 'var(--paper)',
            border: '1.5px solid var(--ink)',
          }}
        >
          <div>
            <p style={kicker}>Training</p>
            <h3 style={{ ...title, color: 'var(--paper)' }}>
              Ableton Live 10 - certified user.
            </h3>
            <p style={{ ...desc, color: 'oklch(0.9 0.02 85)' }}>
              Studied music production at <strong>BPM College</strong> (2019). The obsession
              with loops, layering and modular thinking translated straight into how I work
              on software.
            </p>
          </div>
          <p data-music-foot style={foot('-2deg')}>// todo: story.</p>
        </div>
      </div>

      <p
        style={{
          margin: '28px 0 0',
          fontFamily: 'var(--mono)',
          fontSize: 11,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
          color: 'var(--ink-soft)',
        }}
      >
        // TODO - fill this section with real tracks and a short write-up.
      </p>
    </article>
  );
}
