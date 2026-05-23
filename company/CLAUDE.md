# CLAUDE.md — the operator repo

This is the operator repo for the business (name TBD). Every action here is
performed by an AI agent. We deliver MVPs in hours-to-days from a small brief and
a few clarifying questions. This file is a **routing table**, not a knowledge
base — keep it short; detail lives in skills, per-project files, and `decisions/`.

## What this repo is

- A **workshop**, not a vault. Tools that stop serving the work get thrown out.
- **Plain Markdown** is the source of truth. Nothing important hides in a tool
  you can't open and read.
- A **substrate operated by agents.** You direct; the agent files, builds, and
  remembers.

## Where state lives (canonical)

- `decisions/` — append-only ADRs. The history of *why*. Never edited once
  Accepted; superseded by a newer ADR that links back.
- `<project>/STATUS.md` — where we are / next action / blockers, per project.
- `<project>/brief.md` — the original brief, immutable.
- `inbox.md` — only a fallback landing spot for `/capture`; not a system to maintain.

## Lifecycle folders (renamable backbone)

| Folder | Meaning |
|---|---|
| `lab/` | Free experiments — the lead-gen surface. |
| `leads/` | Inbound or lab-converted prospects being qualified. |
| `clients/` | Paid engagements. |
| `projects/` | Own side projects + business-improvement work. |
| `archive/` | Frozen at handover. **Immutable** (protected by a hook). |

The arc is a backbone, not a rigid pipeline: **lead → qualified → active →
handoff → archive**. Different project types bend it.

## Scope-based autonomy (the spine)

- **Inside a single sub-project folder → full autonomy.** Build, edit, run,
  commit freely.
- **Business-scope actions → confirm with the operator first.** That means
  anything touching: the repo root, `archive/`, contracts/secrets, `.claude/`,
  money/legal, or more than one project at once.
- Hard stops are **enforced by hooks**, not by trusting this paragraph:
  `.claude/hooks/git-safe.sh` blocks destructive shell; `.claude/hooks/protect-paths.sh`
  blocks edits to `archive/` and secret-ish files. If a hook blocks you, surface
  it and ask — do not work around it.

## Hosting sub-projects

- **New project** → a folder under `clients/` or `projects/`.
- **Existing repo** (e.g. a client hands one over) → **clone it as a sibling**
  and record it in `.repos.json`. **Never clone it nested inside this repo** —
  Git turns a nested `.git` into an unusable gitlink. (See `.repos.json`.)

## Capture

Tell the agent what happened; it files it. `/capture <text>` classifies the
snippet (lead / idea / decision / client note) and routes it to the right place.
A decision becomes an ADR via the `decision` skill. `inbox.md` is only the fallback.

## Client data / privacy

Client PII stays **out of git**. `<project>/client.md` holds a *working
description* only — not contracts, full contact dumps, or credentials. A real
store + viewer is a later build.

## Routing — commands & skills

- Commands: `/capture`, `/intake`, `/promote-to-client`, `/archive`,
  `/weekly-review` (see `.claude/commands/`).
- Skills: `brief-intake`, `decision`, `mvp-scaffold` (see `.claude/skills/`).
- New project scaffolding → `templates/project/`.

## Growth rule

Add a skill after the 3rd repeated prompt; a command when a flow recurs; an MCP
server only for a named workflow. Don't pre-build. Grow by promotion.
