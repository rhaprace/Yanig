import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bmkgAutoResponse,
  bmkgRecentResponse,
  geonetResponse,
  usgsResponse,
} from '@/components/tracker/__fixtures__/apiResponses';
import { fetchMultiSourceEarthquakes } from './useMultiSourceEarthquakeData';

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

  it('asks USGS for the Philippines box as well as the world', async () => {
    const spy = mockFetch(() => json({ features: [] }));
    await fetchMultiSourceEarthquakes();
    const urls = spy.mock.calls.map(([u]) => String(u));
    expect(urls.some((u) => u.includes('minlatitude=3') && u.includes('maxlongitude=130'))).toBe(true);
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
