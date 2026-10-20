import { describe, expect, it } from 'vitest';
import { parseLegalSections } from './legal';
import enPrivacy from '@/i18n/locales/en/privacy.json';
import tlPrivacy from '@/i18n/locales/tl/privacy.json';
import enTerms from '@/i18n/locales/en/terms.json';
import tlTerms from '@/i18n/locales/tl/terms.json';
import enAbout from '@/i18n/locales/en/about.json';
import tlAbout from '@/i18n/locales/tl/about.json';
import esAbout from '@/i18n/locales/es/about.json';
import jaAbout from '@/i18n/locales/ja/about.json';

describe('parseLegalSections', () => {
  it('reads valid sections', () => {
    const [section] = parseLegalSections([
      { id: 'a', title: 'A', paragraphs: ['p'], items: ['i'], link: { label: 'L', href: 'https://example.com' } },
    ]);
    expect(section).toMatchObject({ id: 'a', title: 'A', paragraphs: ['p'], items: ['i'], after: [], warning: false });
    expect(section.link).toEqual({ label: 'L', href: 'https://example.com/' });
  });

  it('drops bad sections and unsafe links', () => {
    const sections = parseLegalSections([
      null,
      'text',
      { title: 'no id' },
      { id: 'b', title: 'B', items: ['ok', 3, ''], link: { label: 'x', href: 'javascript:alert(1)' } },
    ]);
    expect(sections).toHaveLength(1);
    expect(sections[0].items).toEqual(['ok']);
    expect(sections[0].link).toBeUndefined();
  });

  it('returns nothing for a missing translation', () => {
    expect(parseLegalSections('sections')).toEqual([]);
    expect(parseLegalSections(undefined)).toEqual([]);
  });
});

const FALSE_CLAIMS = [/quakesafe/i, /real-?\s?time/i, /\blive\b/i, /phivolcs (data|-)/i, /location-based/i, /IndexedDB/];

describe.each([
  ['privacy', enPrivacy, tlPrivacy],
  ['terms', enTerms, tlTerms],
])('%s text', (_name, en, tl) => {
  it('has the same sections in English and Tagalog', () => {
    const ids = (raw: unknown) => parseLegalSections(raw).map((s) => s.id);
    expect(ids(tl.sections)).toEqual(ids(en.sections));
    expect(ids(en.sections).length).toBe(en.sections.length);
  });

  it('makes no false claims', () => {
    // The GitHub repository URL still has the old name; only the words people read are checked.
    const withoutUrls = (value: unknown) => JSON.stringify(value).replace(/https?:\/\/[^"]+/g, '');
    for (const text of [withoutUrls(en), withoutUrls(tl)]) {
      for (const claim of FALSE_CLAIMS) expect(text).not.toMatch(claim);
    }
  });
});

describe('privacy text', () => {
  it('names every service the browser contacts', () => {
    const text = JSON.stringify(enPrivacy);
    for (const service of ['USGS', 'GeoNet', 'BMKG', 'OpenStreetMap', 'NewsAPI', 'localStorage', 'Vercel']) {
      expect(text).toContain(service);
    }
  });
});

const keys = (value: unknown, prefix = ''): string[] =>
  value && typeof value === 'object' && !Array.isArray(value)
    ? Object.entries(value).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

describe('about.json', () => {
  it('has every key in all four languages', () => {
    const en = keys(enAbout).sort();
    expect(keys(tlAbout).sort()).toEqual(en);
    expect(keys(esAbout).sort()).toEqual(en);
    expect(keys(jaAbout).sort()).toEqual(en);
  });

  it('makes no false claims in any language', () => {
    for (const file of [enAbout, tlAbout, esAbout, jaAbout]) {
      const text = JSON.stringify(file);
      for (const claim of [/quakesafe/i, /real-?\s?time/i, /\blive\b/i]) expect(text).not.toMatch(claim);
    }
  });

  it('says Yanig does not use PHIVOLCS data', () => {
    expect(enAbout.official.text2).toMatch(/does not use PHIVOLCS data/);
  });
});
