/**
 * vinylAudio.ts - zero-dependency Web Audio API SFX for the Music section.
 *
 * All sounds are procedural (no .mp3 / .wav assets, no Tone.js). A single
 * AudioContext is lazily created on first user gesture - browsers block
 * audio that wasn't kicked off by a click / keypress (see
 * https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), and
 * we honor that by gating everything through `unlock()` which must be
 * called from a click handler before any other method.
 *
 * Enable/disable state is in-module; the calling component owns the
 * localStorage persistence and the visible mute toggle.
 */

type Voice = {
  stop: () => void;
};

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;
let crackle: Voice | null = null;

function ensure(): boolean {
  if (typeof window === 'undefined') return false;
  if (!ctx) {
    const Ctor: typeof AudioContext | undefined =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return false;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') {
    // Fire and forget - resume() returns a promise but we don't await it
    // inside a click handler because doing so drops the "user gesture"
    // context on some browsers.
    void ctx.resume();
  }
  return true;
}

/** Call inside a click / keydown handler to lift the autoplay lock. */
export function unlock(): void {
  ensure();
}

export function setEnabled(on: boolean): void {
  enabled = on;
  if (!on) stopCrackle();
}

export function isEnabled(): boolean {
  return enabled;
}

/** Short low-frequency thud + noise burst - the "needle hits vinyl" sound. */
export function playNeedleDrop(): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  const now = ctx.currentTime;

  // 1. Thud: low-pass filtered sine that dives from 140 Hz → 55 Hz.
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  const thumpLP = ctx.createBiquadFilter();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(140, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(55, now + 0.18);
  thumpLP.type = 'lowpass';
  thumpLP.frequency.value = 220;
  thumpGain.gain.setValueAtTime(0, now);
  thumpGain.gain.linearRampToValueAtTime(0.55, now + 0.008);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  thumpOsc.connect(thumpLP).connect(thumpGain).connect(master);
  thumpOsc.start(now);
  thumpOsc.stop(now + 0.25);

  // 2. Noise chirp: a 40ms band-passed noise click, layered over the thud.
  const clickBuf = makeNoiseBuffer(0.04);
  const click = ctx.createBufferSource();
  const clickGain = ctx.createGain();
  const clickBP = ctx.createBiquadFilter();
  click.buffer = clickBuf;
  clickBP.type = 'bandpass';
  clickBP.frequency.value = 1800;
  clickBP.Q.value = 0.7;
  clickGain.gain.setValueAtTime(0.35, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  click.connect(clickBP).connect(clickGain).connect(master);
  click.start(now);
}

/** Muffled wood/plastic knock - the "vinyl flipped" sound. */
export function playFlip(): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  const lp = ctx.createBiquadFilter();
  osc.type = 'triangle';
  osc.frequency.setValueAtTime(320, now);
  osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
  lp.type = 'lowpass';
  lp.frequency.value = 900;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.32, now + 0.004);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  osc.connect(lp).connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.2);
}

/** Tiny sine ping - the "horn waveform tick" used between crackle loops. */
export function playPop(): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(880, now);
  osc.frequency.exponentialRampToValueAtTime(560, now + 0.12);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.06, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.15);
  osc.connect(gain).connect(master);
  osc.start(now);
  osc.stop(now + 0.2);
}

/**
 * Looping vinyl crackle: pink-ish noise passed through a mid peaking EQ so
 * the hiss sits low (around 1.5 kHz) and doesn't mask other SFX. The loop
 * buffer is 2 s - long enough to feel organic, short enough that startup
 * is instant. Called when the rig flips to data-playing="true".
 */
export function startCrackle(): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  if (crackle) return; // already running

  const duration = 2;
  const buf = ctx.createBuffer(1, ctx.sampleRate * duration, ctx.sampleRate);
  const data = buf.getChannelData(0);
  // Pink-ish noise via Voss-McCartney approximation (cheap, sounds right
  // for record-hiss). Small random "pops" sprinkled in for the crackle.
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    let s = (b0 + b1 + b2 + w * 0.115926) * 0.22;
    // Random pop: ~1 per 80 ms on average.
    if (Math.random() < 0.0005) s += (Math.random() * 2 - 1) * 0.4;
    data[i] = s;
  }

  const src = ctx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const hp = ctx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 420;

  const peak = ctx.createBiquadFilter();
  peak.type = 'peaking';
  peak.frequency.value = 1500;
  peak.Q.value = 0.8;
  peak.gain.value = 3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(0.16, ctx.currentTime + 0.6);

  src.connect(hp).connect(peak).connect(gain).connect(master);
  src.start();

  crackle = {
    stop: () => {
      if (!ctx || !master) return;
      const t = ctx.currentTime;
      gain.gain.cancelScheduledValues(t);
      gain.gain.setValueAtTime(gain.gain.value, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.4);
      try {
        src.stop(t + 0.5);
      } catch {
        /* already stopped */
      }
    },
  };
}

export function stopCrackle(): void {
  if (!crackle) return;
  crackle.stop();
  crackle = null;
}

function makeNoiseBuffer(seconds: number): AudioBuffer {
  // ensure() runs before callers - ctx is non-null here.
  const c = ctx as AudioContext;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
