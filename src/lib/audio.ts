/**
 * Hand-rolled mono/poly synth on top of the Web Audio API.
 *
 * No Tone.js, no sample files. Per-note OscillatorNode → per-note GainNode
 * (envelope) → shared BiquadFilterNode (lowpass) → shared master GainNode →
 * AnalyserNode → destination. See `knowledge/music-section-plan.md`.
 */

export type Waveform = OscillatorType;

export interface NoteOnOpts {
  /** 0–1 peak gain for this voice. Defaults to 0.22. */
  velocity?: number;
}

export interface Synth {
  noteOn(midi: number, opts?: NoteOnOpts): void;
  noteOff(midi: number): void;
  setCutoff(hz: number): void;
  setWave(type: Waveform): void;
  getAnalyser(): AnalyserNode;
  /** Returns a MediaStream that mirrors the master bus — for MediaRecorder. */
  getRecordingStream(): MediaStream;
  destroy(): void;
}

const midiToFreq = (midi: number) => 440 * 2 ** ((midi - 69) / 12);

const ATTACK = 0.005;
const RELEASE = 0.015;
const STUCK_NOTE_MS = 2000;
const DEFAULT_VELOCITY = 0.22;

interface Voice {
  osc: OscillatorNode;
  gain: GainNode;
  timer: ReturnType<typeof setTimeout>;
}

export function createSynth(): Synth {
  const AC: typeof AudioContext =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext: typeof AudioContext })
      .webkitAudioContext;
  const ctx = new AC();

  const filter = ctx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 1200;
  filter.Q.value = 0.7;

  const master = ctx.createGain();
  master.gain.value = 0.5;

  const analyser = ctx.createAnalyser();
  analyser.fftSize = 1024;

  const streamDest = ctx.createMediaStreamDestination();

  filter.connect(master);
  master.connect(analyser);
  analyser.connect(ctx.destination);
  analyser.connect(streamDest);

  let wave: Waveform = 'sine';
  const voices = new Map<number, Voice>();

  const releaseVoice = (midi: number) => {
    const v = voices.get(midi);
    if (!v) return;
    voices.delete(midi);
    clearTimeout(v.timer);
    const now = ctx.currentTime;
    v.gain.gain.cancelScheduledValues(now);
    v.gain.gain.setTargetAtTime(0, now, RELEASE);
    const stopAt = now + RELEASE * 10;
    v.osc.stop(stopAt);
    setTimeout(() => {
      try {
        v.osc.disconnect();
        v.gain.disconnect();
      } catch {
        /* already torn down */
      }
    }, RELEASE * 10 * 1000 + 50);
  };

  return {
    noteOn(midi, opts) {
      if (ctx.state === 'suspended') void ctx.resume();
      if (voices.has(midi)) releaseVoice(midi);

      const peak = Math.max(0, Math.min(1, opts?.velocity ?? DEFAULT_VELOCITY));

      const osc = ctx.createOscillator();
      osc.type = wave;
      osc.frequency.value = midiToFreq(midi);

      const gain = ctx.createGain();
      gain.gain.value = 0;

      osc.connect(gain);
      gain.connect(filter);

      const now = ctx.currentTime;
      gain.gain.setTargetAtTime(peak, now, ATTACK);
      osc.start(now);

      const timer = setTimeout(() => releaseVoice(midi), STUCK_NOTE_MS);
      voices.set(midi, { osc, gain, timer });
    },
    noteOff(midi) {
      releaseVoice(midi);
    },
    setCutoff(hz) {
      filter.frequency.setTargetAtTime(hz, ctx.currentTime, 0.02);
    },
    setWave(type) {
      wave = type;
      voices.forEach((v) => {
        v.osc.type = type;
      });
    },
    getAnalyser() {
      return analyser;
    },
    getRecordingStream() {
      return streamDest.stream;
    },
    destroy() {
      voices.forEach((_, midi) => releaseVoice(midi));
      setTimeout(() => {
        try {
          filter.disconnect();
          master.disconnect();
          analyser.disconnect();
          streamDest.disconnect();
          void ctx.close();
        } catch {
          /* already closed */
        }
      }, 400);
    },
  };
}

/** A-minor pentatonic, 13 notes spanning roughly A3 → D6. */
export const PENTATONIC_MIDI: readonly number[] = [
  57, 60, 62, 64, 67, 69, 72, 74, 76, 79, 81, 84, 86,
];

/** QWERTY keys that trigger each index in `PENTATONIC_MIDI`. */
export const QWERTY_MAP: readonly string[] = [
  'a', 'w', 's', 'e', 'd', 'f', 't', 'g', 'y', 'h', 'u', 'j', 'k',
];

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

export function midiToName(midi: number): string {
  const name = NOTE_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${name}${octave}`;
}
