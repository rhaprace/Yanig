import type { EarthquakeFeature } from '@/hooks/useEarthquakeData';
import { isNearPhilippines } from '@/utils/tracker';

/** Country calling codes for the countries in src/config/countries.ts. */
const CALLING_CODES: Record<string, string> = {
  US: '1',
  JP: '81',
  MX: '52',
  CL: '56',
  ID: '62',
  PH: '63',
};

/**
 * Makes a tel: link from a number as it is printed, for example "(02) 8911-1406".
 * A number with a leading 0 is a local area number, so it gets the country code.
 * Short numbers such as 911 or 143 stay as they are.
 */
export const toTelHref = (printed: string, countryCode: string): string => {
  const digits = printed.replace(/\D/g, '');
  const callingCode = CALLING_CODES[countryCode];
  if (digits.length > 4 && digits.startsWith('0') && callingCode) {
    return `tel:+${callingCode}${digits.slice(1)}`;
  }
  return `tel:${digits}`;
};

/** The agency that gave us the record. The multi-source hook marks GeoNet and BMKG in `net`. */
export const sourceName = (net: string | undefined): 'USGS' | 'GeoNet' | 'BMKG' => {
  if (net === 'geonet') return 'GeoNet';
  if (net === 'bmkg') return 'BMKG';
  return 'USGS';
};

/**
 * The earthquakes for the home page: the newest ones near the Philippines. When there are none near the
 * Philippines, the newest ones from anywhere, so the list is never empty while data exists.
 */
export const homeQuakes = (
  features: EarthquakeFeature[] | undefined,
  count = 5
): { quakes: EarthquakeFeature[]; nearPhilippines: boolean } => {
  const near = newestQuakes((features ?? []).filter(isNearPhilippines), count);
  return near.length > 0 ? { quakes: near, nearPhilippines: true } : { quakes: newestQuakes(features, count), nearPhilippines: false };
};

/** The newest earthquakes first. The hook sorts the list, but we do not depend on that. */
export const newestQuakes = (features: EarthquakeFeature[] | undefined, count = 5): EarthquakeFeature[] =>
  [...(features ?? [])]
    .filter((f) => Number.isFinite(f.properties.time))
    .sort((a, b) => b.properties.time - a.properties.time)
    .slice(0, count);

/** Depth in whole km, or null when the source did not give a depth. */
export const depthKm = (quake: EarthquakeFeature): number | null => {
  const depth = quake.geometry.coordinates[2];
  return typeof depth === 'number' && Number.isFinite(depth) ? Math.round(depth) : null;
};

/** "5 minutes ago" in the reader's language. */
export const timeAgo = (time: number, language: string, now = Date.now()): string => {
  const seconds = Math.round((time - now) / 1000);
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  let rtf: Intl.RelativeTimeFormat;
  try {
    rtf = new Intl.RelativeTimeFormat(language === 'tl' ? 'fil' : language, { numeric: 'auto' });
  } catch {
    rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  }
  for (const [unit, size] of units) {
    if (Math.abs(seconds) >= size) return rtf.format(Math.round(seconds / size), unit);
  }
  return rtf.format(0, 'minute');
};

/** The second language on the poster: Tagalog under every other language, English under Tagalog. */
export const secondLanguage = (language: string): 'en' | 'tl' => (language.startsWith('tl') ? 'en' : 'tl');

export const STEP_COUNT = 3;

/** The next step for a key press in the Drop, Cover, Hold on strip, or null if the key does nothing. */
export const stepForKey = (key: string, current: number): number | null => {
  if (key === 'ArrowRight' || key === 'ArrowDown') return Math.min(current + 1, STEP_COUNT - 1);
  if (key === 'ArrowLeft' || key === 'ArrowUp') return Math.max(current - 1, 0);
  if (key === 'Home') return 0;
  if (key === 'End') return STEP_COUNT - 1;
  return null;
};
