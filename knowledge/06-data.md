# 06 - Data

Portfolio content is split across two files:

- `src/data/portfolio.ts` - **stable public surface**: `Project`/`Contact`/`ProjectExtra`/`PortfolioData` types, `projects`/`contact` exports, helpers `iconFor`/`shortDesc`. Components import from here.
- `src/data/portfolio.data.ts` - **auto-generated data**: written by the `#admin` backoffice via the GitHub Contents API. Do not hand-edit. The serializer in `src/admin/serializer.ts` round-trips this file byte-identically, so edits produce minimal diffs. The file format is load-bearing: a fixed header, `export const data: PortfolioData = `, a single JSON literal, and `;\n`.

See `src/admin/AdminApp.tsx` for the editor surface (`#admin` hash route, password-gated, commits on Save).

## Types

```ts
export type ProjectExtra = { label: string; url: string };

export type Project = {
  name: string;
  description: string;
  language: string;         // primary language or space-separated list joined with ' · '
  url: string;
  extras?: ProjectExtra[];  // optional secondary links (articles, listings, etc.)
};
```

## Exports

```ts
export const projects: Project[];             // current: 3 entries
export const contact: {
  email: string;
  github: string;
  linkedin: string;
  phone: string;
};
export function iconFor(lang: string): string;
export function shortDesc(d: string): string;
```

### `iconFor(lang)`

Maps a language string to a glyph used by `CodeArt` for project cards.

```ts
const LANG_ICON = {
  TypeScript: '</>',
  JavaScript: '{}',
  Go:         'fn',
  Python:     'λ',
  Rust:       '>_',
  Claude:     '✦',
};
```

- Exact match against `LANG_ICON` keys.
- Fallback: if the string contains `·` (multi-language project like `'Go · Python · TypeScript'`), returns `∞`.
- Otherwise returns `'{ }'`.

**When adding a project** with a language not in the map, decide:

- Is this a one-off? Use `∞` multi-lang display or a custom glyph inline.
- Is this a language we'll see again? Extend `LANG_ICON`.

### `shortDesc(d)`

Truncation helper for card previews:

1. Splits on first `' - '` (em-dash separator) or `'. '` (sentence end).
2. Takes the first segment.
3. If still > 110 chars, truncates to 107 + `'…'`.

So `description` can be long and rich; the card preview stays tight.

## Adding a project

1. Open `src/data/portfolio.ts`.
2. Append an object literal to `projects: Project[]` - TypeScript enforces the shape.
3. Check `language` against `LANG_ICON`. Extend the map if appropriate (see above).
4. Write a `description` that:
   - Starts with a strong hook, so `shortDesc` gives a good preview.
   - Is separated by `' - '` from extended detail (the separator is the truncation point).
5. Add `extras` if the project has companion articles/listings/etc.
6. `npm run typecheck` - catches missing fields.
7. `npm run dev` - verify the card renders in `#repos`; click it to verify the lightbox.

There is no CMS, no loader, no Markdown. The project list is code. This is on purpose - it makes content changes reviewable in diffs. The `#admin` backoffice is an alternative *writer* that still produces the same code diffs - it doesn't bypass the "content is code" contract.

For a guided creation flow, use `../prompts/add-project.md` and `../recipes/add-project.md`.

## Editing contact

Same file, `contact` object. The email is consumed by `Letter.tsx` (copy-to-clipboard + `mailto:` form action). Phone is displayed on the Letter section. GitHub and LinkedIn are linked from Intro and Letter.

## What is NOT in `portfolio.ts`

- Section copy (headlines, body text) lives in JSX in `src/components/sections/*.tsx`.
- Education and work history details live in `Story.tsx` and `Experience.tsx` respectively.

If any of those grow past ~20 lines of static content, consider extracting them into `portfolio.ts` as typed arrays - but for now, inline JSX is fine because each lives once.
