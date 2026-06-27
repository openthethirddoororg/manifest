import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://openthethirddoor.org',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'ru'],
  },
  // Root → default locale. en/ru are prefixed by the [lang] route itself.
  redirects: {
    '/': '/en',
  },
});
