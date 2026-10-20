import type { TFunction } from 'i18next';

/** The guide topics, in the order a person meets them. "during" opens first. */
export const GUIDE_IDS = ['before', 'during', 'after', 'kit', 'building', 'community'] as const;
export type GuideId = (typeof GUIDE_IDS)[number];
export const DEFAULT_GUIDE: GuideId = 'during';

/**
 * The sections of each guide, as keys in guides.json. The kit guide is a checklist (see KIT_SECTIONS).
 * Drop, Cover, Hold on is drawn as figures above the "during" sections (see DropCoverHold).
 */
const GUIDE_SECTIONS: Record<Exclude<GuideId, 'kit'>, string[]> = {
  before: ['secureHome', 'emergencyPlanning', 'importantDocuments'],
  during: ['indoors', 'outdoors', 'nearCoast'],
  after: ['immediate', 'communication', 'ongoingSafety'],
  building: ['foundation', 'interior'],
  community: ['neighborhood', 'resources'],
};

/** Each kit item has a fixed id. The ticks are saved per id, so the order or text can change. */
export const KIT_SECTIONS: { id: string; items: string[] }[] = [
  { id: 'waterFood', items: ['water', 'food', 'opener', 'utensils', 'babyFood'] },
  { id: 'lightRadio', items: ['radio', 'flashlight', 'batteries', 'powerBank', 'whistle'] },
  { id: 'firstAid', items: ['firstAidKit', 'medicines', 'hygiene', 'dustMask'] },
  { id: 'papersMoney', items: ['documents', 'contactList', 'cash', 'map', 'clothes'] },
];

export const KIT_ITEM_IDS: string[] = KIT_SECTIONS.flatMap((section) => section.items);

export const isGuideId = (value: string): value is GuideId => (GUIDE_IDS as readonly string[]).includes(value);

export interface GuideSection {
  id: string;
  title: string;
  points: string[];
}

export const getGuideSections = (t: TFunction, id: Exclude<GuideId, 'kit'>): GuideSection[] =>
  GUIDE_SECTIONS[id].map((sectionId) => ({
    id: sectionId,
    title: t(`guides.${id}.sections.${sectionId}.title`),
    points: t(`guides.${id}.sections.${sectionId}.points`, { returnObjects: true }) as string[],
  }));
