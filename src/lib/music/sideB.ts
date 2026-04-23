/**
 * Side B — "Lab Nocturne"
 * 60 BPM · D dorian · 16-bar loop · ambient experimental.
 *
 * Chord progression (4 bars each): Dm9 — Fmaj9 — Am11 — Gm9
 *
 * Music-design notes:
 *  - Pad has its own slow filter LFO ("breathing"), gated by reduced-motion.
 *  - Generative pentatonic arp on a deterministic-hash schedule (~16% per
 *    16th step) with octave coin flip and a sparser counter-melody two
 *    octaves up at lower probability.
 *  - Reverse-swell: pad re-strikes on the upbeat into bars 4/8/12/16
 *    with a long attack so it crests at the downbeat.
 *  - subDrone has built-in ±6¢ detune sway over 30 s for slow motion.
 *  - Sends: pad + bells go heavy on plate reverb; drone is dry to keep
 *    the low end clean.
 */

import * as Tone from 'tone';
import { startScheduler } from './scheduler';
import {
  fmBell,
  sawPad,
  subDrone,
  type Sends,
} from './instruments';
import { makePingPong, makePlateReverb } from './effects';
import { chord, noteToMidi } from './tuning';
import type { Composition } from './sideA';

const BPM = 60;
const STEPS_PER_BAR = 16;
const BARS = 16;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

const CHORDS = [
  chord('D3', [0, 7, 10, 14, 17]), // Dm9
  chord('F3', [0, 7, 11, 14, 19]), // Fmaj9-ish open
  chord('A2', [0, 7, 10, 14, 17]), // Am11
  chord('G2', [0, 7, 10, 14, 17]), // Gm9
];
const DRONE_ROOTS = [
  noteToMidi('D2'),
  noteToMidi('F2'),
  noteToMidi('A1'),
  noteToMidi('G1'),
];
const ARP_POOLS = [
  ['D', 'F', 'G', 'A', 'C'].map((n) => noteToMidi(n + '4')),
  ['F', 'G', 'A', 'C', 'D'].map((n) => noteToMidi(n + '4')),
  ['A', 'C', 'D', 'E', 'G'].map((n) => noteToMidi(n + '4')),
  ['G', 'Bb', 'C', 'D', 'F'].map((n) => noteToMidi(n + '4')),
];

/** Same hash as Side A — deterministic so flipping back and forth is
 *  identical instead of randomly drifting. */
function hash01(seed: number): number {
  let x = (seed | 0) ^ 0x9e3779b1;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return ((x >>> 0) % 10000) / 10000;
}

export function composeSideB(bus: Tone.ToneAudioNode): Composition {
  const reverb = makePlateReverb(3.6, 0.04);
  const delay = makePingPong('4n.', 0.42);
  reverb.output.connect(bus);
  delay.output.connect(bus);

  const padSends: Sends = {
    reverb: { node: reverb, amount: 0.55 },
  };
  const bellSends: Sends = {
    reverb: { node: reverb, amount: 0.6 },
    delay: { node: delay, amount: 0.32 },
  };

  const padV = sawPad({ dest: bus, sends: padSends });
  const droneV = subDrone({ dest: bus });
  const bellV = fmBell({ dest: bus, sends: bellSends });
  const counterV = fmBell({ dest: bus, sends: bellSends });

  let reduced = false;

  const onStep = (time: number, absStep: number) => {
    const step = ((absStep % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const inBarStep = step % STEPS_PER_BAR;
    const section = Math.floor(bar / 4) % CHORDS.length;

    // Chord change — fire at the start of every 4-bar section.
    if (bar % 4 === 0 && inBarStep === 0) {
      CHORDS[section].forEach((midi, i) => {
        padV.trigger(time + i * 0.03, midi, 0.5);
      });
      droneV.trigger(time, DRONE_ROOTS[section], 0.5);
      bellV.trigger(time + 0.02, DRONE_ROOTS[section] + 36, 0.42);
    }

    // Reverse swell: re-trigger the chord on bar (sectionEnd-1) step 12,
    // crests into the downbeat. Skipped under reduced-motion.
    if (!reduced && bar % 4 === 3 && inBarStep === 12) {
      // Top voice only — dramatic but not muddy.
      const top = CHORDS[section][CHORDS[section].length - 1];
      padV.trigger(time, top, 0.42);
    }

    // Generative pentatonic arp — 16th grid, deterministic ~16% probability.
    if (hash01(bar * STEPS_PER_BAR + step) < 0.16) {
      const pool = ARP_POOLS[section];
      const idx = Math.floor(hash01(bar * STEPS_PER_BAR + step + 7) * pool.length);
      const basePitch = pool[idx] ?? pool[0];
      const octaveShift = hash01(bar * STEPS_PER_BAR + step + 11) < 0.5 ? 0 : 12;
      bellV.trigger(time, basePitch + octaveShift, 0.28 + hash01(bar * 16 + step + 13) * 0.15);
    }

    // Sparse counter-melody — two octaves up, half the density, weighted
    // toward the second half of each section. Skipped under reduced-motion.
    if (!reduced) {
      const sectionStep = (bar % 4) * STEPS_PER_BAR + inBarStep;
      const probability = sectionStep > 32 ? 0.08 : 0.04;
      if (hash01(bar * STEPS_PER_BAR + step + 23) < probability) {
        const pool = ARP_POOLS[section];
        const idx = Math.floor(hash01(bar * STEPS_PER_BAR + step + 29) * pool.length);
        const basePitch = pool[idx] ?? pool[0];
        counterV.trigger(time, basePitch + 24, 0.22 + hash01(bar * 16 + step + 31) * 0.12);
      }
    }
  };

  const sched = startScheduler(BPM, 4, onStep);
  return {
    stop: () => sched.stop(),
    setRate: (m: number) => sched.setBpm(BPM * m),
    setReducedMotion: (r: boolean) => {
      reduced = r;
      padV.setBreath(r ? 0 : 1);
    },
    dispose: () => {
      padV.dispose();
      droneV.dispose();
      bellV.dispose();
      counterV.dispose();
      reverb.dispose();
      delay.dispose();
    },
  };
}
