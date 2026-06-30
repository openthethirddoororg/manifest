import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  // base is relative to the Astro project root (template/) → repo-level /content
  loader: glob({ pattern: '**/*.md', base: '../content' }),
  schema: z.object({
    title: z.string(),
    order: z.number(),
    description: z.string().optional(),
    // draft: true → hidden from production builds (no page, nav, switch, sitemap),
    // still visible in `astro dev` for previewing.
    draft: z.boolean().default(false),
  }),
});

export const collections = { pages };
