# Company Brain Patterns — Org-Scale Patterns Translated to Solo

Companion to `brain-deep-dive.md`. That doc focused on personal/individual brain concepts. This one covers **company-scale knowledge bases** — handbooks, wikis, SSOT discipline, enterprise AI brains — and the subset that translates to a solo operator modeling his business as a company with CXO roles.

> Note on naming: the operator dislikes "brain" as a term. Used here only when quoting how others describe their systems. The Workshop absorbs patterns without inheriting the framing.

---

## 1. The category landscape

The "company brain" market splits into three overlapping categories with blurry lines because every vendor now claims AI: **enterprise search** (a search box over all your tools), **wiki/KB** (where you write truth down), and **agent platforms** (an LLM reasoning over both). Each bets on a different underlying primitive.

**Glean** is the gold-standard enterprise search play. Indexes Slack, Drive, Notion, GitHub, Jira, Confluence; respects per-source ACLs; layers a chat assistant on top. Pricing opaque-by-design — reported ~$45–50/user/month with 100-seat minimum, floor near $60K/year, full TCO $350K–$480K with integration and tuning ([gosearch.ai pricing analysis](https://www.gosearch.ai/blog/glean-pricing-explained/), [workativ TCO](https://workativ.com/ai-agent/blog/glean-pricing)). G2 sentiment positive on UX, caustic on price transparency and 7–12% renewal escalators ([G2](https://www.g2.com/products/glean-technologies-glean/reviews)).

**Coda Brain** is effectively dead as a brand: Grammarly acquired Coda Dec 2024, rebranded to Superhuman Oct 2025, Coda Brain capabilities folded into Superhuman Go ([Dust comparison](https://dust.tt/blog/notion-ai-alternatives-ai-workspace-automation)). **Notion AI** added Agents (Sept 2025) and Custom Agents on schedules (Feb 2026), positioned around document/database generation across connected tools ([Notion vs Coda 2026](https://agentglitch.io/posts/notion-ai-vs-coda-ai-comparison/)). **Atlassian Rovo** is bundled into Standard/Premium/Enterprise at ~$10.44/user/mo — roughly half Notion Business and the cheapest "real" enterprise option if you already live in Confluence/Jira.

**Wiki tier** sorts cleanly by price and audience: **Tettra** ($4/user/mo, free <10 users) for sub-20-person Slack-first teams; **Slab** $6.67 with real-time collaboration as differentiator ([Tettra vs Guru](https://tettra.com/article/tettra-vs-guru/), [Slab vs Tettra](https://www.nuclino.com/solutions/slab-vs-tettra)); **Guru** is the enterprise-priced option with SOC 2 and verification workflows; **Outline** and **GitBook** trade on docs-as-markdown aesthetics (GitBook AI explicitly limited to GitBook spaces — stated weakness).

**Mem.ai** (now Mem 2.0) bets on zero-organization AI-native notes at $15/mo — strong temporal context, polarizing UX, scored 7.9/10 ([productivitystack review](https://productivitystack.io/guides/mem-ai-guide/)). **Dust.tt** and **Onyx** are the agent-platform plays: Dust is closed-source, connector-rich, SOC 2 Type II / HIPAA / GDPR ([Dust](https://dust.tt/home/solutions/dust-platform)); Onyx is open-source, self-hostable, agentic RAG ([Onyx vs Dust](https://onyx.app/alternatives/dust)). **Stack AI** is the no-code agent builder at enterprise tier — closer to workflow platform than KB.

**The pattern:** every tool either indexes content you wrote elsewhere (Glean, Dust, Onyx) or asks you to write inside their walls (Notion, Tettra, GitBook). None solve the rot problem.

---

## 2. The handbook-first pattern

GitLab is canonical and most-imitated. As of 2019: 605,000 words across 550 pages, ~50 hours of reading; engineering led at 138,000 words, marketing 115,000 ([GitLab handbook by numbers](https://about.gitlab.com/blog/2019/04/24/the-gitlab-handbook-by-numbers/)). Now 2,000+ printed pages and the operational layer of **TeamOps** — credited with scaling them from startup to public company ([TeamOps](https://handbook.gitlab.com/handbook/teamops/)). Stated rationale: async-first inclusion (underrepresented groups, neurodiverse individuals, global timezones); "shared reality" via written artifacts; **the handbook overrides Slack, email, and meetings when they conflict** ([Shared Reality](https://handbook.gitlab.com/teamops/shared-reality/)). Employees explicitly told to "look it up in the handbook" before asking colleagues ([McKinsey interview with Sid Sijbrandij](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/all-remote-from-day-one-how-gitlab-thrives)).

**Other handbooks worth studying:**

- **PostHog** — public since 2020, open-source on GitHub, covers mission/values/roadmap/engineering/content; anyone can edit including the handbook itself ([PostHog handbook](https://posthog.com/handbook), [GitHub](https://github.com/PostHog/posthog.com)).
- **Basecamp / 37signals** — handbook on GitHub so changes are diffable ([basecamp/handbook](https://github.com/basecamp/handbook)); paired with Shape Up (six-week cycles, appetites, hill charts) ([Shape Up](https://basecamp.com/shapeup)).
- **Sourcegraph** — handbook.sourcegraph.com, openly markdown ([sourcegraph/handbook](https://github.com/sourcegraph/handbook)).
- **Cal.com** — "the most public private company," handbook explicitly open ([cal.com/open](https://cal.com/open)).
- **Doist** — GitHub-hosted handbook inspired by GitLab; 95% of team communication is async ([Doist how-we-work](https://doist.com/how-we-work/how-doist-works-remote)).

**Critics** are quieter but real. HN thread on Confluence: "the only use case is when you want to hide information but credibly claim it's documented" ([HN](https://news.ycombinator.com/item?id=33709093)). The async-first / meeting-first debate is mostly settled in remote-native circles — Stripe pairs structured narrative memos with in-person reading sessions ([Pragmatic Engineer on Stripe](https://newsletter.pragmaticengineer.com/p/stripe), [Slab on Stripe writing culture](https://slab.com/blog/stripe-writing-culture/)). The pushback is rarely "don't write things down" — it's "writing without enforcement is theatre."

---

## 3. Departments-as-folders / org-chart-as-information-architecture

Dominant pattern: by-department mirroring the org chart. GitLab's top-level handbook splits into **Engineering, Marketing, Sales, Finance, Legal, People Group, Security** — a literal CXO-to-folder mapping. Structure tracked headcount, not importance — engineering and marketing got the bulk because they were biggest. PostHog uses the same shape.

**The PARA alternative** (Tiago Forte's Building a Second Brain) splits knowledge into **P**rojects (time-bound), **A**reas (ongoing responsibility), **R**esources (reference), **A**rchive (cold storage). Forte's "PARA for Teams" argues the Areas section *is* your department/CXO map ([Forte Labs: PARA for Teams](https://fortelabs.com/blog/para-for-teams/), [team PARA writeup](https://blog.dclg.net/organizing-your-teams-knowledge-with-para)). Advantage over org-chart-as-IA: **Projects float independently** — a launch isn't trapped in Marketing or Engineering; it's cross-cutting.

**Role + lifecycle stage** alternative organizes by *audience and time*: "new hire week 1," "manager prep for promo cycle," "on-call rotation." Common in ITIL-style ops and SRE runbooks; how Stripe structures onboarding artifacts ([First Round podcast with Brie Wolfson](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/)).

**Anti-patterns** are well-catalogued. Atlassian's own guidance warns the functional model "can create silos and slow cross-team collaboration" ([Atlassian on org charts](https://www.atlassian.com/work-management/project-management/organizational-chart)). Confluence-watchers note department spaces routinely **duplicate cross-cutting topics** — onboarding lives partially in HR, partially in Engineering, partially in Security, none canonical ([k15t Confluence pitfalls](https://www.k15t.com/blog/2014/09/seven-major-pitfalls-to-avoid-when-using-atlassian-confluence-for-collaboration)).

**Hybrid pattern most public handbooks converge on:** departments as top folders, PARA-style Projects/Areas inside each department, flat top-level "Company" namespace for cross-cutting policy.

---

## 4. Single Source of Truth — the deep dive

SSOT means every fact is *mastered* in exactly one place and every other reference points back ([Wikipedia](https://en.wikipedia.org/wiki/Single_source_of_truth)). In docs practice this becomes the **canonical doc pattern**: one URL is "the" page; everything else is a link or deprecated stub ([Docsie on source of truth](https://www.docsie.io/blog/glossary/source-of-truth/)).

**Enforcement in mature orgs:**

- **CODEOWNERS-style ownership** — every doc has a named owner responsible for review and freshness.
- **Docs-in-source-control** — *Software Engineering at Google* Ch. 10: moving docs into source tree gave them "their own owners, canonical locations within the source tree, and processes for identifying bugs and fixing them" ([abseil.io SWE Book](https://abseil.io/resources/swe-book/html/ch10.html)).
- **Canonical/go links** — Google's `go/` short-links promote a single URL to canonical status; `go/onboarding` is *the* onboarding doc.
- **Deprecation rituals** — Canonical (the company) describes docs as "an engineering practice rather than an engineering task" with formal review like code ([Canonical](https://canonical.com/documentation)).

**Failure mode: multiple sources of half-truth** — McKinsey research has employees spending 20–28% of their workweek searching across disconnected systems ([agilityportal](https://agilityportal.io/blog/single-source-of-truth-founders-lessons)). Once people find wrong info twice, they stop trusting the wiki and revert to Slack-asking.

**SSOT changes when an LLM is also a reader.** Two shifts: (1) canonical doc must be machine-parseable — markdown over rich text, headings over bold, structured frontmatter over prose preamble; (2) **contradictions become actively harmful** because the LLM retrieves both and either hallucinates a synthesis or picks wrong. The Karpathy LLM-wiki pattern goes further — *the LLM maintains the wiki*, so SSOT enforcement is delegated: agent rewrites canonical pages when new sources arrive; raw sources are immutable ([MindStudio on Karpathy's pattern](https://www.mindstudio.ai/blog/karpathy-llm-wiki-knowledge-base-pattern), [Falconer enterprise version](https://falconer.com/guides/enterprise-llm-wiki-karpathy)).

---

## 5. Knowledge succession and bus factor

"Bus factor" = the number of people who could be hit by a bus before the project collapses. Engineering-knowledge analyses frame it as "the risk of critical knowledge being held by too few people," with dark areas of the codebase "escaping regular review and testing cycles, making them prime candidates for undetected bugs, tribal knowledge, and burnout risk" ([ContributorIQ](https://contributoriq.com/blog/engineering-knowledge-transfer-best-practices), [Codenteam](https://codenteam.com/the-bus-factor-why-your-teams-success-shouldnt-depend-on-a-single-person/)).

**Tribal knowledge anti-pattern**: "the undocumented quirks, workarounds for known bugs, and implicit assumptions that accumulate over years of working with a system — shortcuts and sensory diagnoses senior operators carry but never write down" ([Manual.to](https://manual.to/the-tribal-knowledge-crisis-in-manufacturing/)). Cost is invisible: "quality escapes, rework, schedule delays, audit findings and missed contract milestones" that appear long after the person has left.

Standard extraction: shadowing, recorded interviews, runbook authoring during incidents, "explain like I'm an intern" sessions, paired work with formal handoff docs. Aerospace estimates put proper succession transfer at 3–5 years of overlap.

**For a solo operator, the audience for the brain is four people who don't exist yet:**

1. **Future-self** — six months from now you will not remember why MAX_RETRIES is 7.
2. **Claude / the agent** — every CLAUDE.md you write is succession docs for the model that will sit in your seat tomorrow morning.
3. **A future contractor** — the freelance designer or accountant who needs to understand the business in an afternoon, not a week.
4. **A future hire or partner** — if you ever take a co-founder or sell, the brain is what they buy.

**The bus factor of one *is* the solo operator's natural state; the brain is the insurance policy.**

---

## 6. The wiki graveyard — real failure stories

The phrase "wiki graveyard" is now its own genre. A representative cross-section:

1. **Kumar Kislay** ([DEV: Why Your Engineering Wiki is a Graveyard](https://dev.to/kislay/why-your-engineering-wiki-is-a-graveyard-and-how-to-fix-it-2eme)): *"Internal wikis were supposed to solve the knowledge problem. Instead, most become graveyards of outdated information that nobody reads and nobody updates… Every process update, every tool migration, every team reorganization makes some percentage of your wiki quietly wrong. Nobody marks the pages as outdated and nobody deletes them. They stay visible in search results, indistinguishable from accurate content, until someone follows the instructions and something breaks."*

2. **Pravodha**: *"A knowledge base without owners is destined to become a digital graveyard"* — diagnosis: absence of named accountability, not tooling ([Pravodha blog](https://pravodha.com/blogs/your-wiki-isnt-a-knowledge-base-its-a-graveyard)).

3. **Joel Dickson** ([Medium: Documentation Graveyard](https://medium.com/beer-and-servers-dont-mix/the-documentation-graveyard-bc1ba3872cda)): focuses on search rot — stale results indistinguishable from fresh ones.

4. **Anonymous HN comment** on Confluence (highly upvoted): *"The only use case for Confluence is when you want to hide information, but credibly claim that it's documented"* ([HN](https://news.ycombinator.com/item?id=33709093)). Same thread: *"people just throw random documents into Confluence wherever convenient at time of writing and never go back to logically organize anything."*

5. **"Slack is not a source of truth"** ([sorryengineering](https://www.sorryengineering.com/p/slack-is-not-a-source-of-truth)): when somebody asks a question on Slack the best possible answer should be a URL to the canonical doc — but in practice Slack *becomes* the source because the doc is stale or missing.

6. **Tettra's own SSOT post** (vendor-biased but honest): *"Most companies think they have a single source of truth until employees start relying on Slack, tribal knowledge, and outdated documents… Once employees find incorrect or outdated information a few times, they stop relying on the system altogether"* ([Tettra](https://tettra.com/article/single-source-of-truth/)).

7. **techresolve.blog on Notion** ([techresolve](https://techresolve.blog/2025/12/26/how-i-stopped-turning-notion-into-a-graveyard-of-e/)): friction is *creating* pages with no content; fix: no page exists without Purpose + Next Action on creation, plus "Documentation Sprints" where for one sprint nobody may create a new page and everyone must flesh out 1 page or delete 5.

8. **Glen Rhodes on second-brain failure for engineers** ([Glen Rhodes](https://glenrhodes.com/why-most-second-brain-knowledge-systems-fail-engineers-and-what-actually-works/)): *"Most second-brain setups get the direction of information flow backward: you put things in, the system does nothing, you come back and hope to find something useful, and that hope is almost always disappointed."*

**What predicts success vs failure**: named owners, write-during-incident not write-after, deletion rituals, retrieval pressure (search analytics, "did this answer your question"), and — critically — **the doc being the path of least resistance at the moment information is needed**. Stripe's success comes from leadership writing the memos themselves; PostHog's from making the handbook the place where you *propose* changes, not just record them.

---

## 7. Translating to solo operator

Given the operator's design — single inbox, type-by-promotion, CXOs as knowledge+skills+tools bundles, lean CLAUDE.md, no sub-agents day 1 — opinionated read on what applies:

**Handbook-first: yes, but the audience is Claude, not future-hires.** GitLab's TeamOps rationale (async, equal participation) doesn't apply at solo scale — there's no one to be excluded. But the *operational* benefit absolutely does: a handbook-first solo operator stops re-explaining context every session. The CLAUDE.md pattern is already a tiny handbook. Honest framing: *"this isn't a handbook for employees, it's an operating manual for the agent that does 95% of the work"* ([Claude Code memory docs](https://code.claude.com/docs/en/memory), [stormy.ai solo-founder playbook](https://stormy.ai/blog/solo-founder-playbook-claude-code-startup)).

**Department folders → CXO folders.** What to steal from GitLab: (a) the by-CXO top-level split — gives each promotion-type a natural home; (b) the "look it up before asking" norm, internalized as "Claude reads it before answering"; (c) the public/internal split — even solo, separate "thinking" from "operational." What *not* to steal: department-as-silo. CXOs should cross-link aggressively; a launch lives in CMO with pointers from CTO and CFO, not duplicated.

**SSOT: critical, not overkill — enforced differently.** Solo SSOT failure looks like: notes in Apple Notes, decisions in iMessage, prices in three different Stripe products, runbooks in your head. The Karpathy LLM-wiki pattern is the right shape: raw sources immutable, the wiki LLM-maintained, schema in CLAUDE.md. Concretely: one canonical page per CXO domain; raw inputs in `sources/`; agent rewrites canonical pages on a cadence.

**Onboarding doc: write it now, for Claude.** The audience question dissolves — Claude *is* the new hire every session. Glen Rhodes's "friction at capture has to be nearly zero" applies double for solo: capture must be inbox-only; organization must be LLM-deferred.

**Bus factor: a real concern, but reframed.** Traditional bus factor (you get hit by a bus) is dramatic. Realistic ones: a two-week vacation; sick for a month; handing books to an accountant; selling the business; adding a co-founder; forgetting your own pricing rationale in eight months. Each solved by the same artifact — a brain a stranger (or stranger-self) could read in a day.

**What does NOT apply at solo scale:** TeamOps's async-for-inclusion rationale, formal review processes with multiple reviewers, deprecation committees, GitLab-sized handbooks (605K words would crush a solo). Stay closer to **PostHog-shaped than GitLab-shaped**: opinionated, edit-anywhere, small enough to read in an evening.

---

## 8. Open questions for the operator

1. **What is the canonical artifact format?** Markdown in the repo (Karpathy/Claude-Code-native), Notion, Obsidian, hybrid? Choice locks in who edits and how easily Claude rewrites.
2. **Who owns the deprecation ritual?** Weekly Friday review, CXO-by-CXO quarterly sweep, or LLM-driven "find pages older than N days with no inbound links" sweep?
3. **Where does the line live between "private operator brain" (decisions, finances, second-guessing) and "public-facing handbook" (pricing, policies)?** Cal.com and PostHog publish almost everything; Basecamp a subset; most solos publish nothing.
4. **How does the brain interact with the single inbox?** Capture in inbox + canonical in handbook, or same surface with promotion rules? Type-by-promotion suggests latter — implementation isn't obvious.
5. **What is the smallest viable handbook?** GitLab is 2,000+ pages; PostHog hundreds; a solo probably needs ~20 pages day one. Which 20? Which deferred until pain forces them?

---

## Sources

- [Glean pricing analysis — gosearch.ai](https://www.gosearch.ai/blog/glean-pricing-explained/)
- [Glean TCO breakdown — workativ](https://workativ.com/ai-agent/blog/glean-pricing)
- [Glean G2 reviews](https://www.g2.com/products/glean-technologies-glean/reviews)
- [Dust comparison of Notion AI alternatives](https://dust.tt/blog/notion-ai-alternatives-ai-workspace-automation)
- [Notion AI vs Coda AI 2026 — agentglitch](https://agentglitch.io/posts/notion-ai-vs-coda-ai-comparison/)
- [Tettra vs Guru](https://tettra.com/article/tettra-vs-guru/)
- [Slab vs Tettra — Nuclino](https://www.nuclino.com/solutions/slab-vs-tettra)
- [Mem.ai review — productivitystack](https://productivitystack.io/guides/mem-ai-guide/)
- [Dust solutions](https://dust.tt/home/solutions/dust-platform)
- [Onyx vs Dust comparison](https://onyx.app/alternatives/dust)
- [GitLab handbook by numbers — 2019](https://about.gitlab.com/blog/2019/04/24/the-gitlab-handbook-by-numbers/)
- [GitLab TeamOps](https://handbook.gitlab.com/handbook/teamops/)
- [GitLab Shared Reality](https://handbook.gitlab.com/teamops/shared-reality/)
- [McKinsey interview with Sid Sijbrandij](https://www.mckinsey.com/capabilities/people-and-organizational-performance/our-insights/all-remote-from-day-one-how-gitlab-thrives)
- [PostHog handbook](https://posthog.com/handbook)
- [Basecamp handbook on GitHub](https://github.com/basecamp/handbook)
- [Basecamp Shape Up](https://basecamp.com/shapeup)
- [Sourcegraph handbook](https://github.com/sourcegraph/handbook)
- [Cal.com open](https://cal.com/open)
- [Doist how-we-work](https://doist.com/how-we-work/how-doist-works-remote)
- [HN — Confluence as documentation theatre](https://news.ycombinator.com/item?id=33709093)
- [Pragmatic Engineer on Stripe](https://newsletter.pragmaticengineer.com/p/stripe)
- [Slab on Stripe writing culture](https://slab.com/blog/stripe-writing-culture/)
- [Forte Labs: PARA for Teams](https://fortelabs.com/blog/para-for-teams/)
- [Aleks Obukhov on team PARA](https://blog.dclg.net/organizing-your-teams-knowledge-with-para)
- [First Round podcast with Brie Wolfson](https://review.firstround.com/podcast/from-kickoffs-to-retros-and-slack-channels-stripes-documentation-best-practices-with-brie-wolfson/)
- [Atlassian on org charts](https://www.atlassian.com/work-management/project-management/organizational-chart)
- [k15t — Confluence pitfalls](https://www.k15t.com/blog/2014/09/seven-major-pitfalls-to-avoid-when-using-atlassian-confluence-for-collaboration)
- [Wikipedia — SSOT](https://en.wikipedia.org/wiki/Single_source_of_truth)
- [Docsie on source of truth](https://www.docsie.io/blog/glossary/source-of-truth/)
- [Software Engineering at Google — Ch. 10](https://abseil.io/resources/swe-book/html/ch10.html)
- [Canonical on documentation practice](https://canonical.com/documentation)
- [Agilityportal SSOT lessons](https://agilityportal.io/blog/single-source-of-truth-founders-lessons)
- [Tettra SSOT guide](https://tettra.com/article/single-source-of-truth/)
- [MindStudio — Karpathy LLM-wiki pattern](https://www.mindstudio.ai/blog/karpathy-llm-wiki-knowledge-base-pattern)
- [Falconer enterprise LLM-wiki guide](https://falconer.com/guides/enterprise-llm-wiki-karpathy)
- [ContributorIQ knowledge transfer](https://contributoriq.com/blog/engineering-knowledge-transfer-best-practices)
- [Codenteam bus factor](https://codenteam.com/the-bus-factor-why-your-teams-success-shouldnt-depend-on-a-single-person/)
- [Manual.to tribal knowledge crisis](https://manual.to/the-tribal-knowledge-crisis-in-manufacturing/)
- [DEV — Engineering Wiki Graveyard (Kumar Kislay)](https://dev.to/kislay/why-your-engineering-wiki-is-a-graveyard-and-how-to-fix-it-2eme)
- [Pravodha — Wiki Graveyard](https://pravodha.com/blogs/your-wiki-isnt-a-knowledge-base-its-a-graveyard)
- [Medium — Documentation Graveyard (Joel Dickson)](https://medium.com/beer-and-servers-dont-mix/the-documentation-graveyard-bc1ba3872cda)
- [sorryengineering — Slack is not a source of truth](https://www.sorryengineering.com/p/slack-is-not-a-source-of-truth)
- [techresolve — Notion graveyard fix](https://techresolve.blog/2025/12/26/how-i-stopped-turning-notion-into-a-graveyard-of-e/)
- [Glen Rhodes — why second brains fail engineers](https://glenrhodes.com/why-most-second-brain-knowledge-systems-fail-engineers-and-what-actually-works/)
- [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- [Stormy.ai — solo founder Claude Code playbook](https://stormy.ai/blog/solo-founder-playbook-claude-code-startup)
