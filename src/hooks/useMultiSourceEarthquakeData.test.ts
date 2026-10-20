import type { EarthquakeFeature } from '@/types/common';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bmkgAutoResponse,
  bmkgRecentResponse,
  geonetResponse,
  usgsResponse,
} from '@/components/tracker/__fixtures__/apiResponses';
import { fetchMultiSourceEarthquakes, pickUSGS, USGS_FEED_URL } from './useMultiSourceEarthquakeData';

const json = (body: unknown) => Promise.resolve(new Response(JSON.stringify(body), { status: 200 }));

const mockFetch = (handler: (url: string) => Promise<Response>) =>
  vi.spyOn(globalThis, 'fetch').mockImplementation((input) => handler(String(input)));

beforeEach(() => {
  vi.spyOn(console, 'warn').mockImplementation(() => {});
});
afterEach(() => vi.restoreAllMocks());

describe('fetchMultiSourceEarthquakes', () => {
  it('merges USGS, GeoNet and BMKG into one list, newest first', async () => {
    mockFetch((url) => {
      if (url.includes('usgs.gov')) return json(usgsResponse);
      if (url.includes('geonet')) return json(geonetResponse);
      if (url.includes('autogempa')) return json(bmkgAutoResponse);
      if (url.includes('gempaterkini')) return json(bmkgRecentResponse);
      return Promise.reject(new Error(url));
    });
    const data = await fetchMultiSourceEarthquakes();
    const ids = data.features.map((f) => f.id);
    // USGS: 2 valid (one null magnitude dropped, repeats from the two queries removed).
    // GeoNet: 1 valid (one deleted). BMKG: 3.
    expect(ids).toHaveLength(6);
    expect(ids).toContain('geonet_2026p789411');
    expect(data.features.every((f) => Number.isFinite(f.geometry.coordinates[0]))).toBe(true);
    expect(data.features.every((f) => Number.isFinite(f.properties.mag))).toBe(true);
    const times = data.features.map((f) => f.properties.time);
    expect(times).toEqual([...times].sort((a, b) => b - a));
    expect(data.metadata.count).toBe(6);
  });

  it('asks USGS once, for the ready-made 30-day feed, not the slow search API', async () => {
    const spy = mockFetch(() => json({ features: [] }));
    await fetchMultiSourceEarthquakes();
    const usgs = spy.mock.calls.map(([u]) => String(u)).filter((u) => u.includes('usgs.gov'));
    expect(usgs).toEqual([USGS_FEED_URL]);
  });

  it('still shows the other sources when one fails', async () => {
    mockFetch((url) => (url.includes('usgs.gov') ? Promise.reject(new Error('502')) : json(geonetResponse)));
    const data = await fetchMultiSourceEarthquakes();
    expect(data.features.map((f) => f.id)).toEqual(['geonet_2026p789411']);
  });

  it('throws when every source fails, so the page shows the error state', async () => {
    mockFetch(() => Promise.reject(new TypeError('Failed to fetch')));
    await expect(fetchMultiSourceEarthquakes()).rejects.toThrow();
  });
});

describe('pickUSGS', () => {
  const quake = (id: string, lon: number, lat: number, time: number) =>
    ({ id, type: 'Feature', properties: { mag: 3, place: id, time }, geometry: { type: 'Point', coordinates: [lon, lat, 10] } }) as unknown as EarthquakeFeature;

  it('keeps the newest 100 worldwide and every older one near the Philippines', () => {
    const far = Array.from({ length: 150 }, (_, i) => quake(`far${i}`, -150, 60, 10_000 - i));
    const oldNearPH = quake('mindanao-old', 126, 7, 1);
    const picked = pickUSGS([oldNearPH, ...far]);
    expect(picked).toHaveLength(101);
    expect(picked.map((q) => q.id)).toContain('mindanao-old');
    expect(picked.map((q) => q.id)).not.toContain('far149');
  });

  it('does not list a quake near the Philippines twice', () => {
    const picked = pickUSGS([quake('luzon', 121, 16, 5)]);
    expect(picked.map((q) => q.id)).toEqual(['luzon']);
  });

  it('gives nothing for an empty feed', () => expect(pickUSGS([])).toEqual([]));
});
