---
description: File a captured snippet (lead, idea, decision, or client note) into the right place.
---

# /capture

Take whatever the operator just told you and **file it** — they shouldn't have to
say where it goes. `$ARGUMENTS` holds the snippet.

## Steps

1. Classify the snippet:
   - **Decision** (something was settled) → invoke the `decision` skill, write an
     ADR into `decisions/`.
   - **Lead / inbound** → `leads/<slug>/` (create with the `brief-intake` shape if
     there's enough to qualify; otherwise a stub `brief.md`).
   - **Client note** for an existing engagement → that client's folder
     (`clients/<name>/` working notes or `client.md`). Keep PII out of git.
   - **Idea / side thing** → `projects/<slug>/` or a note under the relevant project.
2. If the right home is genuinely unclear, append it to `inbox.md` with today's
   date and move on — don't block.
3. Respect scope: filing inside a sub-project is free; if it would touch
   `archive/`, contracts, or repo-root config, confirm with the operator first.
4. Report in one line where it landed.
