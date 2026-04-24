import {
  MIXTAPE_TRACKS,
  MIXTAPE_SFX,
  type MixtapeSide,
  type MixtapeSfxKey,
} from './mixtapeTracks';

type SideMap<T> = Record<MixtapeSide, T>;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let muteGain: GainNode | null = null;
let comp: DynamicsCompressorNode | null = null;
let sideBus: SideMap<GainNode> | null = null;
let sideReverb: SideMap<ConvolverNode> | null = null;
let hissSource: AudioBufferSourceNode | null = null;
let hissGain: GainNode | null = null;

let activeSide: MixtapeSide = 'A';
let pendingSide: MixtapeSide = 'A';
let bedSource: AudioBufferSourceNode | null = null;
let bedPlaybackRate = 1;
let enabled = false;
let reducedMotion = false;
let volume = 0.65;
let muted = false;

const buffers = new Map<string, Promise<AudioBuffer | null>>();
const sfxBufs: Partial<Record<MixtapeSfxKey, AudioBuffer>> = {};
let relaunchTimer: number | null = null;

const HISS_GAIN_DEFAULT = 0.0316;
const FADE_IN_S = 0.35;
const FADE_OUT_S = 0.35;
const PAUSE_ON_CHANGE_MS = 780;

const url = (rel: string) => `${import.meta.env.BASE_URL}${rel}`;

