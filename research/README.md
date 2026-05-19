# Research — Private AI-Native Host Repo

Research and design brainstorm for a future private GitHub repository that will serve as the operator's memory + workshop layer behind the public bar-portfolio surfaces. **Not** an implementation plan, **not** a fork of `bar-portfolio`, **not** a deployment target. A separate, private, Claude-native repo whose job is to remember.

Three documents, ordered by depth:

| If you want… | Open |
|---|---|
| The architecture and principles | [host-repo-architecture.md](./host-repo-architecture.md) |
| Concrete examples, sample files, tooling, costs | [practical-reference.md](./practical-reference.md) |
| What to call it (and why not "brain") | [naming-and-framing.md](./naming-and-framing.md) |

## What's locked

- **Walking-skeleton spine:** capture ↔ retrieve. The repo is memory.
- **Capture:** single inbox; type-by-promotion via Rule of Three.
- **Retrieval (2026 lightweight):** lean `CLAUDE.md` TOC + SessionStart hook + 2–3 skills. Sub-agents / MCP / cross-session memory deferred until usage justifies them.
- **CXOs** are knowledge + skills + tools bundles (not sub-agents). Roster grows organically as recurring pain demands a seat. Day 1 has no CXOs.
- **Sub-projects** = real client engagements; live in their own repos with their own CI/CD; the host does not deploy them.
- **Structure** is grown by promotion, never by pre-creation.
- **Naming:** top recommendation is **Workshop** (`סדנה`); see naming doc for the full menu and rationale.

## What's deferred (next brainstorm sessions)

1. Lean `CLAUDE.md` design — sections, routing table format, invariants list
2. The 3 Day-1 skills (triage / promote / index) in detail
3. Inbox shape — naming, structure, dating
4. Post-promotion folders — what the first 3–5 look like
5. CXO mandate templates — what a charter looks like as a file
6. Workshop ↔ sub-project handoff — graduation criteria
7. CXO ↔ sub-project visibility — which CXO sees which client
8. Founder ↔ CXO interaction model — advisor / decider / auditor
9. CPO-for-agents in practice — roster file, agent CVs, performance log
10. Sub-project bootstrap — what the host hands a new engagement at birth
11. "Near-future" CXO build order — which seat earns the first definition
12. Knowledge promotion across CXOs — CKO's cross-domain librarian role

## Research that informed this

Eight web research passes spanning solo-operator playbooks, AI-native operating systems, per-client engagement patterns, the design space for "departments" in an agent org, the CPO-for-agents concept, zero-to-scaffold bootstrap methodology, Claude retrieval innovations 2026, and the personal-brain concept landscape with critical pushback and naming alternatives.

Full source bibliographies inside each document.
