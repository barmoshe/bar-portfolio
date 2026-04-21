# Music section — implementation plan

> **Status:** approved concept, awaiting execution.
> **Audience:** Claude Code (or a human running the rebuild).
> **Paired reading:** [`knowledge/music-repos.md`](./music-repos.md) — the research behind the links strip and tonal choices.
> **Target file to rewrite:** [`src/components/sections/Music.tsx`](../src/components/sections/Music.tsx) (currently a 252-line placeholder card grid; rebuild replaces it wholesale).

---

## TL;DR

Replace the placeholder card grid in the Music section with a single hand-drawn,
hand-built playable instrument — a **1-octave ink-drawn synth** with two sketchy knobs
(filter cutoff + waveform) and a live waveform scope, plus a small links strip below that
points into Bar's real music-engineering repos. The instrument is built on the Web Audio
API with *no* new runtime dependencies, consistent with Bar's actual JUCE / DSP-primitives
lineage documented in the paired research file. The section *is* the demo; the demo *is*
the proof; the proof is that the entire stack from oscillator to UI was built by hand.

The folio counter `05 // OFF-KEYBOARD` stays — the site has been advertising this concept
since day one.

---

## Concept — the north star

The visitor scrolls past Repos. The ink-bleed headline flickers in. They see a small
hand-sketched synth sitting on the page with a prompt reading *"tap to wake."* They click.
The overlay dissolves, a short signature motif begins to play quietly on its own. They
press a key; it makes a warm, considered note, not a cartoon bleep. They discover they can
play it with the `A`–`K` row. They drag a knob, the tone opens up, a little waveform
wobbles on screen. Thirty seconds later they've played a melody, and the section has
earned its place without a single line of marketing copy.

The instrument doubles as the argument: *I build audio from the oscillator up.* The body
of work in [music-repos.md](./music-repos.md) backs that up.

---

## Design principles (non-negotiable)

1. **It is an artifact, not a widget.** Every detail signals *a person built this*: crooked
   keys, visible keyboard mapping letters, an AnalyserNode-driven scope reading the actual
   audio. No polished UI-library look.
2. **It demonstrates both crafts.** The *sound* is the music brief. The *build* is the
   engineering brief. Both must land.
3. **Native to the house style.** Ink, dashed borders, slight rotations, the same ink-bleed
   motif the rest of the site uses. Not a visiting guest from a different website.
4. **Low barrier, high ceiling.** Anyone can click a key and get a pleasant note.
   A curious visitor discovers the keyboard mapping, the knob, the record affordance.
5. **Quiet by default.** Gated behind an explicit "tap to wake" gesture.
6. **No wrong notes.** Keys are quantised to a forgiving scale (pentatonic or Dorian) so
   anything the visitor plays sounds musical. This is the design thesis made audible —
   *well-designed systems make people look good.*

---

## Visitor experience, moment by moment

- **Before interaction.** The instrument is visible but silent. A soft prompt reads
  *"tap to wake."*
- **First click.** AudioContext resumes. A short signature motif plays once — quiet,
  pentatonic, under 4 seconds — to confirm the instrument is alive. The wake prompt fades.
- **Exploration.** Clicks, taps, or the `A S D F G H J K` keyboard row trigger notes.
  Black keys on `W E T Y U`. Each key animates (press-down + a soft LED glow) and
  produces an ink-ripple in the section background using an existing palette token.
- **Knob A — filter cutoff.** Vertical drag sweeps a lowpass from muffled to open.
- **Knob B — waveform.** Snaps between sine · triangle · square · saw with a small
  label change.
- **Idle.** After ~12 s without input the instrument *plays itself* — a looped signature
  motif at whisper volume. First interaction interrupts it. Motif resumes when idle again.
- **Record (optional, phase 4).** A small ink-drawn "rec" button captures the next 8
  seconds and offers it back as a shareable link or short audio download.

---

## Tech choices

- **Vanilla Web Audio API. No Tone.js. No react-piano.** Bar's CLAUDE.md explicitly says
  *"No new runtime deps for cosmetic changes."* A single-voice mono synth does not need
  Tone.js's scheduling abstractions, and hand-rolling it is the engineering brief.
  Current deps (`react`, `react-dom`, `gsap`, `@gsap/react`) are sufficient.
- **Graph shape:** one lazy `AudioContext`, one `OscillatorNode` per active key (polyphony
  is trivial to allow), a shared `BiquadFilterNode` (lowpass), a shared `GainNode` for a
  short AD envelope per press, and one `AnalyserNode` tapped off the master bus feeding
  the scope.
- **Gesture requirement.** Browsers block audio before a user gesture. The AudioContext is
  created on first wake-click, then `resume()`d. See MDN's Web Audio best practices.
- **Scale lock.** All key triggers quantise to a pentatonic (suggested: A minor pentatonic:
  A C D E G, plus octave) so the instrument cannot produce clashing notes.
