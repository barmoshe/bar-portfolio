/**
 * Shared audio effects + master bus, built on Tone.js.
 *
 * Three responsibilities:
 *   1. `makeMasterChain()` — saturator -> EQ -> stereo widener -> compressor
 *      -> limiter -> volume. Music + surface noise pass through this; SFX
 *      tap in *before* the limiter via the same input so they can't clip
 *      the output, but they bypass the compressor so transient hits don't
 *      pump the music bed.
 *   2. `makePlateReverb()` / `makePingPong()` — shared send buses. Each
 *      side owns its own pair so reverb tails fade with the side crossfade.
 *   3. `makeTape()` — wow + flutter (slow Vibrato + fast Chorus) wrapped in
 *      a single input/output pair so a side bus can insert it inline.
 *      `setIntensity(0)` flattens the modulation for prefers-reduced-motion.
 *
 * Plus `makeSurfaceNoise()` — pink-noise bed + 50/100 Hz motor hum +
 * three-voice crackle bank (tick / pop / dust) scheduled by a setInterval,
 * not by Tone.Transport (so the user's RPM knob can change tempo without
 * also changing crackle density).
 */

import * as Tone from 'tone';

export type SendBus = {
  /** Connect instruments here (with their own send-amount gain). */
  input: Tone.Gain;
  /** Wet output — connect this back to the side bus. */
  output: Tone.Gain;
  dispose: () => void;
};

export type MasterChain = {
  /** Music + surface noise input — runs through compressor + limiter. */
  musicIn: Tone.Gain;
  /** SFX input — bypasses the compressor (so needle/flip/scratch don't pump). */
  sfxIn: Tone.Gain;
  setVolume: (linear: number) => void;
  setMuted: (m: boolean) => void;
  dispose: () => void;
};

export function makeMasterChain(): MasterChain {
  const musicIn = new Tone.Gain(1);
  const sfxIn = new Tone.Gain(1);

  // Tape-style soft saturation. Chebyshev order 4 adds 2nd/4th harmonics
  // for warmth without harshness; wet is dialed back so the dry tone
  // dominates and the saturation just thickens transients.
  const sat = new Tone.Chebyshev(4);
  sat.wet.value = 0.16;

  // Subtractive EQ: shave a bit of mud at 220 Hz, lift "air" at 8 kHz.
  const eq = new Tone.EQ3({
    low: -1.5,
    mid: 0,
    high: 1.4,
    lowFrequency: 220,
    highFrequency: 6500,
  });

  // Mid/side stereo widener (Tone.StereoWidener uses M/S internally so
  // it survives mono fold-down on phone speakers without the comb-filter
  // collapse a Haas-trick gives.)
  const widener = new Tone.StereoWidener(0.6);

  // Glue compressor — moderate ratio, soft knee, slow-ish attack so
  // transients survive but the bed stays controlled.
  const compressor = new Tone.Compressor({
    threshold: -18,
    ratio: 2.5,
    attack: 0.012,
    release: 0.14,
    knee: 12,
  });

  // True brickwall — Tone.Limiter is a high-ratio Compressor with
  // ratio: 20 + lookAhead, which gives a solid -1.5 dBFS ceiling.
  const limiter = new Tone.Limiter(-1.5);

  // Output trim — controlled by setVolume / setMuted.
  const volume = new Tone.Volume(0);

  // Music path: full chain.
  musicIn.chain(sat, eq, widener, compressor, limiter, volume, Tone.getDestination());
  // SFX path: skips the compressor so its sidechain isn't driven by the
  // SFX transient. Still rides the limiter + volume so it can't clip.
  sfxIn.chain(limiter);

  let muted = false;
  let linear = 0.6;
  const apply = () => {
    const target = muted ? -Infinity : Tone.gainToDb(Math.max(0.0001, linear));
    volume.volume.rampTo(target, 0.05);
  };
  apply();

  return {
    musicIn,
    sfxIn,
    setVolume: (v) => {
      linear = Math.max(0, Math.min(1, v));
      apply();
    },
    setMuted: (m) => {
      muted = m;
      apply();
    },
    dispose: () => {
      musicIn.dispose();
      sfxIn.dispose();
      sat.dispose();
      eq.dispose();
      widener.dispose();
      compressor.dispose();
      limiter.dispose();
      volume.dispose();
    },
  };
}

export function makePlateReverb(decay = 2.4, preDelay = 0.022): SendBus {
  const reverb = new Tone.Reverb({ decay, preDelay, wet: 1 });
  // Generation is async but `generate()` is implicit — Tone uses the
  // pre-existing IR until the new one is ready. Safe to use immediately.
  const input = new Tone.Gain(1);
  const output = new Tone.Gain(0.55);
  input.connect(reverb);
  reverb.connect(output);
  return {
    input,
    output,
    dispose: () => {
      reverb.dispose();
      input.dispose();
      output.dispose();
    },
  };
}

export function makePingPong(delayTime: Tone.Unit.Time = '8n.', feedback = 0.32): SendBus {
  const delay = new Tone.PingPongDelay({ delayTime, feedback, wet: 1 });
  const input = new Tone.Gain(1);
  const output = new Tone.Gain(0.45);
  input.connect(delay);
  delay.connect(output);
  return {
    input,
    output,
    dispose: () => {
      delay.dispose();
      input.dispose();
      output.dispose();
    },
  };
}

export type Tape = {
  input: Tone.Gain;
  output: Tone.Gain;
  /** 0 = no modulation (reduced-motion), 1 = default warp. */
  setIntensity: (n: number) => void;
  dispose: () => void;
};

