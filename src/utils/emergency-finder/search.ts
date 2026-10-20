import type { CityEmergencyData } from '@/types/emergency-finder';

/** Lower case, no accents, single spaces. "Las Piñas " becomes "las pinas". */
export const normalizeSearchText = (text: string): string =>
  text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Returns the cities whose city or province name contains the query.
 * Case and accents do not matter. An empty query returns every city.
 */
export const filterCities = (cities: CityEmergencyData[], query: string): CityEmergencyData[] => {
  const needle = normalizeSearchText(query);
  if (!needle) return cities;
  return cities.filter(
    (city) => normalizeSearchText(city.city).includes(needle) || normalizeSearchText(city.province).includes(needle)
  );
};

/** A stable id for a city, for React keys and element ids. */
export const cityId = (city: Pick<CityEmergencyData, 'city' | 'province'>): string =>
  normalizeSearchText(`${city.city}-${city.province}`).replace(/[^a-z0-9]+/g, '-');
