/**
 * Tiny instrument factories. Each returns a { trigger(time, midi, vel) }
 * voice. Everything is built from OscillatorNode + GainNode + BiquadFilter
 * + BufferSource(noise) — no samples, no deps.
 */

import { midiToFreq } from './tuning';

export type Voice = {
  trigger: (time: number, midi: number, vel?: number) => void;
};

export type NoiseVoice = {
  trigger: (time: number, vel?: number) => void;
};

function makeNoiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const buf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * seconds), ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

/** FM Rhodes-ish electric piano. Warm bell-pad hybrid. */
export function fmEPiano(ctx: AudioContext, dest: AudioNode): Voice {
  const noiseBuf = makeNoiseBuffer(ctx, 0.2);
  return {
    trigger(time, midi, vel = 0.7) {
      const f = midiToFreq(midi);
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const amp = ctx.createGain();
      const tone = ctx.createBiquadFilter();

      carrier.type = 'sine';
      modulator.type = 'sine';
      carrier.frequency.value = f;
      modulator.frequency.value = f * 2;

      modGain.gain.setValueAtTime(f * 2.2 * vel, time);
      modGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);

      tone.type = 'lowpass';
      tone.frequency.value = 2600;

      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.22 * vel, time + 0.005);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 1.3);

      modulator.connect(modGain).connect(carrier.frequency);
      carrier.connect(tone).connect(amp).connect(dest);
      modulator.start(time);
      carrier.start(time);
      modulator.stop(time + 1.4);
      carrier.stop(time + 1.4);

      // Subtle key click for felt-hammer realism.
      const click = ctx.createBufferSource();
      const clickGain = ctx.createGain();
      const clickBP = ctx.createBiquadFilter();
      click.buffer = noiseBuf;
      clickBP.type = 'bandpass';
      clickBP.frequency.value = 2200;
      clickBP.Q.value = 0.9;
      clickGain.gain.setValueAtTime(0.04 * vel, time);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      click.connect(clickBP).connect(clickGain).connect(dest);
      click.start(time);
      click.stop(time + 0.05);
    },
  };
}

/** FM bell — high mod ratio, long shimmery tail. */
export function fmBell(ctx: AudioContext, dest: AudioNode): Voice {
  return {
    trigger(time, midi, vel = 0.55) {
      const f = midiToFreq(midi);
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const amp = ctx.createGain();

      carrier.type = 'sine';
      modulator.type = 'sine';
      carrier.frequency.value = f;
      modulator.frequency.value = f * 3.5;

      modGain.gain.setValueAtTime(f * 4 * vel, time);
      modGain.gain.exponentialRampToValueAtTime(0.001, time + 1.4);

      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.16 * vel, time + 0.004);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 2.6);

      modulator.connect(modGain).connect(carrier.frequency);
      carrier.connect(amp).connect(dest);
      modulator.start(time);
      carrier.start(time);
      modulator.stop(time + 2.8);
      carrier.stop(time + 2.8);
    },
  };
}

/** Detuned 3-saw pad voice. Long attack / release, LP tone. */
export function sawPad(ctx: AudioContext, dest: AudioNode): Voice {
  return {
    trigger(time, midi, vel = 0.5) {
      const f = midiToFreq(midi);
      const amp = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 1100;
      lp.Q.value = 0.6;

      const detune = [-7, 0, 7];
      const oscs = detune.map((cents) => {
        const osc = ctx.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = f;
        osc.detune.value = cents;
        const og = ctx.createGain();
        og.gain.value = 0.33;
        osc.connect(og).connect(lp);
        osc.start(time);
        osc.stop(time + 4.8);
        return osc;
      });
      void oscs;

      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.09 * vel, time + 1.8);
      amp.gain.setValueAtTime(0.09 * vel, time + 3.2);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 4.6);

      lp.connect(amp).connect(dest);
    },
  };
}

/** Sine sub — root-note bass held for full chord change. */
export function subBass(ctx: AudioContext, dest: AudioNode): Voice {
  return {
    trigger(time, midi, vel = 0.55) {
      const f = midiToFreq(midi);
      const osc = ctx.createOscillator();
      const saw = ctx.createOscillator();
      const amp = ctx.createGain();
      const lp = ctx.createBiquadFilter();

      osc.type = 'sine';
      osc.frequency.value = f;
      saw.type = 'sawtooth';
      saw.frequency.value = f;
      saw.detune.value = -5;

      const sawGain = ctx.createGain();
      sawGain.gain.value = 0.08;

      lp.type = 'lowpass';
      lp.frequency.value = 180;

      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.32 * vel, time + 0.02);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 1.0);

      osc.connect(amp);
      saw.connect(sawGain).connect(lp).connect(amp);
      amp.connect(dest);
      osc.start(time);
      saw.start(time);
      osc.stop(time + 1.1);
      saw.stop(time + 1.1);
    },
  };
}

