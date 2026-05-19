# Practical Reference — Real Repos, Sample Files, Tooling, Costs

Companion to `host-repo-architecture.md`. Where the architecture doc is theoretical/structural, this one is concrete: real repos to crib from, real sample files, real tooling, real costs, real anti-patterns from real practice.

---

## 1. Five reference repos worth cribbing from

| # | Repo | What to steal |
|---|---|---|
| 1 | **[coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter)** — Cole Medin's Claude Code skill that generates a personalized 9-phase PRD for a proactive second brain. | `SOUL.md` (agent personality + safety), `USER.md` (your profile), `MEMORY.md` (decisions/lessons), `daily/YYYY-MM-DD.md`. The "fill an 8-section requirements template, then generate" bootstrap pattern. |
| 2 | **[remember-md/remember](https://github.com/remember-md/remember)** — the most directly cribbable layout. `~/remember/` with `REMEMBER.md`, `Persona.md` (auto-managed top beliefs), `People/`, `Projects/`, `Notes/`, `Journal/`, `Tasks/`, `Areas/`, `Resources/`, `Inbox/`, `Templates/`, `Archive/`. | The three epistemic layers (Capture → Curate → Pinned); YAML frontmatter schema (`type` / `freshness` / `confidence` / `evidence`); `promotion_confidence: 0.85` + `promotion_sources: 5` thresholds; the `/remember:evolve` weekly loop. |
| 3 | **[huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain)** — 17 skills + 6 worker agents + people CRM, inspired by Garry Tan's gstack/gbrain. | Numbered top-level folders (`00-inbox/`, `01-daily/`, `02-personal/`, `03-professional/`, `04-projects/`, `05-knowledge/people/`, `06-templates/`). The **people CRM tiering** (Tier 3 stub at 1 mention, Tier 2 moderate at 3 mentions, Tier 1 full at 8+). The worker-agent split (researcher / data-collector / executor / publisher) to keep main context lean. |
| 4 | **[humanlayer/humanlayer](https://github.com/humanlayer/humanlayer/blob/main/CLAUDE.md)** — production `CLAUDE.md` from the team that wrote ["Writing a good CLAUDE.md"](https://www.humanlayer.dev/blog/writing-a-good-claude-md). ~80 lines, factual, no instructions-as-imperatives. | The `TODO(0..4)` priority annotation system; the "Quick Actions" make-target block; the explicit "Architecture Flow" ASCII diagram. Pair with [humanlayer/12-factor-agents](https://github.com/humanlayer/12-factor-agents) for the persona-selection-first pattern. |
| 5 | **[charlie947/ai-second-brain](https://github.com/charlie947/ai-second-brain)** — implements Karpathy's LLM wiki ([gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)). | The **raw / wiki / schema three-layer split**; the immutability rule (LLM never edits `raw/`); 3-stage migration from ChatGPT/Claude history → tagged vault → wired channels. |

Honorable mentions: `ChrisWiles/claude-code-showcase`, `danielrosehill/Claude-Code-Repo-Managers-ClaudeMD`, `NicholasSpisak/second-brain`, `eugeniughelbur/obsidian-second-brain`.

---

## 2. Sample artifacts (real, cited)

### 2.1 Lean CLAUDE.md (~80 lines)

From [humanlayer/humanlayer/CLAUDE.md](https://raw.githubusercontent.com/humanlayer/humanlayer/main/CLAUDE.md). The shape, not the content:

```markdown
# CLAUDE.md
This file provides guidance to Claude Code when working in this repo.

## Repository Overview
Monorepo with two project groups: HumanLayer SDK & Local Tools Suite.

## Components
- humanlayer-ts/  - TypeScript SDK
- humanlayer-go/  - Minimal Go client
- hld/            - Go daemon (approvals + Claude Code sessions)
- hlyr/           - TypeScript CLI + MCP server

## Architecture Flow
Claude Code → MCP → hlyr → JSON-RPC → hld → HumanLayer Cloud API

## Quick Actions
- make setup        # resolve deps
- make check-test   # all checks + tests
- make check        # lint + typecheck

## TODO Annotations
TODO(0) critical, never merge | TODO(1) high | TODO(2) medium
TODO(3) low | TODO(4) question | PERF perf opportunity
```

**Discipline (from [jock.pl's 1000-session writeup](https://thoughts.jock.pl/p/how-i-structure-claude-md-after-1000-sessions)):** every rule must "earn its place" or be removed. Rules >200 lines get less adherence. Index entries <150 chars. CLAUDE.md is re-injected every turn — bloat is paid every turn.

### 2.2 SKILL.md frontmatter

Canonical reference: [anthropics/skills skill-creator/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md).

```markdown
---
name: skill-creator
description: Create new skills, modify and improve existing skills, and
  measure skill performance. Use when users want to create a skill from
  scratch, edit, or optimize an existing skill, run evals to test a skill...
---

# Skill Creator
A skill for creating new skills and iteratively improving them.

At a high level, the process goes:
- Decide what the skill should do
- Write a draft
- Create test prompts and run claude-with-access-to-the-skill on them
- Evaluate qualitatively and quantitatively
- Rewrite based on feedback
- Repeat until satisfied

Your job is to figure out where the user is in this process and help them
progress. Be flexible — if they say "just vibe with me", do that.
```

**Anthropic guidance:** ≤500 lines body, ~100-word description, descriptions **pushy** (combat undertriggering). See [Agensi's SKILL.md reference](https://www.agensi.io/learn/skill-md-format-reference).

### 2.3 SessionStart hook (≤1s wall-time)

From [Claude Code docs](https://code.claude.com/docs/en/hooks) + [MindStudio walkthrough](https://www.mindstudio.ai/blog/session-start-hooks-claude-code-force-context):

```bash
#!/usr/bin/env bash
# .claude/hooks/session-start.sh
set -euo pipefail

BRANCH=$(git branch --show-current 2>/dev/null || echo "no-git")
COMMITS=$(git log --oneline -5 2>/dev/null || echo "")
INBOX=$(ls -1 inbox/ 2>/dev/null | wc -l)
TODAY=$(date +%F)
DAILY="journal/${TODAY}.md"

cat <<EOF
{"message": "Branch: ${BRANCH}. Inbox count: ${INBOX}.
Recent commits:
${COMMITS}
Daily note: ${DAILY} (exists: $([ -f "$DAILY" ] && echo yes || echo no))."}
EOF
```

**Hook anti-patterns to avoid:** imperative phrasing (triggers prompt-injection defense — phrase as **factual statements**); >1s wall-time; writing secrets via `CLAUDE_ENV_FILE` (leaks to all subsequent Bash calls).

### 2.4 Inbox note (composite of remember-md/remember schema)

```markdown
---
date: 2026-05-19
type: observation
freshness: stable
confidence: 0.6
---
Lead from WhatsApp #972-50-xxx — "Yossi, runs a 12-seat clinic in
Petah Tikva, wants a booking page + WA confirmations". Mentioned
budget ~ILS 4-6k. Followup: Thursday 21:00. Source: WA voice note
@ 14:32. Possibly Tier-3 person stub: see People/yossi-clinic.md.
```

Faithful composite, not a verbatim public note — solo operators don't publish their inboxes.

---

## 3. Practical evolution timeline

Synthesized from `remember-md/remember`, `coleam00/second-brain-starter`, `charlie947/ai-second-brain`, and the [Rails-in-8-weeks build writeup](https://world.hey.com/cpinto/building-a-complete-saas-product-with-only-claude-code-cca13895):

| Stage | What actually appears |
|---|---|
| **Day 1 (2–4h)** | `CLAUDE.md` skeleton (~50 lines), `inbox/`, `journal/YYYY-MM-DD.md`, one `/triage` skill, SessionStart hook. Nothing else. |
| **Week 1** | `people/`, `projects/`, `notes/` appear after first real captures. First 3 skills concretized: `triage`, `promote`, `index`. First MCP wired (Gmail OR filesystem, not both). |
| **Month 1** | `persona.md` auto-managed; `/evolve` weekly loop scheduled; `templates/`; first sub-agent (researcher) spun out to keep main context lean. Common abandonment: bespoke tagging taxonomies (collapse into standard `type/freshness/confidence`). |
| **Month 3** | `areas/` (ongoing responsibilities) and `archive/` distinguish from `projects/`. People CRM tiering (Tier 3 → 2 → 1) starts firing. Second MCP added (Calendar or Notion). First reorganization — folders ≥10 entries get sub-indexed. |
| **Year 1** | ~10B tokens per the Anthropic Max-plan case study; `raw/` (immutable sources) vs `wiki/` (LLM-owned) split formalized; weekly maintenance ≈30 min; 5–8 skills active, dozens drafted-then-deleted. |

---

## 4. Battle-tested tooling stack (2026)

From [Codersera](https://codersera.com/blog/best-mcp-servers-claude-code-cursor-2026/), [Toolradar](https://toolradar.com/blog/best-mcp-servers-claude-code), [Nimbalyst](https://nimbalyst.com/blog/best-claude-code-mcp-servers/):

- **MCP servers — official only** (community forks largely obsolete since March 2026): Filesystem, GitHub, **Google Workspace** (Gmail + Calendar + Drive + Docs in one), Notion (official), Stripe, Cloudflare, Slack, Vercel. Pick **4–6**, not 15.
- **Sub-agents**: researcher / executor / publisher split from `huytieu/COG-second-brain`. Use only when one task = >5k tokens of exploration repeatedly.
- **Skill registries**: [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code) (44k+ stars), [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit) (135 agents, 35 skills, 20 hooks), [ComposioHQ/awesome-claude-skills](https://github.com/ComposioHQ/awesome-claude-skills), [BehiSecc/awesome-claude-skills](https://github.com/BehiSecc/awesome-claude-skills) (includes the **agnix** linter — 156 rules for SKILL.md / CLAUDE.md / hooks).
- **Hooks people actually use**: SessionStart (context injection), PreCompact (preserve invariants), PostToolUse (lint/format), Stop (cost log). [Complete 2026 reference](https://thepromptshelf.dev/blog/claude-code-hooks-complete-reference-2026/) lists 32+ events.
- **WhatsApp**: no Anthropic-blessed MCP as of May 2026. Bridge via Zapier MCP (`coleam00/second-brain-skills` MCP-client pattern). Rolling your own is an anti-pattern.

---

## 5. Real-world anti-patterns (from production usage)

1. **CLAUDE.md as linter.** HumanLayer: *"Never send an LLM to do a linter's job — LLMs are expensive and slow vs. formatters. Style guidelines eat context."* Use `make check`, not CLAUDE.md prose.
2. **The 200-line CLAUDE.md cliff.** Jock.pl (1000+ sessions): adherence collapses past ~200 lines because the file is re-injected every turn. Vague rules ignored, specific ones followed. Every rule earns its place.
3. **The March 2026 read-to-edit collapse.** [Anthropic post-mortem (Apr 23)](https://www.buildthisnow.com/blog/models/claude-code-quality-regression-2026): read-to-edit ratio dropped from 6.6:1 to 2.0:1; daily cost per dev went from $12 to $1,504 with no productivity gain. Lesson: monitor read/edit ratio; budget context; force Research → Plan → Implement → Validate phases with `/clear` between.
4. **Malicious CLAUDE.md.** Cloned repos can ship CLAUDE.md that instructs Claude to exfiltrate `~/.ssh` or env vars. Review CLAUDE.md before first run on any cloned repo; gate sensitive paths with explicit permissions.
5. **Persona stampede / over-routing.** `humanlayer/12-factor-agents`' "MANDATORY PERSONA SELECTION" is genuinely useful, but solo operators copy it without ever using it — every session burns tokens re-reading 5 personas. If you have <3 distinct workflows, skip personas entirely.

---

## 6. Migration from scattered tools (first 2 weeks)

Per [Notion's Markdown Content API (Feb 2026)](https://www.notion.com/help/export-your-content) and `charlie947/ai-second-brain` Stage 1:

1. **Notion → markdown (Day 1, 30 min):** Workspace settings → Export → **Markdown & CSV**, "Include subpages: on". Drop the unzipped tree under `raw/notion/`. Don't reorganize — let the LLM do it via `/triage`.
2. **Gmail (Day 2–3):** wire Google Workspace MCP; ask Claude to summarize last 90 days of unread starred mail into `inbox/gmail-backlog.md` as Tier-3 person stubs + open threads. Only starred / labeled.
3. **WhatsApp (Day 4–5):** export per chat (Settings → Chat → Export, without media); drop `.txt` under `raw/whatsapp/`; run `/triage` to extract leads → `people/` stubs and decisions → `notes/`. No battle-tested WhatsApp MCP as of May 2026 — manual export is pragmatic.
4. **Head dump (Week 1):** Karpathy-style 30-min voice memo per day → transcript → `inbox/`. `coleam00/second-brain-starter`'s interview template walks the LLM through extracting structure.
5. **Week 2 — promotion pass:** run `/promote` to lift Tier-3 stubs to Tier-2 where mentions ≥3; auto-archive `inbox/` items older than 14 days untouched.

**Hard-won rule from all 5 reference repos:** don't migrate everything. Migrate what gets *referenced* in the next 30 days; everything else stays in `raw/` and is pulled on demand.

---

## 7. Cost / effort estimates

From [Verdent](https://www.verdent.ai/guides/claude-code-pricing-2026), [Finout](https://www.finout.io/blog/claude-code-pricing-2026), [Anthropic cost docs](https://code.claude.com/docs/en/costs):

| Question | Real numbers |
|---|---|
| Day 1 setup time | **2–4 hours** (CLAUDE.md + 1 skill + 1 hook + 1 MCP) |
| Weekly maintenance | **30–60 min** for a working `/evolve` loop; near-zero once `persona.md` auto-promote stable |
| Pro plan ($20/mo) | Adequate <10 h/week of use |
| Max 5x (~$100/mo) | One operator: ~10B tokens over 8 months ≈ $800 total; would have been $15k at API rates |
| Enterprise baseline | $150–250/dev/month, ~$13/active day, 90% under $30/day |
| Per-session tokens | 10k–100k+ for medium codebase reads. Opus 4.6: $5 in / $25 out per M; Sonnet 4.6: $3 in / $15 out per M |
| Solo founder reference | [Rails-in-8-weeks build](https://world.hey.com/cpinto/building-a-complete-saas-product-with-only-claude-code-cca13895): 727 commits, 38.6k LOC, 36 active days, a few hours/week oversight |

---

## 8. Practical questions for Day 1

1. **Single-tenant vs. shareable?** If you ever want a collaborator (even future-you on another machine) to read this, the `remember-md/remember` layout wins. Strictly local-personal forever → `coleam00/second-brain-starter` SOUL/USER/MEMORY scheme is faster.
2. **Where does WhatsApp dispatch sit?** Your portfolio reserves `--mp-whatsapp` for dispatch CTAs. Is the brain's WhatsApp pipeline a *receiver* (export → triage → lead) or also a *sender* (Claude drafts replies)? Sender mode needs human-in-the-loop guardrails (HumanLayer style); receiver mode is a 1-day build.
3. **Which 1 MCP first?** Gmail (highest signal, fastest extraction) or filesystem (cheapest, no auth)? Pick exactly one for Week 1; second not before Day 30.
4. **People CRM tiering thresholds?** Adopt huytieu/COG's defaults (1/3/8 mentions) or your own? The threshold you'll regret leaving at default if your workflow is heavily client-driven.
5. **What's the kill criterion for a skill?** Per Jock.pl, every rule must earn its place. Pre-commit to "skill removed if not invoked in 30 days" — otherwise `.claude/skills/` accretes dead weight.

---

## Sources

- [How I Structure CLAUDE.md After 1000+ Sessions — jock.pl](https://thoughts.jock.pl/p/how-i-structure-claude-md-after-1000-sessions)
- [Writing a good CLAUDE.md — HumanLayer](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [humanlayer/humanlayer CLAUDE.md](https://github.com/humanlayer/humanlayer/blob/main/CLAUDE.md)
- [humanlayer/12-factor-agents CLAUDE.md](https://github.com/humanlayer/12-factor-agents/blob/main/CLAUDE.md)
- [Karpathy LLM Wiki gist](https://gist.github.com/karpathy/442a6bf555914893e9891c11519de94f)
- [anthropics/skills skill-creator/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter)
- [coleam00/second-brain-skills](https://github.com/coleam00/second-brain-skills)
- [remember-md/remember](https://github.com/remember-md/remember)
- [huytieu/COG-second-brain](https://github.com/huytieu/COG-second-brain)
- [charlie947/ai-second-brain](https://github.com/charlie947/ai-second-brain)
- [hesreallyhim/awesome-claude-code](https://github.com/hesreallyhim/awesome-claude-code)
- [rohitg00/awesome-claude-code-toolkit](https://github.com/rohitg00/awesome-claude-code-toolkit)
- [Claude Code Hooks reference (official)](https://code.claude.com/docs/en/hooks)
- [SessionStart Hooks walkthrough — MindStudio](https://www.mindstudio.ai/blog/session-start-hooks-claude-code-force-context)
- [Complete 2026 Hooks Reference — The Prompt Shelf](https://thepromptshelf.dev/blog/claude-code-hooks-complete-reference-2026/)
- [SKILL.md Specification — Agensi](https://www.agensi.io/learn/skill-md-format-reference)
- [Best MCP Servers for Claude Code 2026 — Codersera](https://codersera.com/blog/best-mcp-servers-claude-code-cursor-2026/)
- [Best MCP Servers — Nimbalyst](https://nimbalyst.com/blog/best-claude-code-mcp-servers/)
- [Best MCP Servers — Toolradar](https://toolradar.com/blog/best-mcp-servers-claude-code)
- [Notion export to Markdown](https://www.notion.com/help/export-your-content)
- [Claude Code Pricing 2026 — Verdent](https://www.verdent.ai/guides/claude-code-pricing-2026)
- [Claude Code Pricing 2026 — Finout](https://www.finout.io/blog/claude-code-pricing-2026)
- [Claude Code cost management (official)](https://code.claude.com/docs/en/costs)
- [Solo founder SaaS in 8 weeks — Hey](https://world.hey.com/cpinto/building-a-complete-saas-product-with-only-claude-code-cca13895)
- [Claude Code Quality Regression — BuildThisNow](https://www.buildthisnow.com/blog/models/claude-code-quality-regression-2026)
- [Claude Code leak — Digital Applied](https://www.digitalapplied.com/blog/claude-code-leak-agentic-architecture-lessons-2026)
