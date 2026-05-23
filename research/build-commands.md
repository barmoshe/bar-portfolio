# `/build` and `/build-harness` — Command Concepts (Options Research)

Research exploration of two command *concepts* for the future Workshop repo, plus how the `/goal` primitive would orchestrate them. This is **options research**, not a Day-1 plan and not a scaffold of the repo — same register as [naming-and-framing.md](./naming-and-framing.md): explore the space, recommend tentatively, leave the decisions open.

The trigger idea (operator's framing): **the company harness carries knowledge + tools + scripts**, and it can apply that bundle in **two directions** —

- **inward**, on *itself* → `/build-harness` (fix / improve / implement new stuff in the harness)
- **outward**, on *the work* → `/build` (build something by the company itself)

This is the same bundle shape the research already uses for a CXO — *"a bundle of `knowledge + skills + tools` scoped to a domain"* ([host-repo-architecture.md §5](./host-repo-architecture.md)). Here the bundle is scoped to the company-as-a-whole, and the two commands are just which way it points.

---

## 1. Framing — inward vs outward

| | `/build-harness` (inward) | `/build` (outward) |
|---|---|---|
| **Acts on** | The `.claude/` infra: `CLAUDE.md`, SessionStart hook, skills, settings | A deliverable / sub-project — the company's actual output |
| **Bundle used** | knowledge (what good harness looks like) + tools/scripts (token-count, link-check, skill-author) | knowledge (CXO domains, conventions) + tools/scripts (scaffold, deploy) |
| **Closest existing concept** | The `index` skill (routing-table upkeep) + the `/create-skill` open question ([claude-skills.md §10](./claude-skills.md)) | The *graduation ritual* — draft → sub-project ([host-repo-architecture.md §5](./host-repo-architecture.md)) |
| **Side-effecting?** | Yes — mutates the repo it runs in (self-modification) | Yes — creates/changes a *separate* sub-project repo |
| **Failure blast radius** | The company's own working memory | One client/lab deliverable |

The symmetry is the appeal: one bundle, two directions. The risk is that "two commands" is a tidy story imposed on two quite different acts — self-modification vs. production — that may not want the same shape. Sections 2–3 take each on its own terms before Section 5 returns to whether the symmetry actually holds.

---

## 2. `/build` — the option space

"Use the company to build something" is under-specified. At least three non-exclusive readings, each with different cost and risk:

**Option A — Graduate a draft into a sub-project.** `/build` is the *graduation ritual* given a name: take a clustered Workshop draft, create a new sub-project repo + Workshop overlay, hand it a starter harness. This is almost entirely already described — CRO/CLO are the entry points, COO+CTO+CEO gate go/no-go, the draft "graduates to a sub-project" ([host-repo-architecture.md §5](./host-repo-architecture.md)); the sub-repo is born at the POC gate, not at Discovery ([intake-flow.md](./intake-flow.md), touchpoint 9); the overlay holds private context that never deploys ([sub-repo-relationship.md](./sub-repo-relationship.md) §4–6). Under this reading `/build` is mostly *naming + scaffolding* on top of the existing `/promote` skill — which raises the honest question in §5: is it a new primitive or a rename?

**Option B — Drive an in-place build inside an existing sub-project.** `/build` runs *within* a sub-project and pulls the relevant CXO knowledge (CTO conventions, design system, the overlay's decisions/retros) into context to produce the actual artifact. This is the "company knowledge as loaded context" reading — closest to how a coding agent already works, but with the Workshop's accumulated domain knowledge as the differentiator. Heavier on retrieval; this is where sub-agents earn their place ([host-repo-architecture.md §4](./host-repo-architecture.md): sub-agents only "when one task = >5k tokens of exploration repeatedly").

**Option C — Full pipeline (intake → graduate → first build).** One command spanning intake-flow's touchpoints through the first shipped slice. Tempting, but collides hardest with the architecture's "thin slices, human gates between stages" stance ([client-lifecycle.md](./client-lifecycle.md) stage gates) and with the §9 caveat below (a single `/goal` can't gate a multi-objective pipeline).

**Tentative read:** A and B are the live candidates; C is probably too much for one command. A is cheap but may be redundant with `/promote`; B is where the company's knowledge actually does work a generic agent couldn't. If only one `/build` exists, B is the more *distinctive* capability — but it presupposes a sub-project already exists, i.e. A (or the manual ritual) already ran.

---

## 3. `/build-harness` — the option space

The self-improvement loop: the harness operating on the harness. Candidate jobs, all recurring:

- Keep `CLAUDE.md` under its line budget (≤100 lines, [host-repo-architecture.md §8](./host-repo-architecture.md)) — prune when it drifts toward the "200-line cliff" where adherence collapses ([practical-reference.md](./practical-reference.md) anti-patterns).
- Keep the SessionStart hook under its token budget (≤500 tokens, dynamic state only) — prune bloat.
- Author / retire skills — the §10 sunset question ("skill removed if not invoked in 60 days") and the `/create-skill` authoring-loop question ([claude-skills.md §10](./claude-skills.md)).
- Audit settings / routing tables — overlaps the `index` skill's job of updating routing when structure drifts ([claude-skills.md §8](./claude-skills.md)).

**The real design question is primitive choice.** [claude-skills.md §2](./claude-skills.md) separates skill (auto-fires on topic) / sub-agent (heavy, isolated context) / slash command (explicit, one keystroke). Harness-mutation is *side-effecting and audit-worthy* — you want a record of "what changed the company's own brain and why." The research's own rule: skills are knowledge, **MCP is for side-effecting verbs that need auditability** ([host-repo-architecture.md §4](./host-repo-architecture.md)). So the honest options are:

1. **Slash command** — explicit, Bar invokes it deliberately. Fits "infrequent, intentional, human-initiated."
2. **Slash command → sub-agent for the heavy audit → main Claude applies the diff** — the hybrid pattern §2 already endorses. Keeps the audit reasoning out of the main window.
3. **MCP-gated mutations** — if/when promotion-and-harness-edits become verbs that must be logged and reversible.

**Tentative read:** `/build-harness` as a *slash command* (option 1), graduating toward the §2 hybrid (option 2) as the audits get expensive, with MCP (option 3) deferred until auditability is a felt need (Rule of Three). Note also the §5 anti-pattern hazard: a malicious or careless `CLAUDE.md` edit is exactly the "exfiltration risk" the research flags ([practical-reference.md](./practical-reference.md)) — a command that edits the harness is the highest-trust command in the repo.

---

## 4. How `/goal` orchestrates both

`/goal` is a meta-layer above the command: the command does the work, `/goal` decides when the work is done ([claude-skills.md §9](./claude-skills.md)). Both of these commands are good `/goal` candidates because both have a nameable finish line. *Illustrative* conditions (not prescriptions), each phrased to the §9 discipline — observable, verifiable from the transcript, no tool runs:

- `/build-harness` → *"until `CLAUDE.md` is back under the line budget, the SessionStart hook is under the token budget, and every skill description names its trigger verbs"*
- `/build` (Option A) → *"until the sub-project overlay exists with pitch / appetite / exit-criteria and the sub-repo is created with a starter `CLAUDE.md` pointing back to the overlay"*

**The §9 caveat bites here.** The goal evaluator runs no tools — it only judges what Claude has *surfaced in the conversation*. So "the harness passes `make check`" or "the deploy returns 200" are **not** valid `/goal` conditions; those need a deterministic Stop hook ([claude-skills.md §9](./claude-skills.md): "Stop hooks for invariants, `/goal` for objectives"). A clean split for these commands:

- **`/goal`** gates the *objective* of one session ("the harness is tidied", "the slice is built").
- **A Stop hook** enforces the *invariant* that doesn't vary by session ("don't stop with uncommitted files", "don't stop if `make check` fails").

This is also why Option C (full pipeline) is awkward: it's multi-objective, and §9 explicitly flags that "sessions with multiple parallel objectives need explicit human checkpointing," not one `/goal`.

---

## 5. Governance tension (left open on purpose)

The architecture's spine is **promotion-not-creation / Rule of Three / no empty scaffolds** ([host-repo-architecture.md §8](./host-repo-architecture.md)), and the Day-1 stance is that *even the three core skills start as slash commands and only graduate to skills after firing 3× the same way* ([claude-skills.md §8](./claude-skills.md)). Pre-defining `/build` and `/build-harness` is in direct tension with that. Two honest readings, presented as options, **not resolved here**:

- **They earn Day-1 existence.** They're not speculative folders — they name the company's two core verbs (make the product, maintain the maker). The "no empty scaffolds" rule is about *folders for imagined future needs*; a command for a verb you'll run weekly isn't that.
- **They emerge by promotion.** `/build-harness` only earns a definition after Bar has hand-tidied the harness 3× and noticed the pattern; `/build` may turn out to *be* `/promote` + scaffolding, discovered rather than declared. Declaring them now risks the exact "structured procrastination" the research warns against.

A possible split (also just an option): **`/build-harness` is the stronger Day-1 candidate** because harness-tuning is unambiguously recurring and self-contained, whereas **`/build` is more likely the graduation ritual maturing** and may not want its own command at all until real sub-projects exist. But this is a judgment for a future session with real usage data, not a call to make in a research doc.

---

## 6. Open questions

1. Is `/build` a genuinely new primitive, or `/promote` + scaffolding under a friendlier name? (decide once one real sub-project has shipped)
2. Primitive for `/build-harness`: slash command, the §2 hybrid, or MCP-gated — and what's the trigger to move up that ladder?
3. Does a harness-editing command need a mandatory diff-review / append-only changelog, given it's the highest-trust command in the repo?
4. Should `/build` (Option B) own sub-agent spawning, or stay in the main context and let sub-agents be a separate decision?
5. What's the Stop-hook invariant set that should back-stop both commands (uncommitted files, `make check`, link-check)?
6. Do these two ever share a `tools/` + `scripts/` directory (the literal "knowledge + tools + scripts" bundle), or does each carry its own?

---

## Sources

**Internal (Workshop research):**
- [host-repo-architecture.md](./host-repo-architecture.md) — CXO bundle (§5), retrieval & MCP-for-side-effects (§4), governance principles (§8), open questions (§13)
- [claude-skills.md](./claude-skills.md) — skill vs sub-agent vs slash command (§2), Day-1 three (§8), `/goal` (§9), open questions incl. `/create-skill` & sunset rule (§10)
- [sub-repo-relationship.md](./sub-repo-relationship.md) — what a sub-project inherits at birth (§4–6)
- [intake-flow.md](./intake-flow.md) — sub-repo created at the POC gate (touchpoint 9)
- [client-lifecycle.md](./client-lifecycle.md) — stage gates, thin-slice discipline
- [practical-reference.md](./practical-reference.md) — the 200-line CLAUDE.md cliff, malicious-CLAUDE.md risk, `/evolve` loop, `make check` over CLAUDE.md-as-linter

**External (`/goal` and methodology, as already cited in `claude-skills.md`):**
- [Anthropic — Keep Claude working toward a goal](https://code.claude.com/docs/en/goal)
- [Mervin Praison — /goal multi-turn sessions until a verifiable finish line](https://mer.vin/2026/05/claude-code-slash-goal-multi-turn-sessions-until-a-verifiable-finish-line/)
- [QRSPI — structured agentic workflow (Question, Research, Structure, Plan, Implement)](https://github.com/matanshavit/qrspi)
