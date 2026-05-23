---
description: Use the harness inward — improve the company's own .claude/ harness (the highest-trust command).
---

# /build-harness

Point the bundle **inward**, at the harness itself: `CLAUDE.md`, hooks, skills,
commands, settings, routing. `$ARGUMENTS` is what to improve (or "audit").

> **This is the highest-trust command in the repo** — it edits the company's own
> brain. That is **business scope**: propose, get confirmation, then apply. Never
> apply a harness change silently. `protect-paths.sh` still blocks secret/`archive/`
> edits regardless.

## Steps

1. **Audit** the target area against its budget/intent:
   - Root `CLAUDE.md` stays a **lean routing table** — prune if it drifts toward a
     knowledge base or past its line budget.
   - `session-start.sh` stays fast and dynamic-state-only — prune bloat.
   - Skills: author a new one **only after the 3rd repeat** (Rule of Three);
     retire any not used in a long while. Every skill `description` should name
     its trigger.
   - `settings.json` permissions + routing tables: check for drift vs the real
     tree (commands/skills/folders that exist).
   - Hooks: confirm they still block/allow correctly.
2. **Propose a concrete diff** and show it to the operator. Wait for confirmation.
3. **Apply** the confirmed change.
4. **Log it** — write an ADR via the `decision` skill recording *what changed in
   the harness and why*. This append-only changelog is **mandatory** for harness
   edits (it's the audit trail for the company's own brain).
5. **Re-run the hook self-tests** (pipe sample JSON to `git-safe.sh` /
   `protect-paths.sh`; run `session-start.sh`) to confirm nothing broke.

> For an expensive audit, spin a sub-agent to do the reading and let the main
> session apply the diff. Pair with `/goal` for the finish line (e.g. "until
> CLAUDE.md is back under budget and every skill description names its trigger").
