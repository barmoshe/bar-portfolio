# External research — Agent-Operated Business Repo (provenance archive)

> **Provenance & trust:** Two external research reports, supplied by Bar (May
> 2026), captured here verbatim as a source. They are **external input**, not
> Workshop decisions — the reconciliation against our actual decisions lives in
> [workshop-design.md](./workshop-design.md) §"Reconciliation with external
> research." Report 2's inline `citeturn…` tokens are ChatGPT citation
> artifacts; treat them as "a source was cited here," not as live links. Read
> vendor/benchmark claims skeptically (both Mem0 and Letta numbers are
> self-reported).

---

# Report 1 — The Agent-Operated Business Repo: A Design Report for Solo Builders (May 2026)

## TL;DR

- **Build the repo as a substrate for agents, not a wiki for you.** A tiny root `CLAUDE.md` (≤100–200 lines), aggressive progressive disclosure via `.claude/skills/`, a `SessionStart` hook that injects current client status + recent ADRs, and an append-only `decisions/` log will beat any “second brain” pattern you can construct in Notion or Obsidian — and survives precisely because deletion is encouraged.
- **For multi-project hosting, default to sibling clones coordinated by a parent operator repo of pointers**, not nested independent `.git` directories. Use `git subtree add --squash` only when archiving a finished engagement. Skip submodules. Tools like `meta` formalize the sibling-clones pattern when you have ≥5 active projects.
- **Start with the walking skeleton; add nothing until a specific failure forces it.** Total recurring cost target: ~$100–120/month (Claude Max 5× + GitHub MCP + one web tool). Skip memory plugins, filesystem MCP, agent teams, and vector stores on day one — Letta’s own 2026 benchmark shows a plain filesystem with an agent that can grep (74.0% LoCoMo with GPT-4o mini) beats Mem0’s best graph variant (68.5%).

## Key Findings

1. **CLAUDE.md has a hard instruction budget.** HumanLayer’s reverse engineering of the Claude Code harness found the system prompt already consumes ~50 instructions, against a frontier-thinking-model ceiling of ~150–200 reliably-followed instructions. That leaves you roughly 100 slots — across every project. Treat CLAUDE.md as onboarding (WHY/WHAT/HOW), not as a style guide; push everything else behind skills, hooks, or `@imports`.
1. **Hooks are the only deterministic enforcement Claude Code offers.** CLAUDE.md instructions can be reasoned around; a `PreToolUse` hook that exits 2 cannot. As of mid-2025, Claude Code’s static `permissions.allow`/`deny` patterns have well-documented matching bugs (≥30 open issues; e.g., `Bash(ls *)` patterns failing on `ls -la ~/.claude/`). The community workaround — moving safety enforcement from permissions into hooks — is now the canonical pattern.
1. **Filesystem-based memory beats most managed memory products on the task that matters.** Letta’s April 2026 benchmark put LoCoMo transcripts in plain files and let an agent grep them: 74.0% with GPT-4o mini, vs Mem0’s 68.5% best score. For a solo operator, markdown files + grep + a `SessionStart` injection of recent decisions is the right baseline.
1. **Git refuses to silently nest repos.** Adding a directory with its own `.git/` produces a verbatim `warning: adding embedded git repository` and an unusable gitlink — by design, since Jeff King’s 2017 commit. This means the naive “clone client repos into `clients/<x>/`” plan needs a deliberate pattern (sibling clones, submodules, or subtree), not luck.
1. **Notion-style PKM systems fail in documented, predictable ways:** Collector’s Fallacy, architecture-over-output, graph-view illusion, no proactive surfacing, no retirement mechanism. The agent-operated repo wins because (a) hook-driven `SessionStart` injection *is* proactive surfacing, (b) deletion via a “workshop” framing is socially acceptable, and (c) the agent files things — you don’t maintain a metadata schema.
1. **The 2026 Claude Code runtime is moving fast and you must verify pricing/tooling before committing.** Anthropic ran a brief April 2026 experiment removing Claude Code from Pro for 2% of new signups (Simon Willison, April 22 2026); a v2.1.100 token-inflation bug (~40% increase via broken prompt caching) was reportedly unfixed in public releases through May 11, 2026. Per Anthropic’s official Claude Code costs page (docs.anthropic.com/en/docs/claude-code/costs, updated April 16, 2025), “Across enterprise deployments, the average cost is around $13 per developer per active day and $150-250 per developer per month, with costs remaining below $30 per active day for 90% of users.” Max 5× ($100/month) is therefore at the break-even floor for full-time use.
1. **Framing determines survival.** Call it a **workshop** or **operator repo**, never a “second brain.” Workshops invite throwing tools out; brains feel sacred and accrete debris until abandonment.

### 1. Repo-as-agent-substrate patterns

Claude Code’s runtime exposes five extension points around a single agent loop: `CLAUDE.md` (always-on context), `.claude/skills/` (progressively-disclosed workflows), `.claude/agents/` (isolated subagents), `.claude/commands/` (slash commands), hooks in `.claude/settings.json`, and MCP servers. Anthropic’s own documentation states: *“New to Claude Code? Start with CLAUDE.md for project conventions, then add other extensions as specific triggers come up.”* Each layer has a distinct job, and mixing them up — running routing logic in a subagent’s prompt instead of in a hook, using CLAUDE.md for enforcement instead of hooks — is the root cause of most “my agent setup is a mess” failures.

