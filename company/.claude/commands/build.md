---
description: Use the harness outward — build a deliverable/sub-project with the company's accumulated knowledge.
---

# /build

Point the company's `knowledge + tools + scripts` bundle **outward**, at the
work. `$ARGUMENTS` is what to build (or which project/slice).

## Steps

1. **Locate the target's scope.**
   - Already a sub-project (`clients/<x>/`, `projects/<x>/`, or a sibling clone in
     `.repos.json`) → **drive the build in place.**
   - No project yet → **graduate one first**: run the `mvp-scaffold` skill to
     create the folder (or sibling clone) and seed `brief.md` / `STATUS.md`.
2. **Load the relevant company knowledge into context** before building: the
   project's `CLAUDE.md`, `brief.md`, `STATUS.md`, and its `decisions/`. That
   accumulated context is the differentiator over a generic agent.
3. **Build the smallest thin slice** toward the brief's v1 "done." Don't add a
   framework, dependency, or abstraction the demo doesn't need.
4. **Stay in sub-project scope** — you have full autonomy here. If a step would
   touch business scope (repo root, `archive/`, contracts, `.claude/`), stop and
   confirm with the operator.
5. **Record as you go:** update `STATUS.md` (next action + date); capture
   non-obvious choices as ADRs via the `decision` skill.
6. Reserve sub-agents for genuinely heavy exploration (repeatedly reading many
   files), not routine edits.

> Pair with `/goal` for a session finish line (e.g. "until the v1 demo slice
> runs"). `/goal` judges only what's surfaced in the conversation — use a Stop
> hook for deterministic invariants (no uncommitted files, build passes).
