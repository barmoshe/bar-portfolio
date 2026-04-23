/**
 * Tone.js instrument factories. Each returns a `{ trigger(time, midi, vel),
 * dispose() }` voice. Instruments accept an optional `sends` map so a
 * composition can route them to shared reverb / delay buses without
 * touching the per-call trigger signature.
 */

import * as Tone from 'tone';
import { midiToFreq } from './tuning';

export type SendNode = { input: Tone.ToneAudioNode };

export type Sends = {
  reverb?: { node: SendNode; amount: number };
  delay?: { node: SendNode; amount: number };
};

export type VoiceOpts = {
  /** Direct (dry) destination — typically the side instrument bus. */
  dest: Tone.ToneAudioNode;
  sends?: Sends;
};

export type Voice = {
  trigger: (time: number, midi: number, vel?: number) => void;
  dispose: () => void;
};

export type NoiseVoice = {
  trigger: (time: number, vel?: number) => void;
  dispose: () => void;
};

/** Wire a synth's output to dry + optional send taps at scaled gain. */
function fanOut(src: Tone.ToneAudioNode, opts: VoiceOpts): Tone.Gain[] {
  const taps: Tone.Gain[] = [];
  src.connect(opts.dest);
  if (opts.sends?.reverb) {
    const g = new Tone.Gain(opts.sends.reverb.amount);
    src.connect(g);
    g.connect(opts.sends.reverb.node.input);
    taps.push(g);
  }
  if (opts.sends?.delay) {
    const g = new Tone.Gain(opts.sends.delay.amount);
    src.connect(g);
    g.connect(opts.sends.delay.node.input);
    taps.push(g);
  }
  return taps;
}

function midiToHz(midi: number): number {
  return midiToFreq(midi);
}

