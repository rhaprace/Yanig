export const API_ENDPOINTS = {
  USGS: 'https://earthquake.usgs.gov/fdsnws/event/1/query',
  IP_GEOLOCATION: 'https://ipapi.co/json',
} as const;

export interface USGSQueryParams {
  format?: 'geojson' | 'xml' | 'csv';
  starttime?: string;
  endtime?: string;
  minmagnitude?: number;
  maxmagnitude?: number;
  mindepth?: number;
  maxdepth?: number;
  minlatitude?: number;
  maxlatitude?: number;
  minlongitude?: number;
  maxlongitude?: number;
  latitude?: number;
  longitude?: number;
  maxradius?: number;
  maxradiuskm?: number;
  limit?: number;
  offset?: number;
  orderby?: 'time' | 'time-asc' | 'magnitude' | 'magnitude-asc';
}

//eslint-disable-next-line @typescript-eslint/no-explicit-any
export const buildQueryString = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  return queryParams.toString();
};

export const usgsAPI = {
  getEarthquakes: async (params: USGSQueryParams = {}) => {
    const defaultParams: USGSQueryParams = {
      format: 'geojson',
      limit: 50,
      minmagnitude: 2.5,
      orderby: 'time',
    };

    const queryString = buildQueryString({ ...defaultParams, ...params });
    const url = `${API_ENDPOINTS.USGS}?${queryString}`;

    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`USGS API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  },
  getNearbyEarthquakes: async (
    latitude: number,
    longitude: number,
    radiusKm: number = 500,
    minMagnitude: number = 2.5
  ) => {
    return usgsAPI.getEarthquakes({
      latitude,
      longitude,
      maxradiuskm: radiusKm,
      minmagnitude: minMagnitude,
      limit: 100,
    });
  },
  getSignificantEarthquakes: async () => {
    return usgsAPI.getEarthquakes({
      minmagnitude: 4.5,
      limit: 100,
    });
  },
  getRecentEarthquakes: async (hours: number = 24) => {
    const endtime = new Date();
    const starttime = new Date(endtime.getTime() - hours * 60 * 60 * 1000);

    return usgsAPI.getEarthquakes({
      starttime: starttime.toISOString(),
      endtime: endtime.toISOString(),
      orderby: 'time',
    });
  },
  getEarthquakesByRegion: async (
    minLat: number,
    maxLat: number,
    minLon: number,
    maxLon: number,
    minMagnitude: number = 2.5
  ) => {
    return usgsAPI.getEarthquakes({
      minlatitude: minLat,
      maxlatitude: maxLat,
      minlongitude: minLon,
      maxlongitude: maxLon,
      minmagnitude: minMagnitude,
    });
  },
};

export const geolocationAPI = {
  getUserLocation: async () => {
    try {
      const response = await fetch(API_ENDPOINTS.IP_GEOLOCATION);
      if (!response.ok) {
        throw new Error('Failed to get location');
      }
      return response.json();
    } catch (error) {
      if (import.meta.env.DEV) console.warn('Geolocation error:', error);
      return null;
    }
  },
  getBrowserLocation: (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      });
    });
  },
};

export const statisticsAPI = {
  getStatistics: async (days: number = 30) => {
    const endtime = new Date();
    const starttime = new Date(endtime.getTime() - days * 24 * 60 * 60 * 1000);

    const data = await usgsAPI.getEarthquakes({
      starttime: starttime.toISOString(),
      endtime: endtime.toISOString(),
      limit: 10000,
    });
    const features = data.features || [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const magnitudes = features.map((f: any) => f.properties.mag);

    return {
      total: features.length,
      averageMagnitude: magnitudes.reduce((a: number, b: number) => a + b, 0) / magnitudes.length || 0,
      maxMagnitude: Math.max(...magnitudes, 0),
      minMagnitude: Math.min(...magnitudes, 10),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      significant: features.filter((f: any) => f.properties.mag >= 4.5).length,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      withTsunami: features.filter((f: any) => f.properties.tsunami === 1).length,
      period: {
        start: starttime.toISOString(),
        end: endtime.toISOString(),
        days,
      },
    };
  },
};

export default {
  usgs: usgsAPI,
  geolocation: geolocationAPI,
  statistics: statisticsAPI,
};