**The CLAUDE.md instruction budget is small.** HumanLayer reverse-engineered the Claude Code harness and found the system prompt already contains ~50 instructions; frontier thinking models follow ~150–200 instructions reliably before compliance collapses. HumanLayer keeps their own root file under 60 lines. DataCamp’s 2026 guide recommends ≤150 instructions with progressive disclosure and manual `/compact` at 60% context. The consensus practice: factual statements (not imperatives, to avoid Claude’s prompt-injection defenses), a handful of essential commands, pointers to `.claude/skills/` and `docs/` via `@imports` instead of inlining, and *never* sending an LLM to do a linter’s job.

**Skills are the right home for non-trivial procedural knowledge.** A skill is `.claude/skills/<name>/SKILL.md` with YAML frontmatter (`name`, `description`) and optional `references/`, `scripts/`, and `assets/`. Anthropic’s progressive disclosure loads only the description into always-on context; the SKILL.md body loads when Claude judges the skill relevant; reference files load only when SKILL.md tells Claude to read them. Anthropic’s published guidance: keep SKILL.md under ~500 lines, write descriptions very specifically about *when* to trigger (e.g., “Use when working with PDF files or when the user mentions PDFs, forms, or document extraction”). The format became an open standard adopted by Codex, Cursor, Gemini CLI, and GitHub Copilot in late 2025/early 2026, so writing skills this way gives portability for free.

**Subagents are for context isolation, not parallelism for its own sake.** A subagent runs in its own context window and returns only a summary. Use them when (a) a task will read many files (codebase research), (b) you want to restrict tool access (a `db-reader` with read-only SQL), or (c) you want a different model for cost (a Haiku classifier). Subagents cannot spawn other subagents — no infinite recursion. Anti-pattern: subagents for trivial work (renaming a variable). Anthropic’s Agent Teams (announced February 2026) are bidirectional, multi-process, and explicitly experimental; do not adopt them in a solo-operator skeleton.

**Hooks are deterministic enforcement.** The Claude Code hooks reference documents 25 lifecycle events. The ones a solo operator will actually use: `SessionStart`, `UserPromptSubmit`, `PreToolUse`, `PostToolUse`, `Stop`. Crucial property documented by Anthropic: stdout from `SessionStart`, `UserPromptSubmit`, and resume runs is *injected into Claude’s context as content it must process* — unlike CLAUDE.md, which Claude can deprioritize as the conversation grows. This is the mechanism that makes “always know the current client” and “always know what was decided yesterday” actually reliable.

**MCP servers expand reach but cost context.** Anthropic’s Thariq Shihipar announced MCP Tool Search (lazy loading) on January 14, 2026. Per claudefa.st’s analysis: “running Meta MCP and CLI, Shopify AI Toolkit, and Higgsfield MCP simultaneously consumes around 12K context tokens at session start without Tool Search; with Tool Search enabled, that drops to around 600 tokens. That’s a 95% reduction.” Anthropic’s engineering documentation confirms tool descriptions exceeding 10% of the context window trigger deferral. Even with Tool Search, the failure mode that matters is installing servers whose tools the agent ignores — they slow planning even when unused.

**What bloats context and degrades performance:** `@`-importing long docs into the root CLAUDE.md (loads unconditionally — a fresh monorepo session already burns ~20K tokens before you type anything); code-style rules a linter could enforce; unedited `/init` boilerplate; redundant MCP servers (two web-search tools, filesystem MCP on top of built-in Read/Write); multiple competing memory MCP servers; skills with vague `description` fields that never trigger correctly.

### 2. Hosting sub-projects inside one repo

This is the hardest decision. The naive instinct — clone client repos into `clients/acme/` and let it ride — runs into Git’s built-in defense.

**Git’s nested-repo warning, verbatim.** When you `git add` a directory containing its own `.git/`, Git prints (text stable since v2.14, 2017):

```
warning: adding embedded git repository: <path>
hint: You've added another git repository inside your current repository.
hint: Clones of the outer repository will not contain the contents of
hint: the embedded repository and will not know how to obtain it.
hint: If you meant to add a submodule, use:
hint:   git submodule add <url> <path>
hint: If you added this path by mistake, you can remove it from the
hint:   index with: git rm --cached <path>
```

The result is a “gitlink” entry (mode 160000) with no `.gitmodules` backing — an unusable placeholder. Jeff King’s commit message explains: *“no clone of your repository can do anything useful with the gitlink without the user manually adding the submodule config. In most cases, the user probably meant to either add a real submodule, or they forgot to put the embedded repository in their .gitignore file.”* You must design around this.

**The four serious patterns:**

**(a) Sibling clones with a parent operator repo (recommended).** Layout:

```
~/work/
  operator/           # parent repo - committed
    CLAUDE.md
    .claude/
    leads/, clients/, lab/
    .repos.json       # manifest of sibling paths/urls
  acme-client/        # cloned as sibling - independent repo
  beta-prototype/
```

