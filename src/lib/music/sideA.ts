/**
 * Side A — "Confident Sunday"
 * 78 BPM · F major · 8-bar loop · jazzy lo-fi hip-hop.
 *
 * Chord progression (2 bars each): Fmaj7 — Am7 — Dm7 — B♭maj7
 * Structure: 4 chords × 2 bars = 8 bars, 16 steps per bar, 128 steps total.
 */

import { startScheduler, type Scheduler } from './scheduler';
import {
  fmBell,
  fmEPiano,
  hat,
  kick,
  rim,
  snare,
  subBass,
} from './instruments';
import { chord, noteToMidi } from './tuning';

const BPM = 78;
const STEPS_PER_BAR = 16;
const BARS = 8;
const TOTAL_STEPS = STEPS_PER_BAR * BARS;

// Fmaj7 / Am7 / Dm7 / Bbmaj7, one voicing per bar-pair, rooted around middle.
const CHORDS = [
  chord('F3', [0, 4, 7, 11]), // Fmaj7
  chord('A3', [0, 3, 7, 10]), // Am7
  chord('D3', [0, 3, 7, 10]), // Dm7
  chord('Bb2', [0, 4, 7, 11]), // Bbmaj7
];
const BASS_ROOTS = [noteToMidi('F2'), noteToMidi('A2'), noteToMidi('D2'), noteToMidi('Bb1')];

// 4-bar melody phrase in F pentatonic, step positions (0..63).
// Variation pass (bars 4-7) swaps note 3.
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

// Swing: delay off-8ths (steps whose 16th-position % 2 === 1) by a tiny
// fraction of a step duration. 55% swing → delay = (0.55 - 0.5) × 2 × stepDur.
const SWING = 0.1;

export function composeSideA(ctx: AudioContext, bus: AudioNode): () => void {
  const kickVoice = kick(ctx, bus);
  const snareVoice = snare(ctx, bus);
  const hatVoice = hat(ctx, bus);
  const rimVoice = rim(ctx, bus);
  const bassVoice = subBass(ctx, bus);
  const pianoVoice = fmEPiano(ctx, bus);
  const melodyVoice = fmBell(ctx, bus);

  const stepSec = 60 / BPM / 4; // 16th-note seconds

  const onStep = (time: number, absStep: number) => {
    const step = ((absStep % TOTAL_STEPS) + TOTAL_STEPS) % TOTAL_STEPS;
    const inBarStep = step % STEPS_PER_BAR;
    const bar = Math.floor(step / STEPS_PER_BAR);
    const chordIdx = Math.floor(bar / 2) % CHORDS.length;
    const t = time + (inBarStep % 2 === 1 ? SWING * stepSec : 0);

    // Chord stab on beat 1 of each bar.
    if (inBarStep === 0) {
      CHORDS[chordIdx].forEach((midi, i) => {
        pianoVoice.trigger(time + i * 0.004, midi, 0.6);
      });
    }

    // Bass — root on step 0, octave up on step 8, fifth on step 12.
    if (inBarStep === 0) bassVoice.trigger(time, BASS_ROOTS[chordIdx], 0.7);
    else if (inBarStep === 8) bassVoice.trigger(time, BASS_ROOTS[chordIdx] + 12, 0.55);
    else if (inBarStep === 12) bassVoice.trigger(time, BASS_ROOTS[chordIdx] + 7, 0.5);

    // Drums.
    // Kick: 0, 8, + ghost on 6.
    if (inBarStep === 0 || inBarStep === 8) kickVoice.trigger(t, 1);
    else if (inBarStep === 6) kickVoice.trigger(t, 0.32);
    // Snare: 4, 12.
    if (inBarStep === 4 || inBarStep === 12) snareVoice.trigger(t, 0.65);
    // Hat: every other step with velocity dither.
    if (inBarStep % 2 === 0) {
      const v = 0.28 + Math.random() * 0.12;
      hatVoice.trigger(t, v);
    }
    // Rim: 8% chance on off-beats.
    if (inBarStep % 4 !== 0 && Math.random() < 0.08) {
      rimVoice.trigger(t, 0.35);
    }

    // Melody — bars 0-3 base, bars 4-7 variation.
    const melody = bar < 4 ? MELODY_BASE : MELODY_VAR;
    const phraseStep = step % (STEPS_PER_BAR * 4);
    for (const note of melody) {
      if (note.step === phraseStep) {
        melodyVoice.trigger(t, note.midi, note.vel ?? 0.55);
      }
    }

  };

  const sched: Scheduler = startScheduler(ctx, BPM, 4, onStep);
  return () => sched.stop();
}
