# Claude Skills — Authoring Reference for the Workshop

The Workshop architecture commits to 3 Day-1 skills (`triage`, `promote`, `index`) and grows by Rule of Three. This doc is the authoring reference: what a Claude Skill is in 2026, how it differs from sub-agents and slash commands, the progressive-disclosure architecture that makes it cheap, and concrete authoring rules.

---

## 1. What a Skill is, technically

A Claude Skill is **a folder containing a `SKILL.md`** ([Anthropic — Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)). The SKILL.md has YAML frontmatter (`name`, `description`, optional `metadata`) and a markdown body. The folder can also contain bundled reference files, code, and assets the skill references.

Claude loads Skills in **three progressive stages** ([Anthropic — Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices); [Anthropic engineering blog — Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)):

| Stage | When loaded | Token cost | What's loaded |
|---|---|---|---|
| **Metadata** | At session start | ~30–100 tokens per skill | YAML frontmatter only (`name` + `description`) |
| **Full instructions** | When description matches the task | <5,000 tokens | The SKILL.md body |
| **Bundled resources** | When the SKILL body references them | Variable | Reference files, scripts, fixtures |

> *"This lightweight approach means you can install many Skills without context penalty; Claude only knows each Skill exists and when to use it."* ([Anthropic best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices))

Implication: a Workshop with 30 skills doesn't pay 30× the token cost upfront. It pays ~3K tokens at session start (description metadata), then ~5K more per skill that actually fires during the session.

---

## 2. Skill vs Sub-agent vs Slash Command — when to use which

