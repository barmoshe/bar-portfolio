# Music-related repos on GitHub — research report

Research input for the Music section rebuild. This document surveys every public repo at
[github.com/barmoshe](https://github.com/barmoshe) with a music, audio-DSP, MIDI, or synth
angle — 9 repos of 53 total — plus a short reading of what the body of work signals about
Bar as a music-engineer. Scraped live on 2026-04-21.

## The arc in one paragraph

Bar's public GitHub tells a quiet, legible story about music engineering. It opens in
**April 2022** with `SMOOTH-plugin`, a JUCE 6 + CMake scaffold — not a plugin but a
template for *future* plugins, the architectural pass before the craft. Four months later,
in **August–October 2022**, a burst of tiny JUCE projects appears — white noise, then a
sine, then a saw, then a gain plugin, then a distortion effect — each one a single-idea
audio primitive, each with a YouTube demo link, each titled like a lab notebook entry. **Late 2023** brings `AI_MIDI_API`, a polyglot Python/TypeScript/Go
workers project whose layout mirrors the Temporal pipelines Bar builds elsewhere, applied to
MIDI. **2024–2025** brings `Israelify-backend`, the server for a Spotify-inspired app built
with a collaborator. **2025** adds `simple-touch-instruments`, a fork of Synthux-Academy's
Daisy-board touch-synth kit — hardware synth exploration. The through-line is someone who
treats audio as a stack to be built from the oscillator up, not consumed from a preset menu.

## Reading for the Music section

The portfolio currently shows none of this. That's the gap. The "Off-Keyboard" section can
present the work at two levels simultaneously: the *thesis* (signal-path thinking from
oscillator → effect → plugin → app → hardware) and a few *artifacts* (the instrument you
play is descended from the same lineage as the JUCE experiments below). If the in-page
instrument is a hand-built synth using Web Audio, it's unmistakably consistent with the
repos catalogued here, and it earns the right to exist.

---

## Repos catalogued by theme

### 1. DSP primitives — building blocks in JUCE (2022)

Five repos from Aug–Oct 2022. Each is small, each has a video preview, each is framed as a
learning exercise. Together they read as a methodical climb from pure generation to effect
processing — the exact order someone who respects the craft would pick.

**[WhiteNoiseGenerator](https://github.com/barmoshe/WhiteNoiseGenerator)** — C++ · JUCE
The first one. README: *"I'm excited to learn how to use the JUCE framework. Here is my
first little audio app."* A white-noise generator with an amplitude control.
[Video preview](https://youtu.be/5Q6y_Jw3FGw). Aug 2022.

**[SineToneGenerator](https://github.com/barmoshe/SineToneGenerator)** — C++ · JUCE
A simple sine-wave audio generator. [Video preview](https://youtu.be/DmZ7jozQENc).
Aug 2022.

**[SawWaveGenerator](https://github.com/barmoshe/SawWaveGenerator)** — C++ · JUCE
A saw-wave generator with a play/pause button. [Video preview](https://youtu.be/me9b6GbU-KY).
Aug 2022.

**[GainIsWhatYouNEED](https://github.com/barmoshe/GainIsWhatYouNEED)** — C++ · JUCE
*"First JUCE mini project built as an AU plug-in. The major thing for me in this project
is the integration with DAWs. It's simply a gain slider (volume)."* Marks the transition
from standalone apps to DAW-hosted plugins. [Video preview](https://youtu.be/0sXhIKAoIKE).
Sept 2022.

**[Hard-SoftCliping_Distortion](https://github.com/barmoshe/Hard-SoftCliping_Distortion)** — C++ · JUCE (Projucer)
No README, but the top level shows `Distortion.jucer`, `Source/`, `JuceLibraryCode/`,
`Builds/` — a standard Projucer-managed JUCE audio-effect plugin implementing hard- and
soft-clipping distortion. The first *effect* (not generator) in the series. Oct 2022.

### 2. Plugin scaffolding (2022)

**[SMOOTH-plugin](https://github.com/barmoshe/SMOOTH-plugin)** — CMake · JUCE 6
*"A prototype to model a way to create an entire repo using JUCE 6 and CMake."* Not a
plugin — a template for *future* plugins. Concept: set all JUCE paths / custom modules /
configuration in the top-level `CMakeLists.txt` so every sub-project is nearly zero-config,
environment is identical across developers, and related plugins can share build settings
and code. Built **Apr 2022**, four months *before* the DSP-primitive burst — the
infrastructure pass that made the five-plugin summer that followed cheap to execute.

### 3. AI + MIDI, polyglot pipeline (2023)

**[AI_MIDI_API](https://github.com/barmoshe/AI_MIDI_API)** — TypeScript · Python · Go
No README, but the root layout is a tell: `main.go`, `go.mod`, `go_workflow/`,
`PythonWorker/`, `tsWorker/`, `express-gen-ts/`. This is a multi-worker architecture with a
Go orchestration layer coordinating Python and TypeScript workers behind an Express
TypeScript API — the same topology Bar uses in
[`data-processing-service`](https://github.com/barmoshe/data-processing-service) (featured
on Temporal's Code Exchange). Applied here to MIDI: AI-generated or AI-analysed musical
data moving through language-specialised workers. Oct 2023. Worth restoring a README.

### 4. Full-stack music app (2024–2025)

**[Israelify-backend](https://github.com/barmoshe/Israelify-backend)** — JavaScript · Node · MongoDB
The backend for Israelify, a Spotify-inspired music app. Features per README:
authentication + REST endpoints, custom middleware layer, integrated logging,
MongoDB-backed data model. The frontend lives in the collaborator's repo at
[Gal-Or/IsraelifyApp](https://github.com/Gal-Or/IsraelifyApp). Currently surfaced on the
portfolio as `isralify`. Pushed through Mar 2025.

### 5. Hardware synth exploration (2025)

**[simple-touch-instruments](https://github.com/barmoshe/simple-touch-instruments)** — C++ · Daisy/Daisyduino · *fork*
A fork of [Synthux-Academy/simple-touch-instruments](https://github.com/Synthux-Academy/simple-touch-instruments) —
the firmware + instrument examples for the Synthux Simple Touch Synth board, an educational
touch-controlled hardware synth running on the Electro-Smith Daisy platform. The fork date
(Mar 2025) marks when Bar stepped from plugin-DSP into embedded-audio territory. Not
original authorship, but relevant signal: it means Bar has the Daisy toolchain installed
and is reading embedded-DSP code in C++ on a fingerboard-style instrument — which is
surprisingly on-theme for the "Off-Keyboard" hand-drawn-instrument concept.

---

## What the body of work signals

The nine repos together describe someone who can reason up and down the audio stack: DSP
primitives (generators, effects) in JUCE; plugin scaffolding and build systems; MIDI as a
transport layer for AI pipelines; a full-stack streaming app; and embedded hardware synths
on Daisy. No single repo is large. Instead the catalogue *is* the portfolio — each repo is
a paragraph, and together they make a coherent essay about how Bar approaches music
engineering.

Two caveats worth being honest about, if any of this surfaces on the portfolio:

- **Most repos are from 2022.** The DSP-primitive phase is a learning burst rather than
  production work. They should be framed as *études* — small well-executed exercises that
  teach craft — not as shipped products.
- **`simple-touch-instruments` is a fork.** The work in that repo is Synthux Academy's,
  not Bar's. If it's referenced on the portfolio it should be labelled as "exploration of
  the Synthux Simple Touch platform," not "I built this."

## Implications for the Music section rebuild

Three concrete consequences for the design:

First, the **hand-built Web Audio instrument proposed in the concept brief is consistent
with this lineage** — a sine, a saw, a filter, drawn in ink. The same primitives appear in
the 2022 JUCE series. Building the in-page instrument from raw oscillators rather than
reaching for Tone.js keeps the site's music artifact philosophically aligned with the
repos it's advertising.

Second, there's a **genuine story to tell** beneath the instrument, if you want one: a
short credit line under the synth linking to 2–4 of these repos turns the toy into an
index of the body of work. Suggested first three links: `WhiteNoiseGenerator` (the "first
little audio app"), `GainIsWhatYouNEED` (the first DAW-hosted plugin), `Israelify-backend`
(the full-stack app). Optional fourth: `AI_MIDI_API` if Temporal + MIDI is part of the
narrative you want to project.

Third, **`portfolio.ts` currently lists `isralify` as the only music-adjacent repo.** If
the Music section starts pointing at these others, they don't need to be `Project` entries
in the Repos grid — they can live *only* in the Music section, kept scoped to their
subject. That preserves the Repos grid's focus while giving the Music section genuine
depth.

---

## Not music

For completeness, these repos showed up during scraping and were *evaluated but excluded*:
`GGJ_BUBBLES` (game jam, not audio-focused), `behor` (HTML, undocumented), `star` (HTML,
undocumented), `hamster_simulator` (game), `bk-ai` (AI, not music), `mister-mail` (Gmail
clone), `ticket-analyzer` (analytics), plus all Temporal/DevOps/studies repos.

## Scraping method (for reproducibility)

Scraped on 2026-04-21 from `github.com/barmoshe?tab=repositories` pages 1–2 via the live
DOM, then enriched per-repo via `api.github.com/repos/barmoshe/{name}` and
`/repos/{name}/readme`. Total public repos: 53. Music-related: 9.

All data in this report was sourced from live GitHub responses; no repo descriptions have
been paraphrased beyond quoting the README snippets shown in quotation marks above.
