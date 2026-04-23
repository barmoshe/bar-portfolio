/**
 * Side A — "Confident Sunday"
 * 78 BPM · F major · 8-bar loop · jazzy lo-fi hip-hop.
 *
 * Chord progression (2 bars each): Fmaj7 — Am7 — Dm7 — B♭maj7
 * Shell voicings (3-7-9-13) keep the harmony jazzy without thickening.
 *
 * Music-design notes:
 *  - Swing: off-grid 16ths land 12% late, the lo-fi hip-hop pocket.
 *  - Velocity: deterministic hash of `bar*16+step` (not Math.random) so
 *    side flips don't accumulate divergence between identical loops.
 *  - Ghost snares: 18% probability on odd 16ths, −14 dB vs main snares.
 *  - Bass: root + chromatic / scalar passing tones approaching the next
 *    chord change.
 *  - Bar 8: tom + open-hat fill announcing the loop wrap.
 *  - Sends: e-piano + bell go to plate reverb (warm tail), hats to
 *    ping-pong delay (off-beat texture), drums + bass stay dry.
 */

import * as Tone from 'tone';
import { startScheduler, type Scheduler } from './scheduler';
import {
  fmBell,
  fmEPiano,
  hat,
  hatOpen,
  kick,
  rim,
  snare,
  subBass,
  tom,
  type Sends,
} from './instruments';
import { makePingPong, makePlateReverb, type SendBus } from './effects';
import { chord, noteToMidi } from './tuning';

const BPM = 78;
const STEPS_PER_BAR = 16;
const BARS = 8;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;
const SWING = 0.12; // off-8ths land 12% late

// Shell voicings: 3rd, 7th, 9th (and 13th where it fits). Drops the root
// (the bass owns it) so the chord stays open.
const CHORDS = [
  chord('A3', [0, 7, 12, 14]),  // Fmaj7 → 3 (A) – 7 (E) – 9 (G)
  chord('C4', [0, 7, 12, 14]),  // Am7  → 3 (C) – 7 (G) – 9 (B)
  chord('F3', [0, 7, 12, 14]),  // Dm7  → 3 (F) – 7 (C) – 9 (E)
  chord('D3', [0, 7, 12, 14]),  // Bbmaj7 → 3 (D) – 7 (A) – 9 (C)
];
const BASS_ROOTS = [noteToMidi('F2'), noteToMidi('A2'), noteToMidi('D2'), noteToMidi('Bb1')];
// Approach tones — semitone below or scale-wise pickup leading into the next root.
const BASS_APPROACH = [
  noteToMidi('G2'),  // ascending into A
  noteToMidi('C3'),  // descending fifth into D
  noteToMidi('C2'),  // chromatic into Bb (down)
  noteToMidi('E2'),  // descending into F (next loop)
];

const MELODY_BASE: Array<{ step: number; midi: number; vel?: number }> = [
  { step: 0, midi: noteToMidi('A4'), vel: 0.6 },
  { step: 6, midi: noteToMidi('C5'), vel: 0.55 },
  { step: 12, midi: noteToMidi('D5'), vel: 0.65 },
  { step: 20, midi: noteToMidi('C5'), vel: 0.5 },
  { step: 28, midi: noteToMidi('A4'), vel: 0.55 },
  { step: 36, midi: noteToMidi('G4'), vel: 0.6 },
  { step: 44, midi: noteToMidi('F4'), vel: 0.65 },
  { step: 52, midi: noteToMidi('A4'), vel: 0.55 },
];
const MELODY_VAR: Array<{ step: number; midi: number; vel?: number }> = [
  { step: 0, midi: noteToMidi('C5'), vel: 0.6 },
  { step: 8, midi: noteToMidi('D5'), vel: 0.55 },
  { step: 14, midi: noteToMidi('F5'), vel: 0.6 },
  { step: 22, midi: noteToMidi('D5'), vel: 0.55 },
  { step: 30, midi: noteToMidi('C5'), vel: 0.55 },
  { step: 38, midi: noteToMidi('A4'), vel: 0.6 },
  { step: 46, midi: noteToMidi('G4'), vel: 0.55 },
  { step: 54, midi: noteToMidi('F4'), vel: 0.7 },
];

/** Cheap deterministic 0..1 hash. Used for humanization so the same step
 *  always gets the same offset across loops and side flips. */
function hash01(seed: number): number {
  let x = (seed | 0) ^ 0x9e3779b1;
  x = Math.imul(x ^ (x >>> 16), 0x85ebca6b);
  x = Math.imul(x ^ (x >>> 13), 0xc2b2ae35);
  x ^= x >>> 16;
  return ((x >>> 0) % 10000) / 10000;
}

export type Composition = {
  stop: () => void;
  setRate: (multiplier: number) => void;
  setReducedMotion: (r: boolean) => void;
  dispose: () => void;
};

