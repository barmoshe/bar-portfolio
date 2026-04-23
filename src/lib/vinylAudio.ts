/**
 * vinylAudio.ts — Tone.js audio engine for the Mixtape section.
 *
 * Architecture (see knowledge/07-mixtape-audio.md for the long version):
 *
 *   musicIn (Compressor + Limiter + Volume) → Destination
 *      ▲                                                  ▲
 *      ├── sideABus → tape wow/flutter → sideAGain ───────┤
 *      ├── sideBBus → tape wow/flutter → sideBGain ───────┤
 *      └── surfaceNoise ─────────────────────────────────┘
 *
 *   sfxIn (Limiter + Volume, no compressor) → Destination
 *      ▲
 *      └── needleDrop / flip / scratch / pop  (parallel — does not pump music)
 *
 * Per-side reverb and ping-pong delay sends live inside `composeSideA` /
 * `composeSideB` so their tails crossfade with the side gain. SFX use Tone
 * synths directly — randomized per call so flips and scratches don't sound
 * identical the second time.
 *
 * State is module-level. The calling component owns localStorage and the
 * visible mute / volume / on-off controls; this module just exposes setters.
 */

import * as Tone from 'tone';
import { composeSideA, type Composition } from './music/sideA';
import { composeSideB } from './music/sideB';
import {
  makeMasterChain,
  makeSurfaceNoise,
  makeTape,
  type MasterChain,
  type Surface,
  type Tape,
} from './music/effects';

let started = false;
let enabled = false;
let reduced = false;
// Cached so the visible UI controls can write before the AudioContext is
// even created — values get applied on first ensure().
let pendingVolume = 0.6;
let pendingMuted = false;

let chain: MasterChain | null = null;
let surface: Surface | null = null;

type SideRig = {
  bus: Tone.Gain;
  tape: Tape;
  gain: Tone.Gain;
  comp: Composition | null;
};
let sideA: SideRig | null = null;
let sideB: SideRig | null = null;

let currentSide: 'A' | 'B' = 'A';
let currentRate = 1;
let bedRunning = false;

const CROSSFADE_S = 0.5;
const FADE_OUT_S = 0.6;

// Reusable SFX synths — built lazily so the AudioContext only spins up
// after the first user gesture. All connect to chain.sfxIn (parallel path).
type SfxKit = {
  needleThump: Tone.MembraneSynth;
  needleClick: Tone.NoiseSynth;
  needleClickFilt: Tone.Filter;
  needleScrape: Tone.NoiseSynth;
  needleScrapeFilt: Tone.Filter;

  flipKnock: Tone.MembraneSynth;
  flipKnockFilt: Tone.Filter;
  flipClick: Tone.NoiseSynth;
  flipClickFilt: Tone.Filter;
  flipSwish: Tone.NoiseSynth;
  flipSwishFilt: Tone.Filter;

  scratchHigh: Tone.NoiseSynth;
  scratchHighFilt: Tone.Filter;
  scratchBody: Tone.NoiseSynth;
  scratchBodyFilt: Tone.Filter;

  pop: Tone.Oscillator;
  popGain: Tone.Gain;
};
let sfx: SfxKit | null = null;

