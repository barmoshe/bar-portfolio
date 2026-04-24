# Mixtape audio engine

Zero-dependency Web Audio API engine for the `#mixtape` section. No audio assets and no libraries — every sound is synthesized directly on `AudioContext` + oscillator / filter / buffer-source nodes. Two compositions (Side A: 78 BPM lo-fi hip-hop in F major; Side B: 60 BPM ambient in D dorian) play continuously once enabled and equal-power-crossfade on flip.

## Files

- `src/lib/vinylAudio.ts` — public API, AudioContext lifecycle, master chain, procedural SFX (needle drop, flip, scratch, pop), layered surface noise.
- `src/lib/music/instruments.ts` — procedural voice factories (FM e-piano, FM bell, detuned saw pad, mono sub bass, sine drone, kick / snare / hat / open hat / rim / tom). Each `trigger(time, midi, vel)` is a short-lived graph of oscillator + gain + filter nodes that disconnects on release.
- `src/lib/music/scheduler.ts` — Chris Wilson lookahead scheduler over `ctx.currentTime`. 25 ms tick, 0.12 s horizon.
- `src/lib/music/sideA.ts` / `sideB.ts` — compositions.
- `src/lib/music/tuning.ts` — MIDI ↔ Hz, chord builder.
- `src/components/sections/Mixtape.tsx` — UI: vinyl rig SVG, on/off, RPM knob, side toggle, volume slider, mute toggle, `aria-live` announcement.

## Signal graph

```
sideABus (GainNode) ── composeSideA(ctx, sideABus) ─┐
                                                    ├── sideAGain (crossfade)
                                                    │        │
                                                    │        ▼
sideBBus            ── composeSideB(ctx, sideBBus) ─┘   master (volume)
                                                              │
surface noise (pink + ticks + dust + 50/100 Hz hum) ──────────►│
                                                              ▼
                                                          muteGain
                                                              ▼
                                                         destination

SFX (needle / flip / scratch / pop) ──► master (same path)
```

No compressor, no limiter, no convolver reverb. The pre-Tone baseline intentionally ran without those; today's engine follows that baseline so the audio thread stays light on desktop Chrome where those nodes were previously triggering steady-state dropouts.

## Autoplay lock

`unlock()` is the only function that may create the `AudioContext`. It is called inside a `pointerdown` / `keydown` handler in `Mixtape.tsx`. No Tone-style module-load side effects — nothing touches `AudioContext` before the user clicks.

## Public API (`vinylAudio.ts`)

```ts
unlock()                     // call inside a click/keydown to lift autoplay
setEnabled(on: boolean)
isEnabled(): boolean
startBed(side?: 'A' | 'B')   // starts both compositions; routes to chosen side
stopBed()                    // fades + tears down compositions
setSide('A' | 'B')           // equal-power crossfade
setRpm(multiplier: number)   // 1 = native BPM
setVolume(linear: number)    // 0..1, ramps master gain
setMuted(muted: boolean)     // post-master mute gate
setReducedMotion(r: boolean) // no-op today (engine is static), kept for parity
playNeedleDrop(side)
playFlip()
playScratch(side)
playPop()
```

All setters are safe to call before the context is created — values are cached and applied when the chain is built in `ensure()`.

## Visibility

A single `visibilitychange` listener is installed on context creation. When the tab is hidden while audio is running, the context is `suspend()`ed; on return it is `resume()`d. This prevents the bursts of overdue events that otherwise appear when a throttled `setTimeout` scheduler catches up.

## RPM

`setRpm(multiplier)` forwards into the custom scheduler's `setBpm` on both sides. Each composition was written at its native BPM (A=78, B=60); the multiplier scales both proportionally so the 33⅓ / 45 / 78 knob in the UI feels physical.
