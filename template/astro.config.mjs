import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  // Root lands on the default locale. Both en and ru are prefixed by the
  // [lang] route; the language switch appears on every mirrored page.
  redirects: {
    '/': '/en',
  },
});
