# Company Folder Redesign: a CXO-spine org that starts at two roles

> Finalized from an operator interview on 2026-05-24. This is a **design doc**; implementation is a later, separate pass.
> Companion docs: [host-repo-architecture.md](host-repo-architecture.md), [cxo-folders.md](cxo-folders.md), [workshop-design.md](workshop-design.md), and the current `../company/CLAUDE.md`.

## Context

The current `company/` is a lifecycle-shaped workshop (lab to leads to clients to projects to archive) with plain-Markdown state, scope-based autonomy, hooks, and append-only ADRs. The redesign keeps all of that and adds an **organizing spine: CXO seats**. The twist decided in the interview is to **start like a real startup**: one founder-level seat and one generalist, growing new seats only when the work proves it needs them. This is grow-by-promotion applied to the org chart itself.

## What was decided

| Question | Decision |
|---|---|
| Organizing principle | **CXO seats as the spine.** Seats are the org; lifecycle folders are the shared workspaces they operate on. |
| v1 seats | **CEO + General Worker only.** Simulate a real early-stage company: improve the Worker until analysis justifies a new department. |
| Who is CEO | **The root `CLAUDE.md` and Bar, jointly.** The CLAUDE.md is the CEO's standing charter and governance; Bar is the human CEO who confirms business-scope. |
| Representation (v1) | CEO in root `CLAUDE.md`; **General Worker as the main acting agent guided by a worker charter/skill, not a subagent yet.** Future departments get promoted to `.claude/agents/<seat>.md` subagents. |
| Promotion trigger | **Deferred.** For now, improve the General Worker; analyze the need for a new department later, then decide the trigger. |
| Lifecycle folders | **Kept as shared workspaces.** Seats operate on them; they are not owned by a single seat in v1. |
| Creative & graphics home | **Open.** Decide which seat owns it when a creative need actually appears (consistent with grow-by-promotion). |
| Business name | **TBD.** Design stays name-agnostic ("the company / operator repo"). |

## The model: start at two roles, grow by promotion

