/* Trimmed copies of real API responses (taken 20 Oct 2026). Keep the shapes exact. */
import type { BMKGQuake, GeoNetFeature, USGSFeature } from '@/utils/tracker';

const usgsBase = {
  updated: 1792156131040,
  tz: null,
  detail: '',
  felt: null,
  cdi: null,
  mmi: null,
  alert: null,
  status: 'reviewed',
  tsunami: 0,
  sig: 340,
  sources: ',us,',
  types: ',origin,phase-data,',
  nst: 50,
  dmin: 1.055,
  rms: 1.04,
  gap: 76,
  magType: 'mb',
  type: 'earthquake',
};

/** https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&... */
export const usgsResponse: { type: 'FeatureCollection'; features: USGSFeature[] } = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      id: 'us6000u2pp',
      properties: {
        ...usgsBase,
        mag: 4.7,
        place: '10 km SE of Lamitan, Philippines',
        time: 1792153105421,
        url: 'https://earthquake.usgs.gov/earthquakes/eventpage/us6000u2pp',
        net: 'us',
        code: '6000u2pp',
        ids: ',us6000u2pp,',
        title: 'M 4.7 - 10 km SE of Lamitan, Philippines',
      },
      geometry: { type: 'Point', coordinates: [125.7789, 6.0268, 10] },
    },
    {
      type: 'Feature',
      id: 'ak0261abcd',
      properties: {
        ...usgsBase,
        mag: 2.9,
        place: '50 km S of Cantwell, Alaska',
        time: 1792270000000,
        url: 'https://earthquake.usgs.gov/earthquakes/eventpage/ak0261abcd',
        net: 'ak',
        code: '0261abcd',
        ids: ',ak0261abcd,',
        title: 'M 2.9 - 50 km S of Cantwell, Alaska',
      },
      geometry: { type: 'Point', coordinates: [-149.1, 62.9, 80.2] },
    },
    {
      // Real USGS records can have a null magnitude.
      type: 'Feature',
      id: 'nc75000000',
      properties: {
        ...usgsBase,
        mag: null,
        place: null,
        time: 1792260000000,
        url: 'https://earthquake.usgs.gov/earthquakes/eventpage/nc75000000',
        net: 'nc',
        code: '75000000',
        ids: ',nc75000000,',
        title: 'M ? - Northern California',
      },
      geometry: { type: 'Point', coordinates: [-122.8, 38.8, 2.1] },
    },
  ],
};

/** https://api.geonet.org.nz/quake?MMI=2 (GeoJSON: values are inside "properties"). */
export const geonetResponse: { type: 'FeatureCollection'; features: GeoNetFeature[] } = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [175.096832275, -39.954586029] },
      properties: {
        publicID: '2026p789411',
        time: '2026-10-20T01:58:19.749Z',
        depth: 25.11251640319824,
        magnitude: 2.0520248133733756,
        mmi: -1,
        locality: 'Within 5 km of Whanganui',
        quality: 'best',
      },
    },
    {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [169.665664673, -40.516899109] },
      properties: {
        publicID: '2026p789688',
        time: '2026-10-20T04:25:38.622Z',
        depth: 449.2786560058594,
        magnitude: 4.420796164757883,
        mmi: -1,
        locality: '210 km north-west of Westport',
        quality: 'deleted',
      },
    },
  ],
};

/** https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json ("gempa" is one object). */
export const bmkgAutoResponse: { Infogempa: { gempa: BMKGQuake } } = {
  Infogempa: {
    gempa: {
      Tanggal: '19 Okt 2026',
      Jam: '20:46:11 WIB',
      DateTime: '2026-10-19T13:46:11+00:00',
      Coordinates: '4.16,97.51',
      Lintang: '4.16 LU',
      Bujur: '97.51 BT',
      Magnitude: '4.2',
      Kedalaman: '5 km',
      Wilayah: 'Pusat gempa berada di darat 26 km Timur Laut Kab. Gayo Lues',
      Potensi: 'Gempa ini dirasakan untuk diteruskan pada masyarakat',
    },
  },
};

/** https://data.bmkg.go.id/DataMKG/TEWS/gempaterkini.json ("gempa" is an array). */
export const bmkgRecentResponse: { Infogempa: { gempa: BMKGQuake[] } } = {
  Infogempa: {
    gempa: [
      {
        Tanggal: '18 Okt 2026',
        Jam: '15:00:08 WIB',
        DateTime: '2026-10-18T08:00:08+00:00',
        Coordinates: '-8.09,120.26',
        Lintang: '8.09 LS',
        Bujur: '120.26 BT',
        Magnitude: '5.3',
        Kedalaman: '10 km',
        Wilayah: '60 km TimurLaut LABUANBAJO-NTT',
        Potensi: 'Tidak berpotensi tsunami',
      },
      {
        Tanggal: '09 Okt 2026',
        Jam: '12:11:04 WIB',
        DateTime: '2026-10-09T05:11:04+00:00',
        Coordinates: '0.77,126.03',
        Lintang: '0.77 LU',
        Bujur: '126.03 BT',
        Magnitude: '5.1',
        Kedalaman: '10 km',
        Wilayah: '125 km Tenggara BITUNG-SULUT',
        Potensi: 'Tidak berpotensi tsunami',
      },
    ],
  },
};
