---
description: Push main, watch the GitHub Actions deploy, verify live URL responds 200.
---

# /deploy-check

End-to-end deploy verification. Wraps `recipes/deploy.md`.

## Steps

1. Confirm clean working tree:
   ```bash
   git status
   ```
   If dirty, ask the user whether to commit, stash, or abort.

2. Confirm branch is `main`:
   ```bash
   git branch --show-current
   ```

3. Optional local verification (do this if the user says they're unsure):
   ```bash
   npm run typecheck
   npm run build
   ```

4. Push:
   ```bash
   git push origin main
   ```

5. Watch the workflow. If `gh` is available:
   ```bash
   gh run list --workflow=deploy.yml --limit 1
   gh run view <id> --log
   ```
   Otherwise tell the user to open the Actions tab; typical runtime is 60–120s.

6. After green, verify live URLs:
   ```bash
   curl -s -o /dev/null -w "root: %{http_code}\n" https://barmoshe.github.io/bar-portfolio/
   curl -s -o /dev/null -w "showcase.html: %{http_code}\n" https://barmoshe.github.io/bar-portfolio/showcase.html
   ```
   Expect `200` for both. A transient `404` in the first 30–60 seconds after green is CDN propagation - retry once.

## Failure modes

- Workflow red on build step → read the log, reproduce with `npm run build` locally, fix, push again.
- Workflow green but site 404 → `base` path in `vite.config.ts` or `public/.nojekyll` (see `knowledge/99-caveats.md`).
- Styles broken post-deploy → look for hardcoded `/` asset paths; everything should resolve through `import.meta.env.BASE_URL`.
