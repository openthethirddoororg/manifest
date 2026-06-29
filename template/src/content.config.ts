import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  // base is relative to the Astro project root (template/) → repo-level /content
  loader: glob({ pattern: '**/*.md', base: '../content' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string().optional(),
  }),
});

export const collections = { pages };
