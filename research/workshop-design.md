# The Workshop Repo — Design (first pass)

*(Working title still "Workshop / סדנה" — name remains undecided. See
[naming-and-framing.md](./naming-and-framing.md).)*

This is the **design session** the vision doc deferred to
([workshop-vision.md](./workshop-vision.md) §"v1 ambition" /
"Open questions"). It records the **decisions** Bar made in a short design
interview (May 2026), the reasoning, and what's still open. It is still
**pre-build** — no file is created yet — but unlike the vision doc, this one
commits to *shape*.

The throughline that emerged: **the Workshop is a loose, Claude-mediated layer
— not a rigid pipeline.** On almost every "how strict?" fork Bar chose
flexibility. That is itself the design constraint: build the thinnest structure
that lets Claude operate, and let everything else stay adaptive.

---

## Decisions

### 1. Memory is plain, visible notes — not black-box memory

The knowledge lives as **human-readable Markdown Bar can open and read**, not a
hidden auto-memory store, vector DB, or "second brain" graph. Aligns with the
research's anti-Notion-graveyard and lean-retrieval findings
([brain-deep-dive.md](./brain-deep-dive.md),
[practical-reference.md](./practical-reference.md)). Plain files mean both Bar
and any agent read the same source of truth, and nothing rots inside a tool he
can't see into.

### 2. Sub-project hosting model — per-project, both patterns supported

There is **no single rule** for where a sub-project lives. It **depends on the
project**:

- **New project** → a **folder inside the Workshop**.
- **Existing project** (e.g. an unfinished repo a client hands over) →
  **cloned in**.
- Other cases allowed; the instinct stays "projects live *inside* the
  workshop," but the model is deliberately flexible.

Default toward the **safer** placement when ambiguous, but allow nesting when it
fits. (Open mechanics — how a cloned client repo's git history coexists with the
Workshop's — carried forward to "Still open" below; see also
[sub-repo-relationship.md](./sub-repo-relationship.md).)

### 3. Lifecycle is a flexible backbone, not a fixed pipeline

A default arc exists — **lead → qualified → active → handoff → archive** — but
it is a **backbone, not a rigid one-size pipeline**. The Workshop hosts several
project *types* (client builds, Bar's own side / "cell phone" projects,
business-improvement projects), and the lifecycle bends per type rather than
forcing all of them through identical gates. Full reference:
[client-lifecycle.md](./client-lifecycle.md).

### 4. Autonomy is **scope-based**, not action-based ⭐

The standout decision, and a cleaner model than the action-by-action guardrail
list the interview started with:

> **Inside a sub-project's scope → full autonomy.**
> **Anything that touches the business as a whole → ask Bar first.**

Autonomy scales inversely with blast radius. An agent working *inside* a
sub-project sandbox can do what it needs without asking. The moment an action is
**cross-cutting** — affecting the business itself, shared structure, multiple
projects, money/legal, or the Workshop's own substrate — it stops and asks.

This replaces "which actions are dangerous?" with "whose scope does this touch?"
— easier to reason about and matches the agent-operated principle (agents run
the projects; Bar runs the business).

### 5. Capture is conversational — "tell Claude, it files it"

No inbox to maintain. When something happens (a lead messages, an idea hits, a
decision gets made), Bar **tells Claude and Claude decides where it belongs and
files it.** Lowest friction, ADHD-friendly, and consistent with
agent-operated + plain-notes.

> **Divergence from research:** [README.md](./README.md) §"What's locked" lists
> capture as **"single inbox, type-by-promotion (Rule of Three)."** Bar
> **overrode** that here — no inbox. The *promotion* idea (structure grows by
> use, never pre-created) survives; the *inbox* as the capture surface does not.
> Claude-as-filer is the capture surface instead. Recorded so the docs don't
> silently contradict.

### 6. On-open briefing stays adaptive

What Claude surfaces when a session opens is **not fixed** — "it depends, a large
variety." Sometimes active-project status, sometimes recent decisions, sometimes
what changed, sometimes nothing. The SessionStart behavior should be
*context-sensitive*, not a hardcoded dashboard. (Implication: the briefing logic
itself is something Claude decides per session, not a static template.)

### 7. Privacy — client data lives outside git; v1 is a per-project brief

Real client info (names, contacts, contracts, money) **should not live in git
history.** The intent is a **dedicated store + viewer** Bar builds later
(store *and* view the data) — **deferred, not now.**

**For v1:** each sub-project simply carries a **Markdown brief describing the
client and the project** (e.g. `client.md` / project brief). No sensitive
specifics committed beyond that working description; the real datastore comes
later.

---

## The design spine (synthesis)

Putting the decisions together, the thinnest thing that satisfies all of them:

- **A plain-Markdown repo** (1) whose structure grows by use, not pre-creation.
- **Sub-projects nested or cloned in** (2), each with its own brief (7) and its
  own lifecycle position on the flexible backbone (3).
- **Agents operate freely inside each sub-project** and **escalate at business
  scope** (4).
- **Claude is the capture and filing interface** (5) and the **adaptive
  session-opener** (6).
- **Sensitive client data is referenced, not stored** in v1 (7).

Everything else from the research (CXO seats, intake automation, the
`/build` & `/build-harness` commands, the specific Day-1 skills) remains
deferred — the spine above is the walking skeleton.

---

## Still deferred (unchanged from vision)

- Concrete v1 file/folder layout (the exact skeleton on disk).
- The intake / lead-flow automation (WhatsApp, email, forms) —
  [intake-flow.md](./intake-flow.md).
- The CXO / org-layer model — [cxo-folders.md](./cxo-folders.md).
- Which specific skills, hooks, sub-agents Claude gets —
  [claude-skills.md](./claude-skills.md).
- `/build` and `/build-harness` as named commands —
  [build-commands.md](./build-commands.md).
- The name.

## Next open questions (for the build session)

1. **Scope mechanics for autonomy (4):** how does an agent *know* it's about to
   cross the project→business boundary? Is "business scope" a directory, a
   marker file, a CLAUDE.md rule, or a Stop-hook check? This is the first thing
   to make concrete because it's the safety boundary.
2. **Cloned-repo git coexistence (2):** nested clone vs submodule vs sibling +
   reference — how a handed-over client repo lives inside without tangling
   histories.
3. **The client-data store + viewer (7):** what it is and how the per-project
   brief points at it once it exists.
4. **Filing conventions for "tell Claude, it files it" (5):** Claude needs
   *some* shared placement logic so filing is consistent across sessions —
   define the minimum so it's predictable without an inbox.
5. The name.
