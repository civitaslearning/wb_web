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
| `src/layouts/Base.astro` | The one HTML shell: head, SEO tags, fonts, header, footer |
| `src/components/Header.astro`, `Footer.astro` | Shared chrome, driven by `src/data/nav.json` |
| `src/components/Logo.astro` | Wordmark SVG from the live site (fills use `currentColor`) |
| `src/styles/site.css` | All styles; brand tokens at the top |
| `src/pages/index.astro` | Home page and its two scripts (impact ledger, ROI calculator) |
| `src/pages/[slug].astro` | One template for all 14 solution and use-case pages, driven by `src/data/solutions.json` |
| `src/pages/[...path].astro` | Template for pages imported from the live site: legal pages, EduStream, open positions, gated resource pages |
| `src/pages/blog/[...page].astro`, `blog/[slug].astro` | Blog index (`/blog/`, `/blog/page/N/`) and blog posts |
| `src/pages/podcast/[slug].astro`, `press/[slug].astro` | Podcast episode and news pages |
| `src/pages/sitemap.xml.ts` | Sitemap for every page that is not `noindex` |
| `src/components/Sections.astro` | Turns page sections into feature rows, checklists, and role grids |
| `src/content/blog/*.md` | One Markdown file per blog post |
| `src/content/podcast/*.md` | One file per episode |
| `src/content/stories/*.md` | One file per customer story; rendered by `customer-success-stories/[id].astro` |
| `src/content/news/*.md` | Press posts hosted on the site |
| `src/content/pages/*.md` | Imported pages; the `path` field sets the URL |
| `src/data/*.json` | Nav, customer logos, team, and the remaining page copy from the crawl |
| `public/assets/` | Customer logos, headshots, product screenshots, and the report cover |
| `public/assets/wp/` | Images and documents that the imported content references |
| `scripts/import-wp.py` | Imports posts, pages, and media from the live site through its REST API |

## Content from the live site

Blog posts, podcast episodes, customer stories, news, and the pages that have no template of their own come from the WordPress REST API. Each keeps its old path, title tag, meta description, `noindex` flag, and images with alt text. The `source` field in the front matter records the original URL.

To refresh the import:

```
python3 -m venv .venv && .venv/bin/pip install beautifulsoup4 lxml markdownify
.venv/bin/python scripts/import-wp.py --cache /tmp/wp-cache
```

The script does not overwrite the hand-curated customer stories that already exist in `src/content/stories`. It does overwrite blog posts, episodes, news, and imported pages. It keeps the `guest` and `order` fields of existing episode files. `scripts/wp-import-report.json` lists what was written and skipped.

## Adding content

- New blog post: add `src/content/blog/<slug>.md` with `title`, `description`, `date`, and `author`. The index, the pager, and the sitemap pick it up.
- New customer story: add `src/content/stories/<slug>.md` with the front matter fields in `src/content.config.ts`. The index and the story page pick it up.
- New solution or use-case page: add an object to `src/data/solutions.json`. The `slug` becomes the path.
- Nav or footer link: edit `src/data/nav.json`.

## SEO

- `Base.astro` emits the canonical URL, Open Graph tags, and article dates. Pass `seoTitle` to keep an exact title tag from the old site, and `noindex` to keep a page out of search.
- `public/robots.txt` points at `/sitemap.xml`.

## Deploy

GitHub Actions deploys the site to GitHub Pages on every push to `master` (`.github/workflows/pages.yml`). Any static host also works: build command `npm run build`, output directory `dist`.

## Open items

- Video embeds on the webinar page are placeholders. Drop in the HubSpot or YouTube embed.
- Contact and subscribe forms are demo-only (`data-demo`). Wire them to HubSpot or the host's form handler.
- The gated resource pages under `/resources/` had HubSpot forms on the live site. The import keeps the copy and drops the forms.
- The imported customer stories have no structured outcomes yet. Add `outcomes`, `logo`, and `institution` to their front matter as they are reviewed.
