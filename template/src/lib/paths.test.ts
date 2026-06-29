import { describe, it, expect } from 'vitest';
import { parseId, routeSlug, entryUrl, pageId, locales, localeLinks } from './paths';

describe('parseId', () => {
  it('splits language and slug', () => {
    expect(parseId('en/values')).toEqual({ lang: 'en', slug: 'values' });
    expect(parseId('ru/index')).toEqual({ lang: 'ru', slug: 'index' });
  });
});

describe('routeSlug', () => {
  it('maps index to empty string', () => {
    expect(routeSlug('index')).toBe('');
  });
  it('passes other slugs through', () => {
    expect(routeSlug('values')).toBe('values');
  });
});

describe('entryUrl', () => {
  it('builds the home url for index', () => {
    expect(entryUrl('en', 'index')).toBe('/en');
    expect(entryUrl('ru', 'index')).toBe('/ru');
  });
  it('builds a sub-page url', () => {
    expect(entryUrl('en', 'values')).toBe('/en/values');
  });
});

describe('locales', () => {
  it('returns sorted unique languages from collection ids', () => {
    const ids = ['en', 'en/values', 'ru', 'ru/values', 'fr', 'fr/values'];
    expect(locales(ids)).toEqual(['en', 'fr', 'ru']);
  });
});

describe('localeLinks', () => {
  const ids = ['en', 'en/values', 'ru', 'ru/values', 'fr'];

  it('includes every locale and flags the current one', () => {
    const links = localeLinks(ids, 'en', 'values');
    expect(links.map((l) => l.lang)).toEqual(['en', 'fr', 'ru']);
    expect(links.find((l) => l.lang === 'en')?.current).toBe(true);
    expect(links.find((l) => l.lang === 'ru')?.current).toBe(false);
  });
  it('links a missing mirror to that locale home instead of a 404', () => {
    // fr has no /values page, so its link falls back to /fr
    const links = localeLinks(ids, 'en', 'values');
    expect(links.find((l) => l.lang === 'fr')?.href).toBe('/fr');
    expect(links.find((l) => l.lang === 'ru')?.href).toBe('/ru/values');
  });
  it('links each locale home for the home page (empty slug)', () => {
    const links = localeLinks(ids, 'en', '');
    expect(links.map((l) => l.href)).toEqual(['/en', '/fr', '/ru']);
  });
});

describe('pageId', () => {
  it('builds collection id from lang and slug', () => {
    expect(pageId('ru', 'values')).toBe('ru/values');
    expect(pageId('en', 'index')).toBe('en/index');
  });
  it('uses the bare language code for the home page (empty slug)', () => {
    expect(pageId('ru', '')).toBe('ru');
    expect(pageId('en', '')).toBe('en');
  });
});
