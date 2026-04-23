# Handoff — portfolio content rewrite (in progress)

> **Branch:** `claude/rewrite-portfolio-content-HsIxf`
> **Status:** Planning only. **No code changes yet.** 4 of 6 sections are
> decided; Mixtape and Letter are still pending.

## Start here (next session)

1. Read this file end to end — it contains the full decided plan per section.
2. Ask the user two things before touching code:
   - **Mixtape (#mixtape):** do they want to walk through tracks one-by-one,
     have you draft a full proposal for them to correct, or only refresh the
     header + the Biome Synth track (see "Known Mixtape updates" below)?
   - **Letter (#letter):** which contact cards stay, and should the
     headline/dek get a refresh?
3. Once Mixtape and Letter are locked in, implement everything in one pass.
   All sections' changes are find-and-replace in the files listed below — no
   new runtime deps, no Tailwind, no router. Respect the invariants in
   `CLAUDE.md` and `knowledge/99-caveats.md` (pre-paint theme script,
   HeroSlides fx cycle, Vite base path, `public/.nojekyll`).
4. Verify with `npm run typecheck` then `npm run dev` and eyeball each
   `#<section>` id. Confirm internal `#story`/`#experience` links are all
   updated to `#background` after the merge.

## Known Mixtape updates (already agreed)

- **Biome Synth (track B1)** framing changes to lead with the Claude-skill
  story: a Claude skill that interviews the user via `AskUserQuestion` until
  it produces a full project brief. That brief was used to build the 3D
  galaxy synth in Lovable (Tone.js + Three.js + Canvas2D).
- The **LinkedIn post about the Claude skill** lives on the Mixtape entry
  only, not the Repos card: `https://www.linkedin.com/posts/barmoshe_claude-skill-activity-7450179482327576576-M9J9`
  (shortlink from the post screenshot: `https://lnkd.in/dqj4QwHB`).
- Header (stamp / H2 / dek) and the other 6 tracks are undecided.

## Known Letter considerations

- Current cards: email, phone, LinkedIn, Instagram, WhatsApp, GitHub (see
  `src/data/portfolio.ts` contact object + `src/components/sections/Letter.tsx`).
- Footer line: "Based in Tel Aviv · Open to remote · ● available now".
- No decisions locked in yet.

---

## Global structural changes (apply once Mixtape + Letter are decided)

- **Merge Story + Experience into a new `#background` section.**
  - Delete `src/components/sections/Story.tsx`.
  - Rename/rewrite `src/components/sections/Experience.tsx` →
    `src/components/sections/Background.tsx` (or restructure in place).
  - In `src/App.tsx` lines 100–105 remove `<Story />` and replace
    `<Experience />` with `<Background />`.
  - Update folio numbers on remaining sections:
    - Intro: `01 // WHOAMI` (unchanged)
    - **Background: `02 // BACKGROUND`** (new)
    - Repos: `03 // REPOS` (was 04)
    - Mixtape: `04 // MIXTAPE` (was 05)
    - Letter: `05 // PING` (was 06)
  - Search the repo for any link/nav referencing `#story` or `#experience`
    and update to `#background`. (Experience self-card body links to
    `#mixtape`, which stays valid.)

## Section map (files + copy locations)

| # | Section     | id            | File(s) with copy                                                                 |
|---|-------------|---------------|-----------------------------------------------------------------------------------|
| 1 | Intro       | `#intro`      | `src/components/sections/Intro.tsx`                                               |
| 2 | Background  | `#background` | **NEW** (replaces Story + Experience).                                            |
| 3 | Repos       | `#repos`      | `src/components/sections/Repos.tsx` + `src/data/portfolio.ts`                     |
| 4 | Mixtape     | `#mixtape`    | `src/components/sections/Mixtape.tsx` (TRACKS at lines 65–166)                    |
| 5 | Letter      | `#letter`     | `src/components/sections/Letter.tsx` + `src/data/portfolio.ts`                    |

---

## Section 1 — Intro (`#intro`) — DECIDED

File: `src/components/sections/Intro.tsx`. Direction: builder-first,
sharper-with-fun, range-over-specialty.

**Byline** (replaces line 177):
> Builder by default. Stack and field are negotiable.

**H1** (replaces lines 179–182, keep the `<em>` italic on "build the thing"):
> I just *build the thing.*

**Bio paragraph 1** (replaces lines 185–190):
> I'm Bar. I build — software, mostly, but the medium is whatever the idea
> needs. Web apps, hardware hacks, game-jam soundtracks, weekend scripts
> that quietly become daily tools.

**Bio paragraph 2** (replaces lines 193–197):
> Day job is full-stack. Off-hours is whatever I'm curious about that week.
> Both feed each other — the side projects keep the reflexes sharp, the day
> job keeps the side projects honest.

**Bio paragraph 3** (replaces lines 199–202):
> Title and stack matter less than the habit underneath them. The habit,
> and one belief I keep proving to myself:

**Credo card** (line 206): **unchanged** — "It's only one prompt away"

**Toolline** (replaces lines 212–216):
> builder first · full-stack by trade · AI-native by reflex · happiest shipping the thing

**ID card meta** (Intro.tsx lines 161–169):
- NAME: `Bar Moshe` _(unchanged)_
- ROLE: **`Builder`** _(was: `Build things`)_
- FOCUS: **`Full-stack · AI-native · makes things`** _(was: `Full-Stack · AI-native · Builder`)_
- REACH: `github.com/barmoshe` _(unchanged)_

---

## Section 2 — Background (`#background`) — DECIDED (new merged section)

Stamp: `BACKGROUND`

**H2** (from Story — keep `<em>` italic on "interesting"):
> I follow the *interesting* things — and there are a lot of them.

**Dek:**
> Build, engineer, design, compose — pick a verb.

### Cards (mixed-size grid, 3 BIG + 4 SMALL = 7 total)

**BIG cards (full body, larger card):**

1. **Joomsy** _(was Story timeline; card content kept verbatim from current Experience)_
   - Date: `May 2025 – Present`
   - Role: `Software Engineer, Full-Stack`
   - Link: `joomsy.com →` (`https://www.joomsy.com`)
   - Body:
     > Early-stage startup. Five-person team. Primary developer owning
     > full-stack architecture and database design, plus the deploy
     > pipeline and infra it runs on. Every layer — frontend, backend, the
     > plumbing between — shaped as the product finds its shape.

2. **Self-directed work**
   - Date: `Ongoing`
   - Role: **`Builder / Maker`** _(was: `Builder / Maker / Hobbyist`)_
   - Body (tightened to 2 sentences):
     > A lot of my work happens on my own time, and I don't limit it to one
     > role or field — fullstack, DevOps, product design, creative coding,
     > game dev, music tools. Some of it shows up in
     > [the mixtape](#mixtape) or on [GitHub](https://github.com/barmoshe).

3. **Afeka** (College of Engineering) — _promoted from Story timeline_
   - Subtitle: `B.S. Computer Science`
   - Date: `Oct 2020 – Aug 2023` _(from CV)_
   - Body _(from CV, lightly edited):_
     > Wide range — low-level assembly through .NET — on top of
     > foundational coursework in operating systems, data structures, and
     > algorithms.

**SMALL cards (compact — name + role/program + date + 1-line body):**

4. **Wochit** _(downsized from Experience card)_
   - `Customer Support Engineer · Oct 2021 – Present`
   - Body: "Frontline support and dev-team liaison for a cloud video editor at scale."
   - _Note: CV says Oct 2021; current site says Nov 2021. Use Oct._

5. **Wix, Tel Aviv** — DevOps Workshop
   - Body: "Hands-on with EKS, Kubernetes, Terraform, microservices."

6. **Coding Academy** — Full-Stack Bootcamp
   - Body: "Intensive Node / React / MongoDB course for students with prior coding experience."

7. **BPM College** — Music
   - No body (bare card).

Layout: on desktop, the SMALL cards should sit 2-up or 4-up under the BIG
cards so the grid stays balanced.

---

## Section 3 — Repos (`#repos`) — DECIDED

Files: `src/components/sections/Repos.tsx` + `src/data/portfolio.ts`.

**Header:**
- Stamp: `REPOS` _(was `ON GITHUB`)_
- H2: `A few of the *many things* I've built.` _(unchanged; keep `<em>` italic on "many things")_

**CTA box at bottom**: keep verbatim.
> Kicker: "More on GitHub" · Body: "Experiments, scripts, and half-built ideas — all public." · Link: `github.com/barmoshe`

### Project lineup (replace the `projects` array in `src/data/portfolio.ts` lines 25–57)

1. **Israelify** — _modified entry (was `isralify`)_
   - `name`: `Israelify`
   - `language`: `JavaScript` (glyph: `{}`) — unchanged
   - `url`: `https://github.com/barmoshe/Israelify-backend`
   - `shortDescription`:
     "Spotify-style music app built as a pair project during the Coding
     Academy bootcamp. Node.js + MongoDB backend with REST API, auth,
     middleware, and a custom logger; React frontend in a sibling repo."
   - `extras` (optional):
     - label: `Frontend repo →`, url: `https://github.com/Gal-Or/IsraelifyApp`
     - _Note: do not name the collaborator in the body copy; linking the
       sibling repo is fine._

2. **temporal-data-processing** — _unchanged from current `portfolio.ts`_
   - `name`: `temporal-data-processing`
   - `language`: `Go · Python · TypeScript` (glyph: `∞`)
   - `url`: `https://github.com/barmoshe/data-processing-service`
   - `shortDescription`: **verbatim** current text
   - `extras`: both unchanged
     - `Temporal Code Exchange` → https://temporal.io/code-exchange/cross-language-data-processing-service-with-temporal
     - `Read the Medium article` → https://medium.com/@barmoshe/building-a-cross-language-data-processing-service-with-temporal-a-practical-guide-bf0fb1155d46

3. **Biome Synth** — _new entry; replaces `claude-creative-stack`_
   - `name`: `Biome Synth`
   - `language`: `TypeScript` — pick glyph from existing `LANG_ICONS` map
   - `url`: `https://github.com/barmoshe/cosmic-chord-synth`
   - `shortDescription` (Claude-skill-first framing):
     "Started as a Claude skill that interviews you with `AskUserQuestion`
     until it has a full project brief — no technical background needed.
     Used that brief to build the actual app: a 3D galaxy synth in the
     browser with an auto-DJ on drums, bass, and melodies. Tone.js +
     Three.js + Canvas2D, polished in Lovable."
   - `extras`:
     - `Play the live app →` → `https://biome-synth.lovable.app/`
   - _Note: LinkedIn post link lives in the Mixtape entry only — do not
     duplicate it here._

**Removed**: `claude-creative-stack` — drop entirely.

---

## Section 4 — Mixtape (`#mixtape`) — PENDING

Only the **Biome Synth** track (B1) has agreed updates — see "Known Mixtape
updates" at the top. Everything else about this section (header copy, track
lineup, track bodies, side framing) is undecided. The 6 tracks currently
live inline in `src/components/sections/Mixtape.tsx` at lines 65–166.

Current header:
- Stamp: `MIXTAPE`
- H2: `What I've *made.*`
- Dek: `Side A, 78 BPM F-major lo-fi hits. Side B, 60 BPM D-dorian sketches.
  Flip to switch, tap a card for the write-up.`

---

## Section 5 — Letter (`#letter`) — PENDING

No decisions locked. Cards currently live in `src/data/portfolio.ts` (contact
object, lines 60–65) + `src/components/sections/Letter.tsx` (card rendering,
lines 27–96).

---

## Verification

After all rewrites land:

- `npm run typecheck` — ensure no type errors (data file shapes).
- `npm run dev` and visit `http://localhost:5173/#<section>` for each id to
  eyeball the rendered copy.
- Confirm mobile viewport doesn't overflow for any longer rewrites.
- Check that internal anchor links (`#mixtape`, `#repos`, `#background`) all
  resolve and that external links open.
- Confirm the folio numbers (`01 // WHOAMI`, `02 // BACKGROUND`, …) are in
  order and match the new section count (5, not 6).
