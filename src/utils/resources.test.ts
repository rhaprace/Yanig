import { describe, expect, it } from 'vitest';
import i18n from '@/i18n/config';
import { countries } from '@/config/countries';
import { getLocalResources, getVolunteerOrganizations, toTelHref } from './resources';

const t = i18n.getFixedT('en', 'resources');

describe('toTelHref', () => {
  it('keeps only digits', () => {
    expect(toTelHref('(02) 8911-1406')).toBe('tel:0289111406');
    expect(toTelHref('911')).toBe('tel:911');
    expect(toTelHref('1-800-621-3362')).toBe('tel:18006213362');
  });

  it('keeps a leading plus', () => {
    expect(toTelHref(' +63 2 8911 1406')).toBe('tel:+63289111406');
  });

  it('returns null for text with too few digits', () => {
    expect(toTelHref('')).toBeNull();
    expect(toTelHref('N/A')).toBeNull();
    expect(toTelHref('12')).toBeNull();
  });

  it('makes a link for every national hotline', () => {
    for (const country of Object.values(countries)) {
      for (const contact of country.emergencyNumbers) expect(toTelHref(contact.number), contact.number).not.toBeNull();
    }
  });
});

describe('country-specific resources', () => {
  it('shows US groups (FEMA CERT, ARRL) only for the US', () => {
    const us = getVolunteerOrganizations(t, 'US').map((o) => o.url).join(' ');
    expect(us).toContain('fema.gov');
    expect(us).toContain('arrl.org');
    for (const code of ['PH', 'JP', 'MX', 'CL', 'ID']) {
      const text = JSON.stringify([getVolunteerOrganizations(t, code), getLocalResources(t, code)]);
      expect(text, code).not.toMatch(/FEMA|CERT|ARRL|county|American Red Cross/i);
    }
  });

  it('shows Philippine options for PH', () => {
    const ph = getVolunteerOrganizations(t, 'PH');
    expect(ph.map((o) => o.url)).toEqual(['https://redcross.org.ph/volunteer/', 'https://ocd.gov.ph/']);
    expect(getLocalResources(t, 'PH').flatMap((r) => r.items)).toContain('Your barangay hall');
  });

  it('shows nothing extra for other countries', () => {
    expect(getVolunteerOrganizations(t, 'JP')).toEqual([]);
    expect(getLocalResources(t, 'JP')).toEqual([]);
  });
});

describe('country config', () => {
  it('does not call PHIVOLCS a data source', () => {
    const ph = countries.PH;
    const phivolcs = ph.agencies.find((a) => a.name === 'PHIVOLCS')!;
    expect(phivolcs.url).toBe('https://www.phivolcs.dost.gov.ph');
    expect(phivolcs.type).not.toMatch(/data/i);
    expect(ph.dataSource.name).not.toMatch(/PHIVOLCS/);
  });

  it('names the real data sources for every country', () => {
    for (const country of Object.values(countries)) {
      expect(country.dataSource.name).toBe('USGS, GeoNet and BMKG');
      for (const agency of country.agencies) {
        if (/data source|fuente de datos|データソース/i.test(agency.type)) {
          expect(['U.S. Geological Survey (USGS)', 'BMKG (Meteorology Agency)']).toContain(agency.name);
        }
      }
    }
  });

  it('keeps the Philippine hotline numbers', () => {
    expect(countries.PH.emergencyNumbers.map((c) => c.number)).toEqual(['911', '(02) 8911-1406', '143', '(02) 8527-8481']);
  });
});
