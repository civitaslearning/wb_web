import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const stories = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/stories' }),
  schema: z.object({
    institution: z.string(),
    type: z.string(),
    headline: z.string(),
    summary: z.string(),
    logo: z.string().optional(),
    outcomes: z.array(z.object({ value: z.string(), metric: z.string() })),
    solutions: z.array(z.string()).default([]),
    quote: z.object({ text: z.string(), name: z.string(), title: z.string() }).optional(),
    order: z.number(),
    source: z.string().url(),
  }),
});

const podcast = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    guest: z.string().default(''),
    description: z.string(),
    order: z.number(),
    url: z.string().url(),
  }),
});

export const collections = { stories, podcast };
