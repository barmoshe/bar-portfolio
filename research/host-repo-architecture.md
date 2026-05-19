# Host Repo Architecture — Brainstorm

A research-and-design brainstorm for Bar Moshe's private AI-native "host" GitHub repo. This is *not* an implementation plan, *not* a file list to scaffold, and *not* business strategy. It is the conceptual architecture and the principles that should govern the repo as it grows.

The brainstorm was produced through a multi-turn interview + 6 web research passes. Open questions for further brainstorming are listed at the end.

---

## 1. Context — what this repo IS and IS NOT

**IS:** A private GitHub repo that serves as Bar's *memory* and *workshop*. Knowledge + context + intent layer behind his business. Claude-native — Claude reads from it on every session; Bar reads from it as a second brain. Holds the things that cannot live in public (real pricing, raw intake, decisions, drafts, founder operating manual).

**IS NOT:** A fork or rename of `bar-portfolio` (which stays public and ships to GitHub Pages). NOT a deployment target. NOT where sub-projects' CI/CD lives. NOT a marketing surface. NOT a monorepo that swallows other repos.

**Sub-projects** are the real things Bar ships to customers. Each starts as a POC; if the engagement continues, more work lands in the same sub-project. They are their own things — separate physical repos with their own deploy pipelines. The host helps Bar *think about, bootstrap, and remember* them; the host does not run them.

---

## 2. The walking-skeleton spine: capture ↔ retrieve

The repo's primary architectural job is **memory**. Everything else (workshop, CXOs, sub-projects, decisions, knowledge base) grows around this single loop:

```
something happens  →  captured into the repo  →  retrieved by Claude when relevant
```

If this loop works end-to-end on day one, the architecture is sound. If it breaks at any commit, revert. (Walking Skeleton — Cockburn / Pragmatic Programmer.)

---

## 3. Capture: single inbox, type-by-promotion

**Architectural shape:** ONE inbox. Every captured thing — a lead, an idea, a decision-in-the-making, a draft, an observation, a snippet, a half-formed thought — lands in `/inbox/` as a dated, free-form note. No typing at capture time. Capture friction is zero.

**Triage by promotion:** When a pattern emerges in the inbox (Rule of Three — three real artifacts cluster), they get *promoted* into a new typed folder. The folder is born by promotion, never by creation. This guards against the #1 anti-pattern across every source: the empty Notion graveyard.

Why single inbox and not pre-built typed inboxes: pre-committing to categories before knowing what you actually produce is "highly structured procrastination." Let the structure emerge from real usage. (Matuschak — evergreen notes; Appleton — digital garden; Forte — PARA bottom-up; Fowler — Rule of Three / YAGNI.)

---

## 4. Retrieval: the 2026 lightweight recipe

The 2026 dominant pattern for Claude-native retrieval is leaner than most teams realize. The recommended Day-1 retrieval stack:

- **Lean root `CLAUDE.md`** — ~100 lines max. It is a Table of Contents, not knowledge. Routing table + invariants list. Knowledge itself lives in skills and nested files.
- **SessionStart hook** (`<500 tokens`) — runs on every session start. Outputs *dynamic state only*: today's date, inbox count, items modified since yesterday, recent git activity. Hook output is injected as a discrete message with the weight of user input — Claude can't ignore it. This is the most underhyped primitive in the entire stack.
- **2–3 skills** (`/triage`, `/promote`, `/index`) — each skill is a folder with a `SKILL.md` whose YAML frontmatter (`name`, `description`) is pre-loaded at ~30 tokens; the body and reference files load only when description matches the task (progressive disclosure).
- **Nested `CLAUDE.md` per type-folder** — when a folder gets promoted into existence, it carries its own `CLAUDE.md` describing what that type is and how to work with it. Lazy-loaded only when Claude enters that subtree. This is the perfect fit for type-by-promotion.

**What's deferred** (and what triggers adoption):
- **Sub-agents** — only when one task = >5k tokens of exploration repeatedly. Sub-agents have their own context window and return only their summary to the parent. Heavy primitive; pays off once exploration burn is real.
- **MCP servers** — only when *promotion becomes a side-effecting verb* that needs auditability (moves files, renames, adds frontmatter). Skills are knowledge; MCP is action.
- **`claude-mem` cross-session memory** — only when you notice yourself re-explaining the same context across sessions. Adds a moving SQLite file to the repo; useful but not free.
- **Vector DB / RAG** — probably never. Anthropic dropped RAG from Claude Code because "agentic search outperformed everything, by a lot." Grep + glob + Read beats embeddings below ~10k files. The repo is structured, not prose — vectors don't pay off here.

