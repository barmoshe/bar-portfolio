---
description: Run npm run typecheck and summarize the first 20 errors with file:line.
---

# /typecheck

Fast feedback loop for TypeScript errors.

## Steps

1. Run:
   ```bash
   npm run typecheck
   ```

2. If it exits 0, print "typecheck: clean" and stop.

3. If it exits non-zero, parse the output and surface the first 20 errors in this format:

   ```
   src/components/Foo.tsx:42:7  TS2322: Type 'string' is not assignable to type 'number'.
   ```

   Group by file when there are clusters.

4. For each error, suggest the smallest fix that stays inside the existing type contract. Do not loosen types to silence errors (no `any`, no `@ts-ignore`) unless the user explicitly asks.

## Notes

- The script is `tsc -b` under the hood — it does incremental builds. If a previous build is stale, `rm -rf node_modules/.tmp` and rerun resolves weird cache errors.
- Errors in `src/data/portfolio.ts` usually mean a new project entry is missing a required field or has an extra unknown one.
- Errors in `src/components/HeroSlides.tsx` warrant extra caution — see `knowledge/04-animation.md` before refactoring the fx cycle to silence an error.
