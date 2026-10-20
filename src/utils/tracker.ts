import type { EarthquakeFeature, EarthquakeSource } from '@/types/common';

/* ------------------------------------------------------------------ */
/* Filters, sort and region                                            */
/* ------------------------------------------------------------------ */

export type TrackerView = 'map' | 'list' | 'both';
export type SortOrder = 'newest' | 'strongest';
export type RegionFilter = 'ph' | 'all';
/** 0 means "all magnitudes". */
export type MagnitudeFilter = 0 | 3 | 4 | 5 | 6;

export const MAGNITUDE_FILTERS: MagnitudeFilter[] = [0, 3, 4, 5, 6];
export const SORT_ORDERS: SortOrder[] = ['newest', 'strongest'];
export const REGION_FILTERS: RegionFilter[] = ['ph', 'all'];
export const TRACKER_VIEWS: TrackerView[] = ['map', 'list', 'both'];

export const DEFAULT_TRACKER_VIEW: TrackerView = 'both';
export const DEFAULT_SORT: SortOrder = 'newest';
export const DEFAULT_REGION: RegionFilter = 'ph';
export const DEFAULT_MAGNITUDE: MagnitudeFilter = 0;

/** A box around the Philippines and its seas. */
export const PH_BOUNDS = {
  minLat: 3,
  maxLat: 22,
  minLon: 115,
  maxLon: 130,
} as const;

export const isNearPhilippines = (quake: EarthquakeFeature): boolean => {
  const [lon, lat] = quake.geometry.coordinates;
  return lat >= PH_BOUNDS.minLat && lat <= PH_BOUNDS.maxLat && lon >= PH_BOUNDS.minLon && lon <= PH_BOUNDS.maxLon;
};

export interface TrackerFilters {
  minMagnitude: MagnitudeFilter;
  region: RegionFilter;
}

export const filterEarthquakes = (quakes: EarthquakeFeature[], filters: TrackerFilters): EarthquakeFeature[] =>
  quakes.filter((q) => q.properties.mag >= filters.minMagnitude && (filters.region === 'all' || isNearPhilippines(q)));

const byNewest = (a: EarthquakeFeature, b: EarthquakeFeature) => b.properties.time - a.properties.time;
const byStrongest = (a: EarthquakeFeature, b: EarthquakeFeature) =>
  b.properties.mag - a.properties.mag || byNewest(a, b);

/** Returns a new sorted array. The input is not changed. */
export const sortEarthquakes = (quakes: EarthquakeFeature[], order: SortOrder): EarthquakeFeature[] =>
  [...quakes].sort(order === 'strongest' ? byStrongest : byNewest);

export const sortEarthquakesByTime = (quakes: EarthquakeFeature[]): EarthquakeFeature[] =>
  sortEarthquakes(quakes, 'newest');

export const selectEarthquakes = (
  quakes: EarthquakeFeature[],
  filters: TrackerFilters & { sort: SortOrder },
): EarthquakeFeature[] => sortEarthquakes(filterEarthquakes(quakes, filters), filters.sort);

/* ------------------------------------------------------------------ */
/* Magnitude steps (marker size and colour) and sources                */
/* ------------------------------------------------------------------ */

export type MagnitudeStep = 0 | 1 | 2 | 3;

/** 0: below 4, 1: 4 to 4.9, 2: 5 to 5.9, 3: 6 and above. */
export const magnitudeStep = (mag: number): MagnitudeStep => {
  if (mag >= 6) return 3;
  if (mag >= 5) return 2;
  if (mag >= 4) return 1;
  return 0;
};

export const MAGNITUDE_STEP_LABELS: Record<MagnitudeStep, string> = {
  0: '< 4',
  1: '4 – 4.9',
  2: '5 – 5.9',
  3: '6 +',
};

export const SOURCE_LABELS: Record<EarthquakeSource, string> = {
  usgs: 'USGS',
  geonet: 'GeoNet',
  bmkg: 'BMKG',
};

export const getSource = (quake: EarthquakeFeature): EarthquakeSource => {
  if (quake.properties.source) return quake.properties.source;
  const net = (quake.properties.net || '').toLowerCase();
  if (net === 'geonet') return 'geonet';
  if (net === 'bmkg') return 'bmkg';
  return 'usgs';
};

export const formatMagnitude = (mag: number): string => mag.toFixed(1);

/* ------------------------------------------------------------------ */
/* Converting API responses                                            */
/* ------------------------------------------------------------------ */

const isFiniteNumber = (n: unknown): n is number => typeof n === 'number' && Number.isFinite(n);

