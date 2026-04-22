# Prompts

XML-tagged scaffolds for generative tasks. Each file is a template: fill the `{{PLACEHOLDER}}` slots, feed the whole thing to Claude, paste the output where the matching recipe tells you to.

## Tag legend

- `<instructions>` - the role and the goal, stated plainly. Claude reads this first.
- `<brief>` - the user-supplied inputs (mood, project details, section target). This is where you fill the placeholders.
- `<constraints>` - hard rules. Contrast floors, type contracts, token names, reduced-motion requirements, no-new-deps.
- `<output_format>` - the exact shape of the answer (drop-in CSS block, TS object literal, JSX snippet, markdown critique).

Keep the tags in this order when you write new scaffolds. Claude cues off the sequence.

## Index

| File | Pairs with |
|---|---|
| `customize-colors.md` | `recipes/customize-theme.md` |
| `add-project.md` | `recipes/add-project.md` |
| `add-section-block.md` | `recipes/edit-section.md` |
| `design-critique.md` | `recipes/customize-theme.md` (self-critique pass) |

## Writing a new prompt

1. Start with the smallest version that could work. Prompts grow by accumulation; trim aggressively.
2. Name placeholders by meaning, not position (`{{HUE_FAMILY}}`, not `{{INPUT_1}}`).
3. Put token names, file paths, and type shapes in `<constraints>` directly - don't make Claude re-derive them from `knowledge/`.
4. `<output_format>` should specify where the output gets pasted. Recipes do the same; the pair should agree.

## Background

Constraints in `<constraints>` are the real work. The site's invariants (see `knowledge/99-caveats.md`) belong there whenever the task could plausibly trip them.
