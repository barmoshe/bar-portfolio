# Recipes

**Narratives, not checklists.** Each recipe walks through a common workflow end-to-end, referencing the relevant `knowledge/` files, `prompts/` scaffolds, and code paths. The goal is to read it once and understand the full arc, not to tick boxes.

## Index

| File | When to use |
|---|---|
| `add-project.md` | Adding a new entry to the project grid. |
| `customize-theme.md` | Changing the oklch palette — generating, pasting, verifying contrast. |
| `edit-section.md` | Adding or restructuring content inside an existing section. |
| `deploy.md` | Pushing to `main`, watching the GH Actions build, verifying the live site. |

## Combining recipes with prompts

Recipes tell you the shape of a workflow. `prompts/` scaffolds give Claude the exact constraints for the generative step inside that workflow. Typical composition:

1. Read the relevant recipe to understand the flow.
2. Invoke the prompt scaffold referenced by the recipe (e.g. `prompts/customize-colors.md`) with your inputs filled in.
3. Paste the output into the file the recipe points to.
4. Run the verification commands the recipe ends with.

Recipes assume you have `npm` and a clean `main` checkout. If not, see `knowledge/01-stack.md`.