/** A USGS FDSN GeoJSON feature. Some fields can be null in real responses. */
export interface USGSFeature {
  type: 'Feature';
  id: string;
  properties: Omit<EarthquakeFeature['properties'], 'mag' | 'place'> & {
    mag: number | null;
    place: string | null;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number, number?] | number[];
  };
}

export const normalizeUSGSFeature = (feature: USGSFeature): EarthquakeFeature | null => {
  const { mag, place, title, time } = feature.properties;
  const [lon, lat, depth] = feature.geometry?.coordinates ?? [];
  if (!isFiniteNumber(mag) || !isFiniteNumber(lat) || !isFiniteNumber(lon) || !isFiniteNumber(time)) return null;
  return {
    ...feature,
    properties: {
      ...feature.properties,
      mag,
      place: place || title || '',
      source: 'usgs',
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat, isFiniteNumber(depth) ? depth : 0],
    },
  };
};

/** One feature from https://api.geonet.org.nz/quake (GeoJSON, values in `properties`). */
export interface GeoNetFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] };
  properties: {
    publicID: string;
    time: string;
    depth: number;
    magnitude: number;
    mmi?: number;
    locality: string;
    quality: string;
  };
}

export const convertGeoNetFeature = (feature: GeoNetFeature): EarthquakeFeature | null => {
  const p = feature.properties;
  if (!p || p.quality === 'deleted') return null;
  const [lon, lat] = feature.geometry?.coordinates ?? [];
  const time = Date.parse(p.time);
  if (!isFiniteNumber(p.magnitude) || !isFiniteNumber(lat) || !isFiniteNumber(lon) || !Number.isFinite(time)) {
    return null;
  }
  const mag = Math.round(p.magnitude * 10) / 10;
  const place = p.locality ? `${p.locality}, New Zealand` : 'New Zealand';
  return {
    type: 'Feature',
    id: `geonet_${p.publicID}`,
    properties: {
      mag,
      place,
      time,
      updated: time,
      url: `https://www.geonet.org.nz/earthquake/${p.publicID}`,
      detail: '',
      status: p.quality,
      tsunami: 0,
      sig: 0,
      net: 'geonet',
      code: p.publicID,
      ids: p.publicID,
      sources: 'geonet',
      types: 'origin',
      rms: 0,
      magType: 'M',
      type: 'earthquake',
      title: `M ${mag} - ${place}`,
      source: 'geonet',
    },
    geometry: {
      type: 'Point',
      coordinates: [lon, lat, isFiniteNumber(p.depth) ? p.depth : 0],
    },
  };
};

/** One record from BMKG autogempa.json or gempaterkini.json. All values are strings. */
export interface BMKGQuake {
  Tanggal?: string;
  Jam?: string;
  DateTime?: string;
  Coordinates?: string;
  Lintang?: string;
  Bujur?: string;
  Magnitude?: string;
  Kedalaman?: string;
  Wilayah?: string;
  Potensi?: string;
}

const firstNumber = (value: string | undefined): number => {
  const match = (value ?? '').replace(',', '.').match(/-?\d+(?:\.\d+)?/);
  return match ? parseFloat(match[0]) : NaN;
};

/** "5.0", "M 5.0" and "5,0" all give 5. */
export const parseBMKGMagnitude = (value: string | undefined): number => firstNumber(value);

/** "10 km" gives 10. */
export const parseBMKGDepth = (value: string | undefined): number => firstNumber(value);

/**
 * BMKG "Coordinates" is "lat,lon" (for example "-7.25,108.30").
 * If it is missing, use "Lintang" ("7.25 LS", LS = south) and "Bujur" ("108.30 BT", BT = east).
 */
export const parseBMKGCoordinates = (quake: BMKGQuake): { lat: number; lon: number } | null => {
  if (quake.Coordinates) {
    const [lat, lon] = quake.Coordinates.split(',').map((s) => parseFloat(s.trim()));
    if (Number.isFinite(lat) && Number.isFinite(lon)) return { lat, lon };
  }
  const latAbs = firstNumber(quake.Lintang);
  const lonAbs = firstNumber(quake.Bujur);
  if (!Number.isFinite(latAbs) || !Number.isFinite(lonAbs)) return null;
  const lat = /\bLS\b/i.test(quake.Lintang ?? '') ? -Math.abs(latAbs) : Math.abs(latAbs);
  const lon = /\bBB\b/i.test(quake.Bujur ?? '') ? -Math.abs(lonAbs) : Math.abs(lonAbs);
  return { lat, lon };
};

/** "Tidak berpotensi tsunami" means "no tsunami potential". Only a positive statement counts. */
export const parseBMKGTsunami = (potensi: string | undefined): 0 | 1 => {
  const text = (potensi ?? '').toLowerCase();
  if (!text.includes('tsunami') || text.includes('tidak')) return 0;
  return text.includes('berpotensi') ? 1 : 0;
};

