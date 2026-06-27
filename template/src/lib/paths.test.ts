import { describe, it, expect } from 'vitest';
import { parseId, routeSlug, entryUrl, otherLang, LANGS, DEFAULT_LANG } from './paths';

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

describe('otherLang', () => {
  it('toggles language', () => {
    expect(otherLang('en')).toBe('ru');
    expect(otherLang('ru')).toBe('en');
  });
});

describe('constants', () => {
  it('exposes languages and default', () => {
    expect(LANGS).toEqual(['en', 'ru']);
    expect(DEFAULT_LANG).toBe('en');
  });
});