- **No WebGL, no 3D, no sample files.** Pure synthesis + SVG / canvas visuals.
- **Bundle impact target: < 8 KB gzipped added.** If approaching that, simplify rather
  than add.

---

## File plan

### New files

- `src/components/music/Synth.tsx` — orchestrator. Holds audio-graph state via a ref,
  composes children, emits note-on/off events, handles the wake overlay.
- `src/components/music/Keys.tsx` — renders 13 keys (7 white + 5 black + top C). Handles
  pointer events + `keydown` / `keyup` for the QWERTY mapping. Exposes
  `onNoteOn(midi)` / `onNoteOff(midi)` props.
- `src/components/music/Knob.tsx` — reusable hand-drawn knob. Props: `value`, `onChange`,
  `min`, `max`, `label`, `mode: 'continuous' | 'stepped'`. Drag vertically to change;
  focusable with arrow keys for accessibility.
- `src/components/music/Scope.tsx` — 120 × 32 px canvas or inline SVG `polyline` drawing
  the AnalyserNode's time-domain buffer at 60 fps. Lives inside a dashed ink frame.
- `src/components/music/LinksStrip.tsx` — renders 3–4 small ink chips linking to repos.
  Content enumerated below.
- `src/lib/audio.ts` — `createSynth()` factory. Encapsulates the Web Audio graph so
  components can stay free of audio plumbing. Exports: `createSynth(): { noteOn, noteOff,
  setCutoff, setWave, getAnalyser, destroy }`.

### Modified files

- `src/components/sections/Music.tsx` — *rewrite*. Becomes a thin shell: folio counter,
  stamp, headline, dek, `<Synth />`, `<LinksStrip />`. Keep the existing GSAP entry
  animations for stamp / headline / dek (the patterns in `Music.tsx` lines 59–168 are
  well-formed; migrate them into the rewrite, just remove everything below the dek).
- `src/components/TabBar.tsx` — add `'music'` into the `SECTIONS` tuple (currently
  `['dossier', 'experience', 'repos', 'notes', 'letter']`, line 3). This makes the section
  discoverable in the mobile tabbar nav. Add a matching `<a href="#music">` entry with an
  icon (a small plucked-string or waveform glyph would fit the theme).
- `src/styles.css` — add blocks for `.synth`, `.synth__wake`, `.key`, `.knob`, `.scope`,
  `.links-strip`. Use only `oklch()` for colors and existing tokens where possible.

### Files to NOT touch

- `index.html` (pre-paint theme script — CLAUDE.md §1 invariant)
- `src/components/HeroSlides.tsx` (fx cycle invariant — CLAUDE.md §2)
- `vite.config.ts` (base path invariant — CLAUDE.md §3)
- `public/.nojekyll` (deploy invariant — CLAUDE.md §4)
- `src/components/InkDefs.tsx` — the `'music'` filter id is already registered; reuse it.

---

## Styling plan

Pull only from existing tokens in `src/styles.css`. If new tokens are needed, add them in
**both** `:root` **and** `html.dark` in the same commit (CLAUDE.md `Defaults`).

**Instrument frame:** dashed 1.5 px border in `--green`, `6 px 7 px 0 var(--green)` offset
shadow, background `var(--paper)`. Rotate the whole instrument by `-0.4deg` for the
hand-drawn tilt.

**Keys:** each white key uses `var(--paper)` background, `1.5 px` dashed `var(--ink)`
border, its own tiny rotation (`-0.3deg` + `i * 0.1deg` alternating). Black keys use
`var(--surface-strong)` with `var(--paper)` text. Active state: lift via
`transform: translateY(1px)`, tint background toward `var(--green)`, add
`filter: drop-shadow(0 0 10px var(--cyan))` for a momentary LED glow. Each key shows its
QWERTY letter in small `var(--mono)` text at the bottom — no hidden knowledge.

**Knobs:** SVG, two concentric circles + a tick mark. Drag handle is the outer ring;
tick points toward the current value. Colors: base `var(--surface-strong)`, tick
`var(--green)`, label `var(--mono)`.

**Scope:** canvas inside a dashed ink frame. Waveform stroke: `var(--magenta)` on light,
`var(--cyan)` on dark. Thin line (1 px), no fill.

**Wake overlay:** centered text *"tap to wake"* in `var(--display)` at ~1.4 rem, applies
`filter: url(#music)` so the existing ink-bleed treatment animates the text in on mount
and fades on click.

**Ink ripples (per note):** on note-on, absolutely-position a small 12 px ink splash at
the key's x position at the top of the instrument that drifts up and fades over 700 ms.
Color is chosen per note from a fixed palette array so the octave has *colors* as well as
pitches.

---

## Accessibility & reduced motion

