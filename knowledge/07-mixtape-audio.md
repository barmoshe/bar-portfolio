# Mixtape audio — currently removed

The mixtape section is **visual-only** right now. The audio engine was removed wholesale and is pending a redesign (new sound palette + new composition plan). The animated turntable, RPM knob spin, side flip, and track list all still work — they just don't produce sound.

## Where the stubs live

In `src/components/sections/Mixtape.tsx`, every place the old engine was called is marked with a `TODO(audio):` comment describing the intended re-introduction point:

- Component-level comment block at the top of the file lists the old public API surface to aim for on re-introduction.
- `toggleAudio` — where to call `unlock()`, `setEnabled(true)`, `playNeedleDrop(side)`, `startBed(side)` / `stopBed()`.
- `flipSide` — where to call `playFlip()` and `setSide(next)`.
- Volume, mute, RPM, and reduced-motion effects — where to forward state into the engine.
- `TrackVinyl.spin` — where to call `playScratch(track.side)`.

`RPM_RATE` is kept commented out next to `RPM_SPIN` so the tempo multipliers aren't lost.

## When re-introducing

Do not restore the previous Tone.js build or the zero-dep pre-Tone engine verbatim — both produced desktop audio issues (crackle, lag, autoplay warnings) for the current listening setup. Treat the next audio pass as a green-field design:

1. Decide first whether the bed is generative or pre-rendered. A single short looping file (~3–4 s) is the lowest-risk default; generative music only if there is a compelling reason.
2. Gate all `AudioContext` creation behind an explicit Start-button click. No module-load side effects, no auto-unlock on any gesture.
3. If generative: budget a single shared reverb (or none), cap polyphony, and stress-test on desktop Chrome where the previous engines glitched first.
4. Re-wire the `TODO(audio):` comment sites listed above to the new API.

## Persisted state

`bm:vinyl-audio`, `bm:vinyl-rpm`, `bm:vinyl-volume`, `bm:vinyl-mute` are still written by the UI so settings survive across sessions once audio returns. `bm:vinyl-audio` is deliberately not read on load — the next audio pass should start with audio off so the very first sound follows an explicit user click.