Tools that formalize this: **`meta`** (github.com/mateodelnorte/meta), **`mu-repo`** (github.com/fabioz/mu-repo), **`myrepos` / `mr`** (Joey Hess, `~/.mrconfig`). Google’s `repo` tool (AOSP) uses an XML manifest and is explicit: *“For Android, Git repositories (projects) are not nested… Avoid using the git submodule feature of Repo.”* Tradeoffs: maximum simplicity per repo, no nested-git weirdness, agents can `cd` into a sibling and work normally. Cost: you give up “one git log for everything”; cross-project commits require the meta tool.

**(b) Nested independent repos with the inner `.git` gitignored.** Possible but discouraged by current practitioner guidance (w3tutorials, 2025): *“Avoid nested repos for dependencies… Never clone a repo into a directory that’s already part of another repo. Instead, clone to a sibling directory.”* You can make it work — `git rm --cached -r child-repo/` then add to `.gitignore` — but the configuration is fragile and Claude Code agents traversing the filesystem can produce surprising `git` invocations across the boundary.

**(c) `git subtree add --squash`.** The official `git-subtree(1)` man page describes producing a single squashed commit to reduce log clutter. GitHub’s documentation endorses subtree merges to contain a repository within a repository. Pro Git warns it is more complex and easier to make mistakes reintegrating changes. A 2026 Grizzly Peak Software comparison (Shane Larson, Feb 13 2026) advocates subtrees for 1–5 person teams: *“Subtrees need nothing extra in CI/CD… a subtree preserves a full copy.”* Right tool when you want to **freeze a snapshot** of a finished engagement; wrong tool when the client repo is still living.

**(d) Git submodules.** Maximally precise (each pointer is a SHA), but 2024–2026 consensus is that submodules are painful for evolving sub-projects, break worktrees, and create friction even solo. Skip them unless shipping a library with vendored stable dependencies.

**Recommendation.** Default to **sibling clones + parent operator repo**, hand-rolled `.repos.json` for the first month. At ≥5 active client repos, install `meta`. Use `git subtree add --squash` only when archiving finished engagements into `archive/<client>/`. Don’t use submodules. Don’t nest repos with gitignore — the failure mode is too easy to hit when an agent runs `git add .`.

