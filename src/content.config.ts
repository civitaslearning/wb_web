import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Fields that keep the SEO signals of the old site.
const seo = {
  seoTitle: z.string().optional(),
  noindex: z.boolean().optional(),
  source: z.string().url().optional(),
  date: z.string().optional(),
  updated: z.string().optional(),
  image: z.string().optional(),
  imageAlt: z.string().optional(),
  /** Set by scripts/import-wp.py. Files without it are hand-curated and never overwritten. */
  imported: z.boolean().optional(),
};

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    institution: z.string().default(''),
    type: z.string(),
    headline: z.string(),
    summary: z.string(),
    logo: z.string().optional(),
    outcomes: z.array(z.object({ value: z.string(), metric: z.string() })).default([]),
    solutions: z.array(z.string()).default([]),
    quote: z.object({ text: z.string(), name: z.string(), title: z.string() }).optional(),
    order: z.number(),
    ...seo,
  }),
});

const podcast = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    guest: z.string().default(''),
    description: z.string(),
    order: z.number(),
    url: z.string(),
    ...seo,
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    author: z.string().default('Civitas Learning'),
    tags: z.array(z.string()).default([]),
    ...seo,
    date: z.string(),
  }),
});

const news = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/news' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    ...seo,
    date: z.string(),
  }),
});

// Pages imported from the old site that have no template of their own.
const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    title: z.string(),
    description: z.string().default(''),
    path: z.string(),
    ...seo,
  }),
});

export const collections = { stories, podcast, blog, news, pages };