**What's overhyped:** RAG for small structured repos, giant skill marketplaces (description-collision tax), CLAUDE.md as dumping ground.

**What's underhyped:** SessionStart hooks, nested CLAUDE.md inheritance, MCP scoped to side-effecting verbs only.

---

## 5. CXOs — the business-layer org chart that grows over time

A CXO is **not** a Claude sub-agent. A CXO is a **bundle of `knowledge + skills + tools`** scoped to a domain. When Claude is working in a CXO's domain, it loads that CXO's skills, reads that CXO's knowledge, and can use that CXO's tools — but Claude is still Claude, not a separate persona. This deliberately avoids the anthropomorphism overhead the agent-HR research warned about.

**No CXOs exist on Day 1.** The repo starts with just the founder (you). CXO seats are born organically as recurring pain demands a name. "I keep redoing pricing math" → CFO seat is born. "I keep forgetting follow-ups" → CRO seat is born. Rule of Three applies to the org chart itself.

### The planned CXO roster (added one-by-one, near-future)

| CXO | Owns |
|---|---|
| **CEO** | Intent, priorities, charter, the "why" layer, says no |
| **CTO** | Tech stack, code conventions, reviews, technical scoping |
| **COO** | Cadence, calendar, intake triage, weekly review, comms-to-decision capture |
| **CFO** | Pricing, deal shapes, invoicing, runway, MVPr |
| **CRO** | Lead qualification, pipeline, POC → pilot → retainer conversion |
| **CMO** | Brand voice, distribution, LinkedIn/lab launches, public-surface translation |
| **CLO** | Lab, experiment register, bet management, kill criteria, idea backlog |
| **CKO** | Knowledge librarian: routing tables, decision-log discipline, stale-doc audits, cross-CXO promotion |
| **CPO** | *HR for agents* — owns the agent roster, charters, performance reviews, retirements, conflict resolution, budget. The seat that asks *"should this agent exist, is it still earning its keep, and who's accountable for what it just did?"* |

### Workshop entry points (proposed, deferred for next brainstorm)

When CXOs exist and a workshop emerges, the proposed shape is **two entry points** for new work, split by source:

- **CRO** is the entry for **client work** (lead → qualify → brief enters workshop)
- **CLO** is the entry for **lab/innovation work** (idea sparks → captured as a bet → enters workshop)

Once in the workshop, **COO + CTO + CEO** contribute layers (capacity, technical scoping, go/no-go against charter). When all four say go, the draft graduates to a sub-project. CFO / CMO / CKO / CPO contribute as needed but aren't on the critical path.

---

## 6. Architectural primitives (the conceptual map)

| Primitive | What it is | When born |
|---|---|---|
| **Host** | The repo itself, the container | Day 1 |
| **Founder** | Bar, the apex actor | Day 1 (always) |
| **Inbox** | Single capture surface, free-form dated notes | Day 1 |
| **Workshop** | Staging area where thinking and pre-build work happens | Emerges when ≥3 drafts cluster |
| **CXOs** | Knowledge + skills + tools bundles, no personas | Emerge one-by-one as pain demands |
| **Roster** | The list of CXOs that exist at any given time | Implicit until ≥3 CXOs exist |
| **Sub-projects** | Client engagements; live in their own repos | Emerge when first POC ships |
| **Knowledge base** | Read-from facts that inform everything | Emerges from inbox by promotion |
| **Intent** | Charter, principles, what we say no to | Emerges when worth writing down |
| **Decisions** | Immutable ADRs ("we chose X because Y") | Emerges after the 3rd decision worth logging |

Nothing in this list except Host, Founder, and Inbox is on Day 1. Everything else is *latent* — present in the architecture as a named place for things to grow *into*, but not pre-built.

---

## 7. Day-1 walking skeleton (the minimum that runs the loop)

~6 top-level entries, no pre-built type folders.

