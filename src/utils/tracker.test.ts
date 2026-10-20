import { describe, expect, it } from 'vitest';
import type { EarthquakeFeature } from '@/types/common';
import {
  bmkgAutoResponse,
  bmkgRecentResponse,
  geonetResponse,
  usgsResponse,
} from '@/components/tracker/__fixtures__/apiResponses';
import {
  convertBMKGQuake,
  convertGeoNetFeature,
  filterEarthquakes,
  formatTimeAgo,
  getSource,
  isNearPhilippines,
  magnitudeStep,
  mergeEarthquakes,
  normalizeUSGSFeature,
  parseBMKGCoordinates,
  parseBMKGMagnitude,
  parseBMKGTsunami,
  selectEarthquakes,
  sortEarthquakes,
  toIntlLocale,
} from './tracker';

const quake = (id: string, mag: number, time: number, lon: number, lat: number, net = 'us'): EarthquakeFeature => ({
  type: 'Feature',
  id,
  properties: {
    mag,
    place: id,
    time,
    updated: time,
    url: '',
    detail: '',
    status: 'reviewed',
    tsunami: 0,
    sig: 0,
    net,
    code: id,
    ids: id,
    sources: net,
    types: 'origin',
    rms: 0,
    magType: 'M',
    type: 'earthquake',
    title: id,
  },
  geometry: { type: 'Point', coordinates: [lon, lat, 10] },
});

describe('USGS', () => {
  it('keeps valid features and marks them as USGS', () => {
    const f = normalizeUSGSFeature(usgsResponse.features[0])!;
    expect(f.properties.mag).toBe(4.7);
    expect(f.properties.time).toBe(1792153105421); // already milliseconds
    expect(f.geometry.coordinates).toEqual([125.7789, 6.0268, 10]);
    expect(getSource(f)).toBe('usgs');
  });

  it('labels every USGS network (us, ak, nc) as USGS', () => {
    expect(getSource(normalizeUSGSFeature(usgsResponse.features[1])!)).toBe('usgs');
  });

  it('drops features with a null magnitude, which would crash mag.toFixed()', () => {
    expect(normalizeUSGSFeature(usgsResponse.features[2])).toBeNull();
  });
});

describe('GeoNet', () => {
  it('reads values from the GeoJSON "properties" and "geometry"', () => {
    const f = convertGeoNetFeature(geonetResponse.features[0])!;
    expect(f).not.toBeNull();
    expect(f.geometry.coordinates[0]).toBeCloseTo(175.0968);
    expect(f.geometry.coordinates[1]).toBeCloseTo(-39.9546);
    expect(f.geometry.coordinates[2]).toBeCloseTo(25.11);
    expect(f.properties.mag).toBe(2.1);
    expect(f.properties.time).toBe(Date.UTC(2026, 9, 20, 1, 58, 19, 749));
    expect(f.properties.place).toBe('Within 5 km of Whanganui, New Zealand');
    expect(getSource(f)).toBe('geonet');
  });

  it('drops deleted events', () => {
    expect(convertGeoNetFeature(geonetResponse.features[1])).toBeNull();
  });
});

describe('BMKG', () => {
  it('converts the single autogempa object', () => {
    const f = convertBMKGQuake(bmkgAutoResponse.Infogempa.gempa)!;
    expect(f.geometry.coordinates).toEqual([97.51, 4.16, 5]); // Coordinates is "lat,lon"; GeoJSON is [lon, lat]
    expect(f.properties.mag).toBe(4.2);
    expect(f.properties.time).toBe(Date.UTC(2026, 9, 19, 13, 46, 11));
    expect(getSource(f)).toBe('bmkg');
  });

  it('keeps south latitudes negative', () => {
    const f = convertBMKGQuake(bmkgRecentResponse.Infogempa.gempa[0])!;
    expect(f.geometry.coordinates).toEqual([120.26, -8.09, 10]);
  });

  it('falls back to Lintang/Bujur with LS = south', () => {
    expect(parseBMKGCoordinates({ Lintang: '8.09 LS', Bujur: '120.26 BT' })).toEqual({ lat: -8.09, lon: 120.26 });
    expect(parseBMKGCoordinates({ Lintang: '0.77 LU', Bujur: '126.03 BT' })).toEqual({ lat: 0.77, lon: 126.03 });
  });

  it('reads magnitude strings', () => {
    expect(parseBMKGMagnitude('5.3')).toBe(5.3);
    expect(parseBMKGMagnitude('M 5.0')).toBe(5);
    expect(parseBMKGMagnitude('5,1')).toBe(5.1);
    expect(parseBMKGMagnitude('')).toBeNaN();
  });

  it('does not read "Tidak berpotensi tsunami" (no tsunami potential) as a tsunami', () => {
    expect(parseBMKGTsunami('Tidak berpotensi tsunami')).toBe(0);
    expect(convertBMKGQuake(bmkgRecentResponse.Infogempa.gempa[0])!.properties.tsunami).toBe(0);
    expect(parseBMKGTsunami('Berpotensi tsunami')).toBe(1);
    expect(parseBMKGTsunami('Gempa ini dirasakan untuk diteruskan pada masyarakat')).toBe(0);
  });

  it('gives the same id to the same event from autogempa and gempaterkini', () => {
    const a = convertBMKGQuake(bmkgRecentResponse.Infogempa.gempa[0])!;
    const b = convertBMKGQuake({ ...bmkgRecentResponse.Infogempa.gempa[0], Magnitude: '5.4' })!;
    expect(a.id).toBe(b.id);
  });

  it('returns null when the date is missing', () => {
    expect(convertBMKGQuake({ ...bmkgAutoResponse.Infogempa.gempa, DateTime: undefined })).toBeNull();
  });
});

