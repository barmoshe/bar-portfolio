---
description: Promote a qualified lead into a paid client engagement.
---

# /promote-to-client

Move a lead into `clients/` and mark the free→paid transition. `$ARGUMENTS` is the
lead slug.

## Steps

1. Move `leads/<slug>/` → `clients/<slug>/` (preserve `brief.md`).
2. Add `contract.md` — a lightweight SOW stub: problem, deliverables, timeline,
   acceptance criteria, constraints. (Keep money/legal specifics out of git if
   sensitive; reference them.)
3. Open an "engagement started" ADR via the `decision` skill, linking the brief.
4. Reset `STATUS.md`: "Where we are: engagement started / Next action: <first
   build step> / Blockers:" + today's date.
5. Decide the build's home: greenfield → `mvp/` inside the client folder
   (`mvp-scaffold`); handed-over repo → sibling clone in `.repos.json`.
6. Report the new path and the first build step.
