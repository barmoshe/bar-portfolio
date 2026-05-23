---
description: Turn an incoming brief into a qualified lead folder.
---

# /intake

Run the standard intake on a new brief. `$ARGUMENTS` holds the raw brief (or a
pointer to where it came from).

## Steps

1. Invoke the `brief-intake` skill to produce the ~5 clarifying questions and a
   structured brief.
2. Create `leads/<slug>/` (slug from the prospect/project name) containing:
   - `brief.md` — the structured brief (immutable once written).
   - `qualifying-questions.md` — the questions, with answers as they arrive.
   - `STATUS.md` — seed with "Where we are: new lead / Next action: qualify /
     Blockers:" + today's date.
3. Open ADR-worthy notes only if a real decision is made; otherwise leave it.
4. Report the new folder path and the open questions.
