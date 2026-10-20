import type { ExternalLink, ResourceCategory } from '@/types/common';
import type { TFunction } from 'i18next';

/**
 * Turns a printed phone number such as "(02) 8911-1406" into a tel: link ("tel:0289111406").
 * Keeps a leading "+". Returns null when the text has fewer than 3 digits.
 */
export const toTelHref = (number: string): string | null => {
  const trimmed = number.trim();
  const digits = trimmed.replace(/\D/g, '');
  if (digits.length < 3) return null;
  return `tel:${trimmed.startsWith('+') ? '+' : ''}${digits}`;
};

/** Where to go for help. Only the US and the Philippines have a list. Other countries get none. */
const LOCAL_RESOURCES: Record<string, Record<string, string[]>> = {
  US: {
    shelters: ['community', 'schools', 'religious', 'redcross'],
    healthcare: ['hospitals', 'urgent', 'fire', 'community'],
    supply: ['eoc', 'fema', 'foodbanks', 'distribution'],
  },
  PH: {
    shelters: ['evacuation', 'schools', 'courts'],
    healthcare: ['hospitals', 'healthStation', 'rhu'],
    supply: ['drrmo', 'dswd', 'barangayHall'],
  },
};

export const getLocalResources = (t: TFunction, countryCode: string): ResourceCategory[] => {
  const groups = LOCAL_RESOURCES[countryCode];
  if (!groups) return [];
  const base = `sections.local.${countryCode}`;
  return Object.entries(groups).map(([group, items]) => ({
    category: t(`${base}.${group}.category`),
    description: t(`${base}.${group}.description`),
    items: items.map((item) => t(`${base}.${group}.items.${item}`)),
  }));
};

/** Volunteer programmes. Each one is a real organisation in that country. */
const VOLUNTEER_ORGANIZATIONS: Record<string, { key: string; url: string }[]> = {
  US: [
    { key: 'cert', url: 'https://www.fema.gov/emergency-managers/individuals-communities/cert' },
    { key: 'redcross', url: 'https://www.redcross.org/volunteer' },
    { key: 'salvation', url: 'https://www.salvationarmyusa.org/usn/disaster-relief/' },
    { key: 'radio', url: 'https://www.arrl.org/ares' },
  ],
  PH: [
    { key: 'redcross143', url: 'https://redcross.org.ph/volunteer/' },
    { key: 'ocdVolunteers', url: 'https://ocd.gov.ph/' },
  ],
};

export const getVolunteerOrganizations = (t: TFunction, countryCode: string): ExternalLink[] =>
  (VOLUNTEER_ORGANIZATIONS[countryCode] ?? []).map(({ key, url }) => ({
    name: t(`sections.volunteer.${countryCode}.${key}.name`),
    description: t(`sections.volunteer.${countryCode}.${key}.description`),
    type: t(`sections.volunteer.${countryCode}.${key}.type`),
    url,
  }));
