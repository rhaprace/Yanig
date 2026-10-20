import { describe, expect, it } from 'vitest';
import { philippinesCities, searchCities } from '@/data/philippines-regions';
import { cityId, filterCities, normalizeSearchText } from './search';

const names = (query: string) => filterCities(philippinesCities, query).map((c) => c.city);

describe('city search', () => {
  it('returns every city for an empty or blank query', () => {
    expect(filterCities(philippinesCities, '')).toHaveLength(philippinesCities.length);
    expect(filterCities(philippinesCities, '   ')).toHaveLength(philippinesCities.length);
  });

  it('matches the city name without case', () => {
    expect(names('CEBU')).toContain('Cebu City');
    expect(names('davao')).toContain('Davao City');
  });

  it('matches the province name', () => {
    const results = filterCities(philippinesCities, 'metro manila');
    expect(results.length).toBeGreaterThan(1);
    expect(results.every((c) => c.province === 'Metro Manila')).toBe(true);
  });

  it('ignores accents and extra spaces', () => {
    expect(normalizeSearchText('  Las   Piñas ')).toBe('las pinas');
    const sample = [{ ...philippinesCities[0], city: 'Las Piñas', province: 'Metro Manila' }];
    expect(filterCities(sample, 'las pinas')).toHaveLength(1);
    expect(filterCities(sample, 'Las  Piñas')).toHaveLength(1);
  });

  it('returns nothing when no city matches', () => {
    expect(names('Atlantis')).toEqual([]);
  });

  it('searchCities uses the same filter', () => {
    expect(searchCities(' cebu ').map((c) => c.city)).toEqual(names('cebu'));
  });

  it('makes a stable, safe id', () => {
    expect(cityId({ city: 'Las Piñas', province: 'Metro Manila' })).toBe('las-pinas-metro-manila');
  });
});
