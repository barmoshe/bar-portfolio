# Handoff — portfolio content rewrite (in progress)

> **Branch:** `claude/rewrite-portfolio-content-HsIxf`
> **Status:** Partially implemented. All 3 pending decisions are now locked.
> Intro is done. Background.tsx exists but **is not wired into App.tsx yet.**
> Story.tsx, Experience.tsx, and every downstream folio number still need
> updating. Remaining work is mechanical — see checklist below.

## Locked decisions (from the user this session)

1. **Intro:** adopt the handoff copy verbatim (applied).
2. **Mixtape:** minimal change — only reframe B1 to *lead* with the
   Claude-skill story and add the LinkedIn post link. Leave header copy
   (stamp / H2 / dek) and the other 6 tracks unchanged.
3. **Letter:** keep all 6 cards (Email, Phone, LinkedIn, Instagram, WhatsApp,
   GitHub). Refresh H2/dek with copy that matches the new builder-first Intro
   tone. Footer line stays.

## What's done in this commit

- `src/components/sections/Intro.tsx` — full copy swap (byline, H1, 3 bio
  paragraphs, toolline) and ID card ROLE/FOCUS. Credo card unchanged.
- `src/components/sections/Background.tsx` — **NEW file**, merges Story +
  Experience. 3 BIG cards (Joomsy · Self-directed work · Afeka) + 4 SMALL
  cards in an auto-fit grid (Wochit · Wix DevOps · Coding Academy · BPM
  College). GSAP reveals wired for both groups. Uses existing
  `--paper` / `--ink` / `--ink-soft` / `--green` tokens — no new CSS needed.
- `src/components/InkDefs.tsx` — added `'background'` to `BLEED_IDS` so
  `attachInkBleed(headline, 'background')` in Background.tsx type-checks.
  `'story'` and `'experience'` are still in the list; they can stay (harmless)
  or be pruned once the old components are deleted.

Typecheck passes: `npm run typecheck` exits clean on this commit.

## Remaining work (next agent — do in this order)

### 1. Wire Background in, remove Story + Experience
- `src/App.tsx` lines 100–105:
  - Add `import Background from './components/sections/Background';`
  - Remove `import Story from ...` and `import Experience from ...`
  - Replace the `<Story />` + `<Experience />` pair with a single
    `<Background />`.
- Delete `src/components/sections/Story.tsx` (it's a standalone timeline
  view; InkTimeline import goes with it).
- Delete `src/components/sections/Experience.tsx`.
- Check `src/components/InkTimeline.tsx` — it was only used by Story. If no
  other consumer remains after Story deletion, delete `InkTimeline.tsx` too.
  Grep: `grep -rn "InkTimeline" src/`.

### 2. Update nav hash links (`#story` / `#experience` → `#background`)
Three hits, all need swapping:
- `src/components/TabBar.tsx:21` — `href="#experience"` → `href="#background"`
- `src/components/Strip.tsx:44` — `href="#story"` label `Story` → either
  remove this link (since Story+Experience merged into one section, one
  entry is enough) or rename to `Background` and point at `#background`.
  Recommended: **drop line 44 entirely** and keep line 45 as the single
  Background link.
- `src/components/Strip.tsx:45` — `href="#experience"` label `Work` →
  `href="#background"` label `Background`.

Verify no other references: `grep -rn "#story\|#experience" src/`.

### 3. Update folio numbers (merge drops section count 6 → 5)
- `src/components/sections/Repos.tsx` — folio `04 // REPOS` → `03 // REPOS`.
  Also swap the stamp from `ON GITHUB` → `REPOS`. H2 and CTA box stay.
- `src/components/sections/Mixtape.tsx` — folio `05 // MIXTAPE` →
  `04 // MIXTAPE`. Header stamp/H2/dek unchanged.
- `src/components/sections/Letter.tsx` — folio `06 // PING` → `05 // PING`.

### 4. Update Repos project lineup (`src/data/portfolio.ts` lines 25–57)
Three projects. Current: `claude-creative-stack`, `isralify`,
`temporal-data-processing`. Target:

1. **Israelify** — renamed entry (was `isralify`)
   - `name`: `'Israelify'`
   - `language`: `'JavaScript'` (unchanged, glyph `{}`)
   - `url`: `'https://github.com/barmoshe/Israelify-backend'`
   - `shortDescription`: "Spotify-style music app built as a pair project
     during the Coding Academy bootcamp. Node.js + MongoDB backend with REST
     API, auth, middleware, and a custom logger; React frontend in a sibling
     repo."
   - `extras`:
     - `{ label: 'Frontend repo →', url: 'https://github.com/Gal-Or/IsraelifyApp' }`

