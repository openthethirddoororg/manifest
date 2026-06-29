import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'ru',
    locales: ['en', 'ru'],
  },
  // Only Russian content exists for now, so root lands on /ru. When English
  // content is added under content/en/, switch this back to /en (and the
  // language switch will appear automatically on mirrored pages).
  redirects: {
    '/': '/ru',
  },
});