/** Long sine drone for Side B. Dest should be kept open for ~4 s. */
export function subDrone(ctx: AudioContext, dest: AudioNode): Voice {
  return {
    trigger(time, midi, vel = 0.5) {
      const f = midiToFreq(midi);
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      const lp = ctx.createBiquadFilter();
      osc.type = 'sine';
      osc.frequency.value = f;
      lp.type = 'lowpass';
      lp.frequency.value = 120;

      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.22 * vel, time + 2.0);
      amp.gain.setValueAtTime(0.22 * vel, time + 3.5);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 4.8);

      osc.connect(lp).connect(amp).connect(dest);
      osc.start(time);
      osc.stop(time + 4.9);
    },
  };
}

/** Kick — sine pitch drop + click transient. */
export function kick(ctx: AudioContext, dest: AudioNode): NoiseVoice {
  const noiseBuf = makeNoiseBuffer(ctx, 0.05);
  return {
    trigger(time, vel = 1) {
      const osc = ctx.createOscillator();
      const amp = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(130, time);
      osc.frequency.exponentialRampToValueAtTime(45, time + 0.08);
      amp.gain.setValueAtTime(0, time);
      amp.gain.linearRampToValueAtTime(0.75 * vel, time + 0.003);
      amp.gain.exponentialRampToValueAtTime(0.0001, time + 0.22);
      osc.connect(amp).connect(dest);
      osc.start(time);
      osc.stop(time + 0.25);

      const click = ctx.createBufferSource();
      const cg = ctx.createGain();
      click.buffer = noiseBuf;
      cg.gain.setValueAtTime(0.18 * vel, time);
      cg.gain.exponentialRampToValueAtTime(0.0001, time + 0.02);
      click.connect(cg).connect(dest);
      click.start(time);
      click.stop(time + 0.03);
    },
  };
}

/** Snare/snap — BP noise + triangle body. Lo-fi felt texture. */
export function snare(ctx: AudioContext, dest: AudioNode): NoiseVoice {
  const noiseBuf = makeNoiseBuffer(ctx, 0.25);
  return {
    trigger(time, vel = 0.7) {
      const noise = ctx.createBufferSource();
      const bp = ctx.createBiquadFilter();
      const ng = ctx.createGain();
      noise.buffer = noiseBuf;
      bp.type = 'bandpass';
      bp.frequency.value = 2400;
      bp.Q.value = 0.9;
      ng.gain.setValueAtTime(0.35 * vel, time);
      ng.gain.exponentialRampToValueAtTime(0.0001, time + 0.18);
      noise.connect(bp).connect(ng).connect(dest);
      noise.start(time);
      noise.stop(time + 0.22);

      const body = ctx.createOscillator();
      const bg = ctx.createGain();
      body.type = 'triangle';
      body.frequency.setValueAtTime(210, time);
      body.frequency.exponentialRampToValueAtTime(140, time + 0.1);
      bg.gain.setValueAtTime(0.22 * vel, time);
      bg.gain.exponentialRampToValueAtTime(0.0001, time + 0.12);
      body.connect(bg).connect(dest);
      body.start(time);
      body.stop(time + 0.14);
    },
  };
}

/** Hi-hat — very short HP-filtered noise. */
export function hat(ctx: AudioContext, dest: AudioNode): NoiseVoice {
  const noiseBuf = makeNoiseBuffer(ctx, 0.08);
  return {
    trigger(time, vel = 0.35) {
      const noise = ctx.createBufferSource();
      const hp = ctx.createBiquadFilter();
      const g = ctx.createGain();
      noise.buffer = noiseBuf;
      hp.type = 'highpass';
      hp.frequency.value = 7500;
      g.gain.setValueAtTime(0.24 * vel, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
      noise.connect(hp).connect(g).connect(dest);
      noise.start(time);
      noise.stop(time + 0.06);
    },
  };
}

/** Rim tick — BP-filtered noise + tiny triangle ping. */
export function rim(ctx: AudioContext, dest: AudioNode): NoiseVoice {
  const noiseBuf = makeNoiseBuffer(ctx, 0.04);
  return {
    trigger(time, vel = 0.5) {
      const noise = ctx.createBufferSource();
      const bp = ctx.createBiquadFilter();
      const g = ctx.createGain();
      noise.buffer = noiseBuf;
      bp.type = 'bandpass';
      bp.frequency.value = 1900;
      bp.Q.value = 3;
      g.gain.setValueAtTime(0.2 * vel, time);
      g.gain.exponentialRampToValueAtTime(0.0001, time + 0.04);
      noise.connect(bp).connect(g).connect(dest);
      noise.start(time);
      noise.stop(time + 0.05);

      const tri = ctx.createOscillator();
      const tg = ctx.createGain();
      tri.type = 'triangle';
      tri.frequency.value = 1700;
      tg.gain.setValueAtTime(0.08 * vel, time);
      tg.gain.exponentialRampToValueAtTime(0.0001, time + 0.03);
      tri.connect(tg).connect(dest);
      tri.start(time);
      tri.stop(time + 0.04);
    },
  };
}
