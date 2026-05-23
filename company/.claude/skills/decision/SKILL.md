---
name: decision
description: Use when a decision gets made that future-you (or a future session) would otherwise re-litigate. Writes an append-only ADR in Nygard format into decisions/. Triggers on "we decided", "let's go with", /capture of a decision, engagement start/close, or any architectural/business choice worth remembering.
license: MIT
---

# decision

Record decisions as **append-only** ADRs so the agent never re-argues settled
questions. Never edit an Accepted record — supersede it with a new one that links
back.

## Filename

`decisions/NNNN-YYYY-MM-DD-<slug>.md` — `NNNN` is the next zero-padded number,
date is today. Engagement-scoped decisions may live in `<project>/decisions/`
instead of the repo root.

## Template

```md
# NNNN. <short title>

- Date: YYYY-MM-DD
- Status: Accepted        # or: Proposed | Superseded by NNNN | Deprecated

## Context
What forced a decision. The constraints and options in play.

## Decision
What we're doing, stated plainly.

## Consequences
What this makes easy, what it costs, what it rules out.
```

## Rules

- One decision per file. Keep it short.
- To change a decision: write a new ADR, set the old one's Status to
  `Superseded by NNNN`, and link them. Do not rewrite history.
- The `SessionStart` hook surfaces the most recent ADRs — that's the payoff.
