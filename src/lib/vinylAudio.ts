/**
 * vinylAudio.ts - zero-dependency Web Audio API engine for the Mixtape section.
 *
 * All sounds are procedural (no .mp3 / .wav assets, no Tone.js). A single
 * AudioContext is lazily created on first user gesture - browsers block
 * audio that wasn't kicked off by a click / keypress (see
 * https://developer.mozilla.org/en-US/docs/Web/Media/Guides/Autoplay), and
 * we honor that by gating everything through `unlock()` which must be
 * called from a click handler before any other method.
 *
 * Architecture:
 *
 *   master (0.6) ───┬── sideABus (GainNode, equal-power crossfade) ── Side A composition
 *                   ├── sideBBus ─── Side B composition
 *                   ├── surface noise (layered crackle + dust pops + motor hum)
 *                   └── one-shot SFX (needle drop, flip, scratch, pop)
 *
 * Two full compositions play continuously once audio is on; flipping
 * performs an equal-power crossfade between side buses so no notes are
 * cut off and no pops appear.
 *
 * Enable/disable state is in-module; the calling component owns the
 * localStorage persistence and the visible mute toggle.
 */

import { composeSideA } from './music/sideA';
import { composeSideB } from './music/sideB';

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let enabled = false;

type BedState = {
  sideAGain: GainNode;
  sideBGain: GainNode;
  stopA: () => void;
  stopB: () => void;
  stopSurface: () => void;
};
let bed: BedState | null = null;
let currentSide: 'A' | 'B' = 'A';

const CROSSFADE_S = 0.5;
const FADE_OUT_S = 0.6;

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
  if (!on) stopBed();
}

export function isEnabled(): boolean {
  return enabled;
}

/** Crossfade between side buses with equal-power tapers. */
export function setSide(side: 'A' | 'B'): void {
  currentSide = side;
  if (!bed || !ctx) return;
  const now = ctx.currentTime;
  const aTarget = side === 'A' ? 1 : 0;
  const bTarget = side === 'B' ? 1 : 0;
  // Equal-power: cos/sin taper gives -3 dB midpoint and flat perceived loudness.
  // We approximate with setTargetAtTime, which is smooth and has no sample-clicks.
  bed.sideAGain.gain.cancelScheduledValues(now);
  bed.sideBGain.gain.cancelScheduledValues(now);
  bed.sideAGain.gain.setTargetAtTime(aTarget, now, CROSSFADE_S / 3);
  bed.sideBGain.gain.setTargetAtTime(bTarget, now, CROSSFADE_S / 3);
}

/** Short low-frequency thud + noise burst - the "needle hits vinyl" sound. */
export function playNeedleDrop(side: 'A' | 'B' = currentSide): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  const now = ctx.currentTime;

  const endFreq = side === 'B' ? 45 : 55;
  const lpFreq = side === 'B' ? 190 : 220;

  // Thud: low-pass filtered sine that dives from 140 Hz to endFreq.
  const thumpOsc = ctx.createOscillator();
  const thumpGain = ctx.createGain();
  const thumpLP = ctx.createBiquadFilter();
  thumpOsc.type = 'sine';
  thumpOsc.frequency.setValueAtTime(140, now);
  thumpOsc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.18);
  thumpLP.type = 'lowpass';
  thumpLP.frequency.value = lpFreq;
  thumpGain.gain.setValueAtTime(0, now);
  thumpGain.gain.linearRampToValueAtTime(0.55, now + 0.008);
  thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
  thumpOsc.connect(thumpLP).connect(thumpGain).connect(master);
  thumpOsc.start(now);
  thumpOsc.stop(now + 0.25);

  // Noise chirp layered over the thud.
  const clickBuf = makeNoiseBuffer(0.04);
  const click = ctx.createBufferSource();
  const clickGain = ctx.createGain();
  const clickBP = ctx.createBiquadFilter();
  click.buffer = clickBuf;
  clickBP.type = 'bandpass';
  clickBP.frequency.value = side === 'B' ? 1400 : 1800;
  clickBP.Q.value = 0.7;
  clickGain.gain.setValueAtTime(0.35, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);
  click.connect(clickBP).connect(clickGain).connect(master);
  click.start(now);

  // Side B adds a 12 ms "settling" scrape so it reads as a more-played pressing.
  if (side === 'B') {
    const scrapeBuf = makeNoiseBuffer(0.02);
    const scrape = ctx.createBufferSource();
    const scrapeLP = ctx.createBiquadFilter();
    const scrapeGain = ctx.createGain();
    scrape.buffer = scrapeBuf;
    scrapeLP.type = 'lowpass';
    scrapeLP.frequency.value = 700;
    scrapeGain.gain.setValueAtTime(0.18, now + 0.08);
    scrapeGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    scrape.connect(scrapeLP).connect(scrapeGain).connect(master);
    scrape.start(now + 0.08);
    scrape.stop(now + 0.2);
  }
}

