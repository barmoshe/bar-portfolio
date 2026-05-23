# Research — Private AI-Native Host Repo

Research and design brainstorm for a future private GitHub repository that will serve as the operator's memory + workshop layer behind the public `bar-portfolio` surfaces. **Not** an implementation plan, **not** a fork of `bar-portfolio`, **not** a deployment target. A separate, private, Claude-native repo whose job is to remember.

`bar-portfolio` itself is sub-project #1 of this host. Future client engagements will be siblings.

## Documents

| Doc | Focus | Length |
|---|---|---|
| **[workshop-vision.md](./workshop-vision.md)** | Vision & intent capture (May 2026 interview) — what Bar wants and why, before any wiring | ~120 lines |
| **[workshop-design.md](./workshop-design.md)** | First design pass (May 2026 interview) — committed decisions: plain notes, scope-based autonomy, conversational capture, per-project hosting, deferred client-data store | ~150 lines |
| **[host-repo-architecture.md](./host-repo-architecture.md)** | The architecture, principles, walking skeleton, CXO model, Day-1 structure | ~270 lines |
| **[practical-reference.md](./practical-reference.md)** | Concrete reference repos, sample CLAUDE.md / SKILL.md / hook / inbox-note artifacts, Day-1 → Year-1 evolution timeline, 2026 tooling stack, anti-patterns, migration patterns, costs | ~180 lines |
| **[naming-and-framing.md](./naming-and-framing.md)** | Why not "brain", critical pushback, alternative names. Top recommendation: **Workshop** / `סדנה` | ~120 lines |
| **[brain-deep-dive.md](./brain-deep-dive.md)** | Technical/cognitive deep dive on the "brain" concept (operator dislikes the name but wants the research). Memory-architecture spectrum (Tier 0–7), Extended Mind hypothesis, real implementations (claude-mem, Letta, Mem0, TheBrain), Notion-graveyard failure pattern, what to absorb under any name | ~230 lines |
| **[company-brain.md](./company-brain.md)** | Org-scale knowledge-base patterns. GitLab handbook + TeamOps, PostHog/Basecamp/Cal.com handbooks, Single Source of Truth, the wiki graveyard with 8 first-person failure stories, what translates to solo | ~190 lines |
| **[cxo-folders.md](./cxo-folders.md)** | Per-CXO folder reference for all 9 seats (CEO, CTO, COO, CFO, CRO, CMO, CLO, CKO, CPO-for-agents). Mandate, knowledge, artifacts, Day-1 minimal, 6-month mature, Claude-native skills, cross-references. Sourced from Umbrex, GitLab handbook, fractional-CXO playbooks, solo-operator OSes | ~340 lines |
| **[sub-repo-relationship.md](./sub-repo-relationship.md)** | `bar-portfolio` as the first sub-project of the host. Virtual Monorepo vs Spine vs Nested CLAUDE.md patterns. Recommended hybrid: Spine + sibling clone + per-sub-project overlay | ~180 lines |
| **[client-lifecycle.md](./client-lifecycle.md)** | Full lifecycle for a client sub-project: Lead → Qualification → Discovery/POC → Paid Pilot → Retainer → Archive. Stage gates, 2026 pricing ranges, Shape Up pitch / `exit-criteria.md`, MADR ADR pattern, retainer cadence (thoughtbot model), Israel Amendment 13 deletion rules, 8 real-practice anti-patterns | ~290 lines |
| **[intake-flow.md](./intake-flow.md)** | Mock walkthrough from marketing site → WhatsApp → host repo → sub-project creation. Framed as "knowledge accumulating at each touchpoint." Weighted integration options (manual paste / WhatsApp Web export / MCP server / Business API gateway / click-to-chat ads) | ~300 lines |
| **[claude-skills.md](./claude-skills.md)** | Authoring reference for Claude Skills. Progressive-disclosure architecture (3 load stages), Skill vs Sub-agent vs Slash Command trade-offs, YAML frontmatter discipline, goal-shaped skill design, the `/goal` slash command (session-scoped stop conditions launched May 2026), `/goal`-driven command sessions, anti-patterns | ~290 lines |
| **[build-commands.md](./build-commands.md)** | Options research on two command concepts: `/build` (build something by the company) and `/build-harness` (the company tuning its own `.claude/` harness) — the harness's knowledge+tools+scripts bundle applied inward vs outward. Option spaces, `/goal` orchestration (command = how, `/goal` = when-done, Stop hook = invariant), the Rule-of-Three governance tension, open questions | ~110 lines |