```
.
├── README.md                # one paragraph: what this repo IS and IS NOT
├── CLAUDE.md                # lean TOC (~100 lines), routing + invariants
├── .claude/
│   ├── settings.json        # permission allowlist
│   ├── hooks/
│   │   └── session-start.sh # today's state briefing, <500 tokens
│   └── skills/
│       ├── triage/SKILL.md  # walk the inbox, propose what to do with each item
│       ├── promote/SKILL.md # rule-of-three: move clustered items into a new folder
│       └── index/SKILL.md   # update routing tables when structure changes
├── inbox/                   # single capture surface
│   └── .gitkeep
└── .gitignore
```

That's it. Everything else (workshop, clients, decisions, cxos, knowledge) is born later, by promotion.

---

## 8. Governance principles (the rules that keep the repo honest)

1. **Rule of Three** — no folder, no skill, no template created without 3 real instances demanding it.
2. **Document-at-birth** — no folder exists without a one-line entry in root `CLAUDE.md`. A folder without a documented purpose is unfinished work.
3. **Promotion, not creation** — structure emerges from existing artifacts being clustered and moved, never from imagining future needs.
4. **CLAUDE.md ≤ 100 lines** — it is a map, not knowledge. Knowledge lives in skills and nested files.
5. **SessionStart hook ≤ 500 tokens** — dynamic state only; never static content; if it bloats, prune.
6. **Skill descriptions are verb-rich** — vague triggers don't auto-load; descriptions must include the user's actual verbs and nouns.
7. **Lazy retrieval over eager** — let Claude read what's needed, not everything; nested `CLAUDE.md` is loaded only when Claude enters its subtree.
8. **Append-only for decisions** — once written, a decision file is never edited. Superseded by writing a new file that references the old.
9. **Frontmatter only when queried** — don't add YAML to artifacts you'll never filter on. Metadata has a cost.
10. **No empty scaffolds** — if a folder has no content, delete it. The graveyard anti-pattern starts with one empty folder "for later."

---

## 9. Methodologies that informed the architecture

Each principle above traces to a named methodology from the research:

- **Walking Skeleton** (Alistair Cockburn / Pragmatic Programmer) — thinnest end-to-end slice that works on day one
- **Tracer Bullet** (Hunt & Thomas) — same idea, different name
- **PARA** (Tiago Forte) — sort by *actionability*, not topic; "archive everything, create project folders only as projects appear"
- **Evergreen Notes** (Andy Matuschak) — prefer associative ontology over hierarchy; let networks emerge
- **Digital Garden / Epistemic Gradient** (Maggie Appleton) — half-formed thoughts are first-class (seedling → budding → evergreen)
- **YAGNI** (Martin Fowler) — folders for "future" use are pure cost with zero current value
- **Rule of Three** (Don Roberts / Fowler) — one is unique, two is coincidence, three is a pattern worth extracting
- **Progressive Disclosure** (Anthropic Skills design) — lightweight at top, deep on match
- **Hierarchical CLAUDE.md** (Anthropic memory model) — lazy-load child files when Claude enters their subtree

---

## 10. Six research passes that informed this brainstorm

| # | Topic | Key takeaways |
|---|---|---|
| 1 | Solo studio operations | Jarvis (Company of One), Levels ($3M solo), Stark (productized services + retainers), Vassallo (small bets), Bourn (wear all the hats). Frame the business as a real org even though one person fills every seat. |
| 2 | AI-native operating systems for solopreneurs | "AI as my team" is real (Notion 3.0, Soleur, Cofounder). Three layers: persistent memory (CLAUDE.md) + skills (loaded on match) + sub-agents (scoped context). Hooks turn every action into an audit log. Avoid agent sprawl, prompt drift, cascading hallucination. |
| 3 | Per-client engagement patterns | thoughtbot playbook, Shape Up pitches, ADRs, the POC → pilot → retainer triggers. Per-client decisions folder + retros that feed host playbook (rule of three for code reuse and patterns). |
| 4 | "Division" design space (12 primitives) | Folder, sub-agent, mode, MCP, cron, inbox, FSM, CODEOWNERS, channel, handoff, crew, typed-graph. Most mature designs combine 3–4 primitives. The dominant solo pattern: folder + sub-agent + MCP + inbox. |
| 5 | CPO-for-agents concept | The role is real and converging from AgentOps + CAIO + "HR for digital employees." 6–8 responsibilities: hiring, onboarding, performance, training, team composition, budgeting, retirement, org-chart maintenance. The HR analogy works for roles/mandates/onboarding/retirement; breaks for motivation/loyalty/coaching. |
| 6 | Zero-to-scaffold bootstrap | Walking Skeleton + PARA + Evergreen Notes + Digital Garden + YAGNI converge on the same advice: start with the thinnest end-to-end loop, never pre-build empty scaffolds, promote-don't-create. Document-at-birth. The "empty Notion graveyard" is the #1 failure mode. |
| 7 | Claude retrieval innovations 2026 | Lean CLAUDE.md as TOC, skills with progressive disclosure, SessionStart hooks (underhyped), nested CLAUDE.md, MCP for side-effecting verbs only. Vector RAG overhyped for structured repos. Day-1 lightweight recipe = CLAUDE.md + hook + 3 skills. |

