# 0002. Treat the company as a harness with /build and /build-harness

- Date: 2026-05-23
- Status: Accepted

## Context

The company repo carries a `knowledge + tools + scripts` bundle. That bundle can
be applied in two directions, and the operator wants a command for each
(explored in the parent repo's `research/build-commands.md`):

- outward, on the work → build the company's deliverables;
- inward, on itself → fix/improve the harness.

## Decision

Add two slash commands:

- **`/build`** — point the bundle **outward**. Drive a build inside an existing
  sub-project (loading its accumulated context), or graduate a new one via
  `mvp-scaffold` first. Operates in sub-project scope (full autonomy).
- **`/build-harness`** — point the bundle **inward** at `.claude/` (CLAUDE.md,
  hooks, skills, settings, routing). This is the **highest-trust command** and is
  **business scope**: it must propose a diff, get operator confirmation, apply,
  then **log an ADR** of what changed and why, and re-run the hook self-tests.

Both are plain slash commands for now (not skills/MCP). They may pair with
`/goal` for a session finish line, back-stopped by Stop-hook invariants later.

## Consequences

- One symmetric mental model: same bundle, two directions.
- Harness self-modification is audited by default (mandatory ADR + confirm),
  matching scope-based autonomy and the `protect-paths.sh` guardrail.
- Open (deferred, per research): whether `/build` is genuinely distinct from
  `/promote` + scaffolding once real sub-projects exist; when `/build-harness`
  should graduate to the sub-agent-hybrid or MCP-gated form; the Stop-hook
  invariant set that back-stops both.
