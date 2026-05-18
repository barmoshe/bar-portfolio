# 08 — Marketing-route SEO & sharing

Audit + recommendations for the **business/marketing landing only**
(`business/index.html`, Vite entry #2, served at
`https://barmoshe.github.io/bar-portfolio/business/`).

This is the conversion surface — the URL Bar sends in DMs, WhatsApp,
LinkedIn, and posts. How it ranks and how it renders when pasted are
both first-class concerns. The portfolio root (`index.html`) and the
backoffice demo (`backoffice/index.html`, `noindex`) are out of scope
here; see `knowledge/05-components.md` for their structure.

## Scope

- **Primary URL:** `https://barmoshe.github.io/bar-portfolio/business/`
- **Source:** `business/index.html` (single static head), React mounts
  from `src/marketing/main.tsx` → `MarketingApp.tsx`.
- **Languages:** Hebrew + English from one URL. The pre-paint script at
  `business/index.html:38–70` resolves `bm:lang` from localStorage; on a
  first visit it rolls 70/30 HE/EN and persists, so most cold sessions
  paint Hebrew (matches `og:locale="he_IL"` on line 20).
- **Audience signal:** marketing copy + JSON-LD frame this as an
  `AboutPage` for `#person` (the portfolio's `Person` graph at
  `index.html:38–113`).

## What's already in place

Snapshot after this audit's fixes; line numbers refer to
`business/index.html` post-edit.

| What | Where | Notes |
|---|---|---|
| Indexable robots | `business/index.html:9` | `index,follow,max-image-preview:large` |
| Canonical | `business/index.html:10` | Absolute, matches deployed URL |
| hreflang block | `business/index.html:11–13` | `he`, `en` (→ `/business/en/`), `x-default` |
| Web manifest link | `business/index.html:14` | Points at `/bar-portfolio/business.webmanifest` |
| `theme-color` (light/dark) | `business/index.html:15–16` | Mirrors `index.html:11–12` |
| OG block | `business/index.html:17–25` | `type=website`, `og:image=og-cover.jpg` (shared with portfolio), 1200×630, Hebrew `og:image:alt` |
| `og:locale` + alternate | `business/index.html:26–27` | `he_IL` with `en_US` alternate |
| Twitter card + handles | `business/index.html:28–34` | `summary_large_image`, `@barmoshe1`, Hebrew alt |
| `AboutPage` JSON-LD | `business/index.html:35–47` | Cross-references portfolio's `#person` / `#website` |
| `FAQPage` JSON-LD | `business/index.html:48–106` | 6 HE Q&A items from `src/marketing/i18n.ts:788–824` |
| `Service` JSON-LD | `business/index.html:107–144` | Provider `@id` → `#person`; two `Offer`s (first working version + continued build), no advertised price |
| Pre-paint lang resolution | `business/index.html:147–179` | Sets `html.lang` / `html.dir` and `window.__bmLang` before React mount; 70/30 random pick on first visit |
| EN canonical mirror | `business/en/index.html` | Same React app, EN-only pre-paint, EN OG/JSON-LD |
| Sitemap | `public/sitemap.xml` | Both URLs with mutual `xhtml:link` hreflang alternates |
| OG image asset | `public/og-cover.jpg` + `.svg` | 1200×630, shared with portfolio |
| Marketing OG design source | `public/og-business.svg` | New 1200×630 BOARD-ticket motif; not yet referenced (needs rasterization) |

## Gaps & risks

Severity: **blocker / high / medium / low**. Evidence is file:line into
the live tree.

### High — single-URL bilingual page without `hreflang`

The page serves HE or EN from the same URL based on `localStorage`. With
no `<link rel="alternate" hreflang="...">` and no `og:locale:alternate`,
crawlers see only `he_IL` and won't surface the page to English search
queries even though the content exists in English.

**Evidence:** `business/index.html:20` (only `he_IL`); no `hreflang` in
the file; `src/marketing/i18n.ts` ships a full EN dictionary alongside
HE.

**Fix (applied):** add `hreflang="he" | "en" | "x-default"` link tags
pointing at the same URL (honest signal — there's no per-language URL
to redirect to), and `og:locale:alternate="en_US"`. This is a
**single-URL multilingual** pattern, which Google explicitly supports
when the language is selected client-side.

### High — `FAQPage` JSON-LD missing despite a real FAQ section