---

## 11. Adopted patterns (handoff notes)

The operator flagged these for adoption when the Workshop is built. See `README.md § Patterns worth adopting` for the full handoff list.

- **`/goal <condition>`** — session-scoped Stop hook (Claude Code v2.1.139, May 2026). State the observable outcome, let the small-model evaluator gate session-end. Skills do the work; `/goal` decides when to stop. Detailed treatment in [claude-skills.md § 9](./claude-skills.md#9-the-goal-slash-command--session-scoped-stop-conditions).

---

## 12. Decisions locked in this brainstorm

- The repo is **private**, **Claude-native**, **knowledge + workshop only** (not deploy).
- The walking-skeleton loop is **capture ↔ retrieve**. The repo is memory.
- Capture: **single inbox**, type-by-promotion.
- Retrieval: **lean CLAUDE.md TOC + SessionStart hook + 2–3 skills**, with sub-agents/MCP/claude-mem deferred until Rule of Three.
- CXOs are **knowledge + skills + tools bundles, not sub-agents**.
- **Day 1 has no CXOs.** Roster grows organically.
- Sub-projects = client engagements, live in their own repos, the host does not deploy them.
- Structure is grown by **promotion**, never by pre-creation. Rule of Three governs.

---

## 13. Open questions deferred for the next brainstorm

These are the architectural sub-topics worth a dedicated brainstorm session each:

1. **Lean CLAUDE.md design** — exact sections, routing table format, invariants list, tone
2. **The 3 Day-1 skills in detail** — triggers, what they actually do, outputs, how they avoid stepping on each other
3. **Inbox shape** — file naming convention, structure of each note (if any), dating
4. **Post-promotion folders** — what the first 3–5 folders that emerge in practice look like
5. **CXO mandate templates** — what a CXO's charter looks like as a markdown file
6. **Workshop ↔ Sub-project handoff** — graduation criteria, what travels with a sub-project at birth
7. **CXO ↔ Sub-project visibility** — which CXO sees which client; per-client P&L for CFO, per-client tech reviews for CTO, etc.
8. **Founder ↔ CXO interaction model** — advisor / decider / auditor posture per CXO
9. **CPO-for-agents in practice** — the roster file, agent CVs, performance log, retirement registry
10. **Sub-project bootstrap** — when a new client engagement is born, what does the host hand it (templates, conventions, starter CLAUDE.md)?
11. **The "near future" CXO build order** — which CXO seat earns the first definition; what pain triggers each subsequent one
12. **Knowledge promotion across CXOs** — when does a pattern observed in one CXO's domain get promoted to the global knowledge base (CKO's job)

---

## 13. Sources

