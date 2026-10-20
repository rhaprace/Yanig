import type { Page } from '@playwright/test';

const now = Date.now();
const min = 60_000;

const usgs = (id: string, mag: number, place: string, lon: number, lat: number, ago: number) => ({
  type: 'Feature',
  id,
  properties: { mag, place, time: now - ago * min, updated: now, url: `https://earthquake.usgs.gov/earthquakes/eventpage/${id}`, tsunami: 0, type: 'earthquake', title: `M ${mag} - ${place}`, net: 'us', code: id, status: 'reviewed', magType: 'mb' },
  geometry: { type: 'Point', coordinates: [lon, lat, 20] },
});

/** Example data: three quakes near the Philippines and one in Alaska. */
export const USGS = {
  type: 'FeatureCollection',
  features: [
    usgs('us1', 4.6, '12 km SW of Sablayan, Philippines', 120.8, 12.8, 30),
    usgs('us2', 5.6, '41 km E of Manay, Philippines', 126.9, 7.2, 90),
    usgs('us3', 3.4, '8 km W of Calatagan, Philippines', 120.6, 13.8, 200),
    usgs('us4', 6.1, '50 km S of Cantwell, Alaska', -148.9, 62.9, 10),
  ],
};

export const GEONET = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [176.1, -38.7] },
      properties: { publicID: '2026p1', time: new Date(now - 45 * min).toISOString(), depth: 7, magnitude: 3.1, mmi: 3, locality: '15 km north of Taupo', quality: 'best' },
    },
  ],
};

export const BMKG_AUTO = { Infogempa: { gempa: { Tanggal: '', Jam: '', DateTime: new Date(now - 300 * min).toISOString(), Coordinates: '-8.40,116.20', Lintang: '8.40 LS', Bujur: '116.20 BT', Magnitude: '4.8', Kedalaman: '10 km', Wilayah: 'Lombok', Potensi: 'Tidak berpotensi tsunami' } } };
export const BMKG_RECENT = { Infogempa: { gempa: [] } };

/** Answer the earthquake, news and map tile requests with fixed data, or fail them all. */
export const mockApis = async (page: Page, mode: 'ok' | 'down' = 'ok') => {
  const json = (body: unknown) => ({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  await page.route('https://earthquake.usgs.gov/**', (r) => (mode === 'down' ? r.abort() : r.fulfill(json(USGS))));
  await page.route('https://api.geonet.org.nz/**', (r) => (mode === 'down' ? r.abort() : r.fulfill(json(GEONET))));
  await page.route('https://data.bmkg.go.id/**', (r) =>
    mode === 'down' ? r.abort() : r.fulfill(json(r.request().url().includes('autogempa') ? BMKG_AUTO : BMKG_RECENT))
  );
  await page.route('**/api/news**', (r) => r.fulfill({ status: 500, body: '' }));
  await page.route('https://*.tile.openstreetmap.org/**', (r) => r.fulfill({ status: 204, body: '' }));
};