describe('mergeEarthquakes', () => {
  const t = Date.UTC(2026, 9, 20, 0, 0, 0);

  it('removes the same event reported by two agencies and keeps the first source', () => {
    const usgs = quake('us1', 5.3, t, 120.3, -8.1);
    const bmkg = quake('bmkg_1', 5.4, t + 20_000, 120.26, -8.09, 'bmkg'); // 20 s and ~5 km apart
    const merged = mergeEarthquakes([[usgs], [bmkg]]);
    expect(merged.map((q) => q.id)).toEqual(['us1']);
  });

  it('keeps events that are close in time but far apart', () => {
    const a = quake('a', 4, t, 120, 10);
    const b = quake('b', 4, t + 10_000, 175, -40);
    expect(mergeEarthquakes([[a], [b]])).toHaveLength(2);
  });

  it('keeps events at one place more than 60 s apart', () => {
    const a = quake('a', 4, t, 120, 10);
    const b = quake('b', 4, t + 61_000, 120, 10);
    expect(mergeEarthquakes([[a, b]])).toHaveLength(2);
  });

  it('removes repeated ids (the world and Philippines USGS queries overlap)', () => {
    const a = quake('us1', 4, t, 125, 6);
    expect(mergeEarthquakes([[a], [{ ...a }]])).toHaveLength(1);
  });

  it('sorts newest first, using millisecond times from every source', () => {
    const usgs = normalizeUSGSFeature(usgsResponse.features[0])!;
    const geonet = convertGeoNetFeature(geonetResponse.features[0])!;
    const bmkg = convertBMKGQuake(bmkgAutoResponse.Infogempa.gempa)!;
    const merged = mergeEarthquakes([[usgs], [geonet], [bmkg]]);
    const times = merged.map((q) => q.properties.time);
    expect(times).toEqual([...times].sort((x, y) => y - x));
    expect(merged[0].id).toBe(geonet.id);
  });
});

describe('filters and sort', () => {
  const t = Date.UTC(2026, 9, 20);
  const manila = quake('manila', 3.4, t - 1000, 121, 14.6);
  const davao = quake('davao', 5.6, t - 5000, 125.6, 7.1);
  const nz = quake('nz', 6.2, t - 3000, 175, -40);
  const edge = quake('edge', 4.0, t - 2000, 115, 3);
  const all = [manila, davao, nz, edge];

  it('checks the Philippines box (lat 3 to 22, lon 115 to 130)', () => {
    expect(isNearPhilippines(manila)).toBe(true);
    expect(isNearPhilippines(edge)).toBe(true);
    expect(isNearPhilippines(nz)).toBe(false);
    expect(isNearPhilippines(quake('x', 4, t, 131, 10))).toBe(false);
  });

  it('filters by region and magnitude', () => {
    expect(filterEarthquakes(all, { minMagnitude: 0, region: 'ph' }).map((q) => q.id)).toEqual([
      'manila',
      'davao',
      'edge',
    ]);
    expect(filterEarthquakes(all, { minMagnitude: 4, region: 'ph' }).map((q) => q.id)).toEqual(['davao', 'edge']);
    expect(filterEarthquakes(all, { minMagnitude: 6, region: 'all' }).map((q) => q.id)).toEqual(['nz']);
    expect(filterEarthquakes(all, { minMagnitude: 6, region: 'ph' })).toEqual([]);
  });

  it('sorts newest or strongest without changing the input', () => {
    const copy = [...all];
    expect(sortEarthquakes(all, 'newest').map((q) => q.id)).toEqual(['manila', 'edge', 'nz', 'davao']);
    expect(sortEarthquakes(all, 'strongest').map((q) => q.id)).toEqual(['nz', 'davao', 'edge', 'manila']);
    expect(all).toEqual(copy);
  });

  it('breaks magnitude ties by time', () => {
    const older = quake('older', 5, t - 10_000, 121, 14);
    const newer = quake('newer', 5, t, 121, 14);
    expect(sortEarthquakes([older, newer], 'strongest').map((q) => q.id)).toEqual(['newer', 'older']);
  });

  it('selectEarthquakes filters and then sorts', () => {
    expect(selectEarthquakes(all, { minMagnitude: 3, region: 'ph', sort: 'strongest' }).map((q) => q.id)).toEqual([
      'davao',
      'edge',
      'manila',
    ]);
  });
});

describe('display helpers', () => {
  it('puts magnitudes into 4 steps', () => {
    expect([2.5, 3.9, 4, 4.9, 5, 5.9, 6, 7.8].map(magnitudeStep)).toEqual([0, 0, 1, 1, 2, 2, 3, 3]);
  });

  it('uses "fil" for Tagalog dates', () => {
    expect(toIntlLocale('tl')).toBe('fil');
    expect(toIntlLocale('en-US')).toBe('en');
    expect(toIntlLocale(undefined)).toBe('en');
  });

  it('formats time ago in the reader language', () => {
    const now = Date.UTC(2026, 9, 20, 12);
    expect(formatTimeAgo(now - 3 * 3600 * 1000, now, 'en')).toBe('3 hours ago');
    expect(formatTimeAgo(now - 20 * 60 * 1000, now, 'en')).toBe('20 minutes ago');
    expect(formatTimeAgo(now - 2 * 86400 * 1000, now, 'en')).toBe('2 days ago');
    expect(formatTimeAgo(now - 3 * 3600 * 1000, now, 'tl')).not.toBe('3 hours ago');
  });
});
