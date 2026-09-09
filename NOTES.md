# NOTES.md — handoff for Claude Code

Context for this repository. Read before doing anything. Written 2026-09-09.

## What this is

A prototype rebuild of **civitaslearning.com** in Astro, with new positioning. It replaces
nothing yet. The live site is WordPress (X theme). This repo is the candidate replacement,
built to keep the live URL structure so SEO does not move.

Owner: Will Ballard, CEO. Board feedback came from Nick Zeppos.

## State right now

- Three commits on `master`. Clean tree. Built and checked in a cloud container: 39 pages, no
  broken images, no JS errors.
- `node_modules/` may be present from an install done through a sandbox. `npm ci` is safe.
- A file `../civitas-site.bundle` sits next to this folder with the full history. `NOTES.md`
  and `DESIGN.md` are tracked in the bundle but were dropped into this folder untracked, so:
  `rm NOTES.md DESIGN.md && git fetch ../civitas-site.bundle master && git merge --ff-only
  FETCH_HEAD && rm ../civitas-site.bundle`. Then `git log` shows three commits.
- A folder `../_to_delete_wb_web_partial` may exist. Delete it. It is an aborted clone.
- Files `../setup-github.sh` and `../setup-github.command` may exist. They are an obsolete
  workaround. Delete them.
- No GitHub remote yet.

## Next steps (the immediate ask)

1. `gh repo create civitaslearning/wb_web --private --source=. --remote=origin --push`
2. Enable Pages with the workflow as source:
   `gh api -X POST repos/civitaslearning/wb_web/pages -f build_type=workflow`
   (if the org plan refuses Pages on a private repo, say so and stop; do not make it public
   without asking — the site shows unreleased positioning and named customer numbers).
3. `gh workflow run pages.yml --ref master`, then `gh run watch`.
4. Report the preview URL: `https://civitaslearning.github.io/wb_web/`.

## Repository map

| Path | Purpose |
|---|---|
| `src/layouts/Base.astro` | The one HTML shell: head, fonts, canonical, header, footer |
| `src/components/Header.astro`, `Footer.astro` | Shared chrome; menus come from `src/data/nav.json` |
| `src/components/Logo.astro` | Real wordmark SVG from the live site; fills are `currentColor` |
| `src/styles/site.css` | All styles. Brand tokens at the top: navy `#001F4C` / `#0F3773`, cyan `#02ADF2`, orange `#FF530C`. Fonts Sora (display), Nunito Sans (body), IBM Plex Mono (labels). Single light theme on purpose. |
| `src/pages/index.astro` | Home page. Its `<script>` builds the example impact ledger and the ROI calculator. |
| `src/pages/[slug].astro` | One template for the 14 solution and use-case pages. Driven by `src/data/solutions.json` (`kind` is `solutions` or `usecases`). |
| `src/components/Sections.astro` | Renders crawled sections: body + screenshot → feature row; bullets + screenshots → image card grid; bullets + SVGs → icon cards; "For X" → role grid with role image; "Why…/How Civitas…" → checklist. |
| `src/content/stories/*.md` | 9 customer stories, front matter schema in `src/content.config.ts`. Rendered by `src/pages/customer-success-stories/[id].astro`. Slugs match the live site. |
| `src/content/podcast/*.md` | 9 episodes, link out to the live site. |
| `src/data/pages.json` | Remaining crawled copy (resources, blog, careers, support, commitment, webinar, workshops). |
| `src/data/customers.json`, `team.json` | Logo strip and leadership team. |
| `public/assets/screens/` | 67 product screenshots and icons from the live solution pages (WebP, ≤1000px). Mapped to sections by `scripts/map-screens.py` from `scripts/screens-inventory.json`. |
| `public/assets/` | 15 customer logos, 4 headshots, 2026 report cover — all pulled from the live site. |
| `.github/workflows/pages.yml` | Build + deploy to GitHub Pages. Rewrites root-relative URLs to `/wb_web/` after the build because Pages serves under a subpath. That step is preview-only. |

## Positioning decisions (do not undo without asking Will)

- Headline: **"Every vendor sells AI. We prove what works."** Competing on proof, not on "AI".
  Element451 (main competitor) sells agents that reduce workload and proves it with activity
  volume. Civitas proves outcomes against matched comparison groups. That is the wedge.
- Frame is **institutional effectiveness**, with student success as the lead use case (Nick's
  feedback). The hero and the "one institution, one dataset" section carry that.
- **Integrations are a headline claim**: Banner, PeopleSoft, Workday, Slate, Canvas,
  Salesforce, Element451, and 100+ systems. Civitas reads from the competitor's CRM.
  "Nothing gets replaced."
- Element451 is never named as a competitor on the site. It appears only as an integration.
- No "bring your data" demo promise. Prospects cannot share data pre-sale. The CTA is
  "bring your questions"; the working session starts from public IPEDS figures.
- The `$4 : $1` line was removed from the ROI calculator on request. It stays in the stat band
  and the outcomes card.
- Proof uses one number and one named institution, never ranges.
- No internal jargon ("Institutional Impact Management", "Impact Platform") in headlines.

## Claims to verify before this goes near production

- The four "beyond the student journey" items (course demand, program portfolio, aid leverage,
  IR) and the finance/accountability outcomes are directional. Confirm product support or
  relabel as roadmap.
- The example ledger data and the calculator math are illustrative and labeled "example".
- Institution sizes on outcome cards are approximate.
- The integration list on the home page was extended by Will's statement ("PeopleSoft,
  Element451, and 100 other systems"); the platform page list is from the live site.

## Known gaps

- Video embeds (webinar page, podcast) are placeholders; the live site uses HubSpot.
- Contact and subscribe forms are demo-only (`data-demo` attribute, no submit).
- Blog posts and podcast episodes link to the live site; only index pages are local.
- Legal pages (privacy, accessibility) link to the live site.
- Mobile nav: the burger button is present but has no menu behavior yet.
- Screenshot-to-section mapping is heuristic (heading and alt text). Spot-check each page once.

## Sources of the content

- Live site crawl on 2026-09-08/09: home, platform, ai-solutions, analytics, workflows,
  data-lakehouse, strategic-services-2, leadership-workshops, nine use-case pages, nine
  customer stories, resources, blog (page 1), podcast, press, about, our-team, careers,
  contact, support, commitment.
- Element451 crawl: home, pricing, Bolt launch press release (June 2026).
- Assets fetched from `civitaslearning.com/wp-content/uploads/2026/…`.

## Conventions

- Keep root-relative links (`/platform/`). Do not add a `base` to `astro.config.mjs`; the
  Pages workflow handles the subpath.
- One fact per line in front matter; text stays as crawled unless Will rewrites it.
- Commit messages: plain, imperative, no ticket numbers.
