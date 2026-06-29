/** A locale code — the name of a top-level folder under content/ (e.g. "en"). */
export type Lang = string;

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

/**
 * Collection id for a page: pageId('ru','values') === 'ru/values'.
 * The home page has an empty slug and its id is just the language code
 * (the glob loader maps content/ru/index.md to id "ru"), so don't append a
 * trailing slash — pageId('ru','') === 'ru'.
 */
export function pageId(lang: Lang, slug: string): string {
  return slug ? `${lang}/${slug}` : lang;
}

/** Sorted, unique locale codes present in a list of collection ids. */
export function locales(ids: string[]): Lang[] {
  const seen = new Set(ids.map((id) => parseId(id).lang));
  return [...seen].sort();
}

export interface LocaleLink {
  lang: Lang;
  href: string;
  current: boolean;
}

/**
 * Every site locale, for the language switch. The current locale is flagged
 * (rendered highlighted, not as a link). Each other locale links to this
 * page's mirror when it exists, otherwise to that locale's home — so a link
 * is always valid even before a page is translated. Derived from the
 * collection ids, so adding a content/<lang>/ folder adds it automatically.
 */
export function localeLinks(ids: string[], lang: Lang, slug: string): LocaleLink[] {
  return locales(ids).map((other) => ({
    lang: other,
    current: other === lang,
    href: ids.includes(pageId(other, slug)) ? entryUrl(other, slug) : entryUrl(other, ''),
  }));
}