Three orthogonal primitives, often confused. The clean separation ([alexop.dev customization guide](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/); [Young Leaders — Skills/Commands/Subagents/Plugins](https://www.youngleaders.tech/p/claude-skills-commands-subagents-plugins); [Level Up Coding — Reverse Engineering Claude Code](https://levelup.gitconnected.com/reverse-engineering-claude-code-how-skills-different-from-agents-commands-and-styles-b94f8c8f9245)):

| Primitive | How invoked | Context | When to use |
|---|---|---|---|
| **Skill** | **Auto-invoked** by Claude based on semantic match between description and conversation | Loaded into the main conversation | Domain expertise that should fire when the topic comes up (*"if user is talking about pricing, load `cfo` knowledge"*) |
| **Sub-agent** | **Explicit** — invoked via `@agent-name` or `Task` tool | **Separate** context window with its own system prompt; only the summary returns | Expensive multi-step work (research, deep exploration, parallel investigations) that would otherwise pollute the main context |
| **Slash command** | **User types `/command`** | Injects into current conversation | Frequently-used workflows the user wants to start in one keystroke (*"every Monday I run `/weekly-review`"*) |

**Hybrid pattern that works:** slash command → sub-agent for the heavy lift → main Claude handles execution with the sub-agent's summary as input. Slash commands are the fastest way to start frequently-used workflows; sub-agents keep main context clean; skills fire automatically when relevant.

**For the Workshop's Day-1 three:**
- `triage` — could be a slash command (`/triage`) that calls a skill. Bar invokes it manually when checking the inbox.
- `promote` — slash command (`/promote`). Explicit human action.
- `index` — skill that auto-fires when CLAUDE.md routing tables drift. Could also be a slash command.

The honest answer: at Day 1, **all three should be slash commands** because Bar invokes them explicitly. Skills come into their own when there are 10+ domains and auto-firing per topic becomes valuable. Promote to skills when the same workflow has been invoked the same way 3 times (Rule of Three).

---

## 3. The YAML frontmatter — the single most important authoring decision

The `description` field is what Claude uses to decide whether to load the skill. **Bad descriptions cause skills to never fire (or fire on every prompt — both fatal).**

Anthropic's guidance ([best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)):

- `name` — short, kebab-case, unique
- `description` — ~100 words, *"pushy"*, includes the user's actual verbs and nouns
- Body — ≤500 lines; split into reference files if larger

**Good description (verb-rich, specific):**
```yaml
description: Triage new items in the Workshop inbox. Use when the user
  says "triage", "process the inbox", "what's in the inbox", or when
  starting a session and the SessionStart hook reports unprocessed
  items. Walks each inbox file, proposes a category (lead / decision /
  observation / draft), suggests promotion candidates that have hit the
  Rule of Three, and offers next actions.
```

**Bad description (vague, no triggers):**
```yaml
description: Helps with the inbox.
```

The bad one will be loaded as 30 tokens of metadata but rarely fire because Claude's pattern match against "helps with the inbox" is weak. The good one fires reliably because it lists exact triggers.

---

## 4. Progressive disclosure in practice — how to structure a long skill

When SKILL.md grows past ~300 lines, split. Pattern ([Anthropic best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices)):

```
skills/triage/
├── SKILL.md                 # <300 lines: trigger, mental model, 5 most common scenarios
├── reference/
│   ├── inbox-schema.md      # loaded when SKILL.md references it
│   ├── categories.md        # loaded when categorization comes up
│   └── promotion-rules.md   # loaded when Rule of Three is invoked
└── examples/
    ├── lead.md              # example: triage a WhatsApp lead
    ├── decision.md          # example: triage a decision draft
    └── observation.md       # example: triage a random insight
```

The SKILL.md body says *"see `reference/promotion-rules.md` for the full Rule of Three logic"* — Claude pulls that file only when the conversation reaches Rule-of-Three territory. Stays cheap by default.

> *"When the SKILL.md file becomes unwieldy, split its content into separate files and reference them. If certain contexts are mutually exclusive or rarely used together, keeping the paths separate will reduce the token usage."* ([Anthropic best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices))

---

## 5. The "goal-shaped" skill design

A useful skill is **goal-shaped** — it answers *"what does the user want to achieve?"*, not *"what tools does Claude have available?"*. This is the difference between a skill called `read-inbox-files` (tool-shaped, useless) and `triage-the-inbox` (goal-shaped, valuable).

Anthropic's framing ([engineering blog](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)): Skills should encode *"specialized knowledge required to complete real-world tasks."* The skill is the unit of *capability*, not the unit of *function*.

**Checklist for a goal-shaped skill:**
- The name reads like the user's intent (verb + noun: `triage-inbox`, `promote-cluster`, `quote-engagement`)
- The description includes the user's words for the goal (not Claude's words for the tool)
- The body opens with *"When [user goal], do X. The output is Y."*
- The skill references *examples* of the goal being achieved, not just rules
- Success criteria are in the skill: *"this skill has succeeded if [observable outcome]"*

---

## 6. Authoring loop — Anthropic's recommended iteration

From the skill-creator skill in [Anthropic's official skills repo](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md):

1. **Decide what the skill should do** (one sentence, goal-shaped)
2. **Write a draft** (SKILL.md, <100 lines first pass)
3. **Create test prompts** that should trigger the skill
4. **Run Claude with access to the skill** on the test prompts
5. **Evaluate qualitatively and quantitatively** (did it fire? did it produce the right output?)
6. **Rewrite based on feedback**
7. **Repeat until satisfied**

The "Claude A writes the skill, Claude B tests it" loop is the cheapest way to get triggers and structure right. One session authors; a fresh session (no memory of the authoring) tests cold.

---

## 7. Common authoring anti-patterns

From [obra/superpowers — anthropic-best-practices](https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md) and Anthropic's official guidance:

1. **Vague descriptions.** "Helps with X." Claude needs verbs and nouns. Write descriptions that name the user's intent words.
2. **SKILL.md as a dumping ground.** Past 500 lines, every additional line dilutes the rest. Split into reference files.
3. **Skills that duplicate CLAUDE.md.** The skill is *task-shaped knowledge*; CLAUDE.md is *project-shaped knowledge*. If a fact applies to every session, it belongs in CLAUDE.md. If it applies only when a specific task is happening, it belongs in a skill.
4. **Tool-shaped skills.** Skills named after tools (`grep`, `file-read`) instead of goals (`find-stale-decisions`, `audit-knowledge-base`).
5. **Skills with no test prompts.** If you didn't write the prompts that should trigger it, you can't know if the description matches reality.
6. **Skill marketplace bloat.** Installing the 153-skill [wshobson/agents](https://github.com/topics/awesome-claude-code) bundle for a personal repo costs description-collision plus 30 tokens per skill at session start. Curate.

---

## 8. How this applies to the Workshop's Day-1 three

| Skill | Day-1 form | Promote-to-skill trigger | Example trigger phrase |
|---|---|---|---|
| **triage** | Slash command `/triage` | After 3rd manual inbox walk → promote to auto-firing skill | *"what's in the inbox", "process the inbox", "triage", session start with unread items* |
| **promote** | Slash command `/promote` | Stays a slash command — explicit human ritual | *"promote these to a folder", "I see a pattern in inbox X Y Z"* |
| **index** | Slash command `/index` | After 5+ folder promotions → promote to auto-firing skill that updates CLAUDE.md routing | *"update the routing table", "index"* |

The pattern: **start as slash commands** (cheap, explicit). **Graduate to skills** when the same workflow has fired 3+ times in similar ways. **Never promote a slash command to a skill if Bar wants to keep explicit control** of when it runs.

---

## 9. Open questions for the operator

1. **Where do skills live — repo or user-global?** Project-level (`.claude/skills/`) ships with the repo; user-level (`~/.claude/skills/`) follows Bar across all repos. Workshop skills should be project-level (specific to the Workshop's vocabulary). Skills that are generic to Bar's working style (e.g. *"always summarize a long output in 3 bullets"*) should be user-level.
2. **Curation vs accretion.** Anthropic's marketplace is approaching skill bloat. Does Bar commit to a curated list (≤15 skills total) or let them accrete?
3. **Skill author vs skill tester separation.** Anthropic recommends Claude A authors, Claude B tests. Does the Workshop have a `/create-skill` command that scaffolds the authoring loop?
4. **Sunset rule.** Per the company-brain doc, every artifact needs a deprecation ritual. What's the rule for retiring a skill? Suggested: *"skill removed if not invoked in 60 days."*
5. **Skill descriptions in Hebrew?** Bar is bilingual; some skills (especially CMO-flavored voice skills) might benefit from Hebrew triggers. Decide upfront whether descriptions are EN-only or bilingual.

---

## Sources

- [Anthropic — Agent Skills overview](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- [Anthropic — Skill authoring best practices](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/best-practices) ([alt URL on docs.claude.com](https://docs.claude.com/en/docs/agents-and-tools/agent-skills/best-practices))
- [Anthropic engineering blog — Equipping agents with Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills)
- [anthropics/skills repo — skill-creator/SKILL.md](https://github.com/anthropics/skills/blob/main/skills/skill-creator/SKILL.md)
- [Generative Programmer — Skill Authoring Patterns from Anthropic's Best Practices](https://generativeprogrammer.com/p/skill-authoring-patterns-from-anthropics)
- [obra/superpowers — anthropic-best-practices](https://github.com/obra/superpowers/blob/main/skills/writing-skills/anthropic-best-practices.md)
- [Lee Hanchung — Claude Agent Skills: A First Principles Deep Dive](https://leehanchung.github.io/blogs/2025/10/26/claude-skills-deep-dive/)
- [Dean Blank / Level Up Coding — Mental Model for Claude Code: Skills, Subagents, Plugins](https://levelup.gitconnected.com/a-mental-model-for-claude-code-skills-subagents-and-plugins-3dea9924bf05)
- [Vuong Ngo / Level Up Coding — Skills vs Agents vs Commands vs Styles](https://levelup.gitconnected.com/reverse-engineering-claude-code-how-skills-different-from-agents-commands-and-styles-b94f8c8f9245)
- [alexop.dev — Claude Code Customization: CLAUDE.md, Slash Commands, Skills, Subagents](https://alexop.dev/posts/claude-code-customization-guide-claudemd-skills-subagents/)
- [Young Leaders — Understanding Claude Code: Skills vs Commands vs Subagents vs Plugins](https://www.youngleaders.tech/p/claude-skills-commands-subagents-plugins)
- [websearchapi.ai — How to Create Claude Code Skills](https://websearchapi.ai/blog/how-to-create-claude-code-skills)
- [travisvn/awesome-claude-skills](https://github.com/travisvn/awesome-claude-skills)

**Related Workshop docs:**
- [host-repo-architecture.md](./host-repo-architecture.md) (Day-1 three skills)
- [practical-reference.md](./practical-reference.md) (real SKILL.md examples)
- [cxo-folders.md](./cxo-folders.md) (which skills naturally live with which CXO)
