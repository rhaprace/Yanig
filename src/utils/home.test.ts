import { describe, expect, it } from 'vitest';
import type { EarthquakeFeature } from '@/hooks/useEarthquakeData';
import { countries } from '@/config/countries';
import { depthKm, homeQuakes, newestQuakes, secondLanguage, sourceName, stepForKey, timeAgo, toTelHref } from './home';

const quake = (id: string, time: number, depth: number = 10, net = 'us') =>
  ({
    id,
    type: 'Feature',
    properties: { time, net, mag: 4.2, place: 'Somewhere' },
    geometry: { type: 'Point', coordinates: [120, 14, depth] },
  }) as unknown as EarthquakeFeature;

describe('toTelHref', () => {
  it('adds the Philippine country code to an area number', () => {
    expect(toTelHref('(02) 8911-1406', 'PH')).toBe('tel:+63289111406');
    expect(toTelHref('(02) 8527-8481', 'PH')).toBe('tel:+63285278481');
  });

  it('keeps short numbers as they are', () => {
    expect(toTelHref('911', 'PH')).toBe('tel:911');
    expect(toTelHref('143', 'PH')).toBe('tel:143');
  });

  it('removes spaces, dashes and brackets from other numbers', () => {
    expect(toTelHref('1-800-621-3362', 'US')).toBe('tel:18006213362');
  });

  it('gives a callable link for every configured hotline', () => {
    for (const config of Object.values(countries)) {
      for (const contact of config.emergencyNumbers) {
        expect(toTelHref(contact.number, config.code)).toMatch(/^tel:\+?\d{3,}$/);
      }
    }
  });
});

describe('sourceName', () => {
  it('names the source of each record', () => {
    expect(sourceName('geonet')).toBe('GeoNet');
    expect(sourceName('bmkg')).toBe('BMKG');
    expect(sourceName('us')).toBe('USGS');
    expect(sourceName('ak')).toBe('USGS');
    expect(sourceName(undefined)).toBe('USGS');
  });
});

describe('newestQuakes', () => {
  it('returns the newest quakes first, limited to the count', () => {
    const list = [quake('a', 1), quake('b', 5), quake('c', 3), quake('d', 4), quake('e', 2), quake('f', 6)];
    expect(newestQuakes(list, 5).map((q) => q.id)).toEqual(['f', 'b', 'd', 'c', 'e']);
  });

  it('handles no data', () => {
    expect(newestQuakes(undefined)).toEqual([]);
  });

  it('drops records without a valid time', () => {
    expect(newestQuakes([quake('a', Number.NaN), quake('b', 2)]).map((q) => q.id)).toEqual(['b']);
  });
});

describe('depthKm', () => {
  it('rounds the depth', () => {
    expect(depthKm(quake('a', 1, 10.6))).toBe(11);
  });

  it('returns null when BMKG gives no depth', () => {
    expect(depthKm(quake('a', 1, Number.NaN))).toBeNull();
  });
});

describe('timeAgo', () => {
  const now = Date.UTC(2026, 9, 20, 12);
  it('uses minutes, hours and days', () => {
    expect(timeAgo(now - 5 * 60_000, 'en', now)).toBe('5 minutes ago');
    expect(timeAgo(now - 3 * 3_600_000, 'en', now)).toBe('3 hours ago');
    expect(timeAgo(now - 2 * 86_400_000, 'en', now)).toBe('2 days ago');
  });

  it('works for Tagalog', () => {
    expect(timeAgo(now - 5 * 60_000, 'tl', now)).toMatch(/5/);
  });
});

describe('secondLanguage', () => {
  it('puts Tagalog under other languages and English under Tagalog', () => {
    expect(secondLanguage('en')).toBe('tl');
    expect(secondLanguage('ja')).toBe('tl');
    expect(secondLanguage('tl')).toBe('en');
  });
});

describe('stepForKey', () => {
  it('moves between the three steps and stops at the ends', () => {
    expect(stepForKey('ArrowRight', 0)).toBe(1);
    expect(stepForKey('ArrowRight', 2)).toBe(2);
    expect(stepForKey('ArrowLeft', 0)).toBe(0);
    expect(stepForKey('ArrowLeft', 2)).toBe(1);
    expect(stepForKey('Home', 2)).toBe(0);
    expect(stepForKey('End', 0)).toBe(2);
    expect(stepForKey('Enter', 1)).toBeNull();
  });
});

describe('homeQuakes', () => {
  const quake = (id: string, lon: number, lat: number, time: number) =>
    ({ id, type: 'Feature', properties: { mag: 4, place: id, time }, geometry: { type: 'Point', coordinates: [lon, lat, 10] } }) as unknown as EarthquakeFeature;

  it('shows earthquakes near the Philippines before newer ones far away', () => {
    const result = homeQuakes([quake('alaska', -150, 60, 300), quake('mindanao', 126, 7, 100), quake('luzon', 121, 16, 200)]);
    expect(result.nearPhilippines).toBe(true);
    expect(result.quakes.map((q) => q.id)).toEqual(['luzon', 'mindanao']);
  });

  it('falls back to the newest from anywhere when none are near the Philippines', () => {
    const result = homeQuakes([quake('alaska', -150, 60, 300), quake('chile', -70, -30, 400)]);
    expect(result.nearPhilippines).toBe(false);
    expect(result.quakes.map((q) => q.id)).toEqual(['chile', 'alaska']);
  });
});