function buildSfx(target: Tone.ToneAudioNode): SfxKit {
  // Needle drop — three layers: a low MembraneSynth thump, a midrange
  // bandpass noise click, and (Side B variant) a settling scrape.
  const needleThump = new Tone.MembraneSynth({
    pitchDecay: 0.06,
    octaves: 3,
    envelope: { attack: 0.003, decay: 0.22, sustain: 0, release: 0.18 },
    volume: -8,
  });
  needleThump.connect(target);

  const needleClick = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.05, sustain: 0, release: 0.04 },
    volume: -16,
  });
  const needleClickFilt = new Tone.Filter({ type: 'bandpass', frequency: 1700, Q: 0.7 });
  needleClick.chain(needleClickFilt, target);

  const needleScrape = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.12, sustain: 0, release: 0.06 },
    volume: -22,
  });
  const needleScrapeFilt = new Tone.Filter({ type: 'lowpass', frequency: 700, Q: 0.5 });
  needleScrape.chain(needleScrapeFilt, target);

  // Flip — wood/plastic chassis knock + bright micro-click + HP swish.
  const flipKnock = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 2,
    envelope: { attack: 0.001, decay: 0.14, sustain: 0, release: 0.08 },
    volume: -12,
  });
  const flipKnockFilt = new Tone.Filter({ type: 'lowpass', frequency: 900, Q: 0.4 });
  flipKnock.chain(flipKnockFilt, target);

  const flipClick = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.0005, decay: 0.02, sustain: 0, release: 0.015 },
    volume: -20,
  });
  const flipClickFilt = new Tone.Filter({ type: 'bandpass', frequency: 4200, Q: 4 });
  flipClick.chain(flipClickFilt, target);

  const flipSwish = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.02, decay: 0.1, sustain: 0, release: 0.06 },
    volume: -22,
  });
  const flipSwishFilt = new Tone.Filter({ type: 'highpass', frequency: 2200, Q: 0.5 });
  flipSwish.chain(flipSwishFilt, target);

  // Scratch — high-frequency BP crackle + low-frequency rubber-friction body.
  const scratchHigh = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.005, decay: 0.18, sustain: 0, release: 0.04 },
    volume: -14,
  });
  const scratchHighFilt = new Tone.Filter({ type: 'bandpass', frequency: 1800, Q: 3.5 });
  scratchHigh.chain(scratchHighFilt, target);

  const scratchBody = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.003, decay: 0.16, sustain: 0, release: 0.06 },
    volume: -16,
  });
  const scratchBodyFilt = new Tone.Filter({ type: 'lowpass', frequency: 240, Q: 0.6 });
  scratchBody.chain(scratchBodyFilt, target);

  // Tiny sine ping (the "horn waveform tick" / runout-groove click).
  const pop = new Tone.Oscillator({ frequency: 880, type: 'sine' });
  const popGain = new Tone.Gain(0);
  pop.chain(popGain, target);
  pop.start();

  return {
    needleThump,
    needleClick,
    needleClickFilt,
    needleScrape,
    needleScrapeFilt,
    flipKnock,
    flipKnockFilt,
    flipClick,
    flipClickFilt,
    flipSwish,
    flipSwishFilt,
    scratchHigh,
    scratchHighFilt,
    scratchBody,
    scratchBodyFilt,
    pop,
    popGain,
  };
}

/** Initialize the master chain + surface noise + SFX. Idempotent.
 *  Must be called after `Tone.start()` (i.e. after a user gesture). */
function ensure(): boolean {
  if (typeof window === 'undefined') return false;
  if (chain) return true;
  if (!started) return false;
  try {
    chain = makeMasterChain();
    surface = makeSurfaceNoise();
    surface.output.connect(chain.musicIn);
    sfx = buildSfx(chain.sfxIn);
    // Apply any pre-gesture UI state.
    chain.setVolume(pendingVolume);
    chain.setMuted(pendingMuted);
  } catch {
    chain = null;
    surface = null;
    sfx = null;
    return false;
  }
  return true;
}

function ensureSide(side: 'A' | 'B'): SideRig | null {
  if (!chain) return null;
  if (side === 'A') {
    if (!sideA) {
      const bus = new Tone.Gain(1);
      const tape = makeTape();
      const gain = new Tone.Gain(side === currentSide ? 1 : 0);
      bus.connect(tape.input);
      tape.output.connect(gain);
      gain.connect(chain.musicIn);
      tape.setIntensity(reduced ? 0 : 1);
      sideA = { bus, tape, gain, comp: null };
    }
    return sideA;
  } else {
    if (!sideB) {
      const bus = new Tone.Gain(1);
      const tape = makeTape();
      const gain = new Tone.Gain(side === currentSide ? 1 : 0);
      bus.connect(tape.input);
      tape.output.connect(gain);
      gain.connect(chain.musicIn);
      tape.setIntensity(reduced ? 0 : 1);
      sideB = { bus, tape, gain, comp: null };
    }
    return sideB;
  }
}

