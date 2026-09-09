import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import solutions from '../data/solutions.json';

/**
 * Sitemap for search engines. Lists every page the site builds, except pages
 * marked noindex. Paths match the old site, so the sitemap keeps its coverage.
 */
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://www.civitaslearning.com')).toString().replace(/\/$/, '');
  const urls: { path: string; lastmod?: string }[] = [];

  // Static templates in src/pages. Dynamic routes are added from their data below.
  const files = import.meta.glob('./**/*.astro');
  for (const file of Object.keys(files)) {
    if (file.includes('[')) continue;
    const path = file.replace(/^\.\//, '/').replace(/\.astro$/, '').replace(/\/index$/, '');
    urls.push({ path: path === '' ? '/' : path + '/' });
  }
  for (const s of solutions) urls.push({ path: `/${s.slug}/` });

  const blog = (await getCollection('blog')).filter((p) => !p.data.noindex);
  for (const p of blog) urls.push({ path: `/blog/${p.id}/`, lastmod: p.data.updated || p.data.date });
  const pages = Math.ceil(blog.length / 9);
  for (let n = 2; n <= pages; n++) urls.push({ path: `/blog/page/${n}/` });

  for (const e of await getCollection('podcast')) if (!e.data.noindex) urls.push({ path: `/podcast/${e.id}/`, lastmod: e.data.updated || e.data.date });
  for (const s of await getCollection('stories')) if (!s.data.noindex) urls.push({ path: `/customer-success-stories/${s.id}/`, lastmod: s.data.updated || s.data.date });
  for (const n of await getCollection('news')) if (!n.data.noindex) urls.push({ path: `/press/${n.id}/`, lastmod: n.data.updated || n.data.date });
  for (const p of await getCollection('pages')) if (!p.data.noindex) urls.push({ path: p.data.path, lastmod: p.data.updated });

  const seen = new Set<string>();
  const body = urls
    .filter((u) => (seen.has(u.path) ? false : (seen.add(u.path), true)))
    .sort((a, b) => a.path.localeCompare(b.path))
    .map((u) => `  <url><loc>${base}${u.path}</loc>${u.lastmod ? `<lastmod>${u.lastmod}</lastmod>` : ''}</url>`)
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