## What's locked

- **Private repo**, Claude-native, knowledge + workshop only (not deploy)
- Walking-skeleton loop: **capture ↔ retrieve** (the repo is memory)
- Capture: **single inbox, type-by-promotion** (Rule of Three)
- Retrieval (2026 lightweight): **lean CLAUDE.md TOC + SessionStart hook + 2–3 skills**, sub-agents/MCP/cross-session memory deferred
- **CXOs are knowledge + skills + tools bundles, not personas**. Roster grows organically as recurring pain demands a seat.
- **Day 1 has no CXOs.** Just the founder.
- Sub-projects live in their own repos; host doesn't deploy them. `bar-portfolio` is sub-project #1.
- Structure grown by **promotion**, never pre-creation.
- Recommended name: **Workshop** (HE: סדנה). Avoid "brain" — pretentious, anthropomorphic, attracts maintenance-as-virtue.

## Patterns worth adopting in the Workshop (handoff notes)

These are research findings the operator flagged as worth applying. Pin them here so future sessions (future-Bar or a fresh Claude session) don't have to re-discover them.

### `/goal <condition>` — session-scoped stop conditions ⭐

Claude Code v2.1.139 (May 2026) shipped `/goal`. It sets a session-scoped Stop hook that uses a small fast model to evaluate after each turn whether a stated condition holds. *"A 'no' tells Claude to keep working and includes the reason as guidance for the next turn."*

**Why this matters for the Workshop:** the Workshop is a long-lived knowledge artifact accessed across many sessions. Most useful sessions have a clear "done" state that the operator can name in one sentence. Wrapping a session in `/goal` removes the need for the operator to babysit progress.

**How to use it (the operator's preferred pattern):**

- `/goal until the 3 client retros are written and committed`
- `/goal until the inbox is empty as of today`
- `/goal until the CFO charter exists with non-empty content`
- `/goal until the weekly review is complete and the board update is in /ceo/`

**Discipline:** state the **observable outcome**, not the process. The evaluator only sees what Claude has surfaced in the conversation — no tool runs. So conditions must be verifiable from the transcript alone.

**Composition with skills:** the skill does the work, `/goal` decides when work is finished. Don't bake "stop when done" into a skill — it breaks reusability across sessions with different appetites.

See [claude-skills.md § 9](./claude-skills.md#9-the-goal-slash-command--session-scoped-stop-conditions) for the full treatment.

---

## Open sub-topics for future brainstorm sessions

1. Lean `CLAUDE.md` design — sections, routing table format, invariants list
2. The 3 Day-1 skills (triage / promote / index) in detail
3. Inbox shape — naming, structure, dating
4. Founder ↔ CXO interaction model — advisor / decider / auditor per CXO
5. Workshop activation rituals — daily / weekly / monthly cadences in practice
6. Knowledge promotion across CXOs — CKO's cross-domain librarian role
7. The "near-future" CXO build order — which seat earns the first definition; what pain triggers each subsequent one
8. `/build` and `/build-harness` as named commands — whether the company's two core verbs earn Day-1 commands or emerge by promotion; primitive choice for harness self-mutation (command / hybrid / MCP). See [build-commands.md](./build-commands.md).

## Research method

Eight web research passes spanning solo-operator playbooks, AI-native operating systems, per-client engagement patterns, the design space for "departments" in an agent org, the CPO-for-agents concept, zero-to-scaffold bootstrap methodology, Claude retrieval innovations 2026, the personal-brain concept landscape, company-brain patterns, per-CXO playbooks, the client sub-project lifecycle, and `bar-portfolio` as sub-project #1.

Full source bibliographies inside each document.