/** Call inside a click / keydown handler to lift the autoplay lock. */
export function unlock(): void {
  if (started) {
    ensure();
    return;
  }
  // Raise scheduler pre-roll so React re-renders and GC pauses don't turn
  // into audible late fires. Cheap, safe to set on the existing context —
  // it's just a number the Tone scheduler reads each tick.
  Tone.getContext().lookAhead = 0.2;
  // Tone.start() returns a Promise but the user gesture is preserved
  // because we kick it off synchronously inside the click handler.
  void Tone.start();
  started = true;
  ensure();
}

export function setEnabled(on: boolean): void {
  enabled = on;
  if (!on) stopBed();
}

export function isEnabled(): boolean {
  return enabled;
}

/** Master volume (0..1 linear). Safe to call before the AudioContext
 *  exists — the value is cached and applied when the chain is built. */
export function setVolume(linear: number): void {
  pendingVolume = Math.max(0, Math.min(1, linear));
  chain?.setVolume(pendingVolume);
}

/** Hard mute — keeps the scheduler running so unmute resumes seamlessly. */
export function setMuted(m: boolean): void {
  pendingMuted = m;
  chain?.setMuted(m);
}

/**
 * `prefers-reduced-motion` toggle. Disables tape wow/flutter, the pad
 * filter LFO, ghost snares, fills, and the reverse-swell on Side B —
 * but keeps the music itself playing. Mirrors how the visual layer
 * suppresses motion without removing content.
 */
export function setReducedMotion(r: boolean): void {
  reduced = r;
  if (sideA) sideA.tape.setIntensity(r ? 0 : 1);
  if (sideB) sideB.tape.setIntensity(r ? 0 : 1);
  sideA?.comp?.setReducedMotion(r);
  sideB?.comp?.setReducedMotion(r);
}

/** Crossfade between the two side gains using equal-power tapers. */
export function setSide(side: 'A' | 'B'): void {
  currentSide = side;
  if (!bedRunning) return;
  const aTarget = side === 'A' ? 1 : 0;
  const bTarget = side === 'B' ? 1 : 0;
  // setTargetAtTime gives a smooth, click-free transition — matches the
  // perceptual loudness of an equal-power crossfade closely enough.
  if (sideA) sideA.gain.gain.cancelScheduledValues(Tone.now());
  if (sideB) sideB.gain.gain.cancelScheduledValues(Tone.now());
  sideA?.gain.gain.setTargetAtTime(aTarget, Tone.now(), CROSSFADE_S / 3);
  sideB?.gain.gain.setTargetAtTime(bTarget, Tone.now(), CROSSFADE_S / 3);
}

/** Tempo multiplier applied to both compositions. 1 = native BPM. */
export function setRpm(multiplier: number): void {
  currentRate = multiplier;
  sideA?.comp?.setRate(multiplier);
  sideB?.comp?.setRate(multiplier);
}

export function startBed(side: 'A' | 'B' = currentSide): void {
  if (!enabled || !ensure() || !chain) return;
  currentSide = side;
  if (bedRunning) {
    setSide(side);
    return;
  }
  const a = ensureSide('A');
  const b = ensureSide('B');
  if (!a || !b) return;

  if (!a.comp) {
    a.comp = composeSideA(a.bus);
    a.comp.setRate(currentRate);
    a.comp.setReducedMotion(reduced);
  }
  if (!b.comp) {
    b.comp = composeSideB(b.bus);
    b.comp.setRate(currentRate);
    b.comp.setReducedMotion(reduced);
  }
  // Initial gains.
  a.gain.gain.value = side === 'A' ? 1 : 0;
  b.gain.gain.value = side === 'B' ? 1 : 0;
  surface?.start();
  bedRunning = true;
}

export function stopBed(): void {
  if (!bedRunning) return;
  bedRunning = false;
  if (sideA) sideA.gain.gain.setTargetAtTime(0, Tone.now(), FADE_OUT_S / 3);
  if (sideB) sideB.gain.gain.setTargetAtTime(0, Tone.now(), FADE_OUT_S / 3);
  surface?.stop();
  setTimeout(() => {
    sideA?.comp?.stop();
    sideB?.comp?.stop();
    sideA?.comp?.dispose();
    sideB?.comp?.dispose();
    if (sideA) sideA.comp = null;
    if (sideB) sideB.comp = null;
  }, Math.ceil(FADE_OUT_S * 1000) + 120);
}

