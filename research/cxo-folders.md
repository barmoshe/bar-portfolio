# Per-CXO Folder Structure — Sourced Reference

Companion to `host-repo-architecture.md`. The architecture doc describes CXOs as **bundles of knowledge + skills + tools** that emerge organically. This doc gets concrete: for each CXO seat the operator plans to instantiate, what does the folder actually contain at Day-1 and at 6-month maturity? Drawn from real fractional-CXO playbooks (Umbrex, Pilot, Burkland), public company handbooks (GitLab, Stripe, Linear, Basecamp), and solo-operator operating systems (Pieter Levels, Justin Welsh, Patrick McKenzie, Daniel Vassallo, Paul Jarvis, Lenny Rachitsky).

> Source-quality caveat: many high-signal source pages (Umbrex, handbook.gitlab.com, basecamp.com/shapeup, levels.io, kalzumeus.com, writer.com/blog) return HTTP 403 to programmatic fetches. Umbrex citations below use search-engine excerpts that quote the page text directly. For higher-fidelity citation in a v2 the operator should fetch these manually.

---

## CEO

**Mandate.** Owns intent, strategy, capital allocation, and the "no list." Per the [Umbrex Fractional CEO Playbook](https://umbrex.com/resources/fractional-executive-playbook/fractional-ceo-interim-ceo-playbook/): *"Strategy and capital allocation sit squarely with the fractional CEO. They decide which markets to enter, how fast to burn cash, and what 'good' looks like in twelve quarters,"* and the engagement begins with *"a two-page role charter that states the top three strategic questions the CEO must answer in the first 90 days, decision-rights boundaries, and the planned exit path."* GitLab's public [CEO handbook](https://handbook.gitlab.com/handbook/ceo/) frames the same scope: *"Set overall strategy ... ensure there is enough cash at all times ... handle pricing and business model."*

**Knowledge it holds**
- Top-3 strategic questions for the next 90 days and decision-rights boundaries (Umbrex CEO Playbook).
- Company vision, hiring/firing standard, board/investor narrative ([GitLab CEO handbook](https://handbook.gitlab.com/handbook/ceo/)).
- Operating-principles document — Stripe-style codification of implicit culture explicit ([Stripe's Operating Principles](https://stripe.com/jobs/culture); [Slab on Stripe writing culture](https://slab.com/blog/stripe-writing-culture/)).
- One-niche / one-painful-problem / one-systematized-solution focus, per [Justin Welsh's LinkedIn OS](https://learn.justinwelsh.me/linkedin).
- A "stay small" growth thesis if applicable ([Paul Jarvis, Company of One](https://ofone.co/press)).

**Artifacts**
- `charter.md` (two-page role charter — questions, decision rights, exit path)
- `priorities.md` (top-3 for the quarter, top-1 for the week)
- `no-list.md` (things the company will not do this cycle — explicit kill list)
- `operating-principles.md` (Stripe-style, written long-form)
- `vision.md` / `north-star.md`
- `board-update.md` (even with no board — writing to a fictional one forces narrative discipline)

**Day-1 (3 files):** `charter.md`, `priorities.md`, `no-list.md`

**6-month mature (8–12):** + `operating-principles.md`, `vision.md`, `decisions/`, `weekly-board-update/`, `quarterly-review.md`, `kpis.md` (3–5 numbers the CEO steers by), `risks.md`, `succession.md`, `escalations-from-cxos.md`

**Claude-native:** A `ceo` skill bundle whose loaded prompt is the charter + no-list. A `/priorities` and `/no` slash command pair. A `weekly-review` skill that opens the charter, asks *"did this week's work serve a top-3 priority?"*, and writes the board update.

**Cross-references:** Reads every CXO's weekly summary. Writes to CFO (capital allocation), CRO (which markets), CLO (which bets), CKO (what to promote/demote).

---

## CTO

**Mandate.** Owns tech stack, conventions, and review bar. Per the [Umbrex Fractional CTO Playbook](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-technology-officer-cto-playbook/), the fractional CTO *"acts as the principal architect ... resulting in a detailed architectural diagram and stack documentation,"* and *"succeeds by wielding leverage through architectural judgment, governance frameworks, and talent coaching rather than becoming the senior engineer on every pull request."* [CTO Academy's playbook](https://cto.academy/fractional-cto-playbook/) frames this as an "operating system" with visible business impact in 90 days. For a solo operator collaborating with coding agents, this seat writes the rules the agents follow.

**Knowledge it holds**
- Stack decisions captured as ADRs in Michael Nygard's Context/Decision/Consequences format ([Martin Fowler on ADRs](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html); [adr.github.io](https://adr.github.io/); [Microsoft Azure WAF on ADRs](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record)).
- Code review guidelines — GitLab's [Code Review Guidelines](https://handbook.gitlab.com/handbook/engineering/workflow/code-review/) and [Reviewer Values](https://handbook.gitlab.com/handbook/engineering/workflow/reviewer-values/).
- Style/convention docs ([Fractional CTO code-review guide](https://fractionalcto.es/en/guide-to-do-code-reviews-in-your-team/)).
- Solo-operator twist: Pieter Levels' "one VPS, vanilla PHP, SQLite, 180+ cron jobs" stack ([levels.io](https://levels.io/how-i-build-my-minimum-viable-products/)) — keep the stack boring on purpose.

**Artifacts**
- `stack.md` (chosen stack + why; explicit anti-stack list)
- `decisions/NNNN-title.md` ADR series ([joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record); [Microsoft ADR template](https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/doc/adr/0001-record-architecture-decisions/))
- `conventions.md` (code style, repo layout, naming)
- `review-checklist.md` (the things the CTO seat blocks merges on)
- `runbooks/` (deploy, rollback, incident)
- `caveats.md` (the "do not break" file — the bar-portfolio repo's existing `knowledge/99-caveats.md` is this)

**Day-1 (3):** `stack.md`, `conventions.md`, `review-checklist.md`

**6-month mature (10–12):** + `decisions/0001-..md` … `00NN-..md`, `runbooks/{deploy,incident,rollback}.md`, `caveats.md`, `security.md`, `dependencies.md`, `quarterly-tech-review.md`, `kpis.md` (deploy frequency, MTTR, % PRs reviewed against checklist)

**Claude-native:** A `cto` skill bundle whose loaded prompt is `stack.md` + `conventions.md` + `caveats.md`. A `/review` slash command running `review-checklist.md` against staged changes. A `new-adr` skill that scaffolds an ADR from the Nygard template.

**Cross-references:** Pairs with CLO (CLO proposes experiments; CTO governs the stack). Writes guardrails for CEO's no-list. Hands runbooks to COO for cadence.

---

## COO

**Mandate.** Owns cadence, intake triage, and the weekly review — the rhythm that keeps a one-person company from drifting. The [Umbrex Fractional COO Playbook](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-operating-officer-playbook/) prescribes *"weekly exec stand-ups, monthly business reviews, and quarterly OKR cycles that replace ad-hoc firefighting."* [Kamyar Shah's 90-day COO model](https://kamyarshah.com/the-first-90-days-of-a-fractional-coo-what-changes-and-when/) frames Days 31–60 as producing *"a five to seven page diagnosis document outlining what's working, what isn't, and the two or three operational bets the company should make in the next 12 months."* The discipline is GTD-shaped — David Allen's [weekly review](https://www.asianefficiency.com/productivity/gtd-weekly-review/): *"Get Clear, Get Current, Get Creative,"* 60–90 minutes, *"where GTD lives or dies."*

**Knowledge it holds**
- Weekly/monthly/quarterly cadence and who chairs each.
- Inbox triage rules (GTD: process every inbox, assign folder/context/status).
- Linear-style cycle discipline: 2-week cycles, ruthless backlog pruning ([Linear Method](https://linear.app/method/introduction)).
- Lenny Rachitsky's sustainability lesson — one great post per week is the ceiling for a solo operator ([Lenny on cadence](https://www.lennysnewsletter.com/p/taking-the-week-off-a-newsletter)).
- Paul Jarvis's once-a-week Sunday Dispatches rhythm.

**Artifacts**
- `cadence.md` (the literal calendar: daily / weekly / monthly / quarterly)
- `weekly-review/2026-Wk-XX.md` (one file per week)
- `inbox.md` (the GTD inbox — every captured-but-unprocessed item)
- `triage-rules.md` (routing table — which CXO each intake type goes to; also a CKO artifact)
- `sops/` (standard operating procedures)
- `diagnosis.md` (the Day-60 five-to-seven-page assessment)

**Day-1 (3):** `cadence.md`, `inbox.md`, `weekly-review/template.md`

**6-month mature (10–12):** + `triage-rules.md`, `weekly-review/2026-Wk-01.md` … `Wk-26.md`, `monthly-business-review.md`, `quarterly-okr.md`, `diagnosis.md`, `sops/{onboard-client,ship-release,handle-incident}.md`, `kpis.md` (cycle-time, % of weeks reviewed, inbox-zero streak)

**Claude-native:** A `coo` skill that runs the weekly review — the [Mandalivia "Weekly Project Review with Claude Code" pattern](https://www.mandalivia.com/obsidian/weekly-project-review-with-claude-code-and-obsidian-cli/) demonstrates this. A `/weekly-review` slash command. A `triage` skill that routes inbox items to the right CXO folder.

**Cross-references:** Reads every CXO inbox; writes to CEO (escalations) and CKO (knowledge captured during review).

---

## CFO

**Mandate.** Owns pricing, cash, and runway. Per [Pilot's fractional CFO cost guide](https://pilot.com/blog/fractional-cfo-cost-guide), deliverables include *"monthly reporting, basic cash flow forecasting, and runway visibility."* [Burkland's service-package overview](https://burklandassociates.com/2026/03/17/what-startup-founders-should-expect-from-a-fractional-cfo-service-package/) and [CFO Advisors' burn-forecasting calculator](https://cfoadvisors.com/blog/cash-burn-forecasting-made-simple-interactive-fractional-cfo-pricing-calculator-for-12-month-runway) put the work in concrete artifacts: 12-month runway model, burn dashboard, pricing memo. Value-based pricing for consulting sits here — [Brennan Dunn's Double Your Freelancing Rate](https://doubleyourfreelancing.com/rate/), [Jonathan Stark on paid roadmapping](https://jonathanstark.com/tfr), and [patio11 on charging more](https://www.kalzumeus.com/greatest-hits/) are canonical references.

**Knowledge it holds**
- Pricing policy and rate card (Stark/Dunn value-pricing; patio11's "minimum engagement is a week" — [Freelance Transformation interview](https://freelancetransformation.com/blog/increase-your-consulting-rates-with-patrick-mckenzie)).
- Runway model assumptions; the ROI rule that a fractional CFO is sold on "3–10x the retainer" ([Burkland](https://burklandassociates.com/2026/03/17/what-startup-founders-should-expect-from-a-fractional-cfo-service-package/)).
- Stripe Atlas-style founding-document hygiene if incorporating ([Stripe Atlas](https://stripe.com/au/guides/atlas/creating-your-founding-documents)).

**Artifacts**
- `pricing.md` (rate card, packages, the "I do not bill hourly under $X" rule)
- `runway.md` (months of cash, burn, scenarios)
- `pnl-monthly.md` or `pnl/2026-MM.md`
- `forecast.md` (12-month, updated quarterly)
- `policies/{expense,refund}-policy.md`

**Day-1 (3):** `pricing.md`, `runway.md`, `pnl-monthly.md`

**6-month mature (8–10):** + `forecast.md`, `pnl/2026-01..06.md`, `policies/{expense,refund}-policy.md`, `tax.md`, `vendors.md`, `kpis.md` (MRR, gross margin, runway months, AR aged), `quarterly-review.md`

**Claude-native:** A `cfo` skill with `pricing.md` + `runway.md` loaded — answers *"should I take this engagement at $X?"* against the rate card. A `/quote` slash command that drafts a proposal at the right rate.

**Cross-references:** Pairs tightly with CRO (price ↔ pipeline). Feeds CEO's capital allocation. Writes constraints to CLO (experiment kill-criteria budget).

---

## CRO

**Mandate.** Owns pipeline and the POC → pilot → retainer conversion ladder. The [Umbrex CRO/CSO Playbook](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-revenue-sales-officer-playbook/) lays out a concrete timeline: *"Charter and KPI slate signed by Day 5, diagnostic flash report and quick win delivered by Day 15, Revenue Blueprint, comp plan, and forecast methodology approved by Day 45, enablement assets, deal-desk policy, and pipeline dashboards live by Day 90."* Pipeline coverage target: *"By Day 30, pipeline coverage should reach 2.5× quota."* [Dock's Sales POC Playbook](https://www.dock.us/library/sales-proof-of-concepts) gives the POC template canon. For solo operators, the *"Stay-Scale-Sunset"* memo at the end of each engagement is the artifact that creates retainer conversion.

**Knowledge it holds**
- Pipeline definition and 2.5× coverage rule.
- POC scope template, pilot success criteria, retainer conversion criteria ([Dock](https://www.dock.us/library/sales-proof-of-concepts); [Consulting Success SOW template](https://www.consultingsuccess.com/consulting-statement-of-work-template)).
- The "Stay-Scale-Sunset" decision frame from Umbrex.
- Justin Welsh's "1,000 true fans + one systematized solution" funnel discipline.

**Artifacts**
- `pipeline.md` (named opportunities, stage, $, next step, owner)
- `templates/{poc-scope,pilot-sow,retainer-sow}.md`
- `dealdesk-policy.md` (what discounts are allowed)
- `case-studies/` (patio11's "aggressively soliciting case studies" — [Beancount.io on patio11](https://beancount.io/blog/2026/01/26/patrick-mckenzie-patio11-charge-more-software-business))
- `stay-scale-sunset/{client}.md`

**Day-1 (3):** `pipeline.md`, `templates/poc-scope.md`, `dealdesk-policy.md`

**6-month mature (10–12):** + `templates/{pilot-sow,retainer-sow}.md`, `case-studies/{client}.md` (×N), `stay-scale-sunset/{client}.md` (×N), `forecast.md`, `kpis.md` (coverage, win-rate, POC→pilot %, pilot→retainer %, ACV), `weekly-revops-sync.md`, `revenue-blueprint.md` (Umbrex Day-45 deliverable)

**Claude-native:** A `cro` skill that reads `pipeline.md` and produces the weekly RevOps sync. A `/quote` and `/poc` slash command pair.

**Cross-references:** Pairs with CFO (price/SOW). Feeds CMO (case studies → content). Reports to CEO on coverage.

---

## CMO

**Mandate.** Owns brand voice and distribution. The [Umbrex Fractional CMO Playbook](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-marketing-officer-playbook/) lists deliverables as *"market intelligence and positioning, go-to-market architecture, demand-generation engine, brand governance (visual and verbal identity, tone guidelines), MarTech and data stack rationalization."* For a solo operator with LinkedIn as the distribution surface, [Justin Welsh's LinkedIn Operating System](https://learn.justinwelsh.me/linkedin) and [Content Operating System](https://learn.justinwelsh.me/content) are canonical playbooks — one niche, one painful problem, one systematized solution, daily content cadence.

**Knowledge it holds**
- Voice & tone playbook — *"core traits (three to five personality markers), do's and don'ts, channel applications"* ([Brand Vision playbook](https://www.brandvm.com/post/brand-voice-playbook); [Mailchimp Voice and Tone](https://styleguide.mailchimp.com/voice-and-tone/)).
- Distribution channels and cadence (Welsh's LinkedIn OS).
- Launch playbook (Lenny's "one great post a week" sustainability rule).
- Audit rule: *"tone playbook should be a living document team members contribute to with real-life examples"* ([Medium](https://medium.com/design-bootcamp/how-to-create-a-voice-tone-playbook-from-scratch-e100b082797b)).

**Artifacts**
- `voice.md` (3–5 personality markers, do/don't pairs)
- `positioning.md` (one niche, one problem, one solution)
- `channels.md` (where the brand shows up, at what cadence)
- `launches/{date}-{topic}.md`
- `content-calendar.md`
- `swipe/` (saved examples of voice that worked — the operator's own posts)

**Day-1 (3):** `voice.md`, `positioning.md`, `channels.md`

**6-month mature (10–12):** + `content-calendar.md`, `launches/2026-XX-yy.md` (×N), `swipe/{winners,losers}.md`, `do-not-say.md` (anti-vocabulary — Linear-style *"ruthless about cutting ambiguity"*, [Linear Method](https://linear.app/method/introduction)), `templates/{linkedin-post,launch-thread}.md`, `kpis.md` (followers, post→profile-click, profile→DM, DM→pipeline)

**Claude-native:** A `cmo` skill whose loaded prompt is `voice.md` + `do-not-say.md` — every drafted post goes through it. A `/post` slash command that drafts to-voice and refuses off-voice phrasing.

**Cross-references:** Reads case studies from CRO. Receives "share this" requests from CLO (experiment writeups) and CTO (technical posts). Brand voice is enforced on outputs from every other seat.

---

## CLO (Chief Lab Officer)

**Mandate.** Owns experiments, bets, and kill criteria. Aligns with [Strategyzer's "To Kill or Persevere" framework](https://www.strategyzer.com/library/to-kill-or-persevere-how-do-you-score-innovation-projects), [Reforge's growth experiment management system](https://www.reforge.com/blog/growth-experiment-management-system), and the [Basecamp Shape Up betting table](https://basecamp.com/shapeup/2.2-chapter-08): a small group *"decide what to do in the next cycle"* by reviewing pitches. Daniel Vassallo's [small-bets portfolio thinking](https://dvassallo.com/) is the solo-operator analog — *"try many different things, not committing to any unless there is a signal that it's worth doubling down."*

**Knowledge it holds**
- Experiment template: hypothesis, methodology, success metrics, timeline, kill criteria ([Reforge template via PLGeek](https://www.reforge.com/artifacts/growth-experiment-template-from-plgeek)).
- "Pretotype / kill experiment" pattern — *"will users buy it?"* before building ([Medium: The Kill Experiment](https://medium.com/the-experimental-approach/the-kill-experiment-479dd07ec9e0)).
- Shape Up 6-week cycle + cool-down ([Basecamp Shape Up Glossary](https://basecamp.com/shapeup/4.5-appendix-06)).
- *"You can kill an idea, but you can't kill a customer problem"* ([IDEO on innovation labs](https://www.ideo.com/journal/successful-innovation-labs-have-these-four-things-in-common); [HBR on why innovation labs fail](https://hbr.org/2019/07/why-innovation-labs-fail-and-how-to-ensure-yours-doesnt)).

**Artifacts**
- `bets.md` (active bets and their stage)
- `experiments/{date}-{slug}.md` (one file per experiment — hypothesis, kill criteria, result)
- `kill-criteria.md` (standing rules — if any experiment hits these, it dies)
- `pitches/` (Shape Up-style pitches before they become bets)
- `graveyard.md` (everything killed, with what was learned — this feeds CKO)

**Day-1 (3):** `bets.md`, `experiments/template.md`, `kill-criteria.md`

**6-month mature (10–12):** + `experiments/2026-XX-yy-{slug}.md` (×N), `pitches/2026-XX-yy-{slug}.md` (×N), `graveyard.md`, `cooldown.md` (what got done in last cool-down per Shape Up), `cycle-review.md`, `scoring-rubric.md` (Strategyzer-style desirability/feasibility/viability), `kpis.md` (experiments shipped, kill rate, signal-to-noise, % of bets that became products)

**Claude-native:** A `clo` skill that scaffolds an experiment from the template and *refuses* to scaffold without a kill criterion (enforces Strategyzer rule). A `/bet` and `/kill` slash command pair.

**Cross-references:** Reads CFO budget. Writes to CTO (any experiment that ships becomes a stack/conventions issue). Writes to CKO (graveyard learnings get promoted).

---

## CKO

**Mandate.** Knowledge librarian, routing-table owner, audit driver. Per [Serious Insights on the CKO role](https://www.seriousinsights.net/what-is-the-chief-knowledge-officer-job/) and [Wikipedia](https://en.wikipedia.org/wiki/Chief_knowledge_officer), the CKO is *"responsible for managing the processes, practices, and technical specifications for the capture, retention, and use/reuse of an organization's knowledge."* [Knowledge Management Depot](https://knowledgemanagementdepot.com/2009/06/12/knowledge-management-km-roles-and-responsibilities/) notes the knowledge audit is the CKO's diagnostic instrument — *"a review of the firm's knowledge assets and associated knowledge management systems."* For a Claude-native operator, this seat owns the routing table (which intent goes where) and the audit cadence (*"which knowledge is stale?"*).

**Knowledge it holds**
- Taxonomy + ontology — taxonomy is hierarchy, ontology adds relationships ([TopQuadrant](https://www.topquadrant.com/product/taxonomy-and-ontology-management/); [Enterprise Knowledge on taxonomy + IA](https://enterprise-knowledge.com/taxonomy-and-information-architecture-for-the-semantic-layer/)).
- Knowledge-audit cadence.
- Cross-CXO promotion rules — what gets promoted from CLO graveyard to CTO conventions, from CRO case studies to CMO swipe file.
- The bar-portfolio repo's existing `knowledge/` + `recipes/` + `prompts/` + `skills/` separation is already a CKO artifact in early form.

**Artifacts**
- `routing-table.md` (intent → which CXO → which file)
- `taxonomy.md` (controlled vocabulary — Linear's *"if 'issue' means a task, it's only that"*)
- `audit-log/2026-Qx.md` (quarterly knowledge audits)
- `promotion-rules.md` (when CLO graveyard becomes CTO convention; when CRO case study becomes CMO content)
- `index.md` (human-readable map of all CXO folders)

**Day-1 (3):** `routing-table.md`, `taxonomy.md`, `index.md`

**6-month mature (10–12):** + `audit-log/2026-Q1.md`, `audit-log/2026-Q2.md`, `promotion-rules.md`, `stale.md` (files flagged awaiting CEO call), `glossary.md`, `naming-conventions.md`, `cross-references.md` (directed graph of who reads/writes whom), `kpis.md` (median doc age, % docs touched in last quarter, broken-link count)

**Claude-native:** A `cko` skill that runs the audit (`/audit` walking every CXO folder). A `routing` skill that the COO's triage uses — given an intake, returns the destination file.

**Cross-references:** Reads from every CXO. Writes to every CXO (audit findings). Pairs with COO (triage routing).

---

## CPO (HR for agents)

**Mandate.** HR for the agent roster itself: owns the catalog of subagents/skills, their definitions, lifecycle (provision → review → retire), and ownership. Documented role: [Writer's "AI Agent Owner"](https://writer.com/blog/ai-agent-owner/), [Saviynt's AI Agent Lifecycle Management](https://saviynt.com/blog/ai-agent-lifecycle-management), [Prefactor on agent lifecycle](https://prefactor.tech/learn/managing-agent-lifecycle), [OneReach's six-stage Agent Lifecycle Management](https://onereach.ai/blog/agent-lifecycle-management-stages-governance-roi/). Per Saviynt: *"Agents can move through Active, Approved, Pending, Review, Retired, and Suspended states ... every transition recorded for audit."* Per Madrona's [Zapier "more AI agents than employees"](https://www.madrona.com/zapier-has-more-ai-agents-than-employees-heres-how-that-happened/) and [HR Executive on CHROs treating agents like CEOs would](https://hrexecutive.com/how-chros-can-approach-ai-agents-like-a-ceo/), this seat is no longer hypothetical.

**Knowledge it holds**
- Agent/skill definition format — Claude Code subagents are *"named, isolated Claude instance[s] with [their] own system prompt, [their] own context window, [their] own tool access list"* ([Claude Code subagents docs](https://code.claude.com/docs/en/sub-agents); [Claude blog on Skills](https://claude.com/blog/skills-explained)).
- Multi-agent coordinator/roster pattern ([Claude Managed Agents](https://platform.claude.com/docs/en/managed-agents/multi-agent)).
- Lifecycle states + retirement triggers (Saviynt, OneReach).
- *"Individual contributors are effectively managers managing AI agents by defining work, setting parameters, providing iterative feedback"* ([HR Executive](https://hrexecutive.com/how-chros-can-approach-ai-agents-like-a-ceo/)).

**Artifacts**
- `roster.md` (catalog: name, mandate, status (Active/Review/Retired), owner-CXO, last reviewed)
- `agents/{name}.md` (one file per skill/subagent — actual Claude definition with YAML frontmatter)
- `skills/{name}/SKILL.md` (actual Claude Skills)
- `permissions.md` (which agent can run which tools — maps to `.claude/settings.json`)
- `review-schedule.md` (quarterly "is this agent still pulling its weight?" rubric)
- `retired/` (deprecated agents, kept for audit)

**Day-1 (3):** `roster.md`, `agents/ceo.md`, `permissions.md`

**6-month mature (12+ files for 9 seats):** + `agents/{cto,coo,cfo,cro,cmo,clo,cko,cpo}.md`, `review-schedule.md`, `retired/{name}.md`, `hiring-rubric.md` (when does a new agent earn a slot?), `evals/{name}.md` (per-agent eval prompts), `kpis.md` (agent utilization, time-since-last-review, % of agents with an eval)

**Claude-native:** The folder *is* the Claude-native artifact — `agents/` and `skills/` are literal directories the Claude harness loads. A `/hire` slash command that scaffolds a new agent + adds to `roster.md`. A `/retire` slash command that moves an agent into `retired/`, revoking permissions per Saviynt's retirement workflow.

**Cross-references:** Reads from every CXO (each seat's mandate becomes a subagent system prompt). Writes to CEO (org-chart changes). Pairs with CKO (each agent's knowledge bundle lives in a CKO-audited folder).

---

## Cross-cutting patterns

### What's COMMON across every CXO folder

Five files repeat with near-perfect regularity across the playbooks surveyed. These should be the boilerplate the operator scaffolds for every new seat:

1. **`CHARTER.md`** — mandate, decision rights, explicit non-goals. The Umbrex two-page charter shrunk to one file.
2. **`KPIS.md`** — the 3–5 numbers this seat moves. Every Umbrex playbook page lists explicit KPIs (pipeline coverage ≥ 2.5×, forecast variance ±10%, etc.).
3. **`INBOX.md`** — captured-but-unprocessed items, per GTD. COO's inbox is the master; each CXO has its own subordinate inbox.
4. **`README.md`** — human-readable index of what this folder contains.
5. **`DECISIONS/`** — dated decision log, ADR-style. Originally a CTO pattern but applicable to every seat.

A sixth optional convention worth standardizing: **`NO.md`** — what this seat refuses to do. Modeled on the CEO's `no-list.md` but scoped (CMO's `do-not-say.md`, CTO's anti-stack list, CRO's deal-desk forbidden discounts).

### What's UNIQUE per CXO (the signature artifact)

- CEO → `no-list.md` and `priorities.md`
- CTO → `decisions/` ADR series and `caveats.md`
- COO → `weekly-review/` folder and `cadence.md`
- CFO → `pricing.md` and `runway.md`
- CRO → `pipeline.md` and `stay-scale-sunset/`
- CMO → `voice.md` and `swipe/`
- CLO → `experiments/` and `graveyard.md`
- CKO → `routing-table.md` and `audit-log/`
- CPO → `roster.md` and `agents/` (the actual subagent definitions)

### Which CXOs naturally pair

- **CFO + CRO** — Stay-Scale-Sunset decision lives at price ↔ pipeline boundary. Pricing changes invalidate forecast; pipeline performance forces pricing reviews.
- **CTO + CLO** — CLO proposes experiments; CTO governs the stack they ship to. Shape Up's pitch → bet → cool-down puts this conversation at the betting table.
- **CMO + CRO** — Case studies (CRO) become content (CMO); content drives DMs into pipeline (CRO). Welsh's playbook treats them as a single funnel.
- **CKO + COO** — Triage routing (COO) and routing-table maintenance (CKO) are the same artifact from two sides. CKO's audit feeds COO's weekly review.
- **CPO + CEO** — CPO writes subagent prompts that *are* the CEO's charter for each seat. Hiring/retiring an agent is an org-chart change the CEO approves.

### Org chart as directed graph

```
                    CEO (charter, priorities, no)
                   /  |   \         \
                 CFO CRO  CMO        CPO (owns roster of all seats including itself)
                  \ / \   /  \        |
                   X   X     CLO      |
                  / \ / \   /  \      |
               CTO   X   CKO   |      |
                \   / \  /     |      |
                 COO    routing-table  |
                  \    /              /
                   weekly-review <---/
```

CEO sits at top with charter authority. CPO is the only seat that writes back into the CEO line (agent-roster changes are org changes). CKO is connective tissue every other seat reads from. COO's weekly review is the convergence point — every folder's `INBOX.md` gets drained and every `KPIS.md` gets read once a week.

---

## Open questions

1. **One repo or one repo per CXO?** GitLab's public handbook is a giant monorepo with department subdirectories; a Claude-native operator could instead make each CXO a separately versioned skill bundle (`skills/cmo/`, `skills/cto/`). The choice determines whether `/audit` is one walk or nine.
2. **What's the canonical weekly-review trigger?** Hard cron (Pieter Levels-style), Claude `SessionStart` hook, or Sunday human ritual (Paul Jarvis)? Mixed-mode is possible but the *primary* trigger needs to be one.
3. **Does CEO get veto over CPO, or vice versa?** Per [Writer on AI Agent Owners](https://writer.com/blog/ai-agent-owner/), agent retirement should require an *"approved request, validated by the accountable owner."* If CPO retires the CEO subagent, who approves? Need an explicit successor/escalation rule.
4. **How does kill-criteria authority split between CLO and CFO?** Strategyzer's framework: desirability/feasibility/viability. CLO owns first two, CFO owns viability. If they disagree, does CEO break the tie at the betting table, or is there a standing rule?
5. **What lives in `caveats.md` vs `no-list.md`?** The repo already has `knowledge/99-caveats.md` (technical "do not break") and CEO will own `no-list.md` (strategic "do not pursue"). These overlap when a strategic no creates a technical caveat. Need a naming/scope rule before both files drift.

---

## Sources (consolidated)

**Umbrex Fractional Executive Playbook:** [Index](https://umbrex.com/resources/fractional-executive-playbook/) · [CEO](https://umbrex.com/resources/fractional-executive-playbook/fractional-ceo-interim-ceo-playbook/) · [CTO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-technology-officer-cto-playbook/) · [COO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-operating-officer-playbook/) · [CFO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-financial-officer-playbook/) · [CRO/CSO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-revenue-sales-officer-playbook/) · [CMO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-marketing-officer-playbook/) · [CSO-Strategy](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-strategy-officer-playbook/) · [CCO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-customer-officer-cco-playbook/) · [CPO-Product](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-product-officer-playbook/) · [CIO](https://umbrex.com/resources/fractional-executive-playbook/fractional-chief-information-officer-playbook/)

**GitLab Handbook:** [CEO](https://handbook.gitlab.com/handbook/ceo/) · [CEO job family](https://handbook.gitlab.com/job-families/chief-executive-officer/) · [Engineering](https://handbook.gitlab.com/handbook/engineering/) · [Code Review Guidelines](https://handbook.gitlab.com/handbook/engineering/workflow/code-review/) · [Reviewer Values](https://handbook.gitlab.com/handbook/engineering/workflow/reviewer-values/) · [DRI](https://handbook.gitlab.com/handbook/people-group/directly-responsible-individuals/)

**Public company OSes:** [Stripe Operating Principles](https://stripe.com/jobs/culture) · [Slab on Stripe writing culture](https://slab.com/blog/stripe-writing-culture/) · [Stripe Atlas](https://stripe.com/au/guides/atlas/creating-your-founding-documents) · [Linear Method](https://linear.app/method/introduction) · [Basecamp Shape Up Betting Table](https://basecamp.com/shapeup/2.2-chapter-08) · [Shape Up Glossary](https://basecamp.com/shapeup/4.5-appendix-06)

**Fractional CFO:** [Pilot cost guide](https://pilot.com/blog/fractional-cfo-cost-guide) · [Burkland service packages](https://burklandassociates.com/2026/03/17/what-startup-founders-should-expect-from-a-fractional-cfo-service-package/) · [CFO Advisors burn forecasting](https://cfoadvisors.com/blog/cash-burn-forecasting-made-simple-interactive-fractional-cfo-pricing-calculator-for-12-month-runway)

**Fractional CTO + ADR:** [CTO Academy playbook](https://cto.academy/fractional-cto-playbook/) · [Code With Seb fractional CTO](https://www.codewithseb.com/blog/fractional-cto-playbook-startup-guide) · [Fractional CTO code review guide](https://fractionalcto.es/en/guide-to-do-code-reviews-in-your-team/) · [Martin Fowler ADR](https://martinfowler.com/bliki/ArchitectureDecisionRecord.html) · [adr.github.io](https://adr.github.io/) · [joelparkerhenderson/architecture-decision-record](https://github.com/joelparkerhenderson/architecture-decision-record) · [Microsoft Azure WAF ADR](https://learn.microsoft.com/en-us/azure/well-architected/architect-role/architecture-decision-record) · [Microsoft Engineering Fundamentals ADR template](https://microsoft.github.io/code-with-engineering-playbook/design/design-reviews/decision-log/doc/adr/0001-record-architecture-decisions/)

**Fractional COO + GTD:** [Kamyar Shah 90 days](https://kamyarshah.com/the-first-90-days-of-a-fractional-coo-what-changes-and-when/) · [Asian Efficiency GTD Weekly Review](https://www.asianefficiency.com/productivity/gtd-weekly-review/) · [Mandalivia Weekly Project Review with Claude Code](https://www.mandalivia.com/obsidian/weekly-project-review-with-claude-code-and-obsidian-cli/)

**Fractional CRO + POC/SOW:** [Dock Sales POC Playbook](https://www.dock.us/library/sales-proof-of-concepts) · [Consulting Success SOW template](https://www.consultingsuccess.com/consulting-statement-of-work-template) · [Science to Sales Fractional CRO](https://sciencetosales.com/whitepapers/fractional-cro-playbook/)

**Fractional CMO + brand voice:** [Brand Vision playbook](https://www.brandvm.com/post/brand-voice-playbook) · [Mailchimp Voice and Tone](https://styleguide.mailchimp.com/voice-and-tone/) · [Medium voice/tone playbook](https://medium.com/design-bootcamp/how-to-create-a-voice-tone-playbook-from-scratch-e100b082797b)

**Lab / experiments:** [Reforge growth experiment template](https://www.reforge.com/artifacts/growth-experiment-template-from-plgeek) · [Reforge experiment management system](https://www.reforge.com/blog/growth-experiment-management-system) · [Strategyzer To Kill or Persevere](https://www.strategyzer.com/library/to-kill-or-persevere-how-do-you-score-innovation-projects) · [Medium The Kill Experiment](https://medium.com/the-experimental-approach/the-kill-experiment-479dd07ec9e0) · [IDEO innovation labs](https://www.ideo.com/journal/successful-innovation-labs-have-these-four-things-in-common) · [HBR why innovation labs fail](https://hbr.org/2019/07/why-innovation-labs-fail-and-how-to-ensure-yours-doesnt)

**CKO + knowledge architecture:** [Wikipedia CKO](https://en.wikipedia.org/wiki/Chief_knowledge_officer) · [Serious Insights on CKO](https://www.seriousinsights.net/what-is-the-chief-knowledge-officer-job/) · [Knowledge Management Depot](https://knowledgemanagementdepot.com/2009/06/12/knowledge-management-km-roles-and-responsibilities/) · [TopQuadrant taxonomy/ontology](https://www.topquadrant.com/product/taxonomy-and-ontology-management/) · [Enterprise Knowledge IA](https://enterprise-knowledge.com/taxonomy-and-information-architecture-for-the-semantic-layer/)

**CPO-for-agents:** [Writer AI Agent Owner](https://writer.com/blog/ai-agent-owner/) · [Madrona Zapier more agents than employees](https://www.madrona.com/zapier-has-more-ai-agents-than-employees-heres-how-that-happened/) · [HR Executive CHROs approach AI agents like a CEO](https://hrexecutive.com/how-chros-can-approach-ai-agents-like-a-ceo/) · [Saviynt AI agent lifecycle](https://saviynt.com/blog/ai-agent-lifecycle-management) · [Saviynt every AI agent needs identity](https://saviynt.com/blog/lifecycle-management-for-ai-agents) · [Prefactor managing agent lifecycle](https://prefactor.tech/learn/managing-agent-lifecycle) · [OneReach Agent Lifecycle Management](https://onereach.ai/blog/agent-lifecycle-management-stages-governance-roi/) · [Chief Agentic Officer](https://chiefagenticofficer.com/)

**Claude-native:** [Claude Code subagents](https://code.claude.com/docs/en/sub-agents) · [Claude Code Agent Teams](https://code.claude.com/docs/en/agent-teams) · [Claude Managed Agents multi-agent](https://platform.claude.com/docs/en/managed-agents/multi-agent) · [Claude Skills explained](https://claude.com/blog/skills-explained) · [alexop.dev Claude Code customization](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)

**Solo-operator OSes:** [Pieter Levels how I build MVPs](https://levels.io/how-i-build-my-minimum-viable-products/) · [Justin Welsh LinkedIn OS](https://learn.justinwelsh.me/linkedin) · [Justin Welsh Content OS](https://learn.justinwelsh.me/content) · [Paul Jarvis Company of One press](https://ofone.co/press) · [Daniel Vassallo](https://dvassallo.com/) · [Lenny on cadence](https://www.lennysnewsletter.com/p/taking-the-week-off-a-newsletter) · [Patio11 Kalzumeus](https://www.kalzumeus.com/greatest-hits/) · [Beancount on patio11](https://beancount.io/blog/2026/01/26/patrick-mckenzie-patio11-charge-more-software-business) · [Freelance Transformation patio11 interview](https://freelancetransformation.com/blog/increase-your-consulting-rates-with-patrick-mckenzie) · [Brennan Dunn — Double Your Freelancing Rate](https://doubleyourfreelancing.com/rate/) · [Jonathan Stark — TFR](https://jonathanstark.com/tfr)