The 2026 consensus across Anthropic, OpenAI, Microsoft, and LangChain is to **start with a single focused agent and scale into a coordinated specialist team only when workload complexity justifies it**, with a practical cap of three to four active specialists before routing overhead hurts ([Innervation AI](https://www.innervationai.com/blog/single-vs-multi-agent-architecture-2026-guide/), [eesel AI](https://www.eesel.ai/blog/claude-code-multiple-agent-systems-complete-2026-guide)). The winning shape is an **orchestrator that owns the conversation context and spawns specialized workers as needed**, each in isolated context returning a compressed result.

That maps directly onto the chosen design:

- **CEO = orchestrator.** Owns direction, prioritization, routing, and business-scope governance. Realized as the root `CLAUDE.md` (standing instructions) plus Bar (the human who confirms business-scope actions).
- **General Worker = the single focused agent.** Does the actual work across all functions today. Realized as the main acting agent, guided by a **worker charter** (a skill/playbook), not a subagent.
- **Departments = promoted specialists, later.** When one function recurs enough to justify isolation, it is split out into a `.claude/agents/<seat>.md` subagent with a scoped role and tools. Capped at three to four active seats.

### Why the Worker is not a subagent in v1

The file format for an agent and a subagent is identical; the distinction is behavioral, decided by the call site, not the file ([Claude Code subagents docs](https://code.claude.com/docs/en/sub-agents)). Subagents earn their place when you need **isolated context and scoped tools for a recurring, well-defined job** ([Level Up Coding](https://levelup.gitconnected.com/a-mental-model-for-claude-code-skills-subagents-and-plugins-3dea9924bf05)). A generalist that does everything is the opposite of that, so a subagent would add routing and context overhead with no payoff. The Worker stays the main agent until a real specialty splits off. When it does, job-shaped names (for example `builder`, `intake`, `pr-reviewer`) route more reliably than generic title names like `frontend-engineer`.

### The mental-model split (unchanged primitives, clearer roles)

- **`CLAUDE.md`** holds ongoing context and governance → the **CEO charter**.
- **Skills** hold reusable playbooks → what the **Worker** reaches for, including the worker charter itself.
- **Subagents** hold isolated, scoped personas → what a **future department** becomes.
- **Hooks** stay the deterministic enforcement of scope-based autonomy (`git-safe.sh`, `protect-paths.sh`, `session-start.sh`).

## How it fits the existing workshop

Everything load-bearing in the current `company/` stays:

- **Scope-based autonomy** is now expressed through the org: the Worker has **full autonomy inside a sub-project**; **business-scope actions go to the CEO** (CLAUDE.md governance + Bar's confirm). Hooks still enforce the hard stops.
- **Lifecycle folders** (`lab/ leads/ clients/ projects/ archive/`) remain the shared workspaces the Worker operates on, moved through by the existing commands (`/intake`, `/capture`, `/promote-to-client`, `/archive`, `/weekly-review`) and the two-direction harness (`/build`, `/build-harness`).
- **Plain-Markdown state, append-only `decisions/`, templates/project/** are untouched.

## A dynamic roadmap

The interview called for "a clear roadmap that dynamically adapts with the harness and its projects." Add a single **`roadmap.md`** at the company root: the CEO's living view of where the business is going and which department is next. It is reviewed in `/weekly-review`, updated as projects reveal recurring needs, and is the document that justifies promoting the next seat. It is a workshop artifact, not a fixed plan: it changes as the work does.

## Proposed structure (v1)

Additions to the current layout are marked NEW. Nothing is removed.

```
company/
  CLAUDE.md              # CEO charter + routing table (clarified, still <~150 lines)
  roadmap.md             # NEW: living roadmap; what department is next, reviewed weekly
  README.md  AGENTS.md  inbox.md  .repos.json
  .claude/
    settings.json
    commands/            # /build /build-harness /capture /intake /promote-to-client /archive /weekly-review
    hooks/               # git-safe.sh  protect-paths.sh  session-start.sh
    skills/
      brief-intake/  decision/  mvp-scaffold/
      worker/            # NEW: the General Worker charter (how the generalist operates)
    agents/              # NEW: empty in v1; future department subagents land here
  decisions/             # append-only ADRs (record the redesign + each future seat)
  templates/project/
  lab/  leads/  clients/  projects/  archive/   # shared workspaces, unchanged
```

## Open and deferred (recorded)

- **Business name** stays TBD.
- **Promotion trigger** (rule-of-three vs CEO/roadmap call vs either) is decided when the first department need is analyzed.
- **Creative & graphics seat**: which seat owns the capability copied from the creative-stack is decided when a creative need appears. See the copy-and-transform decision in [creative-department-and-host-repo.md](creative-department-and-host-repo.md).
- **Repo topology**: whether the creative-stack becomes a sibling the workshop copies from, or keeps hosting, stays open.

## Implementation outline (for the later pass)

1. Clarify root `CLAUDE.md` to name itself as the CEO charter and add a short "the org" section (CEO + Worker, grow-by-promotion, 3-4 cap).
2. Add `company/skills/worker/SKILL.md` (or `.claude/skills/worker/`) as the General Worker charter.
3. Add `company/roadmap.md` seeded with the current state and the "next department" placeholder.
4. Create an empty `company/.claude/agents/` with a one-line README on when a seat earns a subagent.
5. Write an ADR in `company/decisions/` recording this redesign.

## References

### Web
- Single vs multi-agent architecture (start simple, scale): https://www.innervationai.com/blog/single-vs-multi-agent-architecture-2026-guide/
- Claude Code multiple agent systems guide: https://www.eesel.ai/blog/claude-code-multiple-agent-systems-complete-2026-guide
- Claude Code subagents docs: https://code.claude.com/docs/en/sub-agents
- Mental model: skills, subagents, plugins: https://levelup.gitconnected.com/a-mental-model-for-claude-code-skills-subagents-and-plugins-3dea9924bf05
- Claude Code customization (CLAUDE.md / skills / subagents): https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/

### Internal
- [host-repo-architecture.md](host-repo-architecture.md), [cxo-folders.md](cxo-folders.md), [workshop-design.md](workshop-design.md), [creative-department-and-host-repo.md](creative-department-and-host-repo.md)
- `../company/CLAUDE.md`, `../company/README.md`