2. **temporal-data-processing** — unchanged. Leave entry as-is.

3. **Biome Synth** — **new entry; replaces `claude-creative-stack`.**
   - `name`: `'Biome Synth'`
   - `language`: `'TypeScript'` (pick glyph from existing `LANG_ICONS` map
     in the same file — check what glyph TS gets)
   - `url`: `'https://github.com/barmoshe/cosmic-chord-synth'`
   - `shortDescription`: "Started as a Claude skill that interviews you with
     AskUserQuestion until it has a full project brief — no technical
     background needed. Used that brief to build the actual app: a
     five-biome browser instrument with an AI DJ that composes through
     DRIFT · PULSE · BLOOM · SURGE · DISSOLVE. Tone.js + Three.js + Canvas2D,
     polished in Lovable."
   - `extras`:
     - `{ label: 'Play the live app →', url: 'https://biome-synth.lovable.app/' }`
   - _Do **not** duplicate the LinkedIn-post link here — it lives on the
     Mixtape B1 track only._

Delete the `claude-creative-stack` entry entirely.

### 5. Rewrite Mixtape B1 (`src/components/sections/Mixtape.tsx` ~lines 123–139)
Current B1 mentions the Claude skill mid-paragraph. Move it to the lead
and add the LinkedIn post as a secondary link.

Suggested body (user is free to edit):
> "Started as a Claude skill I wrote that interviews you with
> `AskUserQuestion` until it has a full project brief — no technical
> background needed. Took that brief and built the app: a five-biome
> browser instrument with an AI DJ that composes through DRIFT, PULSE,
> BLOOM, SURGE, DISSOLVE. Tone.js + Three.js + Canvas2D, polished in
> Lovable."

LinkedIn post URL to surface:
`https://www.linkedin.com/posts/barmoshe_claude-skill-activity-7450179482327576576-M9J9`

The `Track` type currently supports a single `href` + optional `linkLabel`
(used for the primary "Play the app →" link on B1). To add the LinkedIn
post, extend the `Track` type with optional `secondaryHref` + `secondaryLabel`
fields (`src/components/sections/Mixtape.tsx` around the type block near
line 50) and update the track-card render (around line 400, where
`t.linkLabel ?? 'Read the post →'` lives) to render a second link after the
primary one when present. Use something like "Read the write-up →" for the
secondary label.

Keep everything else about B1 (preview art, featured flag, previewBg,
previewFit, hashtags) unchanged.

### 6. Refresh Letter H2/dek (`src/components/sections/Letter.tsx` ~lines 279–287)
Keep all 6 cards. Suggested copy (user is free to edit):
- H2: `Drop a <em>line.</em>` (or keep `Say <em>hi.</em>` if you prefer
  — ask the user before landing)
- dek: "Inbox, phone, DM — whichever's easiest. I reply, usually same day."

Footer line stays verbatim.

### 7. Verification
- `npm run typecheck` — must be clean.
- `npm run dev`, open `http://localhost:5173/bar-portfolio/`, eyeball
  each section in order:
  - `#intro` — new builder-first copy, ID card reads `Builder` /
    `Full-stack · AI-native · makes things`.
  - `#background` — merged section, 3 big + 4 small cards, folio `02`.
  - `#repos` — stamp `REPOS`, folio `03`, three projects: Israelify,
    temporal-data-processing, Biome Synth.
  - `#mixtape` — folio `04`, B1 leads with Claude skill + LinkedIn link
    visible.
  - `#letter` — folio `05`, refreshed H2/dek.
- Mobile viewport: confirm the new small-card grid in Background doesn't
  overflow and that longer Intro paragraphs still read cleanly.
- Confirm nav: clicking Background in Strip / TabBar scrolls to the merged
  section. No broken `#story` or `#experience` links.
- Finally, delete **this handoff file**
  (`HANDOFF-rewrite-portfolio-content.md`) once everything above is green.

## Invariants to not break

- Pre-paint theme script in `index.html` `<head>` — untouched.
- `HeroSlides` fx cycle (`src/components/HeroSlides.tsx`) — untouched.
- `base: '/bar-portfolio/'` in `vite.config.ts` — untouched.
- `public/.nojekyll` — untouched.
- No new runtime deps. No Tailwind. No React Router.
- All oklch for any new color tokens (Background intentionally reuses the
  existing `--paper` / `--ink` / `--ink-soft` / `--green` tokens, so no new
  tokens are needed here).
