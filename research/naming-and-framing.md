# Naming and Framing — Why Not "Brain", and What Instead

Companion to `host-repo-architecture.md`. The operator's stance is firm: **don't call it a "brain"** — the framing is pretentious, anthropomorphic, and over-promises what context injection actually does. This document maps the concept landscape, surfaces the critical pushback, and recommends grounded alternatives.

---

## 1. The brain-concept landscape

**Building a Second Brain (BASB).** Tiago Forte's framework is the dominant modern framing: PARA (Projects / Areas / Resources / Archives) for storage shape, CODE (Capture / Organize / Distill / Express) for workflow ([buildingasecondbrain.com](https://www.buildingasecondbrain.com/), [Forte Labs overview](https://fortelabs.com/blog/basboverview/)). Maps decently onto a markdown-in-git repo for Capture/Organize/Archive, but PARA is *task-oriented* (Projects bias) rather than *artifact-oriented* — a builder's workshop has too many cross-cutting "Areas" for the tree to feel natural.

**"AI brain" / "Claude brain" / "claude-mem".** In 2025–26 the phrase covers three different artifacts: (a) hand-curated `CLAUDE.md` files as instruction context ([Claude Code docs](https://code.claude.com/docs/en/memory)); (b) auto-compressed session logs like [claude-mem](https://github.com/thedotmack/claude-mem) ([writeup](https://www.augmentcode.com/learn/claude-mem-persistent-memory-claude-code)); (c) "database-free" file-system-as-memory architectures using markdown + sub-agents ([Medium: Database-Free Memory](https://medium.com/@zljdanceholic/inside-claude-code-the-database-free-memory-architecture-that-redefines-ai-agents-c61d7cb1f763)). When someone says "Claude brain" they usually mean (a)+(c): a repo of markdown the model treats as durable context.

**Obsidian's "vault".** Obsidian deliberately chose *vault* — secure container, local-first, your-files-not-ours — and only later flirted with "second brain" in marketing ([Obsidian vault naming guide](https://app.studyraid.com/en/read/46589/2185751/naming-your-vault)). "Vault" connotes preservation and ownership rather than cognition, which is partly why it survived as the brain-wave crested. Notable Claude+Obsidian projects exist (the public [Knowledge Vault gist](https://gist.github.com/naushadzaman/164e85ec3557dc70392249e548b423e9) pairs Claude Code with an Obsidian vault as a PKM replacement).

**TheBrain (the product).** A 25-year-old node-and-link app whose UX centers on *jumps* between thoughts — every node has parents, children, and "jumps", and the canvas re-centers as you move ([Serious Insights review](https://www.seriousinsights.net/review-thebrain-10/)). Structurally pushes you toward typed connections and traversal-first reading; markdown-in-git pushes you toward documents and grep. Different metaphors, different affordances.

**Other framings.** *Digital garden* (Maggie Appleton) — public, in-progress, "seedling → budding → evergreen," explicitly *anti-perfectionist* ([maggieappleton.com/garden](https://maggieappleton.com/garden/)). *Evergreen notes* (Andy Matuschak) — atomic, concept-titled, densely linked ([notes.andymatuschak.org](https://notes.andymatuschak.org/Evergreen_notes)). *Zettelkasten* — Luhmann's slip-box ([guide](https://leananki.com/zettelkasten-method-smart-notes/)). *Memex* — Bush's 1945 associative-trail machine. *Exobrain / extended cognition* — Clark & Chalmers' framing that tools are *part of* the mind.

---

## 2. Critical perspectives on the "brain" framing

1. **Hacker News, multi-thread consensus**: maintaining a second brain is itself procrastination — "the most elaborate system wins" aesthetic, screenshots of 500-node graphs, more time on plumbing than thinking ([HN: Productivity porn](https://news.ycombinator.com/item?id=32335165), [HN: Second-brain apps](https://news.ycombinator.com/item?id=34036498)). The "authority problem" recurs: loud PKM voices are productivity-about-productivity people.
2. **Cal Newport** rejects the *accumulation* model — works project-first, gathers info on demand, considers a permanent personal KB net-negative for deep work ([In Defense of Thinking](https://calnewport.com/in-defense-of-thinking/), [Zettelkasten Forum on Newport](https://forum.zettelkasten.de/discussion/2083/proactive-vs-reactive-information-management-from-cal-newport-podcast)).
3. **"Stop Calling It Memory"** (Limited Edition Jonathan, Substack) — argues the "AI + Obsidian = memory/brain" framing in tutorials over-promises what context injection actually does, and conflates retrieval with cognition ([substack post](https://limitededitionjonathan.substack.com/p/stop-calling-it-memory-the-problem)).
4. **"Some critical points on BASB"** (Productivity Core, Medium) — BASB conflates linked storage with insight; real breakthroughs are contingent and methodologically messy (per Feyerabend), not a function of well-organized notes ([critique](https://medium.com/@productivitycore/some-critical-points-on-building-a-second-brain-f86122ec8b4f)).
5. **Standard Notes' "New Wave"** — flags the second-brain boom as a marketing layer over basic note-taking, with "brain" carrying anthropomorphic baggage that misleads users about what their notes actually do ([standardnotes.com](https://standardnotes.com/blog/new-wave-second-brain-note-taking)).

**Common thread:** "brain" over-promises (cognition you don't have), encourages collection-as-virtue, and primes users to maintain the system instead of using it. The operator's gut reaction matches the published critique exactly.

---

## 3. Alternative naming menu

Grouped by vibe. Each: meaning · who uses it in the wild · connotation.

### Industrial / craft

- **Workshop** — a place where work gets *made*, not stored. Used by [Palantir Foundry's Workshop](https://www.palantir.com/docs/foundry/workshop/overview) and many writing programs. Connotes craft, output, mess.
- **Forge** — heat + shaping; [Foundry's `forge` toolkit](https://github.com/foundry-rs/foundry), Atlassian Forge. Connotes blacksmithing, iteration, finished tools.
- **Foundry** — casts repeatable artifacts from molten material. Palantir, [Microsoft AI Foundry](https://learn.microsoft.com/en-us/training/azure/ai-foundry), Foundry VTT. Platform-grade; slightly heavy for solo use.
- **Kiln** — patient transformation; [Kiln-AI/Kiln](https://github.com/Kiln-AI/Kiln) is a popular 2025 AI workbench. Connotes slow firing, craft, ceramics.
- **Workbench** — flat surface, tools laid out. [Carpentries Workbench](https://carpentries.github.io/workbench-dev/intro.html). Connotes tinkering, WIP.
- **Atelier** — artist's studio, French loanword. Less common in software; connotes single-maker craft and apprenticeship.

### Archival

- **Vault** — Obsidian's choice; secure container, local-first ([naming guide](https://app.studyraid.com/en/read/46589/2185751/naming-your-vault)), HashiCorp Vault. Connotes preservation, ownership.
- **Codex** — bound book of canonical text; OpenAI [Codex](https://github.com/openai/codex), AGENTS.md ecosystem. Connotes authority, reference, read-mostly.
- **Ledger** — append-only record; [ledger-cli](https://github.com/ledger/ledger-archive), accounting. Connotes truthfulness, audit, dated entries.
- **Archive** — long-term storage; [Software Heritage](https://www.softwareheritage.org/). Connotes finality (maybe too final).

### Organic

- **Garden** — cultivated, public-ish, in-progress ([Maggie Appleton](https://maggieappleton.com/garden/), Matt Brockwell's roam.garden). Connotes growth, patience, tolerance for weeds.
- **Field notes** — observations from the work itself. Connotes humility, practitioner voice.

### Domestic / culinary

- **Pantry / Larder / Mise-en-place** — staged ingredients, ready-to-cook. Rare in software; connotes preparation, not display.
- **Studio** — workspace + identity (KyaniteLabs uses "studio knowledge"). Connotes professional solo practice.

---

## 4. Three opinionated recommendations for Bar

Bar ships fast MVPs under the banner "Build before brief," works bilingually (HE/EN), and the repo is *both* a knowledge layer and a place where things get made. The name should privilege *making* over *collecting*, and stay short.

### 1. **Workshop** (EN) / **סדנה** *sadna* (HE) — top pick

The strongest fit. It directly contradicts "brain": no cognition claim, just a room with tools. It maps onto Bar's actual practice (build, prototype, ship), it's bilingually crisp, and "the workshop repo" is self-explanatory to anyone — collaborators, future Bar, an LLM reading `CLAUDE.md`. Matches the existing portfolio's craft-flavoured ink/grain aesthetic. The only risk is that "workshop" is generic; counter that with a one-word repo slug like `workshop` or `bm-workshop`.

### 2. **Atelier**

One step more personal than "workshop" — an *atelier* is named after the maker, not the trade. Implies a single hand, apprenticeship-style accumulation of taste, and a public-facing studio output. Works in both Hebrew and English mental space (Israeli design culture borrows *atelier* freely). Slightly precious if overused in copy, but as a repo name it's distinctive and honest.

### 3. **Kiln** — dark horse

A kiln is where rough material becomes durable through patient heat — a fitting metaphor for an AI-native knowledge layer that compounds slowly. One syllable, bilingual-neutral, and the existing [Kiln-AI/Kiln](https://github.com/Kiln-AI/Kiln) gives the word real currency in the AI-workbench space without owning it. Risk: less obviously a "knowledge" thing than vault/codex, so it needs a one-line README to land.

**Honorable mentions:** *Ledger* (if the repo leans append-only/dated), *Codex* (if it leans reference-document), *Garden* (if it ever goes public). **Avoid:** *Foundry* (claimed by Palantir/Microsoft), *Vault* (claimed by Obsidian/HashiCorp), *Cortex* (still brain-adjacent).

---

## 5. Open questions to land the name

1. **Is this repo mostly read, mostly written, or mostly run?** Codex/Ledger fit read-heavy; Workshop/Kiln fit write-heavy; Workbench fits run-heavy. The dominant verb should pick the noun.
2. **Public or private surface?** "Garden" and "Atelier" imply *someone will eventually visit*; "Vault" and "Workshop" assume nobody but you (and Claude) will. Which is true at 12 months?
3. **Does the name need to survive a second repo?** If a future `bm-foundry` or `bm-studio` is plausible, don't burn "Studio" on the knowledge layer if the portfolio itself wants it later.
4. **What's the Hebrew version you'd actually type?** *סדנה* (workshop), *ארגז* (toolbox/crate), *מחסן* (storeroom), *מעבדה* (lab). If the HE word feels clumsy aloud, the EN-only name will quietly win — better to pick that intentionally than by drift.

---

## Sources

- [Building a Second Brain — buildingasecondbrain.com](https://www.buildingasecondbrain.com/)
- [Forte Labs — BASB overview](https://fortelabs.com/blog/basboverview/)
- [Productivity Core — Critical points on BASB](https://medium.com/@productivitycore/some-critical-points-on-building-a-second-brain-f86122ec8b4f)
- [Cal Newport — In Defense of Thinking](https://calnewport.com/in-defense-of-thinking/)
- [Hacker News — Productivity porn thread](https://news.ycombinator.com/item?id=32335165)
- [Hacker News — Second-brain apps thread](https://news.ycombinator.com/item?id=34036498)
- [Standard Notes — New Wave: Second Brain Note-Taking](https://standardnotes.com/blog/new-wave-second-brain-note-taking)
- [Limited Edition Jonathan — Stop Calling It Memory](https://limitededitionjonathan.substack.com/p/stop-calling-it-memory-the-problem)
- [claude-mem on GitHub](https://github.com/thedotmack/claude-mem)
- [Augment Code — claude-mem writeup](https://www.augmentcode.com/learn/claude-mem-persistent-memory-claude-code)
- [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- [Inside Claude Code: Database-Free Memory](https://medium.com/@zljdanceholic/inside-claude-code-the-database-free-memory-architecture-that-redefines-ai-agents-c61d7cb1f763)
- [Knowledge Vault gist (Claude Code + Obsidian)](https://gist.github.com/naushadzaman/164e85ec3557dc70392249e548b423e9)
- [Obsidian — Naming Your Vault](https://app.studyraid.com/en/read/46589/2185751/naming-your-vault)
- [Serious Insights — TheBrain 10 review](https://www.seriousinsights.net/review-thebrain-10/)
- [Maggie Appleton — Garden](https://maggieappleton.com/garden/)
- [Andy Matuschak — Evergreen notes](https://notes.andymatuschak.org/Evergreen_notes)
- [LeanAnki — Zettelkasten method](https://leananki.com/zettelkasten-method-smart-notes/)
- [Kiln-AI/Kiln on GitHub](https://github.com/Kiln-AI/Kiln)
- [Palantir Foundry — Workshop](https://www.palantir.com/docs/foundry/workshop/overview)
- [foundry-rs/foundry — Forge toolkit](https://github.com/foundry-rs/foundry)
- [OpenAI Codex on GitHub](https://github.com/openai/codex)
- [Software Heritage](https://www.softwareheritage.org/)
