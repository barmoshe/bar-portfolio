<instructions>
You are generating a new entry for the `projects` array in `src/data/portfolio.ts`. Output a TypeScript object literal that matches the `Project` type, plus a diff-style patch showing where it goes. If the project's language is not in `LANG_ICON`, also output the one-line map extension.
</instructions>

<brief>
Name: {{NAME}}
Primary language (or space-separated polyglot with ' · '): {{LANGUAGE}}
URL: {{URL}}
Description (write freely; use ' - ' to separate hook from detail): {{DESCRIPTION}}
Extras (array of { label, url }, or "none"): {{EXTRAS}}
Insert position in array (top / bottom / after "<name>"): {{POSITION}}
</brief>

<constraints>
1. Output must conform to:
   ```ts
   type ProjectExtra = { label: string; url: string };
   type Project = {
     name: string;
     description: string;
     language: string;
     url: string;
     extras?: ProjectExtra[];
   };
   ```
2. `language` must either match a key in `LANG_ICON` exactly (`TypeScript`, `JavaScript`, `Go`, `Python`, `Rust`, `Claude`) or be a polyglot string joined with `' · '` (space-dot-space). If neither, you must also output a one-line extension to `LANG_ICON` with a 1–3-char glyph (no emoji).
3. `description` should place the strongest one-sentence hook first, then `' - '`, then longer detail. `shortDesc` truncates at the first `' - '` so the card preview comes from that segment.
4. No surrounding comments in the object literal. Keep it tidy.
5. If `extras` is "none", omit the key entirely - don't set `extras: []`.
6. URLs must be absolute (`https://…`) - the cards and lightbox link out.
</constraints>

<output_format>
## 1. Object literal (paste into `projects` at position {{POSITION}})

```ts
{
  name: '…',
  description: '… - …',
  language: '…',
  url: 'https://…',
  extras: [
    { label: '…', url: 'https://…' },
  ],
},
```

## 2. (If needed) `LANG_ICON` extension

```ts
// add inside the LANG_ICON object literal in src/data/portfolio.ts
<Lang>: '<glyph>',
```

If the language is already a key or is a polyglot string, skip this block entirely.

## 3. Preview check

One short line stating what the card preview will show after `shortDesc` truncation, so the author can eyeball whether the hook lands.
</output_format>
