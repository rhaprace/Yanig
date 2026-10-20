import { useQuery } from '@tanstack/react-query';
import { usgsAPI } from '@/services/api';
import type { EarthquakeFeature, EarthquakeResponse } from '@/types/common';
import {
  PH_BOUNDS,
  convertBMKGQuake,
  convertGeoNetFeature,
  mergeEarthquakes,
  normalizeUSGSFeature,
  type BMKGQuake,
  type GeoNetFeature,
  type USGSFeature,
} from '@/utils/tracker';

const GEONET_API = 'https://api.geonet.org.nz/quake';
const BMKG_API = 'https://data.bmkg.go.id/DataMKG/TEWS';

/** How often Yanig checks for new data. The page copy says "every 10 minutes". */
export const REFRESH_INTERVAL_MS = 10 * 60 * 1000;

/** How far back the Philippines query goes. */
const PH_DAYS = 30;

const devWarn = (...args: unknown[]) => {
  if (import.meta.env.DEV) console.warn(...args);
};

const keepValid = (features: (EarthquakeFeature | null)[]): EarthquakeFeature[] =>
  features.filter((f): f is EarthquakeFeature => f !== null);

/** USGS sometimes answers 502 without CORS headers. One quick second try fixes most of these. */
const retryOnce =
  <T>(fetcher: () => Promise<T>, delayMs = 1500) =>
  async (): Promise<T> => {
    try {
      return await fetcher();
    } catch {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
      return fetcher();
    }
  };

const fetchJson = async <T>(url: string): Promise<T> => {
  const response = await fetch(url);
  if (!response.ok) throw new Error(`${url}: ${response.status}`);
  return response.json() as Promise<T>;
};

/** The latest 100 earthquakes of magnitude 2.5 and above, worldwide. */
const fetchUSGSWorld = async (): Promise<EarthquakeFeature[]> => {
  const data: { features?: USGSFeature[] } = await usgsAPI.getEarthquakes({
    limit: 100,
    minmagnitude: 2.5,
  });
  return keepValid((data.features ?? []).map(normalizeUSGSFeature));
};

/**
 * Earthquakes of magnitude 2.5 and above near the Philippines in the last 30 days.
 * The worldwide list above often has none near the Philippines.
 */
const fetchUSGSPhilippines = async (): Promise<EarthquakeFeature[]> => {
  // Use the date only, so the URL stays the same for a day and the browser cache can help.
  const start = new Date(Date.now() - PH_DAYS * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  const data: { features?: USGSFeature[] } = await usgsAPI.getEarthquakes({
    limit: 200,
    minmagnitude: 2.5,
    starttime: start,
    minlatitude: PH_BOUNDS.minLat,
    maxlatitude: PH_BOUNDS.maxLat,
    minlongitude: PH_BOUNDS.minLon,
    maxlongitude: PH_BOUNDS.maxLon,
  });
  return keepValid((data.features ?? []).map(normalizeUSGSFeature));
};

const fetchGeoNet = async (): Promise<EarthquakeFeature[]> => {
  const data = await fetchJson<{ features?: GeoNetFeature[] }>(`${GEONET_API}?MMI=2`);
  return keepValid((data.features ?? []).map(convertGeoNetFeature));
};

const toArray = <T>(value: T | T[] | undefined): T[] =>
  value === undefined ? [] : Array.isArray(value) ? value : [value];

/** autogempa.json has the newest earthquake. gempaterkini.json has the last 15 of magnitude 5 and above. */
const fetchBMKG = async (): Promise<EarthquakeFeature[]> => {
  type BMKGResponse = { Infogempa?: { gempa?: BMKGQuake | BMKGQuake[] } };
  const results = await Promise.allSettled([
    fetchJson<BMKGResponse>(`${BMKG_API}/autogempa.json`),
    fetchJson<BMKGResponse>(`${BMKG_API}/gempaterkini.json`),
  ]);
  const ok = results.filter((r): r is PromiseFulfilledResult<BMKGResponse> => r.status === 'fulfilled');
  if (ok.length === 0) throw new Error('BMKG: no data');
  return keepValid(ok.flatMap((r) => toArray(r.value.Infogempa?.gempa)).map(convertBMKGQuake));
};

export const fetchMultiSourceEarthquakes = async (): Promise<EarthquakeResponse> => {
  // The order matters: when two sources report one earthquake, the first one is kept.
  const sources = [
    ['USGS', retryOnce(fetchUSGSWorld)],
    ['USGS Philippines', retryOnce(fetchUSGSPhilippines)],
    ['GeoNet', fetchGeoNet],
    ['BMKG', fetchBMKG],
  ] as const;
  const results = await Promise.allSettled(sources.map(([, fetcher]) => fetcher()));

  const lists: EarthquakeFeature[][] = [];
  results.forEach((result, i) => {
    if (result.status === 'fulfilled') lists.push(result.value);
    else devWarn(`${sources[i][0]} data not loaded:`, result.reason);
  });
  if (lists.length === 0) throw new Error('No earthquake data source answered.');

  const features = mergeEarthquakes(lists);
  return {
    type: 'FeatureCollection',
    metadata: {
      generated: Date.now(),
      url: 'multi-source',
      title: 'USGS, GeoNet and BMKG earthquakes',
      status: 200,
      api: 'aggregated',
      count: features.length,
    },
    features,
  };
};

export const useMultiSourceEarthquakeData = () =>
  useQuery<EarthquakeResponse>({
    queryKey: ['earthquakes', 'multi-source'],
    queryFn: fetchMultiSourceEarthquakes,
    staleTime: 5 * 60 * 1000,
    refetchInterval: REFRESH_INTERVAL_MS,
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

export default useMultiSourceEarthquakeData;
