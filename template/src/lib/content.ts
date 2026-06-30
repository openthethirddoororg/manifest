import { getCollection } from 'astro:content';

/**
 * The pages that should be published. Drafts (`draft: true` in frontmatter)
 * are hidden in production builds — no page, nav entry, language-switch link,
 * or sitemap entry — but kept visible in `astro dev` so you can preview them.
 *
 * Use this everywhere instead of `getCollection('pages')` so drafts are
 * filtered consistently across routing, navigation, the language switch, and SEO.
 */
export async function getPages() {
  return getCollection('pages', ({ data }) => (import.meta.env.PROD ? !data.draft : true));
}
