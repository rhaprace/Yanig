/** The three agencies the earthquake list uses. Names and text come from about.json (data.sources). */
export const dataSources = [
  { id: 'usgs', url: 'https://earthquake.usgs.gov/' },
  { id: 'geonet', url: 'https://www.geonet.org.nz/' },
  { id: 'bmkg', url: 'https://www.bmkg.go.id/' },
] as const;

export const PHIVOLCS_URL = 'https://www.phivolcs.dost.gov.ph/';
export const SOURCE_CODE_URL = 'https://github.com/rhaprace/quakeSafe';
