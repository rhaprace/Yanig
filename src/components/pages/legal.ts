import { safeHttpUrl } from '@/services/newsAPI';

export interface LegalLink {
  label: string;
  href: string;
}

export interface LegalSection {
  id: string;
  title: string;
  paragraphs: string[];
  items: string[];
  after: string[];
  warning: boolean;
  link?: LegalLink;
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === 'string' && item.trim() !== '') : [];

/**
 * Read the "sections" array of privacy.json or terms.json.
 * Drops malformed sections and links that are not http(s), so a bad translation cannot break the page.
 */
export const parseLegalSections = (raw: unknown): LegalSection[] => {
  if (!Array.isArray(raw)) return [];

  return raw.flatMap((entry): LegalSection[] => {
    if (!entry || typeof entry !== 'object') return [];
    const section = entry as Record<string, unknown>;
    if (typeof section.id !== 'string' || typeof section.title !== 'string') return [];

    const rawLink = section.link as Record<string, unknown> | undefined;
    const href = safeHttpUrl(rawLink?.href);
    const link = href && typeof rawLink?.label === 'string' ? { label: rawLink.label, href } : undefined;

    return [
      {
        id: section.id,
        title: section.title,
        paragraphs: strings(section.paragraphs),
        items: strings(section.items),
        after: strings(section.after),
        warning: section.warning === true,
        link,
      },
    ];
  });
};
