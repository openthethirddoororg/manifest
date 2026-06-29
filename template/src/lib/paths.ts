export type Lang = 'en' | 'ru';

export const LANGS: Lang[] = ['en', 'ru'];
export const DEFAULT_LANG: Lang = 'en';

export interface ParsedId {
  lang: Lang;
  slug: string;
}

/** Split a collection id like "en/values" into language and slug. */
export function parseId(id: string): ParsedId {
  const [lang, ...rest] = id.split('/');
  return { lang: lang as Lang, slug: rest.join('/') };
}

/** "index" is the home page (empty route slug); everything else passes through. */
export function routeSlug(slug: string): string {
  return slug === 'index' ? '' : slug;
}

/** Build the URL for a page: "/en" for home, "/en/values" otherwise. */
export function entryUrl(lang: Lang, slug: string): string {
  const r = routeSlug(slug);
  return r ? `/${lang}/${r}` : `/${lang}`;
}

/** The other supported language. */
export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'ru' : 'en';
}

/**
 * Collection id for a page: pageId('ru','values') === 'ru/values'.
 * The home page has an empty slug and its id is just the language code
 * (the glob loader maps content/ru/index.md to id "ru"), so don't append a
 * trailing slash — pageId('ru','') === 'ru'.
 */
export function pageId(lang: Lang, slug: string): string {
  return slug ? `${lang}/${slug}` : lang;
}
