import type { BrowserContext, Page, Route } from '@playwright/test';

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

export type Source = 'usgs' | 'geonet' | 'bmkg' | 'news';
export type Mode = 'ok' | 'down' | 'hang' | 'junk' | 'http500';

/** How many requests each source got. The tests check these numbers to catch request spam. */
export type Counts = Record<Source, number>;

/**
 * Answer the earthquake, news and map tile requests. Each source can be set apart:
 * ok = fixed data, down = network error, hang = never answers, junk = 200 with HTML, http500 = server error.
 */
export const mockApis = async (page: Page | BrowserContext, modes: Partial<Record<Source, Mode>> | Mode = 'ok'): Promise<Counts> => {
  const mode = (source: Source): Mode => (typeof modes === 'string' ? modes : (modes[source] ?? 'ok'));
  const counts: Counts = { usgs: 0, geonet: 0, bmkg: 0, news: 0 };
  const json = (body: unknown) => ({ status: 200, contentType: 'application/json', headers: { 'access-control-allow-origin': '*' }, body: JSON.stringify(body) });
  const answer = (source: Source, body: () => unknown) => async (route: Route) => {
    counts[source] += 1;
    switch (mode(source)) {
      case 'down':
        return route.abort('internetdisconnected');
      case 'hang':
        return; // never answers
      case 'junk':
        return route.fulfill({ status: 200, contentType: 'text/html', headers: { 'access-control-allow-origin': '*' }, body: '<html>Service unavailable</html>' });
      case 'http500':
        return route.fulfill({ status: 500, headers: { 'access-control-allow-origin': '*' }, body: 'error' });
      default:
        return route.fulfill(json(body()));
    }
  };
  await page.route('https://earthquake.usgs.gov/**', answer('usgs', () => USGS));
  await page.route('https://api.geonet.org.nz/**', answer('geonet', () => GEONET));
  await page.route('https://data.bmkg.go.id/**', async (route) =>
    answer('bmkg', () => (route.request().url().includes('autogempa') ? BMKG_AUTO : BMKG_RECENT))(route)
  );
  await page.route('**/api/news**', answer('news', () => NEWS));
  await page.route('https://*.tile.openstreetmap.org/**', (r) => r.fulfill({ status: 204, body: '' }));
  return counts;
};

/** One NewsAPI-shaped answer with one good article and one unsafe link. */
export const NEWS = {
  success: true,
  totalResults: 2,
  articles: [
    { source: { id: null, name: 'Example News' }, author: null, title: 'Magnitude 5 earthquake felt in Mindanao', description: 'Residents felt shaking.', url: 'https://example.com/quake', urlToImage: null, publishedAt: new Date().toISOString(), content: 'Residents felt shaking.' },
    { source: { id: null, name: 'Bad' }, author: null, title: 'Unsafe link article', description: 'x', url: 'javascript:alert(1)', urlToImage: null, publishedAt: new Date().toISOString(), content: 'x' },
  ],
};

/** One full round of earthquake requests: the USGS 30-day feed, GeoNet, BMKG latest + BMKG recent. */
export const ROUND = { usgs: 1, geonet: 1, bmkg: 2 };

/**
 * Move the page clock forward in small steps. Network answers are real (not on the page clock), so give each
 * step a moment of real time for them to arrive before the next timers run.
 */
export const advance = async (page: Page, ms: number, step = 1000) => {
  for (let done = 0; done < ms; done += step) {
    await page.clock.runFor(Math.min(step, ms - done));
    await page.waitForTimeout(15);
  }
};