### Solo studio operations
- [Company of One — Paul Jarvis (summary)](https://www.befreed.ai/book/company-of-one-by-paul-jarvis)
- [Pieter Levels indie-hacker strategy](https://www.systemscowboy.com/pieter-levels-indie-hacker-strategy/)
- [Paul Graham — Maker's Schedule, Manager's Schedule](https://paulgraham.com/makersschedule.html)
- [Jonathan Stark — Productized Service Creation Process](https://jonathanstark.com/productized-service-creation-process)
- [Daniel Vassallo — Small Bets (Pathless Path)](https://pathlesspath.com/vassallo-small-bets/)
- [Jennifer Bourn — Wearing all the hats](https://jenniferbourn.com/wearing-freelance-hats/)
- [Kai Davis — Escaping feast or famine](https://www.kaidavis.com/articles/feast/)

### AI-native solo operating systems
- [HBR — Scale AI Agents Like Team Members](https://hbr.org/2026/03/to-scale-ai-agents-successfully-think-of-them-like-team-members)
- [Taskade — One-Person Companies 2026](https://www.taskade.com/blog/one-person-companies)
- [dev.to — I Run a Solo Company with AI Agent Departments](https://dev.to/setas/i-run-a-solo-company-with-ai-agent-departments-50nf)
- [MindStudio — Context Inheritance for Multi-Client Projects](https://www.mindstudio.ai/blog/context-inheritance-claude-code-multi-client-projects)
- [HumanLayer — Writing a good CLAUDE.md](https://www.humanlayer.dev/blog/writing-a-good-claude-md)
- [Soleur (Company-as-a-Service)](https://www.soleur.ai/)
- [Cofounder.co](https://cofounder.co/)
- [pulse8-ai-cortex-knowledge-vault on GitHub](https://github.com/synpulse8-opensource/pulse8-ai-cortex-knowledge-vault)
- [Galileo — 7 Agent Failure Modes](https://galileo.ai/blog/agent-failure-modes-guide)

### Per-client engagement patterns
- [thoughtbot Playbook](https://thoughtbot.com/playbook)
- [Basecamp Shape Up — Write the Pitch](https://basecamp.com/shapeup/1.5-chapter-06)
- [ADR home](https://adr.github.io/)
- [Martin Fowler — Architecture Decision Record](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html)
- [Consulting Success — Retainer guide](https://www.consultingsuccess.com/consulting-retainer)
- [Consulting Success — SOW template](https://www.consultingsuccess.com/consulting-statement-of-work-template)
- [DECODE — NDA/MSA/SOW for software](https://decode.agency/article/software-development-contracts/)

### CPO for agents / AgentOps
- [XenonStack — AgentOps](https://www.xenonstack.com/blog/agentops-ai)
- [IBM — Chief AI Officer](https://www.ibm.com/think/topics/chief-ai-officer)
- [PwC — Agentic AI in HR](https://www.pwc.com/us/en/tech-effect/ai-analytics/agentic-ai-in-hr.html)
- [UNLEASH — Salesforce CPO on agentic workforce](https://www.unleash.ai/artificial-intelligence/salesforce-cpo-competitive-advanage-with-agentic-ai-comes-from-the-workforce-not-the-technology/)
- [Security Boulevard — Agentic Sprawl](https://securityboulevard.com/2026/05/a-guide-to-agentic-sprawl-how-to-govern-your-program/)
- [TrueFoundry — AI Agent Registry](https://www.truefoundry.com/blog/ai-agent-registry)

### Bootstrap methodology
- [Walking Skeleton — Code Climate](https://codeclimate.com/blog/kickstart-your-next-project-with-a-walking-skeleton)
- [PARA Method — Tiago Forte](https://www.buildingasecondbrain.com/para)
- [Evergreen notes — Andy Matuschak](https://notes.andymatuschak.org/Evergreen_notes)
- [Digital garden history & ethos — Maggie Appleton](https://maggieappleton.com/garden-history)
- [YAGNI — Martin Fowler](https://martinfowler.com/bliki/Yagni.html)
- [Rule of Three — Wikipedia](https://en.wikipedia.org/wiki/Rule_of_three_(computer_programming))
- [Prevent Notion dumping ground — Síntesi](https://www.sintesi.studio/blog/notion-architecture-prevent-dumping-ground)

### Claude retrieval innovations 2026
- [Skill authoring best practices — Anthropic](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)
- [Create custom subagents — Claude Code Docs](https://code.claude.com/docs/en/sub-agents)
- [Automate workflows with hooks — Claude Code Docs](https://code.claude.com/docs/en/hooks-guide)
- [Session start hooks force context — MindStudio](https://www.mindstudio.ai/blog/session-start-hooks-claude-code-force-context)
- [How Claude remembers your project — Claude Code Docs](https://code.claude.com/docs/en/memory)
- [Nested CLAUDE.md mechanics — dev.to](https://dev.to/subprime2010/claude-code-project-memory-how-claudemd-files-work-across-nested-directories-1mk8)
- [Claude-Mem documentation](https://docs.claude-mem.ai/introduction)
- [Why Cursor, Claude Code, Devin use grep, not vectors — MindStudio](https://www.mindstudio.ai/blog/is-rag-dead-what-ai-agents-use-instead)
- [How I Structure CLAUDE.md After 1000+ Sessions — jock.pl](https://thoughts.jock.pl/p/how-i-structure-claude-md-after-1000-sessions)
- [Claude Code Agent Teams 2026 Playbook — Developers Digest](https://www.developersdigest.tech/blog/claude-code-agent-teams-subagents-2026)
