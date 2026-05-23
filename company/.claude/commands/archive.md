---
description: Freeze a finished client or project at handover.
---

# /archive

Close out an engagement and move it to the immutable `archive/`. `$ARGUMENTS` is
the client/project name.

## Steps

1. Confirm the closeout package exists in the project: handoff notes, run/deploy
   instructions, known limitations, accepted scope, credentials-transfer status,
   short lessons-learned. Create what's missing.
2. Write a closing ADR via the `decision` skill (outcome + lessons), `Status:
   Accepted`.
3. Flip `STATUS.md` to include `archived: true` + today's date.
4. Move the folder → `archive/<name>/`.
5. Note: `archive/` is protected by `protect-paths.sh` — after this, edits are
   blocked. This is a business-scope move; confirm with the operator before
   running.
6. Report what was archived and the closing ADR path.