export const convertBMKGQuake = (quake: BMKGQuake): EarthquakeFeature | null => {
  const coords = parseBMKGCoordinates(quake);
  const mag = parseBMKGMagnitude(quake.Magnitude);
  const time = quake.DateTime ? Date.parse(quake.DateTime) : NaN;
  if (!coords || !Number.isFinite(mag) || !Number.isFinite(time)) return null;
  const depth = parseBMKGDepth(quake.Kedalaman);
  const place = quake.Wilayah ? `${quake.Wilayah}, Indonesia` : 'Indonesia';
  return {
    type: 'Feature',
    id: `bmkg_${time}`,
    properties: {
      mag,
      place,
      time,
      updated: time,
      url: 'https://www.bmkg.go.id/gempabumi/gempabumi-terkini',
      detail: '',
      status: 'reviewed',
      tsunami: parseBMKGTsunami(quake.Potensi),
      sig: 0,
      net: 'bmkg',
      code: `${time}`,
      ids: `bmkg_${time}`,
      sources: 'bmkg',
      types: 'origin',
      rms: 0,
      magType: 'M',
      type: 'earthquake',
      title: `M ${mag} - ${place}`,
      source: 'bmkg',
    },
    geometry: {
      type: 'Point',
      coordinates: [coords.lon, coords.lat, Number.isFinite(depth) ? depth : 0],
    },
  };
};

/* ------------------------------------------------------------------ */
/* Merge and remove duplicates                                         */
/* ------------------------------------------------------------------ */

/** Two reports closer than this in time and distance are one earthquake. */
export const DUPLICATE_MAX_SECONDS = 60;
export const DUPLICATE_MAX_KM = 100;

export const distanceKm = (a: EarthquakeFeature, b: EarthquakeFeature): number => {
  const [lon1, lat1] = a.geometry.coordinates;
  const [lon2, lat2] = b.geometry.coordinates;
  const rad = Math.PI / 180;
  const dLat = (lat2 - lat1) * rad;
  const dLon = (lon2 - lon1) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(dLon / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.min(1, Math.sqrt(h)));
};

export const isSameEarthquake = (a: EarthquakeFeature, b: EarthquakeFeature): boolean =>
  a.id === b.id ||
  (Math.abs(a.properties.time - b.properties.time) <= DUPLICATE_MAX_SECONDS * 1000 &&
    distanceKm(a, b) <= DUPLICATE_MAX_KM);

/**
 * Joins the lists, removes duplicates and sorts newest first.
 * Lists that come first win: pass USGS first so its record is kept.
 */
export const mergeEarthquakes = (lists: EarthquakeFeature[][]): EarthquakeFeature[] => {
  const kept: EarthquakeFeature[] = [];
  for (const quake of lists.flat()) {
    if (!kept.some((k) => isSameEarthquake(k, quake))) kept.push(quake);
  }
  return sortEarthquakesByTime(kept);
};

/* ------------------------------------------------------------------ */
/* Dates in the reader's language                                      */
/* ------------------------------------------------------------------ */

/** i18n uses "tl"; Intl knows Filipino as "fil". */
export const toIntlLocale = (language: string | undefined): string => {
  const lang = (language || 'en').split('-')[0];
  return lang === 'tl' ? 'fil' : lang;
};

export const formatTimeAgo = (time: number, now: number, language?: string): string => {
  const rtf = new Intl.RelativeTimeFormat(toIntlLocale(language), {
    numeric: 'auto',
  });
  const seconds = Math.round((time - now) / 1000);
  const abs = Math.abs(seconds);
  if (abs < 60) return rtf.format(0, 'minute');
  if (abs < 3600) return rtf.format(Math.round(seconds / 60), 'minute');
  if (abs < 86400) return rtf.format(Math.round(seconds / 3600), 'hour');
  return rtf.format(Math.round(seconds / 86400), 'day');
};

export const formatDateTime = (time: number, language?: string): string =>
  new Intl.DateTimeFormat(toIntlLocale(language), {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(time);

export const formatClock = (time: number, language?: string): string =>
  new Intl.DateTimeFormat(toIntlLocale(language), {
    hour: 'numeric',
    minute: '2-digit',
  }).format(time);

/** After new data arrives, the refresh button waits this long. Repeated taps do not send repeated requests. */
export const MIN_REFRESH_GAP_MS = 60_000;

/** True when a manual refresh may ask the sources again. Nothing loaded yet (0) always allows it. */
export const canRefresh = (updatedAt: number, now: number): boolean =>
  !updatedAt || now - updatedAt >= MIN_REFRESH_GAP_MS;
