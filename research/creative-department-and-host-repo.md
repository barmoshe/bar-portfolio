# Creative Stack as a Creative Department, and the Host-Repo Concept

> Research note. Two missions in one report.
> 1. Understand `claude-creative-stack` and define how it becomes the **creative & graphics department** of the workshop business.
> 2. Explore and explain the **host-repo concept** so it is well understood.
>
> This report does **not** plan or perform any removal of host functionality from the creative-stack. That is a later, separate effort. Companion docs: [workshop-vision.md](workshop-vision.md), [workshop-design.md](workshop-design.md), [external-reports-agent-operated-repo.md](external-reports-agent-operated-repo.md), and `company/CLAUDE.md`.

---

## TL;DR

- `claude-creative-stack` plays two roles that are worth separating in thinking: a **creative toolkit** (12 skills, 3 MCP servers, 19 knowledge files, recipes, prompts) and a **host** for child repos.
- **Mission A.** The toolkit is a ready-made **creative & graphics department** organized by discipline. **Decision:** the workshop will not consume the creative-stack as a live dependency. It is a **donor library to copy and transform from** -- selected knowledge and skills get moved into the company repo over time and reshaped under **CXO roles** (the creative work maps to a CMO / creative seat, per [cxo-folders.md](cxo-folders.md)). The marketplace manifest should still be completed and activated as a clean, exhaustive catalog to copy from (today it lists only 9 of 12 skills and 1 of 3 MCP servers, and must move to `.claude-plugin/marketplace.json`).
- **Mission B.** The **host-repo concept** is the agent-operated **workshop** (`company/` + `research/`): a plain-Markdown operator layer with a lab-to-archive lifecycle and scope-based autonomy enforced by hooks. The research is explicit and consistent that this is a **separate, future, private repo** whose job is to remember, with `bar-portfolio` as sub-project #1. It is staged inside `bar-portfolio` today and its `.claude/` hooks only fire once it is at a repo root.
- **End state (today's relationship, not a migration plan):** three layers with clean jobs. The workshop **operates** the business, the creative-stack **produces** the work, the portfolio **presents** Bar.

---

## 0. Frame: the two roles `claude-creative-stack` plays today

`claude-creative-stack` currently wears two hats that are worth telling apart:

- **Toolkit hat (a creative department).** It is a Claude-native library of capabilities: 12 skills, 3 MCP servers, 19 routed knowledge files, artifact starters, recipes, and prompt scaffolds. This is reusable creative production capacity.
- **Host hat (an operator layer).** It physically hosts child repos as sibling subdirectories (`bar-portfolio`, `joomsy-app`, `weatherV1`, and others), and the **workshop scaffold (`bar-portfolio/company/`) plus the `research/` design docs live inside `bar-portfolio`**. This is the operator-memory / business-home concept.

These two hats answer different questions. The toolkit hat answers "how do we produce good creative work fast." The host hat answers "where does the business remember itself and route its projects." Mission A is about the first hat. Mission B explains the second.

---

## Mission A: Creative Stack as the company's Creative & Graphics Department

### What the department is made of

Think of the creative-stack as a department staffed by reusable specialists, with a production line and a handbook behind them.

**The specialists (12 skills).** Grouped by discipline:

| Discipline | Skills |
|---|---|
| Design / UI | `ui-design-kit`, `palette-generator` |
| Motion / animation | `animation-composer` |
| Graphics / shaders | `shader-smith`, `sprite-atlas-builder` |
| Games / procgen | `artifact-game-builder`, `procgen-toolkit` |
| Presentations / diagrams | `presentation-studio`, `diagram-composer` |
| Generative assets | `asset-generator` |
| Quality / iteration | `critique-loop` |
| Content (HE) | `viral-news-scanner` |

**The production line (3 MCP servers).** The side-effect layer that turns intent into files:
- `palette-oklch` (programmatic accessible color palettes, contrast checks, chart palettes)
- `sprite-packer` (atlas packing + JSON manifest)
- `asset-router` (routes image / voice / music / video generation to Replicate, Fal, ElevenLabs, Suno, Luma, with fallback stubs when keys are missing)

**The handbook (19 knowledge files).** The department standards, routed by topic in `knowledge/00-index.md`: artifact sandbox constraints (`03-artifacts.md`), animation (`04`), graphics and design and color (`05`), audio (`07`), dataviz (`08`), shaders (`12`), asset pipelines (`13`), accessibility and performance (`14`), export and recording (`15`), presentations and diagrams (`17`), plus `99-caveats.md` for version-drift warnings. These encode non-negotiable defaults: oklch only, composite-only animation props, WCAG AA contrast, artifact whitelist rules.

**The templates.** 6 end-to-end recipes (`agentic-asset-pipeline`, `animated-landing`, `animated-presentation`, `data-story`, `design-system`, `game-jam`) and 12 prompt scaffolds (`build-*`, `generate-*`, `critique-*`) that capture proven request shapes.

### How the workshop consumes it per lifecycle stage

The company lifecycle (`/intake` to `/build` to `/archive`) maps cleanly onto when each capability gets pulled in:

- **Intake / lead.** Pitch and explore brand direction: `presentation-studio` for the pitch deck, `palette-generator` for first brand-color explorations, `critique-loop` to pressure-test the concept before committing.
- **Build (the core).** The bulk of the department's value: `ui-design-kit` and `animation-composer` for the interface, `shader-smith` / `artifact-game-builder` / `procgen-toolkit` for richer visual or interactive work, `asset-generator` plus the MCP servers (`palette-oklch`, `sprite-packer`, `asset-router`) for the actual asset production.
- **Handoff / archive.** Artifacts double as deliverable specs; `knowledge/15-export-recording.md` covers GIF/MP4/WebM export and sprite packing for the closeout package.

### The operating model: Skill to Artifact to MCP

The department's house pattern is the three-layer pipeline the creative-stack already documents: **Skill (determinism) to Artifact (live preview) to MCP (side-effects)**. This fits the workshop's "build an MVP fast" intent. The skill makes the workflow repeatable, the artifact gives a live preview to iterate against, and the MCP layer commits real outputs (palettes, atlases, generated media).

### Department framing, grounded in creative-ops practice

Real creative organizations structure either **by client** (a manager attached to each engagement) or **by discipline** (heads of design, motion, copy, photography), and they scale capacity with freelancers during peaks ([Ziflow](https://www.ziflow.com/blog/creative-operations-team-structure), [Adobe](https://business.adobe.com/blog/basics/making-creative-work-that-matters-a-guide-to-creative-operations)). The creative-stack is naturally a **by-discipline** department: the skill list above is exactly the discipline breakdown an in-house creative team would have. The standard creative lifecycle (define goals and roles, ideate, review and approve, launch, then invoice and post-mortem) lines up with the workshop's own lead-to-archive arc, including the closing ADR as the post-mortem.

### The consumption mechanism (decided): copy and transform, under CXO roles

The workshop will **not** install or depend on the creative-stack at runtime. The chosen model is **copy and transform**: the creative-stack is a donor library, and selected knowledge and skills are lifted into the company repo over time and reshaped to fit the business, organized under **CXO roles**.

This fits the operator design already drafted in [cxo-folders.md](cxo-folders.md), which models the business as a set of CXO seats, each a separately versioned skill bundle (for example `skills/cmo/`, `skills/cto/`). The creative and graphics work maps naturally onto the **CMO / creative seat** (the CMO mandate there explicitly owns "brand governance (visual and verbal identity)"). So the path is: pick the skill or knowledge file that earns its place (grow-by-promotion, not bulk import), copy it into the relevant CXO bundle in the company repo, and adapt it to the business voice and stack. The creative-stack stays the quarry; the company repo holds the working, transformed copies.

This means the live plugin/marketplace path is **not** the workshop's consumption mechanism. It is still worth completing and activating the marketplace manifest, but for a different reason: as a clean, exhaustive **catalog** of what the creative-stack offers, so copying is deliberate rather than guesswork. For reference, the 2026 mental model behind marketplaces (skills are knowledge, subagents are workers, plugins are the bundle, a marketplace is a registry) is documented in [Claude Code Skills docs](https://code.claude.com/docs/en/skills) and [Level Up Coding](https://levelup.gitconnected.com/a-mental-model-for-claude-code-skills-subagents-and-plugins-3dea9924bf05); the promote-when-reused guidance is in [Scott Spence](https://scottspence.com/posts/organising-claude-code-skills-into-plugin-marketplaces).

The creative-stack already ships `claude-plugin.marketplace.json`. Its shape:

```jsonc
{
  "name": "claude-creative-stack",
  "plugins": [
    { "name": "ui-design-kit",     "source": { "type": "local", "path": "skills/ui-design-kit" } },
    { "name": "animation-composer","source": { "type": "local", "path": "skills/animation-composer" } },
    // ... 9 skills total exposed as plugins
  ],
  "mcps": [
    { "name": "palette-oklch", "source": { "type": "local", "path": "mcp/servers/palette-oklch" } }
  ]
}
```

A note recorded in that file: it must be moved to `.claude-plugin/marketplace.json` to actually activate (the dotfile path was blocked in its authoring environment). **Decision: complete and activate it** as the catalog described above. Two gaps to close: the manifest currently exposes **9 of the 12 skills** (it omits `asset-generator`, `critique-loop`, `viral-news-scanner`) and **1 of the 3 MCP servers** (only `palette-oklch`; `sprite-packer` and `asset-router` are not yet listed).

---

## Mission B: Explore and explain the host-repo concept

The goal here is understanding, not a removal plan.

### What "host repo" means

The phrase currently covers two distinct things:

1. **The child-repo hosting pattern** in `claude-creative-stack/CLAUDE.md`: child repos live as top-level sibling subdirectories, each with its own `.git` and remote, never blending git histories. They are independent ad-hoc clones, typically gitignored from the host.
2. **The operator-memory / workshop layer** designed in `research/` and scaffolded as `bar-portfolio/company/`: the agent-operated business home with a lifecycle (lab to leads to clients to projects to archive), scope-based autonomy, plain-Markdown state, and append-only decision records.

### The workshop mental model

From `company/CLAUDE.md`:

> A **workshop**, not a vault. Tools that stop serving the work get thrown out.

> A **substrate operated by agents.** You direct; the agent files, builds, and remembers.

> **Plain Markdown is the source of truth.** Nothing important hides in a tool you can't open and read.

> **Grow by promotion.** Add a skill after the 3rd repeated prompt; a command when a flow recurs; an MCP server only for a named workflow. Don't pre-build.

The lifecycle folders:

| Folder | Meaning |
|---|---|
| `lab/` | Free experiments, the lead-gen surface |
| `leads/` | Inbound or lab-converted prospects being qualified |
| `clients/` | Paid engagements |
| `projects/` | Own side projects + business-improvement work |
| `archive/` | Frozen at handover, immutable (hook-protected) |

The arc (lead to qualified to active to handoff to archive) is described as "a backbone, not a rigid pipeline." Commands move work through it (`/intake`, `/capture`, `/promote-to-client`, `/archive`, `/weekly-review`) plus the two-direction harness (`/build` outward at deliverables, `/build-harness` inward at the `.claude/` config). Skills are `brief-intake`, `decision`, `mvp-scaffold`.

### Scope-based autonomy, enforced by hooks

The spine of the design, from `company/CLAUDE.md`:

> **Inside a single sub-project folder, full autonomy.** Build, edit, run, commit freely.
> **Business-scope actions, confirm with the operator first.** That means anything touching: the repo root, `archive/`, contracts/secrets, `.claude/`, money/legal, or more than one project at once.
> Hard stops are **enforced by hooks**, not by trusting this paragraph: `git-safe.sh` blocks destructive shell; `protect-paths.sh` blocks edits to `archive/` and secret-ish files.

This matches the best-practice consensus: CLAUDE.md instructions are advisory and can be reasoned around as a conversation grows, while a `PreToolUse` hook that exits non-zero is deterministic and cannot ([Anthropic best practices](https://www.anthropic.com/engineering/claude-code-best-practices)). A third hook, `session-start.sh`, injects current branch, uncommitted changes, the cwd `STATUS.md`, and recent decisions into context at session start.

### How it currently lives in / overlaps the creative-stack

Right now two things are nested where, conceptually, they are their own layer:
- The creative-stack acts as the **physical host** for child repos including `bar-portfolio`.
- The **workshop scaffold and research docs live inside `bar-portfolio`** (`bar-portfolio/company/` and `bar-portfolio/research/`).

So the operator layer is two levels deep (inside a child of the host), even though the design treats it as a standalone thing.

### What the research already says about it

The design intent is consistent and explicit that this is its own repo. From `research/README.md`:

> Research and design brainstorm for a future private GitHub repository that will serve as the operator's memory + workshop layer... A separate, private, Claude-native repo whose job is to remember. `bar-portfolio` itself is sub-project #1 of this host.

From `research/workshop-vision.md`:

> **The Portfolio (`bar-portfolio`)** stays exactly where it is, fully separate. Not absorbed, not touched.

From `research/host-repo-architecture.md`:

> **IS NOT:** A fork or rename of `bar-portfolio`... NOT a deployment target... NOT a monorepo that swallows other repos. The host helps Bar think about, bootstrap, and remember [sub-projects]; the host does not run them.

The recommended sub-project relationship is **Spine + sibling clone**: the host keeps a short summary per sub-project for awareness, and the real repo lives as an unchanged sibling (`research/sub-repo-relationship.md`).

### Recorded context: extraction and the nested-`.claude/` caveat

`company/README.md` records the planned extraction and an important limitation:

> This folder currently lives inside `bar-portfolio` as a staging ground. It is designed to be **extracted into its own private repo**.
> History-preserving: `git subtree split --prefix=company -b company-export`...
> Note: `.claude/` config and the hooks activate only once this folder is at a **repo root**. While nested inside `bar-portfolio` they do not fire (Claude Code does not cascade nested `.claude` settings/hooks). That is expected.

This is recorded context, not a step to run here. It explains why the concept reads as a standalone repo: the hooks and settings literally cannot fire until it sits at a repo root.

### Repo-topology context (background)

The monorepo-vs-multi-repo question sits under all of this. AI agents tend to produce better work with full-codebase context, atomic changes, and a single CI boundary, which favors a monorepo; but improving cross-repo / multi-root tooling narrows that edge ([DEV: Monorepo vs Multi-Repo](https://dev.to/dortort/monorepo-vs-multi-repo-why-ai-agents-tip-the-scale-1cdj)). The workshop design deliberately chooses **separation with awareness** (sibling clones + a spine + a manifest) rather than a swallowing monorepo, which is why the operator layer reads as its own repo even while staged inside `bar-portfolio`. This is background that explains the shape; it is not a directive to split anything.

---

## Decisions (resolved) and what stays open

Resolved with the operator on 2026-05-24:

- **Consumption: copy and transform, not install.** The workshop does not use the creative-stack as a live dependency. Selected knowledge and skills get copied into the company repo over time and reshaped under **CXO roles** (creative work to the CMO / creative seat, per [cxo-folders.md](cxo-folders.md)). Grow-by-promotion governs what gets lifted; the creative-stack stays the donor quarry.
- **Marketplace manifest: complete and activate.** Add the 3 missing skills (`asset-generator`, `critique-loop`, `viral-news-scanner`) and the 2 missing MCP servers (`sprite-packer`, `asset-router`), and move the file to `.claude-plugin/marketplace.json`. Its role is a clean catalog to copy from, not the workshop's runtime dependency.
- **Discipline coverage: future skills.** The toolkit is strong on web/UI, motion, graphics, games, presentations, and generative assets, and thin on brand strategy, copywriting, video editing, and print. These are treated as a **roadmap of skills to grow later** (by promotion), not as out-of-scope.

Still open (recorded, not decided):

- **Repo topology.** Once the workshop is its own repo, whether the creative-stack becomes a sibling the workshop copies from, or keeps its hosting role, is undecided. This report only explains the present arrangement.
- **CXO mapping detail.** Exactly which seat(s) own the creative work (CMO alone, or a dedicated creative/design seat) and the promotion rules for lifting a skill from the creative-stack into a CXO bundle are deferred to the CXO build (see [cxo-folders.md](cxo-folders.md), `promotion-rules.md`).

---

## Closing: the three roles and how they relate today

After the conceptual dust settles, there are three things with three jobs:

| Role | What it is | Its job |
|---|---|---|
| **Portfolio** | `bar-portfolio` (public, GitHub Pages) | Bar's public surfaces. Stays separate and untouched. Sub-project #1 of the host. |
| **Workshop / operator layer** | the host-repo concept (`company/` + `research/`) | Remembers the business, routes leads to clients to archive, enforces scope-based autonomy. A substrate, not a deployment target. |
| **Creative Stack** | `claude-creative-stack` (toolkit) | The creative & graphics source library: skills + MCP + knowledge the workshop **copies and transforms from** into CXO bundles, not a live dependency. |

Today these overlap: the creative-stack hosts the portfolio, and the workshop concept is staged inside the portfolio. Conceptually they are three layers with clean boundaries: the workshop **operates** the business (and will hold its own transformed copies of the creative skills under CXO roles), the creative-stack is the **donor source** for that creative capability, and the portfolio **presents** Bar publicly. This report frames that relationship for understanding; it leaves repo topology to a later, separate decision.

---

## References

- Anthropic, Claude Code best practices: https://www.anthropic.com/engineering/claude-code-best-practices
- Claude Code Skills docs: https://code.claude.com/docs/en/skills
- obviousworks, 2026 CLAUDE.md architecture: https://www.obviousworks.ch/en/designing-claude-md-right-the-2026-architecture-that-finally-makes-claude-code-work/
- DEV, Monorepo vs Multi-Repo (AI agents): https://dev.to/dortort/monorepo-vs-multi-repo-why-ai-agents-tip-the-scale-1cdj
- Scott Spence, organising skills into plugin marketplaces: https://scottspence.com/posts/organising-claude-code-skills-into-plugin-marketplaces
- Level Up Coding, mental model (skills/subagents/plugins): https://levelup.gitconnected.com/a-mental-model-for-claude-code-skills-subagents-and-plugins-3dea9924bf05
- Adobe, creative operations guide: https://business.adobe.com/blog/basics/making-creative-work-that-matters-a-guide-to-creative-operations
- Ziflow, creative operations team structure: https://www.ziflow.com/blog/creative-operations-team-structure

### Internal cross-references
- [workshop-vision.md](workshop-vision.md), [workshop-design.md](workshop-design.md), [external-reports-agent-operated-repo.md](external-reports-agent-operated-repo.md), [sub-repo-relationship.md](sub-repo-relationship.md), [host-repo-architecture.md](host-repo-architecture.md), [cxo-folders.md](cxo-folders.md)
- `../company/CLAUDE.md`, `../company/README.md`
