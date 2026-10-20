import { describe, expect, it } from 'vitest';
import en from '@/i18n/locales/en';
import tl from '@/i18n/locales/tl';
import es from '@/i18n/locales/es';
import ja from '@/i18n/locales/ja';

const keys = (obj: unknown, prefix = ''): string[] =>
  obj && typeof obj === 'object' && !Array.isArray(obj)
    ? Object.entries(obj).flatMap(([k, v]) => keys(v, prefix ? `${prefix}.${k}` : k))
    : [prefix];

const plain = (key: string) => key.replace(/_(one|other)$/, '');

describe.each(['guides', 'resources'] as const)('%s translations', (ns) => {
  const enKeys = keys(en[ns]).map(plain).sort();

  it.each([
    ['tl', tl],
    ['es', es],
    ['ja', ja],
  ] as const)('%s has every English key', (_code, locale) => {
    const localeKeys = new Set(keys(locale[ns]).map(plain));
    expect(enKeys.filter((k) => !localeKeys.has(k))).toEqual([]);
  });

  it.each([
    ['en', en],
    ['tl', tl],
    ['es', es],
    ['ja', ja],
  ] as const)('%s has no US-only kit text or old name', (_code, locale) => {
    const text = JSON.stringify(locale[ns]);
    expect(text).not.toMatch(/gallon|galon|NOAA|ガロン|QuakeSafe|real-time|tiempo real/i);
  });
});