/** Warm Rhodes-leaning FM electric piano. PolySynth so chord stabs work. */
export function fmEPiano(opts: VoiceOpts): Voice {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 2,
    modulationIndex: 6,
    oscillator: { type: 'sine' },
    modulation: { type: 'sine' },
    envelope: { attack: 0.004, decay: 0.45, sustain: 0.05, release: 1.4 },
    modulationEnvelope: { attack: 0.003, decay: 0.18, sustain: 0, release: 0.4 },
  });
  synth.volume.value = -10;
  const tone = new Tone.Filter({ type: 'lowpass', frequency: 2800, Q: 0.4 });
  synth.connect(tone);
  const taps = fanOut(tone, opts);

  return {
    trigger(time, midi, vel = 0.7) {
      synth.triggerAttackRelease(midiToHz(midi), '2n', time, Math.max(0.05, vel));
    },
    dispose() {
      synth.dispose();
      tone.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** FM bell — high modulation index, percussive attack, long shimmery release. */
export function fmBell(opts: VoiceOpts): Voice {
  const synth = new Tone.PolySynth(Tone.FMSynth, {
    harmonicity: 3.5,
    modulationIndex: 12,
    oscillator: { type: 'sine' },
    modulation: { type: 'sine' },
    envelope: { attack: 0.002, decay: 1.0, sustain: 0, release: 2.4 },
    modulationEnvelope: { attack: 0.001, decay: 0.6, sustain: 0, release: 1.2 },
  });
  synth.volume.value = -14;
  const taps = fanOut(synth, opts);

  return {
    trigger(time, midi, vel = 0.55) {
      synth.triggerAttackRelease(midiToHz(midi), '2n', time, Math.max(0.05, vel));
    },
    dispose() {
      synth.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Detuned 3-saw pad. Long attack/release, lowpass tone, gentle filter
 *  breathing via a slow LFO. */
export function sawPad(opts: VoiceOpts): Voice & { setBreath: (depth: number) => void } {
  const synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: 'fatsawtooth', count: 3, spread: 14 },
    envelope: { attack: 1.6, decay: 1.2, sustain: 0.7, release: 3.6 },
  });
  synth.volume.value = -16;
  const lp = new Tone.Filter({ type: 'lowpass', frequency: 1100, Q: 0.6 });
  // Slow filter LFO for "breathing" — gated by setBreath so reduced-motion
  // can flatten it.
  const lfo = new Tone.LFO({ frequency: 0.08, min: 800, max: 1600 });
  lfo.connect(lp.frequency);
  lfo.start();

  synth.connect(lp);
  const taps = fanOut(lp, opts);

  return {
    trigger(time, midi, vel = 0.5) {
      synth.triggerAttackRelease(midiToHz(midi), '2m', time, Math.max(0.05, vel));
    },
    setBreath(depth: number) {
      // depth in 0..1; 1 = full LFO sweep, 0 = static at midpoint.
      const center = 1200;
      const span = 400 * depth;
      lfo.min = center - span;
      lfo.max = center + span;
    },
    dispose() {
      lfo.stop();
      lfo.dispose();
      synth.dispose();
      lp.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Sine sub bass with a tiny saw-detuned blend for definition. */
export function subBass(opts: VoiceOpts): Voice {
  const synth = new Tone.MonoSynth({
    oscillator: { type: 'sine' },
    envelope: { attack: 0.012, decay: 0.4, sustain: 0.3, release: 0.6 },
    filter: { type: 'lowpass', Q: 0.5, rolloff: -12 },
    filterEnvelope: { attack: 0.005, decay: 0.2, sustain: 0.5, release: 0.4, baseFrequency: 200, octaves: 0.6 },
  });
  synth.volume.value = -10;
  const taps = fanOut(synth, opts);

  return {
    trigger(time, midi, vel = 0.55) {
      synth.triggerAttackRelease(midiToHz(midi), '4n', time, Math.max(0.05, vel));
    },
    dispose() {
      synth.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Long sine drone for Side B. Slow ±6¢ detune sway over 30 s for life. */
export function subDrone(opts: VoiceOpts): Voice {
  const synth = new Tone.Synth({
    oscillator: { type: 'sine' },
    envelope: { attack: 2.2, decay: 1.5, sustain: 0.6, release: 4.5 },
  });
  synth.volume.value = -14;
  const detuneLfo = new Tone.LFO({ frequency: 0.033, min: -6, max: 6, type: 'sine' });
  detuneLfo.connect(synth.detune);
  detuneLfo.start();
  const lp = new Tone.Filter({ type: 'lowpass', frequency: 140, Q: 0.4 });
  synth.connect(lp);
  const taps = fanOut(lp, opts);

  return {
    trigger(time, midi, vel = 0.5) {
      synth.triggerAttackRelease(midiToHz(midi), '4m', time, Math.max(0.05, vel));
    },
    dispose() {
      detuneLfo.stop();
      detuneLfo.dispose();
      synth.dispose();
      lp.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Kick — MembraneSynth pitch-drops naturally. */
export function kick(opts: VoiceOpts): NoiseVoice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.04,
    octaves: 6,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.001, decay: 0.32, sustain: 0, release: 0.18 },
  });
  synth.volume.value = -6;
  // Click transient — a tiny noise burst layered on top for snap.
  const click = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.0005, decay: 0.012, sustain: 0, release: 0.006 },
    volume: -22,
  });
  const clickFilt = new Tone.Filter({ type: 'bandpass', frequency: 1800, Q: 1.5 });
  click.chain(clickFilt);
  const taps = fanOut(synth, opts);
  // Click is dry-only (no sends) — keeps transient in front.
  clickFilt.connect(opts.dest);

  return {
    trigger(time, vel = 1) {
      synth.triggerAttackRelease('C2', '8n', time, Math.max(0.05, vel));
      click.triggerAttackRelease(0.012, time, vel * 0.8);
    },
    dispose() {
      synth.dispose();
      click.dispose();
      clickFilt.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Snare — bandpass noise + triangle body. Lo-fi felt texture. */
export function snare(opts: VoiceOpts): NoiseVoice {
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.06 },
    volume: -10,
  });
  const noiseFilt = new Tone.Filter({ type: 'bandpass', frequency: 2400, Q: 0.9 });
  noise.chain(noiseFilt);

  const body = new Tone.MembraneSynth({
    pitchDecay: 0.02,
    octaves: 1.5,
    envelope: { attack: 0.001, decay: 0.12, sustain: 0, release: 0.04 },
    volume: -12,
  });

  const taps = fanOut(noiseFilt, opts);
  body.connect(opts.dest);

  return {
    trigger(time, vel = 0.7) {
      noise.triggerAttackRelease(0.18, time, Math.max(0.05, vel));
      body.triggerAttackRelease('A3', '16n', time, Math.max(0.05, vel) * 0.8);
    },
    dispose() {
      noise.dispose();
      noiseFilt.dispose();
      body.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Hi-hat — very short HP-filtered noise. */
export function hat(opts: VoiceOpts): NoiseVoice {
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.04, sustain: 0, release: 0.02 },
    volume: -16,
  });
  const hp = new Tone.Filter({ type: 'highpass', frequency: 7500, Q: 0.7 });
  noise.chain(hp);
  const taps = fanOut(hp, opts);

  return {
    trigger(time, vel = 0.35) {
      noise.triggerAttackRelease(0.04, time, Math.max(0.05, vel));
    },
    dispose() {
      noise.dispose();
      hp.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Open hat — same recipe as `hat` with longer release for fills. */
export function hatOpen(opts: VoiceOpts): NoiseVoice {
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.18, sustain: 0, release: 0.12 },
    volume: -16,
  });
  const hp = new Tone.Filter({ type: 'highpass', frequency: 7000, Q: 0.6 });
  noise.chain(hp);
  const taps = fanOut(hp, opts);

  return {
    trigger(time, vel = 0.32) {
      noise.triggerAttackRelease(0.22, time, Math.max(0.05, vel));
    },
    dispose() {
      noise.dispose();
      hp.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Rim tick — bandpass noise + a tiny triangle ping. */
export function rim(opts: VoiceOpts): NoiseVoice {
  const noise = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.03, sustain: 0, release: 0.01 },
    volume: -16,
  });
  const bp = new Tone.Filter({ type: 'bandpass', frequency: 1900, Q: 3 });
  noise.chain(bp);

  const ping = new Tone.Synth({
    oscillator: { type: 'triangle' },
    envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.01 },
    volume: -22,
  });

  const taps = fanOut(bp, opts);
  ping.connect(opts.dest);

  return {
    trigger(time, vel = 0.5) {
      noise.triggerAttackRelease(0.03, time, Math.max(0.05, vel));
      ping.triggerAttackRelease(1700, '32n', time, Math.max(0.05, vel) * 0.6);
    },
    dispose() {
      noise.dispose();
      bp.dispose();
      ping.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}

/** Low tom — used for the bar-8 fill on Side A. */
export function tom(opts: VoiceOpts): NoiseVoice {
  const synth = new Tone.MembraneSynth({
    pitchDecay: 0.05,
    octaves: 4,
    oscillator: { type: 'sine' },
    envelope: { attack: 0.002, decay: 0.25, sustain: 0, release: 0.18 },
    volume: -10,
  });
  const taps = fanOut(synth, opts);

  return {
    trigger(time, vel = 0.7) {
      synth.triggerAttackRelease('G2', '8n', time, Math.max(0.05, vel));
    },
    dispose() {
      synth.dispose();
      taps.forEach((g) => g.dispose());
    },
  };
}
