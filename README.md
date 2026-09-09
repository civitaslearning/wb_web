# civitaslearning.com — Astro prototype

Static site built with [Astro](https://astro.build). URL structure matches the live WordPress site, so nothing changes for SEO.

## Run

```
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview
```

## Layout

| Path | What |
|---|---|
| `src/layouts/Base.astro` | The one HTML shell: head, fonts, header, footer |
| `src/components/Header.astro`, `Footer.astro` | Shared chrome, driven by `src/data/nav.json` |
| `src/components/Logo.astro` | Wordmark SVG from the live site (fills use `currentColor`) |
| `src/styles/site.css` | All styles; brand tokens at the top |
| `src/pages/index.astro` | Home page and its two scripts (impact ledger, ROI calculator) |
| `src/pages/[slug].astro` | One template for all 14 solution and use-case pages, driven by `src/data/solutions.json` |
| `src/components/Sections.astro` | Turns page sections into feature rows, checklists, and role grids |
| `src/content/stories/*.md` | One Markdown file per customer story; rendered by `customer-success-stories/[id].astro` |
| `src/content/podcast/*.md` | One file per episode |
| `src/data/*.json` | Nav, customer logos, team, and the remaining page copy from the crawl |
| `src/components/mocks/` | Three example UI tables. Replace with product screenshots. |
| `public/assets/` | Customer logos, headshots, and the report cover from the live site |

## Adding content

- New customer story: add `src/content/stories/<slug>.md` with the front matter fields in `src/content.config.ts`. The index and the story page pick it up.
- New solution or use-case page: add an object to `src/data/solutions.json`. The `slug` becomes the path.
- Nav or footer link: edit `src/data/nav.json`.

## Deploy

Any static host. Cloudflare Pages, Netlify, or Vercel: connect the repository, build command `npm run build`, output directory `dist`.

## Open items

- Video embeds (webinar, podcast) are placeholders. Drop in the HubSpot or YouTube embed.
- Contact and subscribe forms are demo-only (`data-demo`). Wire them to HubSpot or the host's form handler.
- Legal pages (privacy, accessibility) link to the live site.
