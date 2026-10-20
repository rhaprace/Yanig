import { describe, expect, it } from 'vitest';
import { philippinesCities, philippinesRegions } from './philippines-regions';
import { cityId } from '@/utils/emergency-finder/search';
import { toTelHref } from '@/utils/resources';

describe('Philippine city sample data', () => {
  it('has 31 cities, as the page says', () => {
    expect(philippinesCities).toHaveLength(31);
  });

  it('gives every city a unique id', () => {
    const ids = philippinesCities.map(cityId);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it.each(philippinesCities.map((c) => [c.city, c] as const))('%s has at least one number that makes a tel: link', (_name, city) => {
    const numbers = [...city.contacts.map((c) => c.number), city.localGovernment.hotline].filter(Boolean) as string[];
    expect(numbers.length).toBeGreaterThan(0);
    expect(numbers.some((n) => toTelHref(n) !== null)).toBe(true);
    for (const n of numbers) expect(toTelHref(n), n).toMatch(/^tel:\+?\d{3,}$/);
  });

  it('places every city inside the Philippines and in a known region', () => {
    const regions = new Set(philippinesRegions.map((r) => r.code));
    for (const city of philippinesCities) {
      const [lat, lng] = city.coordinates;
      expect(lat, city.city).toBeGreaterThan(4);
      expect(lat, city.city).toBeLessThan(21.5);
      expect(lng, city.city).toBeGreaterThan(116);
      expect(lng, city.city).toBeLessThan(127);
      expect(regions.has(city.region), city.city).toBe(true);
    }
  });
});
