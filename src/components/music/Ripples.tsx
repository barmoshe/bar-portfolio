import { forwardRef, useImperativeHandle, useRef } from 'react';
import { gsap, FULL_MOTION_QUERY } from '../../lib/gsap';
import { PENTATONIC_MIDI } from '../../lib/audio';

export interface RipplesHandle {
  spawn: (midi: number, xPct: number) => void;
}

/** Pitch-keyed ink colors; tokens resolved at runtime so dark mode flips correctly. */
const PITCH_VARS = [
  '--green', '--cyan', '--magenta', '--yellow', '--purple',
  '--green', '--cyan', '--magenta', '--yellow', '--purple',
  '--green', '--cyan', '--magenta',
] as const;

const RING_SIZE = 8;
let motionOk = false;
if (typeof window !== 'undefined') {
  motionOk = window.matchMedia(FULL_MOTION_QUERY).matches;
  window
    .matchMedia(FULL_MOTION_QUERY)
    .addEventListener('change', (e) => (motionOk = e.matches));
}

const Ripples = forwardRef<RipplesHandle>((_props, ref) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const poolRef = useRef<HTMLSpanElement[]>([]);
  const cursorRef = useRef(0);

  useImperativeHandle(ref, () => ({
    spawn(midi, xPct) {
      if (!motionOk) return;
      const root = rootRef.current;
      if (!root) return;

      if (poolRef.current.length < RING_SIZE) {
        for (let i = poolRef.current.length; i < RING_SIZE; i += 1) {
          const span = document.createElement('span');
          span.className = 'synth-ripple';
          span.setAttribute('aria-hidden', 'true');
          root.appendChild(span);
          poolRef.current.push(span);
        }
      }

      const el = poolRef.current[cursorRef.current % RING_SIZE];
      cursorRef.current += 1;

      const idx = PENTATONIC_MIDI.indexOf(midi);
      const tokenName = PITCH_VARS[idx >= 0 ? idx : 0];
      el.style.setProperty(
        'background',
        `color-mix(in oklab, var(${tokenName}) 85%, transparent)`,
      );
      el.style.left = `${xPct}%`;

      gsap.fromTo(
        el,
        { y: 0, scale: 0.6, opacity: 1 },
        {
          y: -32,
          scale: 1.8,
          opacity: 0,
          duration: 0.7,
          ease: 'power1.out',
          overwrite: true,
        },
      );
    },
  }));

  return <div className="synth-ripples" ref={rootRef} aria-hidden="true" />;
});

Ripples.displayName = 'Ripples';
export default Ripples;