export function composeSideA(bus: Tone.ToneAudioNode): Composition {
  // Per-side sends: own reverb + ping-pong delay so the tails crossfade
  // along with the side gain.
  const reverb = makePlateReverb(2.6, 0.025);
  const delay = makePingPong('8n.', 0.32);
  reverb.output.connect(bus);
  delay.output.connect(bus);

  const sendsTonal: Sends = {
    reverb: { node: reverb, amount: 0.32 },
  };
  const sendsHat: Sends = {
    delay: { node: delay, amount: 0.22 },
  };

  const kickV = kick({ dest: bus });
  const snareV = snare({ dest: bus, sends: { reverb: { node: reverb, amount: 0.16 } } });
  const hatV = hat({ dest: bus, sends: sendsHat });
  const hatOpenV = hatOpen({ dest: bus, sends: sendsHat });
  const tomV = tom({ dest: bus });
  const rimV = rim({ dest: bus });
  const bassV = subBass({ dest: bus });
  const pianoV = fmEPiano({ dest: bus, sends: sendsTonal });
  const bellV = fmBell({ dest: bus, sends: { reverb: { node: reverb, amount: 0.4 } } });

  let reduced = false;
  const stepSec = () => 60 / currentBpm / 4;
  let currentBpm = BPM;

  const onStep = (time: number, absStep: number) => {
    const step = ((absStep % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
    const inBarStep = step % STEPS_PER_BAR;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const chordIdx = Math.floor(bar / 2) % CHORDS.length;
    const nextChordIdx = (chordIdx + 1) % CHORDS.length;
    // Off-8ths swing.
    const t = time + (inBarStep % 2 === 1 ? SWING * stepSec() : 0);
    // Deterministic humanization: ±6% velocity dither.
    const dither = (s: number) => 1 + (hash01(bar * 16 + step + s) - 0.5) * 0.12;

    // Chord stab on beat 1; lighter pad on beat 3 (sustains).
    if (inBarStep === 0) {
      CHORDS[chordIdx].forEach((midi, i) => {
        pianoV.trigger(time + i * 0.005, midi, 0.55 * dither(i));
      });
    }
    if (inBarStep === 8) {
      // Re-strike top voice quietly — keeps the bar feeling alive mid-cycle.
      const top = CHORDS[chordIdx][CHORDS[chordIdx].length - 1];
      pianoV.trigger(time, top, 0.32 * dither(7));
    }

    // Bass: root on 0, octave on 8, fifth on 12; passing-tone walk-up on bar 7.
    const isLastBar = bar === BARS - 1;
    if (inBarStep === 0) bassV.trigger(time, BASS_ROOTS[chordIdx], 0.7 * dither(1));
    else if (inBarStep === 8) bassV.trigger(time, BASS_ROOTS[chordIdx] + 12, 0.55 * dither(2));
    else if (inBarStep === 12) bassV.trigger(time, BASS_ROOTS[chordIdx] + 7, 0.5 * dither(3));
    else if (inBarStep === 14 && (bar % 2 === 1)) {
      // Approach tone leading into the next chord every other bar.
      bassV.trigger(t, BASS_APPROACH[isLastBar ? 0 : nextChordIdx], 0.45 * dither(4));
    }

    // Drums.
    // Kick: 0, 8, ghost on 6 + ghost on 14 (bar-7 only) to push the loop.
    if (inBarStep === 0 || inBarStep === 8) kickV.trigger(t, 1 * dither(5));
    else if (inBarStep === 6) kickV.trigger(t, 0.32 * dither(6));
    else if (bar === BARS - 1 && inBarStep === 14) kickV.trigger(t, 0.55 * dither(7));

    // Snare: 4, 12, plus ghost snares at low velocity on odd 16ths (~18%).
    if (inBarStep === 4 || inBarStep === 12) snareV.trigger(t, 0.65 * dither(8));
    else if (!reduced && inBarStep % 2 === 1 && hash01(bar * 16 + step + 100) < 0.18) {
      snareV.trigger(t, 0.18 * dither(9));
    }

    // Hats: every other step. Bar-8 gets an open-hat lift on step 14.
    if (!reduced && bar === BARS - 1 && inBarStep === 14) {
      hatOpenV.trigger(t, 0.5);
    } else if (inBarStep % 2 === 0) {
      const v = 0.26 + hash01(bar * 16 + step + 200) * 0.14;
      hatV.trigger(t, v);
    }

    // Rim: small chance on odd 8ths (every 4 steps where odd).
    if (!reduced && (inBarStep === 6 || inBarStep === 14)) {
      if (hash01(bar * 16 + step + 300) < 0.16) rimV.trigger(t, 0.32);
    }

    // Tom fill on bar 8 — last 4 steps.
    if (!reduced && bar === BARS - 1 && (inBarStep === 11 || inBarStep === 13 || inBarStep === 15)) {
      tomV.trigger(t, 0.55);
    }

    // Melody — bars 0-3 base, bars 4-7 variation. Suppress on bar 8 to
    // make space for the fill (still allow note on step 0 of bar 0 of next loop).
    const melody = bar < 4 ? MELODY_BASE : MELODY_VAR;
    const phraseStep = step % (STEPS_PER_BAR * 4);
    for (const note of melody) {
      if (note.step === phraseStep) {
        bellV.trigger(t, note.midi, (note.vel ?? 0.55) * dither(10));
      }
    }
  };

  const sched: Scheduler = startScheduler(BPM, 4, onStep);
  return {
    stop: () => sched.stop(),
    setRate: (m: number) => {
      currentBpm = BPM * m;
      sched.setBpm(currentBpm);
    },
    setReducedMotion: (r) => {
      reduced = r;
    },
    dispose: () => {
      kickV.dispose();
      snareV.dispose();
      hatV.dispose();
      hatOpenV.dispose();
      tomV.dispose();
      rimV.dispose();
      bassV.dispose();
      pianoV.dispose();
      bellV.dispose();
      reverb.dispose();
      delay.dispose();
    },
  };
}

// Re-export for sideB.ts to share the type.
export type { SendBus };