The marketing landing ships a six-item FAQ (`src/marketing/sections/FAQ.tsx`
rendering `qa.items` from `src/marketing/i18n.ts:788–824`). Without
`FAQPage` structured data, the page is ineligible for FAQ rich results
in Google — pure missed surface area.

**Fix (applied):** emit a `FAQPage` JSON-LD block in `business/index.html`
sourced from the HE strings. Single-language structured data matches the
declared `og:locale="he_IL"`; mixing languages in one `FAQPage` graph is
discouraged.

### Medium — no `theme-color` parity with portfolio

`index.html:11–12` declares light/dark `theme-color` so iOS Safari /
Android Chrome paint the address bar to match. `business/index.html`
omits this, so the marketing page gets the default white/grey chrome
even after the theme toggles.

**Fix (applied):** mirror the two `theme-color` lines verbatim.

### Medium — missing `twitter:image:alt`

`twitter:image` is present (`business/index.html:24`) but lacks the
companion `twitter:image:alt`. OG has `og:image:alt` on line 19;
parity matters for screen-reader users on social platforms.

**Fix (applied):** add `twitter:image:alt` matching `og:image:alt`.

### Low — stale sitemap, no language alternates

`public/sitemap.xml:5,11` `lastmod` is fixed at 2026-04-29; content has
moved since (see `git log -- business/`). Sitemaps also don't expose
hreflang via `xhtml:link`, so even after adding head-level alternates,
the sitemap doesn't reinforce the signal.

**Fix (applied):** bump `lastmod` and add `xhtml:link` siblings on the
`/business/` URL.

### Still research-only — needs assets or tooling not in this repo

1. **Rasterized marketing OG (JPG/PNG).** A new SVG design source ships
   at `public/og-business.svg` (BOARD ticket motif, `#BAR-001` in
   `DOING`, "תאר. אבנה. תחליט." headline). It is **not** referenced
   from any `og:image` meta tag because Twitter, LinkedIn, and Facebook
   don't reliably render SVG previews. `og:image` continues to point at
   `og-cover.jpg`. Next step: rasterize the SVG to a 1200×630 JPG with
   any of `rsvg-convert`, ImageMagick, Inkscape, or `sharp`, write to
   `public/og-business.jpg`, and swap the `og:image` URL in both
   `business/index.html` and `business/en/index.html`.
2. **Real PWA icon assets.** `public/business.webmanifest` references
   `og-cover.jpg` as a single placeholder icon. Replace with proper
   192×192 and 512×512 PNGs (one `purpose:"any"`, one
   `purpose:"maskable"`) when an icon design exists.

## Fixes applied with this doc

### Head (`business/index.html`)
- `<link rel="alternate" hreflang="he|en|x-default">` after canonical;
  `en` points at the new `/business/en/` URL.
- `<link rel="manifest" href="/bar-portfolio/business.webmanifest">`.
- Two `<meta name="theme-color">` lines mirroring `index.html:11–12`.
- `<meta property="og:locale:alternate" content="en_US">` after
  `og:locale`.
- `<meta property="og:image:alt">` rewritten in Hebrew to match
  `og:locale="he_IL"`.
- `<meta name="twitter:site">` and `<meta name="twitter:creator">`
  pointing at `@barmoshe1`.
- `<meta name="twitter:image:alt">` in Hebrew.
- `FAQPage` JSON-LD block sourced from `src/marketing/i18n.ts` HE
  `qa.items` (6 items).
- `Service` JSON-LD block: provider `@id` → portfolio's `#person`,
  `serviceType` "Web and app development", two `Offer`s (first working
  version + continued build). Neither carries a `price`/`priceCurrency`
  — the marketing copy intentionally avoids advertising "free" or
  fixed-price terms; the descriptions describe the flow.

### New file `business/en/index.html`
The English-canonical mirror. Same React app, but the head declares
`<html lang="en" dir="ltr">`, EN OG/Twitter/JSON-LD strings, EN
canonical, and the pre-paint script forces `bm:lang="en"`,
`window.__bmLang="en"`, `html.dir="ltr"` regardless of saved state. This
guarantees crawlers and link previews see EN at this URL even if the
user has `bm:lang="he"` saved locally. The React app's in-page lang
toggle still works — it just doesn't navigate. See **Behavior contract**
below.

