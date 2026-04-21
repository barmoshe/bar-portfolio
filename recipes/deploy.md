# Recipe — Deploy

You've made changes on `main` and you want them live at `https://barmoshe.github.io/bar-portfolio/`. The end state: a green `deploy.yml` workflow run, `curl` on the live URL returning `200`, spot-check of `#showcase` and `/showcase.html`.

## The arc

Deploys are fully automated from `main`. `.github/workflows/deploy.yml` installs deps, runs `npm run build`, uploads `dist/` as a Pages artifact, and publishes. The whole chain takes 60–120 seconds from push to green; Pages CDN propagation adds up to another minute on top. There is no manual step — if the workflow is green and enough time has passed, the site is up.

## 1. Pre-flight

Clean working tree, right branch:

```bash
git status
git branch --show-current  # should print: main
```

If there are unrelated changes staged, stash or commit them before you push — the workflow builds whatever is at `HEAD`.

Optional but recommended:

```bash
npm run typecheck
npm run build
```

Both pass locally means the CI build will pass. The workflow uses the same commands; nothing about the build environment differs materially.

## 2. Commit

Use a concise, present-tense message. Prefix with the area of change when helpful (`data:`, `theme:`, `copy:`, `docs:`, `chore:`).

```bash
git add -A
git commit -m "<subject>"
```

## 3. Push

```bash
git push origin main
```

That push is the deploy. There's no separate `gh-pages` branch to publish to; Actions does the artifact upload.

## 4. Watch the workflow

If you have `gh` installed and authenticated:

```bash
gh run list --workflow=deploy.yml --limit 1
gh run view --log  # once the run id is known
```

Otherwise open the Actions tab in the repo on github.com.

Expect one job (`build-and-deploy`), ~60–90 seconds.

## 5. Verify live

After the run goes green, wait ~30–60 seconds for Pages propagation, then:

```bash
curl -s -o /dev/null -w "%{http_code}\n" https://barmoshe.github.io/bar-portfolio/
curl -s -o /dev/null -w "%{http_code}\n" https://barmoshe.github.io/bar-portfolio/showcase.html
```

Both should print `200`. If one returns `404`, wait another 30 seconds — cache invalidation is eventually consistent.

Open in a browser and spot-check:

- Root page paints without a flash of light theme when OS is set to dark (pre-paint script intact).
- `#repos` grid renders any new entries.
- `#showcase` hash route mounts.
- Mobile viewport — `TabBar` visible, sections track.

## 6. If something's wrong

- **Workflow failed**: click into the run, read the failing step. Usually `npm run build` with a TS error. Fix locally, push again.
- **Workflow green but site 404**: `base: '/bar-portfolio/'` in `vite.config.ts` got changed, or `public/.nojekyll` is missing. See `knowledge/99-caveats.md`.
- **Workflow green but styles broken**: asset paths probably hardcoded somewhere. Grep for `href="/` and `src="/` — everything should go through `import.meta.env.BASE_URL`.

---

Related:
- `knowledge/01-stack.md` — workflow file and Pages setup.
- `knowledge/99-caveats.md` — the four invariants most likely to break a deploy.
- `.claude/commands/deploy-check.md` — slash command that bundles this whole flow.