/** Muffled wood/plastic knock + a brief post-tick hiss — the "vinyl flipped" sound. */
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

  // Short HP noise tail — the physical rotation swish after the knock.
  const swishBuf = makeNoiseBuffer(0.08);
  const swish = ctx.createBufferSource();
  const swishHP = ctx.createBiquadFilter();
  const swishGain = ctx.createGain();
  swish.buffer = swishBuf;
  swishHP.type = 'highpass';
  swishHP.frequency.value = 2200;
  swishGain.gain.setValueAtTime(0, now + 0.05);
  swishGain.gain.linearRampToValueAtTime(0.14, now + 0.07);
  swishGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
  swish.connect(swishHP).connect(swishGain).connect(master);
  swish.start(now + 0.05);
  swish.stop(now + 0.18);
}

/** Tiny sine ping - the "horn waveform tick" / runout groove click. */
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

/** Short scratch chirp when a user clicks a track vinyl. Direction per side. */
export function playScratch(side: 'A' | 'B'): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  const now = ctx.currentTime;
  const buf = makeNoiseBuffer(0.2);
  const src = ctx.createBufferSource();
  const bp = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  src.buffer = buf;
  bp.type = 'bandpass';
  bp.Q.value = 3.5;
  if (side === 'A') {
    bp.frequency.setValueAtTime(1200, now);
    bp.frequency.exponentialRampToValueAtTime(3000, now + 0.18);
  } else {
    bp.frequency.setValueAtTime(2000, now);
    bp.frequency.exponentialRampToValueAtTime(700, now + 0.18);
  }
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
  src.connect(bp).connect(gain).connect(master);
  src.start(now);
  src.stop(now + 0.22);
}

/**
 * Start the full audio bed: two compositions on two side buses (crossfaded),
 * plus layered surface noise that sits over both. Called when the rig
 * enters view with audio enabled.
 */
export function startBed(side: 'A' | 'B' = currentSide): void {
  if (!enabled || !ensure() || !ctx || !master) return;
  if (bed) {
    // Already running - just sync the side.
    currentSide = side;
    setSide(side);
    return;
  }

  const sideAGain = ctx.createGain();
  const sideBGain = ctx.createGain();
  sideAGain.gain.value = side === 'A' ? 1 : 0;
  sideBGain.gain.value = side === 'B' ? 1 : 0;
  sideAGain.connect(master);
  sideBGain.connect(master);

  const stopA = composeSideA(ctx, sideAGain);
  const stopB = composeSideB(ctx, sideBGain);
  const stopSurface = startSurfaceNoise(ctx, master);

  currentSide = side;
  bed = { sideAGain, sideBGain, stopA, stopB, stopSurface };
}

/** Tear down the bed with a short fade-out so cutoff is inaudible. */
export function stopBed(): void {
  if (!bed || !ctx) return;
  const b = bed;
  bed = null;
  const t = ctx.currentTime;
  b.sideAGain.gain.cancelScheduledValues(t);
  b.sideBGain.gain.cancelScheduledValues(t);
  b.sideAGain.gain.setTargetAtTime(0, t, FADE_OUT_S / 3);
  b.sideBGain.gain.setTargetAtTime(0, t, FADE_OUT_S / 3);
  // Stop scheduler + surface source after the fade completes.
  setTimeout(() => {
    b.stopA();
    b.stopB();
    b.stopSurface();
    try {
      b.sideAGain.disconnect();
      b.sideBGain.disconnect();
    } catch {
      /* already disconnected */
    }
  }, Math.ceil(FADE_OUT_S * 1000) + 100);
}

