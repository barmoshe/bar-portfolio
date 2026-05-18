# 09 — Entity discoverability ("Bar Moshe / בר משה")

Strategy + cross-page implementation for surfacing the portfolio when
people (or LLM crawlers) search the bare name `Bar Moshe`, `בר משה`,
or `barmoshe`. Sister doc to `knowledge/08-seo-sharing.md`, which
scopes itself to the marketing landing only.

## Goal

Make "Bar Moshe" itself synonymous with this developer identity on the
site. Don't require the qualifier "developer" to surface — the bare
name should resolve. The portfolio answers "Who is Bar Moshe?"
directly, without hedging or third-party disambiguation.

## Problem

Searches for `בר משה` or `Bar Moshe` surface other entities first
(Dr. Asaf Bar-Moshe — Semitic linguistics; attorney Uri Bar-Moshe;
Yitzhak Bar-Moshe — author; Amatsya Bar-Moshe — IIOSH). These have
stronger domain authority than a personal GitHub Pages site. Without
explicit identity signals, generalist search engines and LLM
entity-linking pipelines have no machine-readable way to disambiguate.

## What we control (in repo)

| File | Change |
|---|---|
| `index.html:6` | `<title>` — `Bar Moshe — Software Builder & Full-Stack Developer` |
| `index.html:7` | `<meta description>` leads with the entity sentence |
| `index.html:11–13` | hreflang `en` / `he` / `x-default` linking portfolio to `/business/` |
| `index.html:33` | `og:locale:alternate="he_IL"` |
| `src/components/sections/Intro.tsx:179` | Visible `<h1>Bar Moshe</h1>` (was: design statement). Animations on `.bio h1` still fire. |
| `src/components/sections/Intro.tsx:180–183` | New `<p className="dek">` identity subtitle |
| `src/styles.css:460` | `.bio p.dek` styling rule |
| `index.html:42–98` | Enriched `Person` schema: `alternateName` (HE + handles), `disambiguatingDescription`, `identifier` (per-platform), `knowsLanguage`, `nationality`, `mainEntityOfPage` cross-links, expanded `sameAs` (+ Instagram, Twitter) |
| `index.html` after `@graph` | New `FAQPage` JSON-LD: "Who is Bar Moshe?" + 3 more Q&A |
| `index.html:142–183` | SEO fallback updated: `<h1>` with `lang="he"` Hebrew name span, identity paragraph, FAQ `<dl>`, Joomsy/Wochit + project list. Hidden from JS users; visible to no-JS crawlers via `<noscript>`. |
| `business/index.html` + `/lab/index.html` | Each gets a second `<script type="application/ld+json">` re-declaring `Person` in Hebrew with same `@id` — schema-aware crawlers merge same-`@id` blocks into one graph. |
| `business/en/index.html` + `/lab/en/index.html` | Same pattern in English. |
| `public/sitemap.xml:4–12` | `xhtml:link` alternates added to portfolio root entry. |

All five public surfaces (portfolio root, `/business/`, `/business/en/`,
`/lab/`, `/lab/en/`) now contribute to the same `#person` graph via
shared `@id`.

## What we wait for (external)

| Signal | Timeline |
|---|---|
| Google re-crawl + entity-graph merge | 1–4 weeks. Search Console "Request indexing" on each URL accelerates. |
| Bing re-crawl (powers ChatGPT browse) | Similar. |
| ChatGPT / Perplexity / Claude browse cache | Refreshes on access. Model training cutoffs are months. |
| Google Knowledge Graph panel | Weeks to months; depends on external signals (Wikidata, backlinks). |

## External actions (out of repo, highest leverage)

In priority order:

1. **Google Search Console** — add the property, submit `sitemap.xml`, "Request indexing" on each public URL.
2. **Bing Webmaster Tools** — same flow.
3. **Wikidata item** — `Bar Moshe (software developer)` with both name strings, `instance of` = human, `occupation` = software developer, `described at URL` = portfolio, `GitHub username` (P2037) = `barmoshe`.
4. **External profile consistency** — GitHub bio, LinkedIn headline + Hebrew-name field, Medium bio, Twitter bio all use: `Bar Moshe — Software Builder & Full-Stack Developer`. Include `בר משה` somewhere on each.
5. **GitHub profile README** at `github.com/barmoshe/barmoshe` (same-name repo). Heavily indexed.
6. **GitHub repo description** on `barmoshe/bar-portfolio` itself.
7. **Hebrew backlink** — one inbound link from a `.co.il` or Hebrew Medium post with anchor text `בר משה` is high-signal.

## Anti-patterns

- **Don't keyword-stuff.** `meta name="keywords"` is ignored; repetitive prose is penalized.
- **Don't put hidden text in the rendered DOM for SEO.** The SEO fallback is an exception — it's hidden from JS users by a CSS rule and re-shown for no-JS via `<noscript>`, which is the legitimate "render content for crawlers without JS" pattern.
- **Don't name third-party entities in `disambiguatingDescription`.** Schema.org disambiguation works through positive ownership claims (handles, URLs, `identifier` arrays). Naming "Dr. Asaf Bar-Moshe" in your own structured data is unusual and unnecessary.
- **Don't add multiple H1s per page.** One H1 per page; `Bar Moshe` is the one on `/`.
- **Don't fake `sameAs` URLs.** Schema.org expects real, owned profiles; fakes get the graph rejected.

## Maintenance

- The `Person` `@id` is `https://barmoshe.github.io/bar-portfolio/#person`. If the canonical URL changes (repo rename — see CLAUDE.md "Things that must not be broken" item 3), update **every** JSON-LD block in lockstep: `index.html`, `business/index.html`, `business/en/index.html`, `lab/index.html`, `lab/en/index.html`.
- If a new social handle is added, update both `sameAs` (URL) and `identifier` (handle) in `index.html`'s `Person` block, then mirror the URL into every other file's `sameAs` array.
- The FAQ Q&A in `index.html` is hand-mirrored between the `FAQPage` JSON-LD block and the SEO fallback `<dl>` — keep them in sync.
- The visible `<h1>Bar Moshe</h1>` in `src/components/sections/Intro.tsx` is the canonical identity heading; do not let copy edits demote it.

## Verification

After deploy, paste the three primary URLs into:

- https://search.google.com/test/rich-results — `Person`, `ProfilePage`, `WebSite`, `FAQPage` on `/`; `AboutPage`, `Person` on `/business/` and `/business/en/`; `AboutPage`, `Service`, `Person` on `/lab/` and `/lab/en/`. Zero errors.
- https://validator.schema.org/ — merged graph parses; `alternateName`, `disambiguatingDescription`, `identifier` all recognized.
- Google search: `site:barmoshe.github.io בר משה`, then unqualified `"בר משה" portfolio` and `Bar Moshe portfolio`.