### New file `public/og-business.svg`
1200×630 marketing-specific OG design source. Not yet referenced by
any `og:image` (see "Still research-only" above).

### New file `public/business.webmanifest`
Web app manifest scoped to `/bar-portfolio/business/`. HE locale,
RTL, marketing theme colors. Icons currently point at the existing
`og-cover.jpg` as a single placeholder.

### `public/sitemap.xml`
- `lastmod` bumped to `2026-05-18` on both existing URLs.
- `xmlns:xhtml` on `<urlset>`.
- `<xhtml:link>` hreflang alternates on the `/business/` URL.
- New `<url>` for `/business/en/` with its own hreflang alternates.

### `vite.config.ts`
Added `businessEn: 'business/en/index.html'` as the fourth entry.

### `CLAUDE.md`
Top-of-file entries table updated to four rows; item #9 in "Things that
must not be broken" updated to four inputs; routing list got a new line
pointing here.

## Behavior contract — per-language URLs

| URL | Declared lang | Pre-paint script | When users land here |
|---|---|---|---|
| `/business/` | `he` | Reads `bm:lang`. On first visit, rolls 70/30 HE/EN and persists. Honors saved choice on return. | Direct shares from Bar (WhatsApp, IL search results). |
| `/business/en/` | `en` | Always forces `bm:lang="en"`. No random pick. | EN search results, EN social shares, anyone clicking an `hreflang="en"` link. |

Why force EN on the EN URL and not just respect `bm:lang`? Because the
URL is the canonical declaration. A crawler or a link-preview fetcher
has no `localStorage`, so they always see the HTML's declared language —
that's correct. A real user who has previously toggled to HE on the
main URL but follows an EN link should see EN on the EN URL (otherwise
the URL is lying to its referrer). The user can still toggle to HE
in-page via the React lang button; doing so does not change the URL.

This means a sub-case exists where a user is on `/business/en/` and
toggles to HE in the React app — the visible content is HE while the
URL still says EN. This is acceptable: it's an explicit user action,
the URL still owns the canonical signal, and a refresh resets to EN.

## Maintenance notes

- If `src/marketing/i18n.ts` `qa.items` changes, regenerate the
  `FAQPage` JSON-LD block in **both** `business/index.html` and
  `business/en/index.html`. There is currently no build step that keeps
  them in sync — they're hand-mirrored.
- If the canonical URL changes (e.g. a repo rename — see CLAUDE.md
  "Things that must not be broken" item 3), update every `href` in the
  hreflang blocks in both HTML files, every `<loc>` and `xhtml:link` in
  the sitemap, and `start_url`/`scope` in `business.webmanifest`, all
  in lockstep.
- Keep the pre-paint script (`business/index.html:104–136`) and
  `og:locale` in agreement: today both default to Hebrew. If the 70/30
  weighting flips, change `og:locale` to match the majority.
- Keep `Service.offers` aligned with the FAQ Q&A around the build flow.
  Today both reflect: build a first working version (3–7 days), then
  agree the continuation in a conversation — no advertised price, no
  hard payment terms in the public copy. If that framing changes,
  update both.

## Verification

1. `npm run lint` — required by CI (`.github/workflows/deploy.yml`).
2. `npm run typecheck` — no TS changes, but worth running.
3. `npm run build` — must emit **four** Vite entries to `dist/`
   (`main`, `business`, `businessEn`, `backoffice`).
4. `npm run preview` → open both:
   - `http://localhost:4173/bar-portfolio/business/` — view source,
     confirm HE meta, hreflang `en` points at `/business/en/`, FAQ +
     Service JSON-LD present.
   - `http://localhost:4173/bar-portfolio/business/en/` — confirm EN
     meta, page paints in English (pre-paint forces `bm:lang="en"`),
     hreflang `he` points back at `/business/`.
5. **Rich Results Test** —
   https://search.google.com/test/rich-results against both deployed
   URLs after merge. Expect `AboutPage` + `FAQPage` + `Service`
   detected on each, zero errors.
6. **Social card previews** — paste both deployed URLs into
   https://www.opengraph.xyz/ and LinkedIn's Post Inspector. Expect
   each URL renders in its declared language with no duplicated
   phrases.
7. **Manual smoke test** — language toggle, theme toggle, and
   `prefers-reduced-motion` still behave; none of these changes touch
   runtime code, but worth a 30s smoke test on both URLs.
