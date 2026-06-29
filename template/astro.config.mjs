import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'astro/config';

// Locales are derived from the folders under content/ — add content/<lang>/
// and that language is part of the site automatically. English is required
// (it is the default locale); a missing content/en fails the build on purpose.
const contentDir = fileURLToPath(new URL('../content', import.meta.url));
const locales = fs
  .readdirSync(contentDir, { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();

if (!locales.includes('en')) {
  throw new Error(
    `content/en is required (it is the default locale) but was not found. ` +
      `Locales discovered: ${locales.join(', ') || '(none)'}`,
  );
}

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'en',
    locales,
  },
  // Root lands on the default locale. Every locale is prefixed by the [lang]
  // route; the language switch appears on every mirrored page.
  redirects: {
    '/': '/en',
  },
});