- Each key is a focusable `<button>` with `aria-label="C4"` etc., plus `role="button"`.
- Space / Enter on a focused key triggers the note.
- QWERTY mapping is *visible*, not hidden — small letter on each key.
- Knobs are focusable; left/down arrows decrement, right/up arrows increment by a
  sensible step. `aria-valuemin` / `aria-valuemax` / `aria-valuenow` set.
- Wake overlay is dismissable with `Enter` as well as click.
- `prefers-reduced-motion`: wrap all decorative animation inside
  `gsap.matchMedia()` + branch on `FULL_MOTION_QUERY` (pattern already used in
  `Music.tsx`). In reduced mode: sound still works, knob drag still works, LED glow and
  ink ripples and idle motif remain but all spring/overshoot eases become linear tweens.
- The idle motif respects `prefers-reduced-motion` by reducing its volume further and
  skipping the ripple animation.
- Keys are not tab traps — Tab escapes the instrument on the last key.
- Contrast: all body text pairs must clear WCAG AA (≥ 4.5 : 1).

---

## Links strip — the proof

Render 3 ink chips in a horizontal strip directly below the instrument. Labels and URLs
(sourced from [music-repos.md](./music-repos.md)):

1. **first audio app** → [`WhiteNoiseGenerator`](https://github.com/barmoshe/WhiteNoiseGenerator)
2. **first DAW plugin** → [`GainIsWhatYouNEED`](https://github.com/barmoshe/GainIsWhatYouNEED)
3. **full-stack music app** → [`Israelify-backend`](https://github.com/barmoshe/Israelify-backend)

Optional 4th (discuss before adding): **MIDI + AI pipeline** →
[`AI_MIDI_API`](https://github.com/barmoshe/AI_MIDI_API).

Chip style: dashed ink border, `var(--mono)` label text, small glyph prefix (e.g. `✎`,
`↓`, `∞`), hover rotates ±1° and brightens. External links open in a new tab.

Caption under the strip in `var(--mono)` 11 px: *"this synth is built from scratch in the
browser; these are its cousins."* Reinforces the thesis.

---

## Invariants to respect (from CLAUDE.md)

- **Colors:** `oklch()` only. If a token is added, land it in `:root` **and** `html.dark`
  in the same commit.
- **Motion:** prefer `transform` / `opacity` / `filter`. Always wrap decorative motion in
  `gsap.matchMedia()`.
- **No Tailwind.** CSS custom properties only.
- **No new runtime deps.** Web Audio API is native — this is not a new dep.
- **No React Router.** Single page + hash anchors.
- **Pre-paint theme script** in `index.html` must remain externally undisturbed.
- **`HeroSlides` fx cycle** in `src/components/HeroSlides.tsx` must remain untouched.
- **Base path `/bar-portfolio/`** in `vite.config.ts` must remain.
- **`public/.nojekyll`** must still land in `dist/`.

Running `npm run typecheck` and `npm run build` must both pass after every phase.

---

## Phased execution

Each phase is **shippable on its own**. Stop after any phase if priorities change.

### Phase 1 — audio core + silent keys (MVP of MVP)

Goal: make the synth make sound via mouse and keyboard; styling can be rough.

- [ ] Create `src/lib/audio.ts` with `createSynth()` returning `{ noteOn, noteOff,
      setCutoff, setWave, getAnalyser, destroy }`.
- [ ] Create `src/components/music/Keys.tsx` rendering 13 keys; wire pointer + keydown
      events; scale-lock to A-minor-pentatonic across the octave.
- [ ] Create `src/components/music/Synth.tsx` with the wake overlay; on wake, call
      `ctx.resume()` and play the signature motif once.
- [ ] Replace the card grid in `src/components/sections/Music.tsx` with `<Synth />`.
      Keep the existing GSAP intro (stamp / headline / dek).
- [ ] Rewrite the headline to match the new concept — suggested: *"A small instrument,
      built by hand."* (replace the current *"The other instrument."*).
- [ ] Rewrite the dek — suggested: *"Built with Web Audio, no libraries. Click the keys,
      or use A–K on your keyboard."*
- [ ] Add `'music'` to the TabBar sections tuple.
- [ ] `npm run typecheck && npm run build` must pass.
- [ ] Smoke test on Chrome, Safari, and mobile Safari (audio unlock + latency).

**Done when:** mouse and keyboard both produce pleasant notes, the section is in the
TabBar, the build passes.

### Phase 2 — visual polish

Goal: make it look hand-drawn.

- [ ] Style keys per spec (dashed borders, tilt, QWERTY letter overlay).
- [ ] Implement LED glow + translate-down on active state.
- [ ] Implement per-note ink ripples in `Synth.tsx` (GSAP, absolute-positioned splashes).
- [ ] Style the wake overlay with ink-bleed filter.
- [ ] Validate `prefers-reduced-motion` paths.

**Done when:** the instrument looks unmistakably part of the site and responds visibly
to every interaction.

### Phase 3 — knobs + scope

Goal: deepen the interactivity.

- [ ] Build `src/components/music/Knob.tsx` with drag + keyboard support and ARIA.
- [ ] Build `src/components/music/Scope.tsx` rendering the AnalyserNode waveform at 60
      fps (requestAnimationFrame inside `useEffect`; cleanup on unmount).
- [ ] Wire cutoff knob → `setCutoff` and waveform knob → `setWave`.
- [ ] Add the idle motif: after 12 s of no input, loop a 4-bar pentatonic phrase at
      low volume until next user input.

**Done when:** both knobs change the sound audibly and the scope reflects the live output.

### Phase 4 — links strip + record keepsake

Goal: turn the toy into proof.

- [ ] Build `src/components/music/LinksStrip.tsx` with the three repo chips.
- [ ] (Optional) record-8-seconds button: capture audio via `MediaRecorder` on a
      `MediaStreamAudioDestinationNode`, offer the blob as a download (no external
      upload — privacy). Gated by explicit user click.
- [ ] Copy-polish pass on all text.

**Done when:** clicking the chips opens the repos in a new tab and the section now
advertises real work.

---

## Acceptance criteria

A pass on all of these means the rebuild is complete:

- Clicking any key produces a note via Web Audio; no clicks, pops, or stuck notes.
- QWERTY row (`A S D F G H J K` + `W E T Y U`) plays the instrument without focus-trap
  issues.
- Tab order enters the instrument, traverses keys and knobs, and exits cleanly.
- Knobs are operable with keyboard (arrow keys) and screen-readers (ARIA).
- Wake gesture is required before any sound plays.
- `prefers-reduced-motion: reduce` removes overshoot tweens; audio remains fully
  functional.
- The section is present in the mobile TabBar and scrolls into view from a `#music` hash.
- `npm run typecheck` passes.
- `npm run build` produces a `dist/` with `.nojekyll` and the base path unchanged.
- GitHub Actions deploy succeeds on push to `main`.
- Lighthouse: Accessibility ≥ 95, Performance ≥ 85 on mobile emulation.
- Manual check on iOS Safari: AudioContext unlocks on the wake tap.

---

## Out of scope (on purpose)

No MIDI input. No multi-octave. No octave-shift. No preset browser. No sample playback.
No WebGL. No collaborative jam. No third-party audio libraries. No login or server
interaction. No analytics on notes played. Holding the line on scope is the signal —
a confident small thing beats a sprawling half-finished thing.

---

## Risks & mitigations

- **iOS Safari audio unlock.** Always create the AudioContext on user gesture, then
  `resume()`. Test explicitly on iOS Safari in Phase 1.
- **Harsh sustained notes at default filter.** Initial cutoff is half-closed
  (~ 1200 Hz), master gain is conservative (-6 dB).
- **Stuck notes on fast typing.** Note-off fires on every `keyup`, but also force-release
  notes whose `keydown` hasn't been paired within 2 s.
- **Idle motif auto-playing after wake is confusing.** The motif only starts *after* the
  12 s idle threshold following the wake; it does not auto-loop from the start.
- **Accessibility regressions.** Keep the keys as real `<button>`s; never re-invent with
  `<div role="button">`.
- **Visual clash with the rest of the site.** Hand-drawn style is enforced via
  existing tokens; no new color palette introduced.
- **Scope canvas janks on low-end mobiles.** Cap the analyser FFT size at 1024 and
  downsample to 64 points before drawing; skip the scope entirely if the device is
  detected as reduced-motion.

---

## Optional escalations (post-ship, if appetite remains)

- A second parallel string tuned to a sympathetic drone, for duet playing.
- Idle motif subtly evolves across visits via a small state hash in `localStorage`
  equivalent (must respect the repo's `localStorage`-free conventions — an in-URL
  parameter is preferable).
- A miniature one-line version of the instrument in the `Notes` footer — pluck once to
  hear the calling-card motif from anywhere on the site.
- WebMIDI support for visitors with a hardware controller (progressive enhancement).

---

## Hand-off notes for Claude Code

Before writing any code:

1. Read [`knowledge/music-repos.md`](./music-repos.md) to internalise the lineage the
   section is advertising.
2. Read the current [`src/components/sections/Music.tsx`](../src/components/sections/Music.tsx)
   top-to-bottom — the GSAP entry animations there are well-formed and must migrate into
   the new shell intact.
3. Read [`knowledge/99-caveats.md`](./99-caveats.md) once more — the "do not break" list
   must be respected.
4. Start Phase 1 only. Ship it, then return for Phase 2.

If anything in this plan conflicts with the site's existing patterns, the existing patterns
win — flag the conflict and pause for a decision rather than diverging silently.