// ---- back-compat shims (kept for any external caller) ----
export function startCrackle(): void {
  startBed(currentSide);
}
export function stopCrackle(): void {
  stopBed();
}

// ---------- one-shot SFX ----------

const RAND = () => Math.random();

export function playNeedleDrop(side: 'A' | 'B' = currentSide): void {
  if (!enabled || !ensure() || !sfx) return;
  const t = Tone.now();
  // Per-call variation — thump pitch wobble and click center freq.
  const thumpHz = (side === 'B' ? 52 : 62) + (RAND() * 8 - 4);
  const clickFreq = (side === 'B' ? 1500 : 1800) + (RAND() * 400 - 200);

  sfx.needleClickFilt.frequency.setValueAtTime(clickFreq, t);
  sfx.needleThump.triggerAttackRelease(thumpHz, '8n', t, 0.85);
  sfx.needleClick.triggerAttackRelease(0.05, t + 0.002, 0.55);

  // Side B: settling scrape ~80 ms in (worn-tape character).
  if (side === 'B') {
    sfx.needleScrape.triggerAttackRelease(0.16, t + 0.08, 0.6);
  }
}

/** Muffled chassis knock + bright plastic click + HP rotation swish.
 *  Each click randomized so two flips in a row sound subtly different. */
export function playFlip(): void {
  if (!enabled || !ensure() || !sfx) return;
  const t = Tone.now();
  const knockHz = 130 + RAND() * 30;
  const clickHz = 3500 + RAND() * 1800;
  sfx.flipKnockFilt.frequency.setValueAtTime(900 + RAND() * 200, t);
  sfx.flipClickFilt.frequency.setValueAtTime(clickHz, t);
  sfx.flipKnock.triggerAttackRelease(knockHz, '16n', t, 0.7);
  sfx.flipClick.triggerAttackRelease(0.018, t + 0.005 + RAND() * 0.01, 0.55);
  // Optional second click — gives the "two-handed flip" feel ~40% of the time.
  if (RAND() < 0.4) {
    sfx.flipClick.triggerAttackRelease(0.014, t + 0.06 + RAND() * 0.04, 0.4);
  }
  sfx.flipSwish.triggerAttackRelease(0.16, t + 0.05, 0.6);
}

export function playPop(): void {
  if (!enabled || !ensure() || !sfx) return;
  const t = Tone.now();
  sfx.pop.frequency.cancelScheduledValues(t);
  sfx.pop.frequency.setValueAtTime(880, t);
  sfx.pop.frequency.exponentialRampToValueAtTime(560, t + 0.12);
  sfx.popGain.gain.cancelScheduledValues(t);
  sfx.popGain.gain.setValueAtTime(0, t);
  sfx.popGain.gain.linearRampToValueAtTime(0.08, t + 0.005);
  sfx.popGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.18);
}

/** Reduced-motion suppresses scratch SFX entirely (matches visual gate). */
export function playScratch(side: 'A' | 'B'): void {
  if (!enabled || !ensure() || !sfx) return;
  if (reduced) return;
  const t = Tone.now();

  // Direction-specific high-freq sweep.
  const startF = side === 'A' ? 1200 : 2000;
  const endF = side === 'A' ? 3000 : 700;
  sfx.scratchHighFilt.frequency.cancelScheduledValues(t);
  sfx.scratchHighFilt.frequency.setValueAtTime(startF, t);
  sfx.scratchHighFilt.frequency.exponentialRampToValueAtTime(endF, t + 0.18);
  sfx.scratchHigh.triggerAttackRelease(0.2, t, 0.7);

  // Low rubber-friction body — gives weight and "physicality" to the scratch.
  sfx.scratchBody.triggerAttackRelease(0.18, t, 0.5);
}
