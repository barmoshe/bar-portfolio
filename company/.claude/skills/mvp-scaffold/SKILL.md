---
name: mvp-scaffold
description: Use when standing up a new sub-project folder or build skeleton inside the workshop. Creates the standard project files from templates/project/ and decides the build's home (folder-in-repo vs sibling clone). Triggers on /new-project, /promote-to-client, "start the build", or "scaffold".
license: MIT
---

# mvp-scaffold

Stand up a sub-project fast, with the standard files so every project is legible
to the agent.

## Steps

1. Choose the home:
   - **New project** → create a folder under `clients/<name>/` or
     `projects/<name>/`.
   - **Existing repo handed over** → clone it as a **sibling** and add an entry to
     `.repos.json` (`{name, path, url, status}`). Never clone nested.
2. Copy `templates/project/` into the folder: `CLAUDE.md`, `brief.md`,
   `STATUS.md`, `client.md`, `decisions/`.
3. Fill `CLAUDE.md` with project-specific context (stack, where the build lives,
   any local conventions). This nested `CLAUDE.md` loads only when working here.
4. Put the build itself under `mvp/` (or the sibling clone). Default to the
   smallest working end-to-end skeleton, then grow.
5. Seed `STATUS.md` with the first concrete next action + today's date.

## Default stack

Pick the lightest stack that ships the v1 "done" from the brief. Don't add a
framework, test runner, or dependency the demo doesn't need. Record the stack
choice as an ADR via the `decision` skill if it's non-obvious.