export function makeTape(): Tape {
  const input = new Tone.Gain(1);
  // Slow pitch sway — the "wow."
  const wow = new Tone.Vibrato({ frequency: 0.35, depth: 0.04 });
  // Faster, denser modulation — the "flutter."
  const flutter = new Tone.Chorus({
    frequency: 7.2,
    delayTime: 1.5,
    depth: 0.35,
    feedback: 0,
    spread: 30,
    type: 'sine',
  }).start();
  flutter.wet.value = 0.12;
  const output = new Tone.Gain(1);

  input.chain(wow, flutter, output);

  let intensity = 1;
  let flutterRunning = true;
  return {
    input,
    output,
    setIntensity: (n) => {
      intensity = Math.max(0, Math.min(1, n));
      wow.depth.value = 0.04 * intensity;
      flutter.wet.value = 0.12 * intensity;
      // Chorus LFO + multi-tap delay-line keep running when wet=0; stop()
      // bypasses them entirely so reduced-motion reclaims real CPU.
      if (intensity === 0 && flutterRunning) {
        flutter.stop();
        flutterRunning = false;
      } else if (intensity > 0 && !flutterRunning) {
        flutter.start();
        flutterRunning = true;
      }
    },
    dispose: () => {
      input.dispose();
      wow.dispose();
      flutter.dispose();
      output.dispose();
    },
  };
}

export type Surface = {
  output: Tone.Gain;
  start: () => void;
  stop: () => void;
  dispose: () => void;
};

/**
 * Layered surface noise: pink-noise bed shaped by HP + peaking filter,
 * a quiet 50/100 Hz mains-style hum, and a three-voice crackle bank
 * triggered by a setInterval (so density is tempo-independent).
 */
export function makeSurfaceNoise(): Surface {
  const output = new Tone.Gain(0);

  const bed = new Tone.Noise({ type: 'pink', volume: -28 });
  const hp = new Tone.Filter(420, 'highpass');
  const peak = new Tone.Filter({ type: 'peaking', frequency: 1500, Q: 0.8, gain: 3 });
  bed.chain(hp, peak, output);

  const hum50 = new Tone.Oscillator({ frequency: 50, type: 'sine', volume: -38 });
  const hum100 = new Tone.Oscillator({ frequency: 100, type: 'sine', volume: -50 });
  hum50.connect(output);
  hum100.connect(output);

  // Three-voice crackle bank — pre-instantiated, reused per tick.
  const tick = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.012, sustain: 0, release: 0.006 },
    volume: -18,
  });
  const tickFilt = new Tone.Filter({ type: 'bandpass', frequency: 3000, Q: 4 });
  tick.chain(tickFilt, output);

  const pop = new Tone.NoiseSynth({
    noise: { type: 'white' },
    envelope: { attack: 0.001, decay: 0.025, sustain: 0, release: 0.014 },
    volume: -14,
  });
  const popFilt = new Tone.Filter({ type: 'bandpass', frequency: 900, Q: 3.5 });
  pop.chain(popFilt, output);

  const dust = new Tone.NoiseSynth({
    noise: { type: 'pink' },
    envelope: { attack: 0.001, decay: 0.06, sustain: 0, release: 0.05 },
    volume: -8,
  });
  dust.connect(output);

  // Self-rescheduling setTimeout that schedules each crackle hit ~50 ms ahead
  // on the audio clock. If a callback fires late (GC, React render stall), the
  // next one still lands correctly via Tone's scheduling — no setInterval-style
  // catch-up burst. Density stays tempo-independent.
  let crackleTimer: ReturnType<typeof setTimeout> | null = null;
  let crackleAlive = false;

  const scheduleNextCrackle = () => {
    if (!crackleAlive) return;
    const r = Math.random();
    const t = Tone.now() + 0.05;
    if (r < 0.62) tick.triggerAttackRelease(0.006, t);
    else if (r < 0.92) pop.triggerAttackRelease(0.012, t);
    else if (r < 0.97) dust.triggerAttackRelease(0.04, t);
    const nextDelay = 55 + Math.random() * 30;
    crackleTimer = setTimeout(scheduleNextCrackle, nextDelay);
  };

  return {
    output,
    start: () => {
      output.gain.cancelScheduledValues(Tone.now());
      output.gain.setValueAtTime(0, Tone.now());
      output.gain.linearRampToValueAtTime(0.32, Tone.now() + 0.6);
      bed.start();
      hum50.start();
      hum100.start();
      if (crackleAlive) return;
      crackleAlive = true;
      scheduleNextCrackle();
    },
    stop: () => {
      const t = Tone.now();
      output.gain.cancelScheduledValues(t);
      output.gain.setTargetAtTime(0, t, 0.18);
      crackleAlive = false;
      if (crackleTimer) {
        clearTimeout(crackleTimer);
        crackleTimer = null;
      }
      setTimeout(() => {
        try {
          bed.stop();
          hum50.stop();
          hum100.stop();
        } catch {
          /* already stopped */
        }
      }, 700);
    },
    dispose: () => {
      crackleAlive = false;
      if (crackleTimer) clearTimeout(crackleTimer);
      bed.dispose();
      hp.dispose();
      peak.dispose();
      hum50.dispose();
      hum100.dispose();
      tick.dispose();
      tickFilt.dispose();
      pop.dispose();
      popFilt.dispose();
      dust.dispose();
      output.dispose();
    },
  };
}
