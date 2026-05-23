# 0001. Start the operator repo as an agent-operated workshop

- Date: 2026-05-23
- Status: Accepted

## Context

Starting a new build-for-clients business and want its home repo set up correctly
from the start — a single source of truth that AI agents load into context every
time. A design interview plus two external research reports (archived in the
parent repo's `research/`) converged on a small, agent-first design. This ADR
bootstraps `decisions/` and records the foundational choices so future sessions
don't re-litigate them.

## Decision

1. **Plain visible Markdown** is the source of truth — no black-box memory store.
2. **Scope-based autonomy:** full autonomy inside a sub-project folder; business-
   scope actions confirm with the operator first. Hard stops enforced by hooks
   (`git-safe.sh`, `protect-paths.sh`), not by prose.
3. **Per-project hosting:** new projects are folders inside the repo; existing
   handed-over repos are **sibling clones** recorded in `.repos.json` — never
   cloned nested (Git embedded-repo footgun).
4. **Conversational capture:** the operator tells the agent; it files via
   `/capture`. `inbox.md` is only a fallback.
5. **Client PII deferred:** `client.md` holds a working description only; a real
   store + viewer is a later build.
6. **Root `CLAUDE.md` is a routing table** (≤~150 lines); detail lives in skills,
   per-project files, and ADRs. Grow by promotion, never pre-build.

## Consequences

- The repo is legible and portable (survives any tool change).
- Safety is deterministic, not advisory — blocked actions surface and ask.
- Some structure is intentionally absent (intake automation, client-data store,
  CXO seats, MCP, managed memory, the name) — added later only when a specific
  pain recurs.
- This skeleton's `.claude/` hooks activate only once the folder is extracted to
  a repo root.
