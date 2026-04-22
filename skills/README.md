# Skills

Portable task-orchestration bundles. Each skill is a directory with a `SKILL.md` that has YAML frontmatter (`name`, `description`, `license`) plus a progressive-disclosure body.

## Index

| Skill | Description |
|---|---|
| `portfolio-curator/` | Routes editing intents (add project, tweak theme, edit section, verify deploy) to the right recipes and prompts. |

## Installing

To use a skill inside Claude Code sessions, either:

1. **Copy** the skill directory into `~/.claude/skills/` - it becomes available as a `/skill` invocation.
2. **Install as a plugin** from this repo if you're managing skills via the Claude Code plugin system.

The canonical copy lives in this repo so it ships with the codebase and stays in sync with the recipes, prompts, and knowledge files it references.

## Authoring notes

- Frontmatter must include `name` and `description`. `description` is what Claude reads when deciding whether the skill matches an intent - make it specific about triggers, not aspirational.
- Body follows progressive disclosure: shortest useful path first, then routing to deeper files (`recipes/…`, `prompts/…`, `knowledge/…`) for the long form.
- Never duplicate content from `knowledge/` into a skill. Link.
