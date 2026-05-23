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

## Reconciliation with external research (May 2026)

Two external reports were captured at
[external-reports-agent-operated-repo.md](./external-reports-agent-operated-repo.md)
(treat their benchmark/vendor claims skeptically). Mapped against our seven
decisions — **confirm / extend / contradict**:

| # | Our decision | Research verdict | What it adds |
|---|---|---|---|
| 1 | Plain visible notes, not black-box memory | **Confirms (strongly)** | Letta's own benchmark: filesystem + grep (74.0% LoCoMo) beat Mem0's best graph (68.5%). Both reports say start file-first; add a memory product only when grep across `decisions/` + per-project files demonstrably fails. Note: Claude Code's **auto-memory** (`MEMORY.md`) is machine-local — keep canonical truth (scope, decisions, handoff) in *named, committed* files, not auto-memory. |
| 2 | Sub-project hosting depends per project; new = folder inside, existing = clone in | **Extends + partially contradicts** ⚠️ | Cloning an existing repo *nested inside* the Workshop hits Git's documented embedded-repo footgun (an unusable gitlink; `git add .` by an agent makes it worse). Refined rule: **new = plain folder inside; existing = sibling clone** coordinated by a manifest (`.repos.json`), submodule only when physical nesting is truly required, `subtree --squash` only to freeze a finished engagement into `archive/`. Avoid the gitignored-nested-repo pattern. |
| 3 | Flexible lifecycle backbone | **Confirms + extends** | Same arc (lead → qualified → active → handoff → archive). Adds: model states as **different required files**, not just tags; `STATUS.md` (where we are / next / blockers) as the keystone per project; free→paid is a state change with a *frozen brief* + lightweight SOW. |
| 4 | Scope-based autonomy (free inside a sub-project, ask at business scope) | **Confirms the posture, supplies the mechanism** | Prose guardrails can be reasoned around; **only hooks/permissions are deterministic**. Implement the "business scope" boundary as `PreToolUse` hooks + protected-path permission rules + (optionally) OS sandbox — *not* a CLAUDE.md sentence. This is the concrete answer to our open question #1. |
| 5 | Conversational capture — "tell Claude, it files it" | **Confirms (was over-stated as 'override')** | Both reports independently propose a `/capture <text>` command that "asks Claude to file the snippet correctly" — that *is* our model. The single-inbox question is just an implementation detail (whether an `inbox.md` sits behind the command as one append target). So: not a contradiction with the research's "inbox" — the inbox is optional plumbing, Claude-as-filer is the surface. |
| 6 | Adaptive on-open briefing | **Confirms + extends** | A `SessionStart` hook's stdout is *injected as context Claude must process* (more reliable than CLAUDE.md, which decays in long sessions). It can be context-sensitive — read the cwd's `STATUS.md`, recent ADRs, git activity — satisfying "it depends" via logic, not a static dashboard. |
| 7 | Client data outside git; v1 = per-project brief | **Confirms + flags a threat-model gap** | Aligns with private-repo + sensitive-data-out. Caveat to record: even a *private* GitHub repo may be unacceptable for some client data (→ self-hosted Forgejo/Gitea if a client requires it). Our deferred "store + viewer" is the right place to resolve this. |

**Net:** the research validates the spine. The one decision it materially
**changes** is #2 — *clone existing repos as siblings, not nested* — and the one
it **operationalizes** is #4 — *enforce the project/business boundary in hooks,
not prose*. The capture "divergence" flagged earlier in this doc is downgraded:
the research's `/capture`-files-it pattern matches our intent.

### Cross-cutting principles the research adds (not yet in our decisions)

- **CLAUDE.md is a routing table, not a knowledge base** — keep root ≤~100–200
  lines (a real instruction budget; imports don't reduce startup cost). Detail
  lives in skills / path rules / nested per-project `CLAUDE.md`.
- **Grow on trigger (Rule of Three)** — add a skill after the 3rd repeated
  prompt; a subagent only for a named context-isolation reason; an MCP server
  only for a named workflow. Matches our "start tiny" instinct.
- **Append-only `decisions/` (ADR)** — never edit accepted records; supersede
  them. Pairs with conversational capture and the adaptive briefing.
- **Verify runtime/pricing before committing** — 2026 Claude Code pricing and a
  token-inflation bug were in flux; treat any quoted price/feature as needing a
  fresh check.

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

1. **Scope mechanics for autonomy (4):** research says enforce in
   `PreToolUse` hooks + protected-path permissions, not prose. *Remaining
   sub-question:* what concretely marks "business scope" vs a sub-project
   sandbox — a top-level path list, a per-project marker file, or cwd-based
   detection in the hook?
2. **Cloned-repo git coexistence (2):** research resolves the default —
   **sibling clones + manifest**, submodule only when nesting is required,
   subtree only to archive. *Remaining sub-question:* do we standardize on
   *one* (siblings) to avoid agent confusion, and where do siblings live
   relative to the Workshop?
3. **The client-data store + viewer (7):** what it is, and how the per-project
   brief points at it once it exists (also resolves the private-GitHub
   threat-model caveat — self-host if a client demands it).
4. **Filing conventions for "tell Claude, it files it" (5):** define the minimum
   shared placement logic (canonical files per project: `brief` / `status` /
   `decisions` / `handoff`) so filing is consistent across sessions — with or
   without an `inbox.md` behind the `/capture` surface.
5. **Root `CLAUDE.md` budget:** keep it a ≤~150-line routing table; decide what
   the business-wide invariants are vs what moves into skills / path rules.
6. The name.
