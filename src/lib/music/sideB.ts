/**
 * Side B — "Lab Nocturne"
 * 60 BPM · D dorian · 16-bar loop · ambient experimental.
 *
 * Chord progression (4 bars each): Dm9 — Fmaj9 — Am11 — Gm9
 * No drums. Detuned saw pad + sub drone + generative pentatonic arps + FM bells.
 * The pad's built-in ±7-cent detune across 3 saw voices supplies the
 * worn-tape wow; no extra LFO needed.
 */

import { startScheduler } from './scheduler';
import { fmBell, sawPad, subDrone } from './instruments';
import { chord, noteToMidi } from './tuning';

const BPM = 60;
const STEPS_PER_BAR = 16;
const BARS = 16;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

// Four chord voicings, one per 4-bar section.
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

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

import type { Composition } from './sideA';

export function composeSideB(ctx: AudioContext, bus: AudioNode): Composition {
  const padVoice = sawPad(ctx, bus);
  const droneVoice = subDrone(ctx, bus);
  const bellVoice = fmBell(ctx, bus);

  const onStep = (time: number, absStep: number) => {
    const step = ((absStep % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const inBarStep = step % STEPS_PER_BAR;
    const section = Math.floor(bar / 4) % CHORDS.length;

    // Chord change — fire at the start of every 4-bar section.
    if (bar % 4 === 0 && inBarStep === 0) {
      CHORDS[section].forEach((midi, i) => {
        padVoice.trigger(time + i * 0.03, midi, 0.55);
      });
      droneVoice.trigger(time, DRONE_ROOTS[section], 0.5);
      bellVoice.trigger(time + 0.02, DRONE_ROOTS[section] + 36, 0.4);
    }

    // Generative arp — 16th-note grid, ~18% hit probability, octave coin flip.
    if (Math.random() < 0.18) {
      const pool = ARP_POOLS[section];
      const basePitch = pick(pool);
      const octaveShift = Math.random() < 0.5 ? 0 : 12;
      bellVoice.trigger(time, basePitch + octaveShift, 0.3 + Math.random() * 0.15);
    }
  };

  const sched = startScheduler(ctx, BPM, 4, onStep);
  return {
    stop: () => sched.stop(),
    setRate: (m: number) => sched.setBpm(BPM * m),
  };
}