**Nested context files work natively.** Claude Code walks the directory tree upward and reads every `CLAUDE.md`, and discovers nested CLAUDE.md files on-demand as it reads files in subtrees. So `clients/acme/CLAUDE.md` only loads when working in that folder. Caveat: per an open Anthropic issue (#37344), nested `.claude/` *settings/hooks/MCP* directories are **not** auto-cascading the same way — only skills and CLAUDE.md do.

### 3. Capture → retrieve memory loop

**The plain-filesystem baseline.** Letta’s April 2026 benchmarking: LoCoMo loaded as plain files with a basic agent searching via filesystem operations scored 74.0% with GPT-4o mini, vs Mem0’s 68.5% best graph variant. Letta’s conclusion: *“specialized memory tools… are less effective than simply allowing the agent to autonomously search through data with iterative querying.”* For a solo operator, a tree of markdown + grep beats nearly every managed memory product on the recall problem that matters.

**Candidate patterns:** (1) Single inbox + promotion — one `inbox.md`, weekly review, items promoted to `clients/<x>/decisions/`, `lab/`, `skills/`, or deleted. (2) Dated notes (`decisions/2026-05-23-acme-auth.md`), append-only. (3) Structured memory files (`hanfang/claude-memory-skill`: `~/.claude/memory/core.md` always loaded, `topics/<topic>.md` on demand). (4) Vector/RAG/managed memory (claude-mem, Mem0, Letta, Zep, Supermemory) — skip until you can name a specific recall failure grep can’t solve. (5) Knowledge graphs (Zep/Graphiti) — not your bottleneck.

**Recommendation:** three files + one hook + one command — `inbox.md`; `decisions/YYYY-MM-DD-NNN-<slug>.md` (append-only, ADR style); `clients/<name>/CLAUDE.md` (per-project nested context); a `SessionStart` hook injecting last 3–5 ADRs and current `STATUS.md`; a `/capture <text>` slash command that asks Claude to file the snippet correctly. Add `claude-mem` only after a month, if you can point to a specific session where you wished you had it.

### 4. Avoiding the “second brain graveyard”

Failure modes: Collector’s Fallacy; architecture exceeds knowledge production (IKEA Effect); graph-view illusion; no proactive surfacing; no retirement mechanism. Survival mechanisms: capture friction < retrieval friction (both near zero — one slash command, one file); proactive surfacing (agent reads memory on session start; `SessionStart` stdout injected as context); AI-assisted organization (agent files things); explicit retirement (weekly `/archive-stale` moving anything in `clients/` untouched for 60 days into `archive/` with `retired: true` frontmatter); plain-text portability. The “workshop” framing matters because workshops are places where stale tools get thrown out; brains are things you protect.

### 5. Governance for a solo, agent-run operation

Adopt Alistair Cockburn’s walking-skeleton discipline. Four day-one guardrails: (1) a `PreToolUse` Bash hook that blocks the obvious disasters (boucle2026’s `git-safe.sh` blocks `git push --force`, `git reset --hard`, `git checkout .`, `git clean -f`, `rm -rf /`, `sudo`, `chmod -R 777`, `curl | bash`); (2) a minimal `permissions.allow` list for boring frequent commands; (3) append-only `decisions/` log in Michael Nygard ADR format (`Context / Decision / Consequences / Status`, never edit accepted records — supersede them); (4) `additionalDirectories` access only where needed (never add `~`).

**Invariants live in hooks, not in CLAUDE.md.** A CLAUDE.md line saying “never delete client data” can be reasoned around; a `PreToolUse` hook that exits 2 on `rm -rf clients/` cannot. **Growth triggers — expand only when:** add a skill when you’ve copy-pasted the same prompt three times; add a subagent when you can name a context-isolation reason; add an MCP server when you can name the workflow it unblocks; split CLAUDE.md at 200 lines; add managed memory when grep across `decisions/` and `clients/*/CLAUDE.md` has failed you on a specific recall task.

### 6. Lab → business handoff

Represent the lifecycle as folder state, with promotion via slash commands:

```
operator/
  lab/                          # free experiments (lead-gen surface)
    <experiment>/{CLAUDE.md, brief.md, STATUS.md}
  leads/                        # converted-from-lab or inbound
    <prospect>/{brief.md, qualifying-questions.md, decisions/, STATUS.md}
  clients/                      # paid engagements
    <client>/
      CLAUDE.md                 # client-specific context
      brief.md                  # original brief, immutable
      contract.md               # scope, deliverables, dates
      decisions/                # engagement-scoped ADRs
      mvp/                      # the build (in-tree or sibling-clone)
      STATUS.md                 # where we are / next action / blockers
  archive/                      # frozen at handover
    <client>/
```

**Promotion commands:** `/intake <brief>` (clarifying-questions skill → `leads/<slug>/`); `/promote-to-client <slug>` (moves to `clients/`, writes `contract.md`, opens “engagement started” ADR, creates `STATUS.md`); `/archive <client>` (moves to `archive/`, closing ADR, optional `git subtree add --squash` to vendor the build).

**`STATUS.md` is the keystone file** — three sections (Where we are / Next action / Blockers), one date stamp; the `SessionStart` hook reads it from cwd and prepends it to context. **Lab → client conversion:** each free experiment ends with an artifact a stranger can play with and a one-line ask; when someone responds, `/intake` copies the lab folder into `leads/` (lab folder frozen); promotion to `clients/` is a billable decision with an explicit ADR.

### 7. 2026 tooling stack (recommended)

| Item | Cost | Why |
|---|---|---|
| Claude Max 5× | $100/mo | Break-even floor for full-time use ($150–250/dev/mo per Anthropic costs page) |
| GitHub MCP server | Free | Highest-leverage MCP; PRs/issues/code search; read-only PAT |
| Context7 OR Brave Search MCP | Free tier | Library docs / web grounding — pick **one** |
| Playwright MCP | Free | Only when building UIs that need verification |
| Private GitHub repo | $0 | Operator repo is private |
| Domain + Vercel hobby | ~$15/yr + free | Lab surface only |
| **Total recurring** | **~$100–115/mo** | |

**Deliberately skipped:** filesystem MCP (Read/Write/Edit/Glob/Grep are built in); memory MCP servers day one; Notion/Obsidian integration; multi-provider abstractions; vector DBs; Agent Teams (experimental). **Pricing flags to verify:** the April 2026 Pro/Max experiment (verify Claude Code still in Pro); v2.1.100 token-inflation bug (~40%, workaround: downgrade to v2.1.34); if `ANTHROPIC_API_KEY` is set in your shell, Claude Code silently bills via API instead of subscription.

**Hooks day one:** `SessionStart` (echo git branch, cwd `STATUS.md`, last 3 ADR titles); `PreToolUse` matcher `Bash` (git-safe.sh + bash-guard.sh); `PostToolUse` matcher `Edit|Write` (formatter/linter); `Stop` (desktop notification). **Skills first month (≤500 lines each):** `brief-intake`, `mvp-scaffold`, `decision`, `weekly-review`.

### 8. Naming/framing (brief)

Call it the **workshop**, the **operator repo**, or your business name with `-ops`. Avoid “second brain,” “knowledge base,” “wiki,” “vault,” “garden.” “Brain” makes deletion feel like lobotomy; “workshop” makes deletion feel like tidying up. Root CLAUDE.md should read like a workshop manifest, not “this is my knowledge base.”

### Comparison tables (1 worst – 5 best, solo operator on Claude Code 2026)

**Sub-project hosting**

| Option | Simplicity | Scalability | Agent-friendliness | Cost | Lock-in risk |
|---|---|---|---|---|---|
| **Sibling clones + parent operator repo** (rec.) | 5 | 4 | 5 | 5 | 5 |
| Sibling clones + `meta`/`mu-repo` | 4 | 5 | 4 | 5 | 4 |
| Nested independent repos (gitignored) | 3 | 2 | 2 | 5 | 4 |
| `git subtree add --squash` | 3 | 4 | 5 | 5 | 5 |
| `git submodule` | 2 | 4 | 3 | 5 | 3 |
| Single monorepo (no nesting) | 5 | 3 | 5 | 5 | 4 |

**Memory loop**

| Option | Simplicity | Scalability | Agent-friendliness | Cost | Lock-in risk |
|---|---|---|---|---|---|
| **Markdown + grep + `SessionStart` hook** (rec.) | 5 | 4 | 5 | 5 | 5 |
| `inbox.md` + dated `decisions/` + `/promote` | 5 | 4 | 5 | 5 | 5 |
| `hanfang/claude-memory-skill` | 4 | 4 | 5 | 5 | 5 |
| `claude-mem` (SQLite + MCP search) | 4 | 5 | 5 | 5 | 4 |
| Mem0 (cloud, $19+/mo) | 3 | 5 | 4 | 3 | 2 |
| Letta (self-hosted) | 2 | 5 | 3 | 4 | 2 |
| Notion/Obsidian + MCP | 3 | 4 | 3 | 3 | 2 |

### Walking skeleton (day one — nothing more)

```
operator/
  CLAUDE.md                          # ≤100 lines: business, stack, principles
  AGENTS.md → CLAUDE.md              # symlink for cross-tool portability
  .gitignore                         # .env, secrets, .claude/settings.local.json
  README.md
  inbox.md                           # empty
  decisions/2026-MM-DD-001-start-the-business.md
  lab/ leads/ clients/ archive/      # all empty
  .repos.json                        # []
  .claude/
    settings.json                    # SessionStart + PreToolUse git-safe + permissions
    settings.local.json              # gitignored personal additions
    commands/ capture.md intake.md promote-to-client.md archive.md weekly-review.md
    skills/ brief-intake/ mvp-scaffold/ decision/
    agents/ researcher.md
    hooks/ git-safe.sh bash-guard.sh session-start.sh
```

**Growth additions, in expected order:** client CLAUDE.md template skill (after first paid client) → extract a skill (after third repeated workflow) → tighten SessionStart injection (after first “I forgot a decision”) → user-level `~/.claude/CLAUDE.md` (after first cross-client transfer) → install `meta` (after fifth active repo) → evaluate `claude-mem` (after first grep-can’t-find-it failure) → a second MCP server (only on specific need).

### Recommendations (timeline)

**Today (≤1h):** create operator repo with the skeleton; `git init` → private GitHub repo; symlink `AGENTS.md → CLAUDE.md` (Claude Code doesn’t read AGENTS.md as of April 2026); subscribe Claude Max 5×; clear `ANTHROPIC_API_KEY`. **Week 1:** install the `PreToolUse` Bash hook bundle (test `git reset --hard` is blocked); write `brief-intake`; build `SessionStart` hook; open ADR #001 “Why sibling clones not submodules.” **Month 1:** run one full lab experiment end-to-end; add `/capture`, `/intake`, `/promote-to-client`, `/archive` as needed; resist a second MCP server. **Quarter 1:** first paid client triggers `mvp-scaffold` and `contract.md` template; review `decisions/` after each engagement.

### Caveats (Report 1)

Pricing/runtime churn — verify every price. MCP Tool Search numbers are config-specific. Permission-matching bugs may be fixed by the time you read this. Memory benchmarks are vendor-favorable (Mem0’s come from Mem0; Letta’s from Letta). AGENTS.md not natively read as of April 2026. Older-but-canonical sources: Cockburn walking skeleton (2000), Nygard ADR (2011), Jeff King nested-repo commit (2017). Threat model assumes a one-person shop comfortable with GitHub-hosted private repos — on-prem/SOC2 changes the substrate (Gitea/Forgejo). Lab lead-intake surface is out of scope. Schedule a 12-month review: still operated, or drifted into the graveyard?

---

# Report 2 — Designing an Agent-Operated Business Home Repo

> Inline `citeturn…` tokens are ChatGPT citation artifacts (a source was cited
> at that point); they are not live links.

## Executive summary

Treat your home repo as a **thin operator layer with strict routing and light guardrails**, not as a giant always-loaded knowledge base. For Claude Code, keep root `CLAUDE.md` short and structural, move procedures into skills, move file-specific guidance into `.claude/rules/`, use hooks for anything that must be enforced, and use subagents only when a side task would otherwise flood the main context. Anthropic’s current docs explicitly warn that long always-loaded instruction files reduce adherence, while skills and path-scoped rules reduce context pressure.

For hosting many projects, the best solo-builder default is **one parent business repo containing metadata and new greenfield project folders, plus either plain folders or sibling clones for inherited client repos**. Use **submodules only when a client repo truly must live nested inside the parent while retaining separate history**; avoid subtree unless you specifically want to vendor code. Heavy monorepo tooling is justified only when projects share dependencies or task graphs.

For memory, start with **plain markdown, one inbox, promotion-by-agent, and Claude auto memory**. External memory systems (Letta, Mem0, claude-mem) add infrastructure, privacy surface, and maintenance long before they are necessary; current research shows memory agents still do not reliably master all memory competencies.

For governance, start with the smallest stable invariants: protected paths, permission rules, append-only decision logs, and a short lifecycle taxonomy. Model work as **lead → qualified brief → active build → handoff → archive**. Minimal 2026 stack: Claude Code, a few project skills, a few hooks, GitHub MCP if you use GitHub heavily, and read-only DB MCP only when querying live data becomes routine. Skip agent teams, custom plugins, channels, and external memory until pain recurs.

## Repo-as-agent-substrate patterns

The strongest evidence from Anthropic’s 2026 docs points to a **layered context design**, not “stuff everything into one massive root file.” Clear separation of concerns: `CLAUDE.md` for always-on context, `.claude/rules/` for modular and path-scoped instructions, skills for on-demand reference/workflows, subagents for isolated work, hooks for deterministic automation, MCP for external systems. Start with `CLAUDE.md`, add others only when pain recurs.

That supports a **lean routing-table root**. Keep root `CLAUDE.md` under ~200 lines; longer files consume more context and reduce adherence, and imported files do **not** reduce startup cost because imports expand at launch. Root `CLAUDE.md` should answer: what this repo is for, where canonical state lives, which lifecycle folders matter, what never gets edited directly, and which skills or per-project files to consult next.

A **fat-context approach** belongs at the per-project edge, not the business root. Nested `CLAUDE.md` and path-scoped rules load more specific guidance when Claude works inside a client folder. Parent/root files load at session start; child/path-scoped files are discovered as Claude enters those areas — global business logic at the top, local delivery logic near the work.

Skills are the best answer when a rule has become a **procedure rather than a fact** — if you keep pasting the same checklist or playbook, move it from `CLAUDE.md` into a skill (body loads only when used). Favors skills like `/qualify-brief`, `/new-project`, `/promote-inbox`, `/handoff`, `/close-project`.

Subagents are best used as **context shields**, not the default mode — isolated workers whose intermediate tool calls stay outside the main conversation, returning only a summary. Ideal for repo mapping, large-file reading, code review, delivery QA. Overusing them on trivial tasks multiplies tokens and complexity.

Hooks are where anything that must hold **every time** goes, because prompt instructions are advisory while hooks are deterministic. `PreToolUse` can deny tool calls before permission checks (even in `bypassPermissions` mode); `SessionStart` can inject lightweight dynamic context; `Stop` can enforce completion checks. “Never edit archive, contracts, or secrets directly” should be a hook or permission rule, not prose. Use `CLAUDE.md` for static context and keep `SessionStart` hooks fast (inject recent git activity, current engagement status, env bootstrap — not long playbooks).

MCP servers belong only where you repeatedly copy info from another system into chat. Tool search now defers MCP schemas until needed, removing much of the startup penalty — but every server adds trust, auth, and prompt-injection surface. High leverage when it replaces real copy-paste pain; low value when it merely feels sophisticated.

Practical pattern: **root `CLAUDE.md` as routing table; path rules for local conventions; skills for repeatable workflows; hooks for invariants; subagents for noisy side work; MCP only for systems you truly touch daily.**

## Hosting client sub-projects inside one business repo

You are deciding between **shared business operating context** and **clean source-control boundaries**. These align for greenfield folders you create yourself, but diverge once you clone existing client repos.

A plain **single parent repo with ordinary folders** is the right default for new work you initiate — one git history, one root `CLAUDE.md`, one `.claude/`, nested per-project files as needed. Most agent-friendly, least maintenance for greenfield MVPs you control.

A **monorepo toolchain** (pnpm workspaces, Turborepo, Nx) is only justified when projects are meaningfully related (shared code, task orchestration, caching, dependency graphs). For loosely related agency-style client folders, they add ceremony before value.

**Git submodules** are the canonical Git-native way to embed one repo inside another while preserving separate history (own history, tracked via gitlink + `.gitmodules`). Best fit when a client’s existing repo must physically live under your home repo while keeping its own commit graph and remote. Price: workflow overhead (recursive clone, tracks a specific submodule commit). Worth it only when physical nesting matters.

**Git subtree** includes a subproject inside a subdirectory, no `.gitmodules`/gitlinks, behaves like ordinary files — but merges the subproject into the parent’s history; better for vendoring than for confidential client repos with separate lifecycle/ownership. Usually the wrong default because it weakens the boundary you care about.

**Sibling clones** are the simplest long-run answer if projects can live *beside* the home repo. `--add-dir` lets Claude access additional directories outside cwd, with an env var to also load their memory files. Keep `business-home/` as the operator repo while maintaining independent sibling clones — avoids nested-git weirdness, preserves strong boundaries.

For parallel work inside a single client repo, **git worktrees** are more relevant than submodules/subtree — multiple working trees, shared object storage, separate per-worktree state; Anthropic positions worktrees as the way to prevent parallel sessions from touching each other’s files.

**Hybrid recommendation:** home repo as a normal git repo containing business state + greenfield projects; for inherited repos prefer **sibling clones** (fewest footguns), use **submodules** only when physical nesting matters more than workflow simplicity; skip subtree unless vendoring; skip Nx/Turbo/pnpm until projects truly share code.

## Memory loop and avoiding the graveyard

### Capture and retrieval

Claude Code gives a built-in memory loop before any external system: two complementary systems — your `CLAUDE.md` files and Claude’s **auto memory** (on by default, machine-local per-project, shared across worktrees in the same git repo, indexed by a `MEMORY.md` entrypoint whose first 200 lines / 25 KB load at session start; topic files read on demand).

Best lightweight pattern: **single inbox plus promotion** — low-friction capture in one place per project, then an agent periodically promotes durable items into a small set of canonical files (`brief`, `clarifications`, `status`, `decisions`, `handoff`, dated `working-notes`). More reliable than classifying up front. Prefer **file-first retrieval before vector retrieval**: a skill that searches `brief.md`, `status.md`, `decisions.md`, recent dated notes is cheaper, more transparent, easier to debug than a vector DB on day one. 2025–2026 research shows agent memory is still an active engineering problem (write filtering, contradiction handling, trust).

External stacks exist and are maturing: **Letta** = always-visible memory blocks pinned into context; **Mem0** = extract/consolidate/retrieve salient info, lower latency/token cost than full-history baselines on its benchmark; **claude-mem** = DIY Claude-specific stack (lifecycle hooks + worker service + SQLite + Chroma + skill + MCP search). Not bad — but solving a later-stage problem; Anthropic built-ins already cover session memory, per-repo learned memory, hierarchical instructions, hooks, MCP retrieval. Stay file-first until **repeated loss across project boundaries** (an extrapolation, not a benchmark).

### Why second brains die and what helps survival

Strongest evidence is KM research, not “second brain” culture. A 2025 systematic literature review found KM success depends on technical+organizational+process factors, not just a repository. A software-team case study found 44 hindering factors (poor planning, inconsistent usage, weak documentation, low motivation/familiarity, weak labeling, low-priority updates) and noted that when updating existing knowledge is hard/deprioritized, quality drops and trust declines — the “Notion graveyard” mechanism.

Survival mechanisms: capture must be **cheap**; promotion/organization happen **after** capture (AI-assisted); knowledge must **reappear proactively** in the task flow; there must be a visible way to **retire/supersede** stale content. Conflicting instructions cause Claude to pick arbitrarily, so stale content is especially dangerous. Keep only a few canonical durable files per project, make the rest disposable, treat retirement as first-class. Append-only decision logs + explicit “superseded” markers beat rewriting history; lightweight ADR practice fits (statuses: accepted, deprecated, superseded). Evidence on *personal* maintenance psychology is thinner than company KM — direction is clear, science is not overstated. Make the repo **earn its keep during delivery, not after**.

## Governance for a solo, agent-run operation

Anthropic’s guidance supports **start tiny, grow on trigger**: repeated mistakes → `CLAUDE.md`; repeated prompts → skills; copy-paste pain → MCP; noisy side tasks → subagents; mandatory repeated actions → hooks.

First version encodes only a few **invariants**: where project state lives, which files are append-only, which dirs are archival, which commands auto-allow, which assets are protected. Hooks and permission settings are the robust place: `PreToolUse` hooks can deny dangerous actions before permission checks; read-only Bash runs without approval by default; allowlists/sandboxing reduce approval fatigue while preserving boundaries; OS-level sandbox can constrain filesystem/network (attractive for client-sensitive work). Move guardrails from prose into permissions, hooks, and sandbox settings.

Use **append-only logs rather than mutable “current truth” prose where chronology matters** (ADRs — lightweight, diff-friendly, clean supersession). Distinguish three policy layers: `~/.claude/rules/` for personal cross-work preferences; project `.claude/` for business-wide conventions; per-project nested rules only when a client folder diverges (project rules outrank user rules). Each new rule should answer: what mistake happened twice, or what command did I paste three times?

## Lab-to-business lifecycle representation

(Thinner, multi-source — partly synthesis.) Sensible lifecycle: **lead → qualified → proposed → won/active → handoff → archive** (close to HubSpot’s default pipeline). Represent the free→paid transition as a **state change with a frozen brief**, not vague continuation — generate a lightweight SOW-style doc (problem, deliverables, timeline, acceptance criteria, constraints, payment/decision context).

Lab state: minimal artifacts (inbound brief, clarifying questions, experiment notes, demo link, pursue/decline decision). Qualified: add feasibility, risk, next-step recommendation. On payment: generate a project folder with scoped brief, acceptance criteria, active execution files. Handoff/archive are part of the operating model (PMI: inadequate closure → poor transition to operations). Minimum closeout: handoff notes, deployment/run instructions, known limitations, accepted scope boundaries, credentials-transfer status, short lessons-learned. Lifecycle states should correspond to **different required files**, not just tags.

## Minimal 2026 tooling stack and framing

### Minimal stack

Core: **Claude Code** (CLI or VS Code extension; included in Pro and Max individual plans, Team Premium seats; Console/API pay-as-you-go). As of June 15 2026, Agent SDK and `claude -p` usage on subscription plans draws from a **separate monthly Agent SDK credit**, not interactive limits.

In-repo minimum: one short root `CLAUDE.md`; a small `.claude/rules/`; a handful of project skills; project settings with permissions + a few hooks; optional per-project nested `CLAUDE.md` only when a client folder genuinely differs. Standalone `.claude/` config is the best fit for personal workflows — start there before converting anything to a plugin.

First hooks: `PreToolUse` to block edits in protected dirs; `SessionStart` to inject current project state/env; maybe `Stop` verification once delivery rhythm stabilizes. Don’t start with a large menu — command hooks run with your full user permissions; experimental prompt/agent hooks are more brittle than command hooks. First skills: `/qualify-brief`, `/new-project`, `/promote-inbox`, `/status-refresh`, `/handoff`, `/close-project` (bodies load only when invoked; can run isolated via `context: fork`). First subagents (tiny, tool-restricted): read-only **researcher**, **repo-mapper**, read-only **delivery-checker**.

MCP “worth it now”: **GitHub MCP** if issues/PRs/reviews are central; **read-only DB MCP** only if you frequently need live data during builds. Skip **agent teams** (experimental, disabled by default); skip **custom plugins/marketplaces** (standalone `.claude/` is better for personal/project setup); skip **channels** (only deliver events while a session is open → pushes toward always-on runtime); skip **external memory** until cross-repo retrieval pain is chronic; skip **lots of MCP servers** (tool search makes them cheap in context, not free in operational burden).

Cost/maintenance: the lowest-maintenance stack is also cheapest — plain files, first-party memory, hooks, skills cost ~nothing extra; GitHub MCP ≈ setup+auth; DB MCP needs care (read-only creds); Letta/Mem0/claude-mem raise maintenance + privacy complexity. SDK automation later is tracked against the separate monthly Agent SDK credit.

### Naming and framing

(Thin evidence — flagged extrapolation.) Avoid **second brain** (invites exhaustive capture, abstract completeness). Surviving patterns are workflow-triggered additions, focused repositories, active-use surfaces. Prefer **business workshop**, **operator repo**, or **delivery home** — names that say intake/build/handoff/learn, not remember-everything-forever.

## Recommended starting point + comparison + open decisions

(Synthesis; scores are judgment calls, higher = better, including lock-in where higher = **lower** risk.)

| Architecture option | Simplicity | Scalability | Agent-friendliness | Cost | Lock-in risk |
|---|---:|---:|---:|---:|---:|
| Parent repo, plain folders + per-project files + Claude auto memory | 5 | 3 | 5 | 5 | 5 |
| Parent repo, plain folders + single inbox + promotion + auto memory | 4 | 4 | 5 | 5 | 5 |
| Parent repo + nested client repos as submodules + auto memory | 3 | 4 | 4 | 5 | 4 |
| Parent repo + git subtree for embedded repos + auto memory | 2 | 3 | 3 | 5 | 4 |
| Business home repo + sibling client clones + shared user rules + auto memory | 4 | 5 | 4 | 5 | 5 |
| Sibling/parent + external memory (Letta/Mem0/claude-mem) | 2 | 5 | 4 | 2 | 2 |

**Walking skeleton:** a single **private** git repo for business operation (not public marketing). Short root `CLAUDE.md`: what the repo is, where work enters, where active projects/archives live, which files are canonical, which dirs are protected, which skills for intake/delivery/closeout — business-wide invariants only, no long procedures. Small `.claude/`: `settings.json` (permissions + hooks), `rules/` (privacy boundaries, archive immutability, naming/lifecycle conventions), `skills/` (qualify brief, new project, promote inbox, handoff, close project). Shallow lifecycle folders: `inbox/`, `leads/`, `projects/active/`, `projects/paused/`, `clients/`, `archive/`. Per active project standardize: `brief.md`, `clarifications.md`, `status.md`, `decisions.md`, `handoff.md`, `working-notes/`. Greenfield source lives under the folder; inherited repos → sibling clone or submodule. Use **Claude auto memory** as a passive enhancer (env details, debugging insights, build gotchas) — keep scope/decisions/handoff/client commitments in named files so critical truth stays inspectable and portable.

**Add the next layer only on repeated pain:** repeated GitHub paste → GitHub MCP; repeated live-data queries → read-only DB MCP; repeated cross-repo knowledge loss → evaluate external memory; repeated parallel sessions on one project → formalize worktrees.

**Open decisions left to you:** (1) inherited repos as **submodules vs sibling clones** — standardize on one to reduce agent confusion; (2) pipeline tracking in-repo vs external CRM; (3) how aggressively Claude operates autonomously (permissions/allowlists/sandboxing shape the daily feel); (4) backup + encryption policy for a repo holding client context (privacy risk grows with the archive); (5) whether to run always-on Agent SDK automation (separate billing/credit + different operational surface).

### Sources (Report 2)

Primary: Anthropic docs (Extend Claude Code; memory; hooks; skills; subagents; MCP; plugins; plans + Agent SDK). Git docs (gitsubmodules, git-subtree, git-worktree). pnpm/Turborepo/Nx (vendor). Research: MemoryAgentBench (Jan 2026); Memory for Autonomous LLM Agents survey (Mar 2026); Mem0 paper (Apr 2025, vendor-tied); Letta memory-blocks (vendor). KM: Koivisto et al. *Pitfalls in Effective Knowledge Management* (2025, origin older); Alam et al. KM success factors SLR (2025). Practice: HubSpot pipeline; Atlassian SOW + closure; PMI closure/lessons-learned (some older than 2024).