function makeNoiseBuffer(context: AudioContext, seconds: number): AudioBuffer {
  const buf = context.createBuffer(1, Math.max(1, Math.floor(context.sampleRate * seconds)), context.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
  return buf;
}

function makeReverbIR(context: AudioContext, decaySec: number): AudioBuffer {
  const length = Math.max(1, Math.floor(context.sampleRate * decaySec));
  const buf = context.createBuffer(2, length, context.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const data = buf.getChannelData(ch);
    for (let i = 0; i < length; i++) {
      const t = i / length;
      data[i] = (Math.random() * 2 - 1) * Math.exp(-4 * t);
    }
  }
  return buf;
}

async function fetchBuffer(rel: string): Promise<AudioBuffer | null> {
  if (!ctx) return null;
  const absolute = url(rel);
  const cached = buffers.get(absolute);
  if (cached) return cached;
  const promise = (async () => {
    try {
      const res = await fetch(absolute);
      if (!res.ok) return null;
      const arr = await res.arrayBuffer();
      return await ctx!.decodeAudioData(arr);
    } catch (err) {
      console.warn('[mixtapeAudio] failed to load', rel, err);
      return null;
    }
  })();
  buffers.set(absolute, promise);
  return promise;
}

function preloadSfx() {
  if (!ctx) return;
  (Object.keys(MIXTAPE_SFX) as MixtapeSfxKey[]).forEach(async (key) => {
    const buf = await fetchBuffer(MIXTAPE_SFX[key]);
    if (buf) sfxBufs[key] = buf;
  });
}

function startHiss() {
  if (!ctx || !master) return;
  const source = ctx.createBufferSource();
  const filter = ctx.createBiquadFilter();
  const gain = ctx.createGain();
  filter.type = 'highpass';
  filter.frequency.value = 2000;
  filter.Q.value = 0.7;
  gain.gain.value = reducedMotion ? 0 : HISS_GAIN_DEFAULT;
  source.loop = true;
  source.connect(filter).connect(gain).connect(master);
  (async () => {
    const fromFile = await fetchBuffer(MIXTAPE_SFX.hiss);
    if (!ctx || source !== hissSource) return;
    source.buffer = fromFile ?? makeNoiseBuffer(ctx, 2);
    try {
      source.start(0);
    } catch {
      /* already started or disposed */
    }
  })();
  hissSource = source;
  hissGain = gain;
}

export function unlock() {
  if (!ctx) {
    const Ctor = (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext);
    ctx = new Ctor();

    master = ctx.createGain();
    master.gain.value = volume * 0.6;

    muteGain = ctx.createGain();
    muteGain.gain.value = muted ? 0 : 1;

    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -3;
    comp.knee.value = 6;
    comp.ratio.value = 3;
    comp.attack.value = 0.003;
    comp.release.value = 0.25;

    master.connect(muteGain).connect(comp).connect(ctx.destination);

    const busA = ctx.createGain();
    const busB = ctx.createGain();
    busA.gain.value = 0;
    busB.gain.value = 0;
    busA.connect(master);
    busB.connect(master);
    sideBus = { A: busA, B: busB };

    const revA = ctx.createConvolver();
    const revB = ctx.createConvolver();
    revA.buffer = makeReverbIR(ctx, 1.6);
    revB.buffer = makeReverbIR(ctx, 2.0);
    revA.connect(busA);
    revB.connect(busB);
    sideReverb = { A: revA, B: revB };

    startHiss();
    preloadSfx();
  } else if (ctx.state === 'suspended') {
    ctx.resume().catch(() => { /* ignore */ });
  }
}

export function isEnabled() {
  return enabled;
}

export function setEnabled(on: boolean) {
  enabled = on;
  if (!on) {
    if (relaunchTimer !== null) {
      clearTimeout(relaunchTimer);
      relaunchTimer = null;
    }
    stopBed();
  }
}

function fadeSideIn(side: MixtapeSide) {
  if (!ctx || !sideBus) return;
  const g = sideBus[side].gain;
  const now = ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(1, now + FADE_IN_S);
}

function fadeSideOut(side: MixtapeSide, seconds = FADE_OUT_S) {
  if (!ctx || !sideBus) return;
  const g = sideBus[side].gain;
  const now = ctx.currentTime;
  g.cancelScheduledValues(now);
  g.setValueAtTime(g.value, now);
  g.linearRampToValueAtTime(0, now + seconds);
}

async function launchBedFor(side: MixtapeSide) {
  if (!ctx || !sideBus || !enabled) return;
  const track = MIXTAPE_TRACKS.find((t) => t.side === side);
  if (!track) return;
  const buffer = await fetchBuffer(track.src);
  if (!buffer || !ctx || !sideBus || !enabled) return;
  if (bedSource) {
    try { bedSource.stop(); } catch { /* already stopped */ }
    bedSource.disconnect();
    bedSource = null;
  }
  const src = ctx.createBufferSource();
  src.buffer = buffer;
  src.loop = true;
  src.playbackRate.value = bedPlaybackRate;
  src.connect(sideBus[side]);
  try {
    src.start(0);
  } catch {
    return;
  }
  bedSource = src;
  activeSide = side;
  if (sideBus) {
    const other: MixtapeSide = side === 'A' ? 'B' : 'A';
    fadeSideOut(other, FADE_IN_S);
    fadeSideIn(side);
  }
}

export function startBed(side: MixtapeSide) {
  if (!ctx) return;
  pendingSide = side;
  activeSide = side;
  void launchBedFor(side);
}

export function stopBed() {
  if (!ctx || !sideBus) return;
  fadeSideOut('A');
  fadeSideOut('B');
  const src = bedSource;
  bedSource = null;
  if (src) {
    setTimeout(() => {
      try { src.stop(); } catch { /* already stopped */ }
      src.disconnect();
    }, Math.ceil(FADE_OUT_S * 1000) + 50);
  }
}

function schedulePauseAndRelaunch() {
  if (relaunchTimer !== null) clearTimeout(relaunchTimer);
  relaunchTimer = window.setTimeout(() => {
    relaunchTimer = null;
    if (!enabled || !ctx) return;
    if (!bedSource) {
      activeSide = pendingSide;
      return;
    }
    fadeSideOut(activeSide, 0.2);
    const src = bedSource;
    bedSource = null;
    setTimeout(() => {
      try { src.stop(); } catch { /* already stopped */ }
      src.disconnect();
    }, 250);
    setTimeout(() => {
      if (!enabled) return;
      activeSide = pendingSide;
      void launchBedFor(activeSide);
    }, 300);
  }, PAUSE_ON_CHANGE_MS);
}

export function setSide(next: MixtapeSide) {
  pendingSide = next;
  if (!ctx || !bedSource) {
    activeSide = next;
    return;
  }
  if (next === activeSide) return;
  schedulePauseAndRelaunch();
}

export function setRpm(mult: number) {
  bedPlaybackRate = mult;
  if (!ctx || !bedSource) return;
  schedulePauseAndRelaunch();
}

export function setVolume(v: number) {
  volume = Math.max(0, Math.min(1, v));
  if (!ctx || !master) return;
  const now = ctx.currentTime;
  master.gain.setTargetAtTime(volume * 0.6, now, 0.02);
}

export function setMuted(m: boolean) {
  muted = m;
  if (!ctx || !muteGain) return;
  const now = ctx.currentTime;
  muteGain.gain.cancelScheduledValues(now);
  muteGain.gain.setValueAtTime(muteGain.gain.value, now);
  muteGain.gain.linearRampToValueAtTime(m ? 0 : 1, now + 0.02);
}

export function setReducedMotion(rm: boolean) {
  reducedMotion = rm;
  if (!ctx || !hissGain) return;
  const now = ctx.currentTime;
  hissGain.gain.cancelScheduledValues(now);
  hissGain.gain.setValueAtTime(hissGain.gain.value, now);
  hissGain.gain.linearRampToValueAtTime(rm ? 0 : HISS_GAIN_DEFAULT, now + 0.12);
}

function playOneShot(key: MixtapeSfxKey, routeSide: MixtapeSide | null) {
  if (!enabled || !ctx || !master) return;
  const buf = sfxBufs[key];
  if (!buf) return;
  const src = ctx.createBufferSource();
  const env = ctx.createGain();
  src.buffer = buf;
  env.gain.value = 1;
  src.connect(env);
  if (routeSide && sideBus && sideReverb) {
    env.connect(sideBus[routeSide]);
    env.connect(sideReverb[routeSide]);
  } else {
    env.connect(master);
  }
  try {
    src.start(0);
  } catch {
    /* ignore */
  }
}

export function playNeedleDrop(side: MixtapeSide) {
  playOneShot(side === 'A' ? 'needleDropA' : 'needleDropB', side);
}

export function playFlip() {
  playOneShot('flip', null);
}

export function playScratch(side: MixtapeSide) {
  playOneShot(side === 'A' ? 'scratchA' : 'scratchB', side);
}
