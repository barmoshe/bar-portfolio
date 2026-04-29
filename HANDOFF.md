# Handoff — SEO visibility work

**Branch:** `claude/improve-seo-visibility-66sBh`
**Head commit:** `b03570a` — `feat(seo): add Open Graph, Twitter Card, JSON-LD Person, robots.txt, sitemap`
**Status:** Pushed. Not merged. No PR opened (user has not requested one).

## What shipped on this branch

| File | Change |
|---|---|
| `index.html` | Added: canonical, robots, author, dual `theme-color` (light/dark), full Open Graph block, Twitter Card block, JSON-LD `@graph` containing `Person` (with `sameAs` to GitHub/LinkedIn/TikTok/Facebook) and `WebSite`. Pre-paint theme `<script>` left untouched and **still last in `<head>`** — invariant #1 in `CLAUDE.md`. |
| `public/robots.txt` | New. Allow-all + sitemap pointer to `https://barmoshe.github.io/bar-portfolio/sitemap.xml`. |
| `public/sitemap.xml` | New. Single canonical URL. Hash routes intentionally omitted (Google does not index URL fragments as separate pages). |

Pre-existing `public/.nojekyll` preserved in `dist/`. Vite default `publicDir` copies new files to `dist/` — confirmed by build.

## Source-of-truth values used in JSON-LD

Pulled from `src/data/portfolio.ts:75-83` (contact) and `src/components/sections/Intro.tsx:184-185` (bio). If those change, **also update `index.html`** — there is no runtime templating; the values are static.

- `name`: "Bar Moshe"
- `jobTitle`: "Builder, Full-stack"
- `image` / `og:image`: `https://barmoshe.github.io/bar-portfolio/portraits/img0.png` (928×1152 portrait — see "Known follow-ups" #2)
- `email`: `mailto:1barmoshe1@gmail.com`
- `sameAs`: github, linkedin, tiktok, facebook URLs

## Verification done

- `npm ci && npm run lint` → clean
- `npm run build` → clean. `dist/index.html` = 4.45 kB; `dist/robots.txt` and `dist/sitemap.xml` present; `dist/.nojekyll` preserved.

## Verification still needed (post-deploy, by user)

1. Merge to `main` → GitHub Actions deploys via `.github/workflows/deploy.yml`.
2. Hit live URLs and confirm 200:
   - https://barmoshe.github.io/bar-portfolio/
   - https://barmoshe.github.io/bar-portfolio/robots.txt
   - https://barmoshe.github.io/bar-portfolio/sitemap.xml
3. Paste live URL into:
   - https://search.google.com/test/rich-results — confirm `Person` is detected, no errors.
   - https://www.linkedin.com/post-inspector/ — confirm preview renders.
4. Verify property in [Google Search Console](https://search.google.com/search-console) (URL-prefix: `https://barmoshe.github.io/bar-portfolio/`) and submit the sitemap.

## Known follow-ups (not yet done — pick up here)

1. ~~**Google Search Console verification meta tag.**~~ DONE. Token `J14SUFNrS5ecDD25pC3JGPK-fDgpXOPxOdMRkJV4Sqs` lives in `index.html`. HTML-file fallback at `public/google934215264611e5f3.html` also present. Verified.
2. ~~**Landscape OG image.**~~ DONE. 1200×630 JPG at `public/og-cover.jpg` (76 KB). Generated from `public/og-cover.svg` via `npx --yes @resvg/resvg-js-cli` then JPG-encoded with `sips`. All three refs in `index.html` (og:image, twitter:image, JSON-LD `image`) now point to it. Add `og:image:width`/`og:image:height`/updated `og:image:alt` were also added. To regenerate: edit the SVG, run the same npx + sips chain.

**Sitemap namespace bug (post-deploy fix, 2026-04-26):** Initial commit `b03570a` shipped `public/sitemap.xml` with `xmlns="http://www.sitemap.org/..."` (singular). Google Search Console rejected it as "Sitemap could not be read." Corrected to `http://www.sitemaps.org/...` (plural). After the deploy lands, **resubmit the sitemap in Search Console**.
3. **Backlinks.** No code change — user needs to add `https://barmoshe.github.io/bar-portfolio/` to GitHub profile README, LinkedIn "Websites" section, and any dev.to/Medium bio. Backlinks are the dominant signal for ranking against existing LinkedIn/GitHub results on a name query.
4. **Custom domain (optional, larger lift).** Buying e.g. `barmoshe.dev` and pointing it at GitHub Pages would lift the site off the `github.io` subpath. Steps: A/AAAA DNS records → Settings → Pages → Custom domain → enable HTTPS → change `base: '/bar-portfolio/'` to `base: '/'` in `vite.config.ts` → update every absolute URL in `index.html` (canonical, og:url, og:image, twitter:image, JSON-LD `url`/`image`/`@id`) and in `public/sitemap.xml` and `public/robots.txt`. Also update the GitHub Actions deploy + the `barmoshe.github.io` URLs in any docs under `knowledge/`.
5. **Indexing wait time.** Google typically takes 3–14 days after sitemap submission to crawl + index. Ranking against entrenched LinkedIn/GitHub results for "Bar Moshe" will take ongoing backlink effort; the schema work just makes it possible.

## Invariants the next agent must respect (from `CLAUDE.md`)

- Pre-paint theme `<script>` in `index.html` stays inline and stays the last node in `<head>`. Do not move it into React or externalize it.
- `base: '/bar-portfolio/'` in `vite.config.ts` must match the repo name. If renaming the repo, update absolute URLs in `index.html` + `public/sitemap.xml` + `public/robots.txt` in the same commit.
- `public/.nojekyll` must keep landing in `dist/`.
- No new runtime deps for cosmetic changes — that's why SEO data is static in `index.html`, not via `react-helmet`.
- Run `recipes/a11y-check.md` after any change touching navigation, focus, semantic structure, animation, color tokens, or audio controls. The SEO change above touches none of those.

## Plan file

Full design rationale is at `/root/.claude/plans/plan-replicated-hennessy.md` (outside the repo, in the agent harness).
