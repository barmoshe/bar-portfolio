# Recipe - Add a project

You want to add a new card to the `#repos` grid. The end state: a new object in `projects[]` in `src/data/portfolio.ts`, a card rendering in dev at `http://localhost:5173/#repos`, a working lightbox, a clean typecheck, and a clean build.

## The arc

The project grid is 100% data-driven. `Repos.tsx` iterates `projects` from `src/data/portfolio.ts` and renders a `HoverCard` + `CodeArt` per entry. The card's glyph comes from `iconFor(language)`; the card's preview text comes from `shortDesc(description)`; the lightbox reads `description` and `extras` straight off the same object. So adding a project is one file edit plus a couple of checks.

## 1. Gather the inputs

Before touching code, have these five things ready:

- **name** - short, visually balanced, works at card size.
- **description** - can be long. Write it with the `' - '` separator (em-dash flanked by spaces) between the hook and the detail. `shortDesc` truncates at that separator, so everything before `' - '` is what the card shows.
- **language** - primary stack. Check `LANG_ICON` in `src/data/portfolio.ts`. If your language is already a key (`TypeScript`, `JavaScript`, `Go`, `Python`, `Rust`, `Claude`), use it verbatim. For a polyglot project, use `' · '` separator (e.g. `'Go · Python · TypeScript'`) - `iconFor` returns `∞` in that case.
- **url** - canonical link for the card's primary click target.
- **extras** (optional) - additional links like blog posts, Product Hunt listings. Each is `{ label, url }`.

For a guided generation of the object literal, use `prompts/add-project.md`.

## 2. Extend `LANG_ICON` if needed

If your language isn't in the map and isn't a multi-lang string, decide:

- **One-off**: just use a multi-lang string or pick the closest existing key. Don't pollute the map.
- **Recurring**: add a new key to `LANG_ICON`. Keep the glyph a 1–3-char visual pun on the language. No emoji - it clashes with the serif display face.

## 3. Append to `projects`

Open `src/data/portfolio.ts` and append a literal to the `projects` array. TypeScript will fail the build if a required field is missing; don't silence it with `any`.

Order matters visually - new projects typically go at the top, but there is no rule. The grid renders in array order.

## 4. Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173/#repos`. The Repos section is **collapsible and
always starts closed** — click the "Show N projects ↓" toggle to expand it.
Find your new card. Verify:

- Glyph renders (not `{ }` unless that's intended).
- Hover animation feels right (`HoverCard` is shared, so it should just work).
- Click opens the lightbox with the full description and any `extras` as additional links.
- Reduced-motion mode (toggle in OS settings) shows the card without hover parallax.

## 5. Typecheck and build

```bash
npm run typecheck
npm run build
```

Typecheck catches shape mismatches. Build catches import-resolution issues the dev server papers over (rare, but possible with new paths).

## 6. Commit

`main` is the deploy branch. See `recipes/deploy.md` for the push flow.

---

Related:
- `knowledge/06-data.md` - types and helper semantics.
- `prompts/add-project.md` - scaffold for generating the literal.
- `.claude/commands/new-project.md` - slash command that automates this whole recipe.