// ---- back-compat shims (Mixtape.tsx references these names) ----
export function startCrackle(): void {
  startBed(currentSide);
}
export function stopCrackle(): void {
  stopBed();
}

/**
 * Layered vinyl surface noise.
 *
 * Three voices sum into the master bus:
 *   1. Pink-ish hiss (2 s loop) — the continuous surface texture.
 *   2. Crackle ticks — sparse sharp impulses sprinkled in the buffer.
 *   3. Motor hum — a quiet 50 Hz sine + faint 2nd harmonic (the belt drive).
 *
 * The hiss buffer is long enough (4 s) that the loop point is inaudible,
 * and EQ is tuned so the bed sits below the music in the 400–1800 Hz range.
 */
function startSurfaceNoise(audioCtx: AudioContext, dest: AudioNode): () => void {
  const duration = 4;
  const buf = audioCtx.createBuffer(1, audioCtx.sampleRate * duration, audioCtx.sampleRate);
  const data = buf.getChannelData(0);
  // Pink noise via Voss-McCartney approximation.
  let b0 = 0,
    b1 = 0,
    b2 = 0;
  for (let i = 0; i < data.length; i++) {
    const w = Math.random() * 2 - 1;
    b0 = 0.99886 * b0 + w * 0.0555179;
    b1 = 0.99332 * b1 + w * 0.0750759;
    b2 = 0.969 * b2 + w * 0.153852;
    let s = (b0 + b1 + b2 + w * 0.115926) * 0.22;
    // Sparse crackle ticks (~1/80ms on average).
    if (Math.random() < 0.0005) s += (Math.random() * 2 - 1) * 0.45;
    // Rarer bigger dust pop (~1/2s).
    if (Math.random() < 0.000015) s += (Math.random() * 2 - 1) * 0.75;
    data[i] = s;
  }

  const src = audioCtx.createBufferSource();
  src.buffer = buf;
  src.loop = true;

  const hp = audioCtx.createBiquadFilter();
  hp.type = 'highpass';
  hp.frequency.value = 420;

  const peak = audioCtx.createBiquadFilter();
  peak.type = 'peaking';
  peak.frequency.value = 1500;
  peak.Q.value = 0.8;
  peak.gain.value = 3;

  const surfaceGain = audioCtx.createGain();
  surfaceGain.gain.setValueAtTime(0, audioCtx.currentTime);
  surfaceGain.gain.linearRampToValueAtTime(0.17, audioCtx.currentTime + 0.6);

  src.connect(hp).connect(peak).connect(surfaceGain).connect(dest);
  src.start();

  // 50 Hz motor hum (mains-style) — very quiet, constant.
  const hum = audioCtx.createOscillator();
  const hum2 = audioCtx.createOscillator();
  const humGain = audioCtx.createGain();
  const hum2Gain = audioCtx.createGain();
  hum.type = 'sine';
  hum2.type = 'sine';
  hum.frequency.value = 50;
  hum2.frequency.value = 100;
  humGain.gain.setValueAtTime(0, audioCtx.currentTime);
  humGain.gain.linearRampToValueAtTime(0.018, audioCtx.currentTime + 0.8);
  hum2Gain.gain.setValueAtTime(0, audioCtx.currentTime);
  hum2Gain.gain.linearRampToValueAtTime(0.007, audioCtx.currentTime + 0.8);
  hum.connect(humGain).connect(dest);
  hum2.connect(hum2Gain).connect(dest);
  hum.start();
  hum2.start();

  return () => {
    const t = audioCtx.currentTime;
    surfaceGain.gain.cancelScheduledValues(t);
    surfaceGain.gain.setTargetAtTime(0, t, 0.15);
    humGain.gain.setTargetAtTime(0, t, 0.15);
    hum2Gain.gain.setTargetAtTime(0, t, 0.15);
    setTimeout(() => {
      try {
        src.stop();
        hum.stop();
        hum2.stop();
      } catch {
        /* already stopped */
      }
    }, 550);
  };
}

function makeNoiseBuffer(seconds: number): AudioBuffer {
  // ensure() runs before callers - ctx is non-null here.
  const c = ctx as AudioContext;
  const buf = c.createBuffer(1, Math.floor(c.sampleRate * seconds), c.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}
