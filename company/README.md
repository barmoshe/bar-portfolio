# company/ — operator repo (walking skeleton)

The home repo of the business: an agent-operated **workshop** that intakes a
brief, builds an MVP, hands it off, and remembers why. Plain Markdown, lean
routing in `CLAUDE.md`, lifecycle folders (`lab/ leads/ clients/ projects/
archive/`), append-only `decisions/`, and a few skills/commands/hooks. Start
here: read `CLAUDE.md`.

This folder currently lives inside `bar-portfolio` as a staging ground. It is
designed to be **extracted into its own private repo**.

## Extracting into its own repo

**Simple (no history):**

```sh
cp -r company <dest> && cd <dest> && git init && git add -A && git commit -m "init operator repo"
```

**History-preserving:**

```sh
git subtree split --prefix=company -b company-export
# then pull/push the company-export branch into a fresh empty repo
```

> Note: `.claude/` config and the hooks activate only once this folder is at a
> **repo root**. While nested inside `bar-portfolio` they do not fire (Claude
> Code does not cascade nested `.claude` settings/hooks) — that is expected.

## `.repos.json`

Manifest of **sibling clones** (existing repos handed over, kept beside this repo
— never nested). Entry shape:

```json
{ "name": "acme", "path": "../acme", "url": "git@github.com:acme/app.git", "status": "active" }
```
