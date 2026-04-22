---
description: Add a new project entry to src/data/portfolio.ts end-to-end.
---

# /new-project

Walks the `recipes/add-project.md` flow with the user.

## Steps

1. Ask the user for (or infer from context):
   - Project name
   - Primary language (check against `LANG_ICON` in `src/data/portfolio.ts`)
   - URL
   - Description (with `' - '` separator between hook and detail)
   - Optional `extras: { label, url }[]`
   - Insert position in `projects[]` (default: top)

2. Use `prompts/add-project.md` with those inputs to generate the object literal (and, if the language isn't in `LANG_ICON`, the map extension).

3. Open `src/data/portfolio.ts` and apply the edit:
   - Append / insert into `projects` at the chosen position.
   - If needed, extend `LANG_ICON` with a new 1–3 char glyph.

4. Run verification:
   ```bash
   npm run typecheck
   ```

5. If typecheck passes, tell the user to `npm run dev` and check `http://localhost:5173/#repos` for the new card + lightbox. Otherwise surface the first error with file:line and stop.

## Invariants

- Do not rename or reshape `Project` / `ProjectExtra` types.
- Do not add runtime deps.
- Do not touch styles for "just this one card" - use existing HoverCard / CodeArt primitives.
