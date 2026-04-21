# Repo notes

## Branching

This is a **mono-branch repo** — `main` only. No feature branches, no PRs. Commit and push directly to `main`.

## Stack

Static site. Three files at root:

- `index.html` — markup + a small pre-paint theme script (inline, must stay inline to avoid FOUC)
- `styles.css` — all styles
- `script.js` — all behavior, loaded with `defer`

No build step. Relative paths only.

## Deploy

GitHub Pages. `.nojekyll` is present. `git push origin main` is the deploy.
