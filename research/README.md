# Research — Private AI-Native Host Repo

Research and design brainstorm for a future private GitHub repository that will serve as the operator's memory + workshop layer behind the public `bar-portfolio` surfaces. **Not** an implementation plan, **not** a fork of `bar-portfolio`, **not** a deployment target. A separate, private, Claude-native repo whose job is to remember.

`bar-portfolio` itself is sub-project #1 of this host. Future client engagements will be siblings.

## Documents

| Doc | Focus | Length |
|---|---|---|
| **[host-repo-architecture.md](./host-repo-architecture.md)** | The architecture, principles, walking skeleton, CXO model, Day-1 structure | ~270 lines |
| **[practical-reference.md](./practical-reference.md)** | Concrete reference repos, sample CLAUDE.md / SKILL.md / hook / inbox-note artifacts, Day-1 → Year-1 evolution timeline, 2026 tooling stack, anti-patterns, migration patterns, costs | ~180 lines |
| **[naming-and-framing.md](./naming-and-framing.md)** | Why not "brain", critical pushback, alternative names. Top recommendation: **Workshop** / `סדנה` | ~120 lines |
| **[brain-deep-dive.md](./brain-deep-dive.md)** | Technical/cognitive deep dive on the "brain" concept (operator dislikes the name but wants the research). Memory-architecture spectrum (Tier 0–7), Extended Mind hypothesis, real implementations (claude-mem, Letta, Mem0, TheBrain), Notion-graveyard failure pattern, what to absorb under any name | ~230 lines |
| **[company-brain.md](./company-brain.md)** | Org-scale knowledge-base patterns. GitLab handbook + TeamOps, PostHog/Basecamp/Cal.com handbooks, Single Source of Truth, the wiki graveyard with 8 first-person failure stories, what translates to solo | ~190 lines |
| **[cxo-folders.md](./cxo-folders.md)** | Per-CXO folder reference for all 9 seats (CEO, CTO, COO, CFO, CRO, CMO, CLO, CKO, CPO-for-agents). Mandate, knowledge, artifacts, Day-1 minimal, 6-month mature, Claude-native skills, cross-references. Sourced from Umbrex, GitLab handbook, fractional-CXO playbooks, solo-operator OSes | ~340 lines |
| **[sub-repo-relationship.md](./sub-repo-relationship.md)** | `bar-portfolio` as the first sub-project of the host. Virtual Monorepo vs Spine vs Nested CLAUDE.md patterns. Recommended hybrid: Spine + sibling clone + per-sub-project overlay | ~180 lines |
| **[client-lifecycle.md](./client-lifecycle.md)** | Full lifecycle for a client sub-project: Lead → Qualification → Discovery/POC → Paid Pilot → Retainer → Archive. Stage gates, 2026 pricing ranges, Shape Up pitch / `exit-criteria.md`, MADR ADR pattern, retainer cadence (thoughtbot model), Israel Amendment 13 deletion rules, 8 real-practice anti-patterns | ~290 lines |

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

## Open sub-topics for future brainstorm sessions

1. Lean `CLAUDE.md` design — sections, routing table format, invariants list
2. The 3 Day-1 skills (triage / promote / index) in detail
3. Inbox shape — naming, structure, dating
4. Founder ↔ CXO interaction model — advisor / decider / auditor per CXO
5. Workshop activation rituals — daily / weekly / monthly cadences in practice
6. Knowledge promotion across CXOs — CKO's cross-domain librarian role
7. The "near-future" CXO build order — which seat earns the first definition; what pain triggers each subsequent one

## Research method

Eight web research passes spanning solo-operator playbooks, AI-native operating systems, per-client engagement patterns, the design space for "departments" in an agent org, the CPO-for-agents concept, zero-to-scaffold bootstrap methodology, Claude retrieval innovations 2026, the personal-brain concept landscape, company-brain patterns, per-CXO playbooks, the client sub-project lifecycle, and `bar-portfolio` as sub-project #1.

Full source bibliographies inside each document.
