# Mixtape audio engine

Tone.js-driven procedural audio for the `#mixtape` section. No audio assets — every sound is synthesized at runtime. Two compositions (Side A: 78 BPM lo-fi hip-hop, F major; Side B: 60 BPM ambient, D dorian) play continuously once enabled and equal-power-crossfade on flip.

## Files

- `src/lib/vinylAudio.ts` — public API + master chain wiring + SFX
- `src/lib/music/effects.ts` — shared factories: `makeMasterChain`, `makePlateReverb`, `makePingPong`, `makeTape`, `makeSurfaceNoise`
- `src/lib/music/instruments.ts` — Tone.js voice factories (FM e-piano, FM bell, fat-saw pad, mono sub bass, sine drone, kick / snare / hat / open-hat / rim / tom)
- `src/lib/music/scheduler.ts` — Chris Wilson lookahead scheduler over `Tone.now()`
- `src/lib/music/sideA.ts` / `sideB.ts` — compositions
- `src/lib/music/tuning.ts` — MIDI ↔ Hz, chord builder
- `src/components/sections/Mixtape.tsx` — UI: vinyl rig SVG, on/off, RPM knob, side toggle, **volume slider**, **mute toggle**, **aria-live** announcement

## Signal graph

```
              ┌──────── instruments (dry)  ─────────┐
              │                                     │
sideABus ─────┼── reverbA send → plate ── return ───┤
              │                                     │
              └── delayA  send → ping-pong ── return┤
                                                    ▼
                                  tape wow/flutter (Vibrato + Chorus)
                                                    ▼
                                                sideAGain (crossfade)
                                                    ▼
sideBBus  ⟶ ⟨ same shape ⟩  ⟶  sideBGain  ─────────►┐
                                                    ▼
surface noise ─────────────────────────────────────►┤
                                                    ▼
                                          MASTER CHAIN  (musicIn)
                                Chebyshev sat → EQ3 → StereoWidener → Compressor → Limiter → Volume → Destination
                                                                                                  ▲
SFX (needle / flip / scratch / pop) ─► sfxIn ─► Limiter ──────────────────────────────────────────┘
```

The two paths share the limiter (so SFX can't clip the output) but **only music passes through the compressor**. SFX bypass it deliberately so a needle drop or flip click doesn't trigger sidechain pumping under the music.

Per-side reverb + delay sends live inside `composeSideA` / `composeSideB` and **return into the side bus before** the tape stage and the side gain. That means tails warp with wow/flutter and crossfade with the side itself — no orphaned reverb hanging across a side flip.

## Public API (`vinylAudio.ts`)

```ts
unlock()                     // call inside a click/keydown to lift autoplay
setEnabled(on: boolean)
isEnabled(): boolean
startBed(side?: 'A' | 'B')   // starts both compositions; routes to chosen side
stopBed()                    // fades + tears down compositions
setSide('A' | 'B')           // equal-power crossfade
setRpm(multiplier)           // 1 = native; 1.35 = 45rpm; 2.34 = 78rpm
setVolume(linear 0..1)       // master, persisted by Mixtape.tsx
setMuted(b: boolean)         // hard mute; scheduler keeps running
setReducedMotion(r: boolean) // see "Reduced motion" below
playNeedleDrop(side)
playFlip()
playScratch(side)            // gated off when reduced-motion is on
playPop()
```

## Reduced motion

`setReducedMotion(true)` flattens the audio "motion" layer without removing the music:

| Layer | Effect at `reduced=true` |
|---|---|
| Tape wow/flutter | depth → 0 (`tape.setIntensity(0)`) |
| Side B pad filter LFO | LFO span → 0 (`sawPad.setBreath(0)`) |
| Side A ghost snares, rim, fill, open-hat lift | suppressed |
| Side B reverse-swell + counter-melody | suppressed |
| Scratch SFX | gated off (matches the visual disc-spin gate at `Mixtape.tsx`'s `TrackVinyl`) |

Mixtape.tsx subscribes to `(prefers-reduced-motion: reduce)` via `matchMedia` and forwards changes into `setReducedMotion` so the user can toggle their OS preference without reloading.

## Music design

### Side A — "Confident Sunday" (78 BPM, F major, 8 bars)

- Progression: Fmaj7 — Am7 — Dm7 — B♭maj7 (2 bars each)
- **Shell voicings** (3-7-9) on the e-piano so the chord stays open over the bass
- Bass: root, octave, fifth + **passing tone every other bar** approaching the next chord
- **Swing** 12% on off-grid 16ths
- Drums: kick on 1+9, snare on 5+13, hats on 8ths, **ghost snares 18%** on odd 16ths, **rim ~16%** on weak 8ths
- **Bar-8 fill**: open-hat lift on step 14 + tom on 11/13/15 + extra ghost kick on 14
- Sends: e-piano + bell → plate reverb (0.32, 0.4); hats → ping-pong delay (0.22)

### Side B — "Lab Nocturne" (60 BPM, D dorian, 16 bars)

- Progression: Dm9 — Fmaj9 — Am11 — Gm9 (4 bars each)
- Detuned 3-saw pad with **slow filter LFO** (0.08 Hz, 800 Hz ↔ 1600 Hz cutoff)
- Sub drone with built-in **±6 ¢ detune sway** (LFO at 0.033 Hz)
- Generative pentatonic arp (~16% per 16th, deterministic hash) + sparse **counter-melody** two octaves up
- **Reverse swell**: top voice re-strikes on step 12 of bar 4/8/12/16, crests into the downbeat
- Sends: pad + bells → plate reverb (0.55–0.6); bells → delay (0.32); drone is dry

## Determinism

All "humanization" / generative randomness uses a small mixer hash over `bar * 16 + step + offset` (in `sideA.ts`/`sideB.ts`'s `hash01`). This keeps two consecutive flips between sides identical instead of drifting — and means a recording of the audio is reproducible.

## Volume + mute persistence

Mixtape.tsx persists three audio settings to localStorage (all wrapped in `try/catch`):

- `bm:vinyl-audio` — `'1'` / `'0'` on/off
- `bm:vinyl-rpm` — `33` / `45` / `78`
- `bm:vinyl-volume` — float `0..1`
- `bm:vinyl-mute` — `'1'` / `'0'`

Mute is distinct from on/off: muting keeps the scheduler running so unmute resumes mid-bar with no warm-up cost.

## Verification (manual)

- `npm run dev` → `http://localhost:5173/#mixtape`
- Click START → needle drop SFX, Side A begins. Listen for: swing pocket, ghost snares, e-piano shell voicings, hat ping-pong delay
- Toggle SIDE → flip SFX with run-to-run variation, equal-power crossfade
- Toggle MUTE → instant silence, scheduler keeps ticking; unmute resumes at correct bar
- Drag VOL → `aria-live` reads "Volume N percent"; level changes audibly without zipper noise
- Click track vinyl → scratch SFX with low rubber-friction body; music does **not** duck
- DevTools → Rendering → Emulate `prefers-reduced-motion: reduce` → tape pad sounds steady (no wow/flutter), no fills, no scratch SFX on track click; main beat continues
- `npm run typecheck` → clean
- `npm run build` → clean
